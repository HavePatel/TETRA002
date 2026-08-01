import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator

class InvoiceExtractionSchema(BaseModel):
    """Pydantic schema representing structured invoice data."""
    invoice_number: Optional[str] = Field(default=None, description="The unique identification number of the invoice.")
    vendor: Optional[str] = Field(default=None, description="The name of the vendor or supplier.")
    gstin: Optional[str] = Field(default=None, description="The Goods and Services Tax Identification Number (GSTIN) of the vendor.")
    invoice_date: Optional[str] = Field(default=None, description="The date the invoice was issued.")
    subtotal: Optional[float] = Field(default=None, description="The total taxable value/subtotal amount of the invoice before tax.")
    gst: Optional[float] = Field(default=None, description="The GST/tax amount.")
    total: Optional[float] = Field(default=None, description="The total/gross amount of the invoice including tax.")
    currency: Optional[str] = Field(default=None, description="The currency code of the invoice amount (e.g., INR, USD).")

    @field_validator("invoice_date")
    @classmethod
    def validate_invoice_date(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        try:
            datetime.date.fromisoformat(v)
        except ValueError:
            raise ValueError("invoice_date must be in YYYY-MM-DD format and be a valid date.")
        return v
