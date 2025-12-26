"""Configuration management for Todo AI Chatbot"""
from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path

# Get the backend directory (parent of src)
BACKEND_DIR = Path(__file__).parent.parent
ENV_FILE = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Database
    DATABASE_URL: str

    # OpenAI / OpenRouter
    OPENAI_API_KEY: str
    OPENROUTER_API_KEY: Optional[str] = None
    LLM_PROVIDER: str = "openrouter"  # "openai" or "openrouter"
    LLM_MODEL: str = "xiaomi/mimo-v2-flash:free"
    LLM_BASE_URL: str = "https://openrouter.ai/api/v1"

    # Better Auth / JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"

    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    RATE_LIMIT: str = "100/minute"

    # Environment
    ENV: str = "development"
    DEBUG: bool = True

    class Config:
        env_file = str(ENV_FILE)
        env_file_encoding = 'utf-8'
        case_sensitive = True


# Global settings instance
settings = Settings()
