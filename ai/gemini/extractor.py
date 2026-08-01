import os
import time
import threading
from typing import Optional
from utils.logger import logger
from schemas.extract import InvoiceExtractionSchema
from gemini.prompts import get_extraction_prompt

class ExtractionError(Exception):
    """Base exception for all invoice extraction errors."""
    pass

class GeminiAPIError(ExtractionError):
    """Raised when the Gemini API request fails or encounters network issues."""
    pass

class InvalidSchemaError(ExtractionError):
    """Raised when the response does not validate against the Pydantic schema."""
    pass

class InvalidJSONError(ExtractionError):
    """Raised when the response is not valid JSON."""
    pass

class GeminiExtractor:
    """Gemini-based information extractor for converting invoice text to structured schemas."""
    
    GEMINI_MODEL = "gemini-flash-latest"
    _client_instance = None
    _lock = threading.Lock()

    def __init__(self) -> None:
        """Initialize GeminiExtractor."""
        pass

    @classmethod
    def _get_client(cls):
        """Lazily initialize and return the single genai.Client instance thread-safely."""
        if cls._client_instance is None:
            with cls._lock:
                if cls._client_instance is None:
                    logger.info("Initializing Gemini GenAI client singleton...")
                    try:
                        from google import genai
                        from utils.config import settings
                        
                        api_key = settings.GEMINI_API_KEY
                        cls._client_instance = genai.Client(api_key=api_key)
                    except Exception as e:
                        logger.error(f"Failed to initialize Gemini Client: {e}")
                        raise GeminiAPIError(f"Failed to initialize Gemini Client: {e}")
        return cls._client_instance

    def _call_gemini(self, client, prompt: str) -> str:
        """
        Perform the API call to Gemini.

        Args:
            client: GenAI client instance.
            prompt (str): Prompt to send.

        Returns:
            str: Raw text response.
            
        Raises:
            GeminiAPIError: If the API call fails.
        """
        from google.genai import types
        try:
            response = client.models.generate_content(
                model=self.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=InvoiceExtractionSchema,
                )
            )
            return response.text
        except Exception as e:
            logger.error(f"Gemini API request failed: {e}")
            raise GeminiAPIError(f"Gemini API request failed: {e}")

    def _validate_response(self, text: str) -> InvoiceExtractionSchema:
        """
        Parse and validate the JSON text using InvoiceExtractionSchema.

        Args:
            text (str): Response text from Gemini.

        Returns:
            InvoiceExtractionSchema: Validated Pydantic schema object.

        Raises:
            InvalidJSONError: If text is not valid JSON.
            InvalidSchemaError: If JSON structure does not match schema.
        """
        import json
        from pydantic import ValidationError

        try:
            data = json.loads(text)
        except json.JSONDecodeError as e:
            logger.warning(f"Failed to parse text as JSON: {e}")
            raise InvalidJSONError(f"Failed to parse response as JSON: {text}")

        try:
            return InvoiceExtractionSchema(**data)
        except ValidationError as e:
            logger.warning(f"Schema validation failed: {e}")
            raise InvalidSchemaError(f"JSON data did not validate against InvoiceExtractionSchema: {e}")

    def extract_invoice_data(self, text: str) -> InvoiceExtractionSchema:
        """
        Extract validated invoice structured data from raw OCR text.

        Args:
            text (str): Raw OCR text.

        Returns:
            InvoiceExtractionSchema: Validated structure.

        Raises:
            ExtractionError: Base or subclass exceptions on failure.
        """
        logger.info("Extraction started")
        start_time = time.time()
        
        prompt = get_extraction_prompt(text)
        client = self._get_client()
        
        max_attempts = 2
        last_error = None
        
        for attempt in range(1, max_attempts + 1):
            try:
                logger.info(f"Running Gemini extraction (attempt {attempt}/{max_attempts})...")
                resp_text = self._call_gemini(client, prompt)
                
                if not resp_text or not resp_text.strip():
                    raise InvalidJSONError("Empty response received from Gemini API")
                
                validated_data = self._validate_response(resp_text)
                
                # Success path
                elapsed = time.time() - start_time
                logger.info(
                    f"\nExtraction completed:\n"
                    f"Characters received: {len(text)}\n"
                    f"Prompt length: {len(prompt)}\n"
                    f"Gemini response time: {elapsed:.2f}s\n"
                    f"Validation: Passed\n"
                    f"Retry: {attempt - 1}"
                )
                return validated_data
                
            except (InvalidJSONError, InvalidSchemaError) as e:
                logger.warning(f"Extraction failure (attempt {attempt}/{max_attempts}): {e}")
                last_error = e
                if attempt < max_attempts:
                    logger.info("Retrying extraction in 1 second...")
                    time.sleep(1)
                    continue
            except GeminiAPIError as e:
                logger.error(f"Gemini API request error (attempt {attempt}/{max_attempts}): {e}")
                last_error = e
                if attempt < max_attempts:
                    logger.info("Retrying extraction after API error in 1 second...")
                    time.sleep(1)
                    continue
                    
        # Failed after all attempts
        elapsed = time.time() - start_time
        logger.error(
            f"\nExtraction failed:\n"
            f"Characters received: {len(text)}\n"
            f"Prompt length: {len(prompt)}\n"
            f"Gemini response time: {elapsed:.2f}s\n"
            f"Validation: Failed\n"
            f"Retry: {max_attempts - 1}\n"
            f"Error: {last_error}"
        )
        raise last_error
