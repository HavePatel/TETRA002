from pathlib import Path
import shutil

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session
import requests

from app.database.dependencies import get_db
from app.models.invoice import Invoice
from app.services.ai_service import extract_invoice
from app.services.validation_service import validate_invoice
from app.services.risk_service import calculate_risk

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_invoice(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Validate PDF file
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    # Create invoice record
    invoice = Invoice(
        status="Uploaded"
    )

    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    # Generate business invoice ID
    invoice.invoice_id = f"INV_{invoice.id:03d}"

    # Save uploaded PDF
    file_name = f"{invoice.invoice_id}.pdf"
    file_path = UPLOAD_DIR / file_name

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    invoice.pdf_path = str(file_path)

    db.commit()
    db.refresh(invoice)

    # -----------------------------
    # AI Extraction
    # -----------------------------
    try:
        ai_response = extract_invoice(str(file_path))

        if not ai_response.get("success"):
            raise HTTPException(
                status_code=500,
                detail=ai_response.get(
                    "error",
                    {}
                ).get(
                    "message",
                    "AI extraction failed."
                )
            )

        data = ai_response["data"]

    except requests.exceptions.RequestException:
        raise HTTPException(
            status_code=503,
            detail="AI extraction service is unavailable."
        )

    # -----------------------------
    # Save extracted fields
    # -----------------------------
    invoice.invoice_number = data.get("invoice_number")
    invoice.vendor = data.get("vendor")
    invoice.gstin = data.get("gstin")
    invoice.invoice_date = data.get("invoice_date")
    invoice.subtotal = data.get("subtotal")
    invoice.gst = data.get("gst")
    invoice.total = data.get("total")

    invoice.status = "Extracted"

    db.commit()
    db.refresh(invoice)

    # -----------------------------
    # Validation
    # -----------------------------
    validation_report = validate_invoice(
        db,
        invoice
    )

    # -----------------------------
    # Risk Scoring
    # -----------------------------
    risk_report = calculate_risk(
        validation_report
    )

    # -----------------------------
    # Final Response
    # -----------------------------
    return {
        "message": "Invoice processed successfully",
        "invoice": {
            "invoice_id": invoice.invoice_id,
            "invoice_number": invoice.invoice_number,
            "vendor": invoice.vendor,
            "gstin": invoice.gstin,
            "status": invoice.status
        },
        "validation": validation_report,
        "risk": risk_report
    }