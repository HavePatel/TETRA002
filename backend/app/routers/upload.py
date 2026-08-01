from pathlib import Path
import shutil

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.invoice import Invoice

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

    # Create invoice record first
    invoice = Invoice(
        status="Uploaded"
    )

    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    # Generate sequential business ID
    invoice.invoice_id = f"INV_{invoice.id:03d}"

    # Save uploaded PDF
    file_name = f"{invoice.invoice_id}.pdf"
    file_path = UPLOAD_DIR / file_name

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Update database
    invoice.pdf_path = str(file_path)

    db.commit()
    db.refresh(invoice)

    return {
        "message": "Invoice uploaded successfully",
        "invoice_id": invoice.invoice_id,
        "file_name": file_name,
        "status": invoice.status
    }