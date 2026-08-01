import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Application settings using Pydantic Settings."""
    
    APP_NAME: str = "AI Invoice Risk Scanner"
    VERSION: str = "1.0.0"
    
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    ENV: str = "production"
    
    GEMINI_API_KEY: str = ""
    ENABLE_MKLDNN: bool = True
    MAX_UPLOAD_SIZE_MB: int = 10
    TEMP_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "temp")
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
