from gemini.extractor import GeminiExtractor
from schemas.extract import InvoiceExtractionSchema

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
