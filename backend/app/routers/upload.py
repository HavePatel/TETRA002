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
    # Validate allowed file types
    allowed_content_types = {
        "application/pdf",
        "image/png",
        "image/jpeg"
    }
    if file.content_type not in allowed_content_types:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, PNG, and JPG/JPEG files are allowed."
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

    # Map MIME type to standard extension
    MIME_TO_EXTENSION = {
        "application/pdf": ".pdf",
        "image/png": ".png",
        "image/jpeg": ".jpg",
    }

    # Extract extension from original filename if valid, otherwise fallback
    ext = ""
    if file.filename:
        file_ext = Path(file.filename).suffix.lower()
        if file_ext in [".pdf", ".png", ".jpg", ".jpeg"]:
            ext = file_ext

    if not ext:
        ext = MIME_TO_EXTENSION.get(file.content_type, ".pdf")

    # Save uploaded file
    file_name = f"{invoice.invoice_id}{ext}"
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

    except requests.exceptions.HTTPError as e:
        try:
            error_json = e.response.json()
            error_message = error_json.get("error", {}).get("message", "AI extraction service encountered an error.")
        except Exception:
            error_message = f"AI Service error: {e.response.text}"
        raise HTTPException(
            status_code=e.response.status_code,
            detail=error_message
        )
    except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
        raise HTTPException(
            status_code=503,
            detail="AI extraction service is offline or unavailable."
        )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI extraction request failed: {str(e)}"
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


@router.get("/invoice/{invoice_id}")
def get_invoice(invoice_id: str, db: Session = Depends(get_db)):
    invoice = (
        db.query(Invoice)
        .filter(Invoice.invoice_id == invoice_id)
        .first()
    )

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found"
        )

    validation_report = validate_invoice(db, invoice)
    risk_report = calculate_risk(validation_report)

    return {
        "invoice": {
            "invoice_id": invoice.invoice_id,
            "invoice_number": invoice.invoice_number,
            "vendor": invoice.vendor,
            "gstin": invoice.gstin,
            "invoice_date": invoice.invoice_date,
            "subtotal": invoice.subtotal,
            "gst": invoice.gst,
            "total": invoice.total,
            "currency": invoice.currency or "INR",
            "status": invoice.status
        },
        "validation": validation_report,
        "risk": risk_report
    }