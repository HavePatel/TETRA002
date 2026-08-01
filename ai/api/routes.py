import os
import time
import uuid
import tempfile
from fastapi import APIRouter, File, UploadFile, HTTPException
from utils.logger import logger
from utils.config import settings
from schemas.response import InvoiceExtractionResponse, ErrorResponse
from services.extraction_service import process_invoice

router = APIRouter(prefix="/api/v1", tags=["Extraction"])

@router.post(
    "/extract",
    response_model=InvoiceExtractionResponse,
    summary="Extract Structured Invoice Data",
    description=(
        "Upload an invoice document (PDF, PNG, JPG, JPEG) to extract structured "
        "invoice fields (vendor, invoice number, tax identifiers, dates, and amounts)."
    ),
    responses={
        400: {"model": ErrorResponse, "description": "Invalid file, unsupported format, empty or oversized file."},
        404: {"model": ErrorResponse, "description": "Temporary file or processing target not found."},
        500: {"model": ErrorResponse, "description": "OCR processing or Gemini extraction failure."}
    }
)
async def extract_invoice(file: UploadFile = File(...)):
    request_id = str(uuid.uuid4())
    filename = file.filename or "unknown"
    
    logger.info(f"[{request_id}] Request received. Filename: {filename}")
    start_time = time.time()
    
    # 1. Extension validation
    ext = os.path.splitext(filename)[1].lower()
    if ext not in [".pdf", ".png", ".jpg", ".jpeg"]:
        logger.error(f"[{request_id}] Unsupported file extension: {ext}")
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Only PDF, PNG, JPG, and JPEG are supported."
        )
    
    # Read file content to validate size and empty file
    content = await file.read()
    file_size = len(content)
    logger.info(f"[{request_id}] File received: {filename}, size: {file_size} bytes")
    
    if file_size == 0:
        logger.error(f"[{request_id}] Uploaded file is empty (0 bytes)")
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        
    # Check max file size (MAX_UPLOAD_SIZE_MB)
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if file_size > max_bytes:
        logger.error(f"[{request_id}] File size {file_size} bytes exceeds limit of {settings.MAX_UPLOAD_SIZE_MB}MB")
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds the limit of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )
        
    # 2. Save file temporarily in configured workspace directory
    os.makedirs(settings.TEMP_DIR, exist_ok=True)
    
    temp_file = tempfile.NamedTemporaryFile(dir=settings.TEMP_DIR, suffix=ext, delete=False)
    temp_file.write(content)
    temp_file.close()  # Close so Windows allows reading in the OCR engine
    
    status = "Success"
    try:
        # 3. Orchestrated extraction
        logger.info(f"[{request_id}] Starting OCR and Gemini extraction pipeline...")
        extracted_data = process_invoice(temp_file.name)
        
        duration = time.time() - start_time
        logger.info(
            f"\n[{request_id}] Request Processed:\n"
            f"Filename: {filename}\n"
            f"Size: {file_size} bytes\n"
            f"Duration: {duration:.2f}s\n"
            f"Status: {status}"
        )
        
        return InvoiceExtractionResponse(
            success=True,
            message="Invoice extracted successfully",
            data=extracted_data
        )
        
    except Exception as e:
        status = "Error"
        duration = time.time() - start_time
        logger.error(
            f"\n[{request_id}] Request Processed (Failed):\n"
            f"Filename: {filename}\n"
            f"Size: {file_size} bytes\n"
            f"Duration: {duration:.2f}s\n"
            f"Status: {status}\n"
            f"Error: {e}"
        )
        raise
    finally:
        # 4. Clean up temp file
        if os.path.exists(temp_file.name):
            try:
                os.remove(temp_file.name)
                logger.info(f"[{request_id}] Cleaned up temporary file: {temp_file.name}")
            except Exception as e:
                logger.error(f"[{request_id}] Failed to delete temporary file {temp_file.name}: {e}")
