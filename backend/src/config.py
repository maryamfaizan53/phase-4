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
    LLM_MODEL: str = "google/gemini-2.0-flash-exp:free"
    LLM_BASE_URL: str = "https://openrouter.ai/api/v1"

    # Better Auth / JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    AUTH_AUTO_CREATE_USERS: bool = False

    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8006
    RATE_LIMIT: str = "100/minute"
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004"

    # Environment
    ENV: str = "development"
    DEBUG: bool = True

    class Config:
        env_file = str(ENV_FILE)
        env_file_encoding = 'utf-8'
        case_sensitive = True


# Global settings instance
settings = Settings()
