from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "AI-Powered Invoice Risk Scanner"
    VERSION: str = "1.0.0"

    DATABASE_URL: str = "sqlite:///./invoice_scanner.db"

    GEMINI_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True
    )


settings = Settings()