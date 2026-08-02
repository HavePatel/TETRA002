from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.invoice import Invoice
from app.services.validation_service import validate_invoice
from app.services.risk_service import calculate_risk

router = APIRouter(prefix="/risk", tags=["Risk"])


@router.post("/{invoice_id}")
def risk_score(invoice_id: str, db: Session = Depends(get_db)):
    invoice = (
        db.query(Invoice)
        .filter(Invoice.invoice_id == invoice_id)
        .first()
    )

    if not invoice:
        return {
            "message": "Invoice not found"
        }

    validation_report = validate_invoice(db, invoice)

    risk_report = calculate_risk(validation_report)

    return risk_report