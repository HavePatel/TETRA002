from pydantic import BaseModel


class InvoiceSchema(BaseModel):
    invoice_id: str
    invoice_number: str
    vendor: str
    gstin: str
    invoice_date: str
    subtotal: float
    gst: float
    total: float
    currency: str