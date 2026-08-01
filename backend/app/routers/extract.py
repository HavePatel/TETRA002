from fastapi import APIRouter

router = APIRouter()


@router.post("/extract/{invoice_id}")
async def extract_invoice(invoice_id: str):

    return {
        "message": "OCR extraction will be implemented here.",
        "invoice_id": invoice_id
    }