from fastapi import FastAPI

from app.core.config import settings
from app.database.database import Base, engine
from app.models import invoice
from app.routers import upload, extract, validate

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Backend API for invoice validation and risk analysis",
)

app.include_router(upload.router, tags=["Upload"])
app.include_router(extract.router, tags=["Extraction"])
app.include_router(validate.router, tags=["Validation"])


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