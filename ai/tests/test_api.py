from fastapi.testclient import TestClient
from unittest.mock import patch
import pytest
from main import app
from schemas.extract import InvoiceExtractionSchema
from ocr.extractor import OCRFailureError
from gemini.extractor import GeminiAPIError

client = TestClient(app, raise_server_exceptions=False)

def test_extract_api_success():
    """Test successful invoice extraction through the API endpoint."""
    mock_data = InvoiceExtractionSchema(
        invoice_number="INV-456",
        vendor="Globex Corp",
        gstin="24ABCDE1234F1Z5",
        invoice_date="2026-08-01",
        subtotal=200.0,
        gst=36.0,
        total=236.0,
        currency="INR"
    )
    
    with patch("api.routes.process_invoice", return_value=mock_data) as mock_process:
        # Create a mock PDF file upload
        files = {"file": ("invoice.pdf", b"%PDF-1.4 mock content", "application/pdf")}
        response = client.post("/api/v1/extract", files=files)
        
        assert response.status_code == 200
        json_data = response.json()
        assert json_data["success"] is True
        assert json_data["message"] == "Invoice extracted successfully"
        assert json_data["data"]["invoice_number"] == "INV-456"
        assert json_data["data"]["vendor"] == "Globex Corp"
        mock_process.assert_called_once()

def test_extract_api_unsupported_format():
    """Test API returns 400 error for unsupported file extensions."""
    files = {"file": ("invoice.txt", b"plain text ocr candidate", "text/plain")}
    response = client.post("/api/v1/extract", files=files)
    
    assert response.status_code == 400
    json_data = response.json()
    assert json_data["success"] is False
    assert "Unsupported file format" in json_data["error"]["message"]

def test_extract_api_empty_file():
    """Test API returns 400 error for empty uploads."""
    files = {"file": ("invoice.pdf", b"", "application/pdf")}
    response = client.post("/api/v1/extract", files=files)
    
    assert response.status_code == 400
    json_data = response.json()
    assert json_data["success"] is False
    assert "Uploaded file is empty" in json_data["error"]["message"]

def test_extract_api_oversized_file():
    """Test API returns 400 error for oversized uploads."""
    with patch("utils.config.settings.MAX_UPLOAD_SIZE_MB", 1):
        large_content = b"x" * (2 * 1024 * 1024)  # 2MB file
        files = {"file": ("invoice.pdf", large_content, "application/pdf")}
        response = client.post("/api/v1/extract", files=files)
        
        assert response.status_code == 400
        json_data = response.json()
        assert json_data["success"] is False
        assert "File size exceeds the limit" in json_data["error"]["message"]

def test_extract_api_ocr_failure():
    """Test API handles OCR processing failures and returns 500 error."""
    with patch("api.routes.process_invoice", side_effect=OCRFailureError("Failed to render PDF")):
        files = {"file": ("invoice.pdf", b"%PDF-1.4 mock content", "application/pdf")}
        response = client.post("/api/v1/extract", files=files)
        
        assert response.status_code == 500
        json_data = response.json()
        assert json_data["success"] is False
        assert "OCR processing failed" in json_data["error"]["message"]

def test_extract_api_gemini_failure():
    """Test API handles Gemini extraction failures and returns 500 error."""
    with patch("api.routes.process_invoice", side_effect=GeminiAPIError("Quota exceeded or connection error")):
        files = {"file": ("invoice.pdf", b"%PDF-1.4 mock content", "application/pdf")}
        response = client.post("/api/v1/extract", files=files)
        
        assert response.status_code == 500
        json_data = response.json()
        assert json_data["success"] is False
        assert "Invoice extraction failed" in json_data["error"]["message"]

def test_extract_api_unexpected_failure():
    """Test API handles unexpected runtime failures and returns 500 error."""
    with patch("api.routes.process_invoice", side_effect=ValueError("Unexpected internal processing error")):
        files = {"file": ("invoice.pdf", b"%PDF-1.4 mock content", "application/pdf")}
        response = client.post("/api/v1/extract", files=files)
        
        assert response.status_code == 500
        json_data = response.json()
        assert json_data["success"] is False
        assert json_data["error"]["message"] == "Unexpected error"
