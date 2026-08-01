from sqlalchemy import Column, Float, Integer, String

from app.database.database import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)

    invoice_id = Column(String, unique=True)
    invoice_number = Column(String)
    vendor = Column(String)
    gstin = Column(String)
    invoice_date = Column(String)

    subtotal = Column(Float)
    gst = Column(Float)
    total = Column(Float)

    currency = Column(String)

    pdf_path = Column(String)
    status = Column(String, default="Uploaded")