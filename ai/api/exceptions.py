from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from ocr.extractor import (
    InvoiceFileNotFoundError,
    UnsupportedFormatError,
    EmptyDocumentError,
    OCRFailureError,
)
from gemini.extractor import (
    ExtractionError,
    GeminiAPIError,
    InvalidSchemaError,
    InvalidJSONError,
)
from utils.logger import logger

def register_exception_handlers(app: FastAPI) -> None:
    """Register global exception handlers for the FastAPI app."""
    
    @app.exception_handler(InvoiceFileNotFoundError)
    async def file_not_found_handler(request: Request, exc: InvoiceFileNotFoundError):
        logger.error(f"FileNotFoundError on {request.method} {request.url.path}: {exc}")
        return JSONResponse(
            status_code=404,
            content={"success": False, "error": {"message": str(exc)}}
        )

    @app.exception_handler(UnsupportedFormatError)
    async def unsupported_format_handler(request: Request, exc: UnsupportedFormatError):
        logger.error(f"UnsupportedFormatError on {request.method} {request.url.path}: {exc}")
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": {"message": str(exc)}}
        )

    @app.exception_handler(EmptyDocumentError)
    async def empty_document_handler(request: Request, exc: EmptyDocumentError):
        logger.error(f"EmptyDocumentError on {request.method} {request.url.path}: {exc}")
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": {"message": str(exc)}}
        )

    @app.exception_handler(OCRFailureError)
    async def ocr_failure_handler(request: Request, exc: OCRFailureError):
        logger.error(f"OCRFailureError on {request.method} {request.url.path}: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": {"message": f"OCR processing failed: {str(exc)}"}}
        )

    @app.exception_handler(ExtractionError)
    async def extraction_error_handler(request: Request, exc: ExtractionError):
        logger.error(f"ExtractionError on {request.method} {request.url.path}: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": {"message": f"Invoice extraction failed: {str(exc)}"}}
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        logger.error(f"HTTPException on {request.method} {request.url.path}: {exc.detail}")
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "error": {"message": exc.detail}}
        )
