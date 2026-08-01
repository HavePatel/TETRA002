from fastapi import FastAPI
from app.core.config import settings
from app.routers import upload

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Backend API for invoice validation and risk analysis",
)

app.include_router(upload.router, tags=["Upload"])


@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }