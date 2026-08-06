from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "AI-Powered Invoice Risk Scanner"
    VERSION: str = "1.0.0"

    DATABASE_URL: str = "sqlite:///./invoice_scanner.db"

    GEMINI_API_KEY: str = ""
    AI_SERVICE_URL: str = "http://localhost:8001/api/v1/extract"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True
    )


settings = Settings()