import os
import pytest
from PIL import Image, ImageDraw
import fitz  # PyMuPDF
from ocr import (
    OCRExtractor,
    InvoiceFileNotFoundError,
    UnsupportedFormatError,
    EmptyDocumentError,
)

# Paths for mock files
MOCK_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "samples", "invoices")
MOCK_IMAGE_PATH = os.path.join(MOCK_DIR, "mock_invoice.png")
MOCK_PDF_PATH = os.path.join(MOCK_DIR, "mock_invoice.pdf")
MOCK_UNSUPPORTED_PATH = os.path.join(MOCK_DIR, "mock_invoice.txt")
MOCK_EMPTY_PATH = os.path.join(MOCK_DIR, "mock_empty.png")

@pytest.fixture(scope="session", autouse=True)
def setup_mock_files() -> None:
    """Create mock image and PDF invoices if they do not exist."""
    os.makedirs(MOCK_DIR, exist_ok=True)
    
    # Create valid mock image
    if not os.path.exists(MOCK_IMAGE_PATH):
        img = Image.new("RGB", (800, 300), color="white")
        draw = ImageDraw.Draw(img)
        # Add high contrast clear text for OCR
        draw.text((50, 50), "Invoice Number: INV-IMAGE-999\nVendor: ABC Services\nTotal Amount: $150.00", fill="black")
        img.save(MOCK_IMAGE_PATH)
        
    # Create valid mock PDF using PyMuPDF
    if not os.path.exists(MOCK_PDF_PATH):
        doc = fitz.open()
        page = doc.new_page(width=800, height=400)
        page.insert_text((100, 100), "Invoice Number: INV-PDF-888\nVendor: XYZ Corp\nTotal: 25000", fontsize=20)
        doc.save(MOCK_PDF_PATH)
        doc.close()
        
    # Create unsupported file format
    if not os.path.exists(MOCK_UNSUPPORTED_PATH):
        with open(MOCK_UNSUPPORTED_PATH, "w", encoding="utf-8") as f:
            f.write("This is a plain text file, not supported by OCR engine.")
            
    # Create empty file (0 bytes)
    if not os.path.exists(MOCK_EMPTY_PATH):
        open(MOCK_EMPTY_PATH, "w").close()

def test_extract_text_from_image() -> None:
    """Test extracting text from a valid image invoice."""
    extractor = OCRExtractor()
    text = extractor.extract_text(MOCK_IMAGE_PATH)
    assert isinstance(text, str)
    assert len(text) > 0
    # OCR check is case insensitive
    upper_text = text.upper()
    assert "INV" in upper_text or "IMAGE" in upper_text or "999" in upper_text

def test_extract_text_from_pdf() -> None:
    """Test extracting text from a valid PDF invoice."""
    extractor = OCRExtractor()
    text = extractor.extract_text(MOCK_PDF_PATH)
    assert isinstance(text, str)
    assert len(text) > 0
    upper_text = text.upper()
    assert "INV" in upper_text or "PDF" in upper_text or "888" in upper_text

def test_extract_invalid_path() -> None:
    """Test raising FileNotFoundError on invalid path."""
    extractor = OCRExtractor()
    invalid_path = os.path.join(MOCK_DIR, "non_existent_file.png")
    with pytest.raises(InvoiceFileNotFoundError):
        extractor.extract_text(invalid_path)

def test_extract_unsupported_file() -> None:
    """Test raising UnsupportedFormatError for unsupported extensions."""
    extractor = OCRExtractor()
    with pytest.raises(UnsupportedFormatError):
        extractor.extract_text(MOCK_UNSUPPORTED_PATH)

def test_extract_empty_document() -> None:
    """Test raising EmptyDocumentError for empty (0 bytes) document."""
    extractor = OCRExtractor()
    with pytest.raises(EmptyDocumentError):
        extractor.extract_text(MOCK_EMPTY_PATH)
