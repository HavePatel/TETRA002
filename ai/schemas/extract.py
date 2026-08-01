from pydantic import BaseModel, Field

class InvoiceExtractionSchema(BaseModel):
    """Pydantic schema representing structured invoice data."""
    invoice_number: str = Field(default="", description="The unique identification number of the invoice.")
    vendor: str = Field(default="", description="The name of the vendor or supplier.")
    gstin: str = Field(default="", description="The Goods and Services Tax Identification Number (GSTIN) of the vendor.")
    invoice_date: str = Field(default="", description="The date the invoice was issued.")
    subtotal: float = Field(default=0.0, description="The total taxable value/subtotal amount of the invoice before tax.")
    gst: float = Field(default=0.0, description="The GST/tax amount.")
    total: float = Field(default=0.0, description="The total/gross amount of the invoice including tax.")
    currency: str = Field(default="INR", description="The currency code of the invoice amount (e.g., INR, USD).")
