from typing import Optional
from pydantic import BaseModel, Field

class InvoiceExtractionSchema(BaseModel):
    """Pydantic schema representing structured invoice data."""
    invoice_number: Optional[str] = Field(default=None, description="The unique identification number of the invoice.")
    vendor: Optional[str] = Field(default=None, description="The name of the vendor or supplier.")
    gstin: Optional[str] = Field(default=None, description="The Goods and Services Tax Identification Number (GSTIN) of the vendor.")
    invoice_date: Optional[str] = Field(default=None, description="The date the invoice was issued.")
    subtotal: Optional[float] = Field(default=None, description="The total taxable value/subtotal amount of the invoice before tax.")
    gst: Optional[float] = Field(default=None, description="The GST/tax amount.")
    total: Optional[float] = Field(default=None, description="The total/gross amount of the invoice including tax.")
    currency: Optional[str] = Field(default="INR", description="The currency code of the invoice amount (e.g., INR, USD).")
