from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.invoice import Invoice
from app.services.validation_service import validate_invoice
from app.services.validation_service import (
    validate_gstin,
    validate_vendor,
    validate_amount,
    validate_invoice_date,
    validate_duplicate,
    validate_invoice
)

router = APIRouter(
    prefix="/validate",
    tags=["Validation"]
)


@router.post("/gstin")
def gstin_validation(gstin: str):
    return validate_gstin(gstin)


@router.post("/vendor")
def vendor_validation(vendor: str):
    return validate_vendor(vendor)


@router.post("/amount")
def amount_validation(
    subtotal: float,
    gst: float,
    total: float
):
    return validate_amount(subtotal, gst, total)


@router.post("/date")
def invoice_date_validation(invoice_date: str):
    return validate_invoice_date(invoice_date)


@router.post("/duplicate/{invoice_id}")
def duplicate_validation(
    invoice_id: str,
    db: Session = Depends(get_db)
):
    invoice = (
        db.query(Invoice)
        .filter(Invoice.invoice_id == invoice_id)
        .first()
    )

    if not invoice:
        return {
            "message": "Invoice not found"
        }

    return validate_duplicate(db, invoice)



@router.post("/{invoice_id}")
def validate_invoice_endpoint(
    invoice_id: str,
    db: Session = Depends(get_db)
):
    invoice = (
        db.query(Invoice)
        .filter(Invoice.invoice_id == invoice_id)
        .first()
    )

    if not invoice:
        return {
            "message": "Invoice not found"
        }

    return validate_invoice(db, invoice)