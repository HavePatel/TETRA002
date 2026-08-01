from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from utils.config import settings
from utils.logger import logger
from api.routes import router as api_router
from api.exceptions import register_exception_handlers

app = FastAPI(
    title=settings.APP_NAME,
    description="Microservice for AI Invoice Risk Scanner, providing OCR capabilities and Gemini-based invoice risk auditing.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Register custom API exception handlers
register_exception_handlers(app)

# Include extraction API routes
app.include_router(api_router)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Global exception handler to capture all unhandled exceptions and return JSON formatted response."""
    logger.error(
        f"Unhandled exception on {request.method} {request.url.path}: {exc}", 
        exc_info=True
    )
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "message": "Unexpected error"
            }
        }
    )

@app.get("/", tags=["General"])
async def read_root() -> dict:
    """Root endpoint to check if the AI Service is running."""
    logger.info("Accessing root endpoint")
    return {"message": "AI Service is running"}

@app.get("/health", tags=["General"])
async def health_check() -> dict:
    """Health check endpoint to verify the service status."""
    logger.info("Accessing health check endpoint")
    return {
        "success": True,
        "message": "AI Service is healthy",
        "version": settings.VERSION
    }

if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting service on {settings.HOST}:{settings.PORT}")
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENV == "development"
    )
