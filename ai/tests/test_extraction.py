from unittest.mock import MagicMock, patch
import pytest
from gemini.extractor import (
    GeminiExtractor,
    GeminiAPIError,
    InvalidJSONError,
    InvalidSchemaError,
)
from schemas.extract import InvoiceExtractionSchema
from services.extraction_service import extract_invoice_data

def test_valid_ocr_extraction():
    """Test extracting from valid OCR text with a correct JSON response."""
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_response.text = '{"invoice_number": "INV-100", "vendor": "Acme Corp", "gstin": "24ABCDE1234F1Z5", "invoice_date": "2026-08-01", "subtotal": 100.0, "gst": 18.0, "total": 118.0, "currency": "INR"}'
    mock_client.models.generate_content.return_value = mock_response
    
    with patch.object(GeminiExtractor, '_get_client', return_value=mock_client):
        result = extract_invoice_data("dummy ocr text")
        
        assert isinstance(result, InvoiceExtractionSchema)
        assert result.invoice_number == "INV-100"
        assert result.vendor == "Acme Corp"
        assert result.subtotal == 100.0
        assert result.total == 118.0
        assert result.currency == "INR"
        
        # Verify call arguments
        mock_client.models.generate_content.assert_called_once()

def test_missing_fields_defaults():
    """Test response with missing fields defaults to empty/0 values correctly."""
    mock_client = MagicMock()
    mock_response = MagicMock()
    # Missing subtotal, gst, total, currency
    mock_response.text = '{"invoice_number": "INV-200", "vendor": "Acme Corp"}'
    mock_client.models.generate_content.return_value = mock_response
    
    with patch.object(GeminiExtractor, '_get_client', return_value=mock_client):
        result = extract_invoice_data("dummy ocr text")
        
        assert isinstance(result, InvoiceExtractionSchema)
        assert result.invoice_number == "INV-200"
        assert result.vendor == "Acme Corp"
        # Defaults check
        assert result.subtotal == 0.0
        assert result.gst == 0.0
        assert result.total == 0.0
        assert result.currency == "INR"

def test_retry_mechanism_success():
    """Test that a malformed JSON on first attempt triggers exactly one retry and succeeds on second attempt."""
    mock_client = MagicMock()
    
    mock_response_fail = MagicMock()
    mock_response_fail.text = "This is not valid JSON"
    
    mock_response_success = MagicMock()
    mock_response_success.text = '{"invoice_number": "INV-300", "vendor": "Acme Corp", "total": 200.0}'
    
    # Configure mock side effect to return malformed first, then valid JSON
    mock_client.models.generate_content.side_effect = [mock_response_fail, mock_response_success]
    
    with patch.object(GeminiExtractor, '_get_client', return_value=mock_client):
        result = extract_invoice_data("dummy ocr text")
        
        assert isinstance(result, InvoiceExtractionSchema)
        assert result.invoice_number == "INV-300"
        assert result.total == 200.0
        
        # Verify exactly two calls were made
        assert mock_client.models.generate_content.call_count == 2

def test_invalid_json_failure():
    """Test that two failed attempts raise InvalidJSONError."""
    mock_client = MagicMock()
    
    mock_response_fail = MagicMock()
    mock_response_fail.text = "Still not valid JSON"
    
    mock_client.models.generate_content.return_value = mock_response_fail
    
    with patch.object(GeminiExtractor, '_get_client', return_value=mock_client):
        with pytest.raises(InvalidJSONError):
            extract_invoice_data("dummy ocr text")
            
        assert mock_client.models.generate_content.call_count == 2

def test_api_error():
    """Test that a general API / connection error raises GeminiAPIError."""
    mock_client = MagicMock()
    
    mock_client.models.generate_content.side_effect = Exception("API connection error")
    
    with patch.object(GeminiExtractor, '_get_client', return_value=mock_client):
        with pytest.raises(GeminiAPIError):
            extract_invoice_data("dummy ocr text")
