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
MOCK_IMAGE_PATH = os.path.join(MOCK_DIR, "mock_invoice_extractor.png")
MOCK_PDF_PATH = os.path.join(MOCK_DIR, "mock_invoice_extractor.pdf")
MOCK_UNSUPPORTED_PATH = os.path.join(MOCK_DIR, "mock_invoice_extractor.txt")
MOCK_EMPTY_PATH = os.path.join(MOCK_DIR, "mock_empty_extractor.png")

@pytest.fixture(scope="session", autouse=True)
def setup_extractor_mock_files() -> None:
    """Create mock image and PDF invoices if they do not exist."""
    os.makedirs(MOCK_DIR, exist_ok=True)
    
    # Create valid mock image
    if not os.path.exists(MOCK_IMAGE_PATH):
        img = Image.new("RGB", (800, 300), color="white")
        draw = ImageDraw.Draw(img)
        draw.text((50, 50), "Invoice Number: INV-IMAGE-777\nVendor: ABC Extractor\nTotal Amount: $150.00", fill="black")
        img.save(MOCK_IMAGE_PATH)
        
    # Create valid mock PDF using PyMuPDF
    if not os.path.exists(MOCK_PDF_PATH):
        doc = fitz.open()
        page = doc.new_page(width=800, height=400)
        page.insert_text((100, 100), "Invoice Number: INV-PDF-666\nVendor: XYZ Extractor\nTotal: 25000", fontsize=20)
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
    upper_text = text.upper()
    assert "INV" in upper_text or "IMAGE" in upper_text or "777" in upper_text

def test_extract_text_from_pdf() -> None:
    """Test extracting text from a valid PDF invoice."""
    extractor = OCRExtractor()
    text = extractor.extract_text(MOCK_PDF_PATH)
    assert isinstance(text, str)
    assert len(text) > 0
    upper_text = text.upper()
    assert "INV" in upper_text or "PDF" in upper_text or "666" in upper_text

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

def test_singleton_engine_reused() -> None:
    """Test that multiple calls reuse the same PaddleOCR engine instance."""
    extractor1 = OCRExtractor()
    extractor2 = OCRExtractor()
    
    engine1 = extractor1._get_ocr_engine()
    engine2 = extractor2._get_ocr_engine()
    
    assert engine1 is engine2

def test_engine_initializes_exactly_once() -> None:
    """Test that the PaddleOCR constructor is called exactly once across multiple OCRExtractor calls."""
    from unittest.mock import patch
    
    # Save original instance
    orig_instance = OCRExtractor._ocr_instance
    OCRExtractor._ocr_instance = None
    
    try:
        with patch("paddleocr.PaddleOCR") as mock_paddleocr:
            extractor1 = OCRExtractor()
            extractor2 = OCRExtractor()
            
            extractor1._get_ocr_engine()
            extractor2._get_ocr_engine()
            
            mock_paddleocr.assert_called_once()
    finally:
        # Restore original instance
        OCRExtractor._ocr_instance = orig_instance

def test_singleton_thread_safety() -> None:
    """Test that concurrent calls to _get_ocr_engine are thread-safe and initialize the engine once."""
    import threading
    
    # Save original instance
    orig_instance = OCRExtractor._ocr_instance
    OCRExtractor._ocr_instance = None
    
    engines = []
    threads = []
    
    def get_engine_thread():
        engine = OCRExtractor._get_ocr_engine()
        engines.append(engine)
        
    try:
        # Start multiple threads to retrieve engine concurrently
        for _ in range(5):
            t = threading.Thread(target=get_engine_thread)
            threads.append(t)
            t.start()
            
        for t in threads:
            t.join()
            
        # Assert all threads got the exact same engine instance
        assert len(engines) == 5
        for eng in engines:
            assert eng is engines[0]
    finally:
        # Restore original instance
        OCRExtractor._ocr_instance = orig_instance
