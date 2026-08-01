from fastapi import APIRouter
from app.services.validation_service import (
    validate_gstin,
    validate_vendor,
    validate_amount
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