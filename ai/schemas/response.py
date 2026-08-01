from pydantic import BaseModel, Field
from schemas.extract import InvoiceExtractionSchema

class ErrorDetail(BaseModel):
    """Pydantic model representing structured error message details."""
    message: str = Field(..., description="Error message details describing the failure.")

class ErrorResponse(BaseModel):
    """Standardized API error response wrapper."""
    success: bool = Field(default=False, description="Indicates if the request was successful.")
    error: ErrorDetail = Field(..., description="Structured error details.")

class InvoiceExtractionResponse(BaseModel):
    """API success response wrapper containing the extracted invoice schema."""
    success: bool = Field(default=True, description="Indicates if the request was successful.")
    message: str = Field(default="Invoice extracted successfully", description="Informational message about the status.")
    data: InvoiceExtractionSchema = Field(..., description="Validated structured invoice data.")
