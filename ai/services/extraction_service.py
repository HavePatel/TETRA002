from gemini.extractor import GeminiExtractor
from schemas.extract import InvoiceExtractionSchema
from ocr import OCRExtractor
from utils.logger import logger

def extract_invoice_data(text: str) -> InvoiceExtractionSchema:
    """
    Extract validated structured invoice data from raw OCR text.

    Args:
        text (str): Raw OCR text.

    Returns:
        InvoiceExtractionSchema: Validated structure.
    """
    extractor = GeminiExtractor()
    return extractor.extract_invoice_data(text)

def process_invoice(file_path: str) -> InvoiceExtractionSchema:
    """
    Orchestrates the entire invoice extraction pipeline.
    Runs OCR on the given file path, then runs Gemini to extract structured fields.

    Args:
        file_path (str): Path to the invoice file.

    Returns:
        InvoiceExtractionSchema: Validated structured invoice schema.
    """
    # 1. OCR Engine
    ocr_extractor = OCRExtractor()
    ocr_text = ocr_extractor.extract_text(file_path)
    
    # 2. Gemini Extraction
    extracted_data = extract_invoice_data(ocr_text)
    
    return extracted_data
