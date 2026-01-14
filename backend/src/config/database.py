"""
Database configuration for the todo application.
"""
from sqlmodel import create_engine
from pydantic import PostgresDsn
from pydantic_settings import BaseSettings
from typing import Optional
import os


class DatabaseSettings(BaseSettings):
    database_url: PostgresDsn = os.getenv(
        "DATABASE_URL", "postgresql://user:password@localhost:5432/todo_db"
    )
    pool_size: int = 20
    max_overflow: int = 30
    pool_pre_ping: bool = True
    pool_recycle: int = 300

    class Config:
        env_file = ".env"


# Initialize settings
db_settings = DatabaseSettings()

# Create engine with connection pooling settings
engine = create_engine(
    str(db_settings.database_url),
    pool_size=db_settings.pool_size,
    max_overflow=db_settings.max_overflow,
    pool_pre_ping=db_settings.pool_pre_ping,
    pool_recycle=db_settings.pool_recycle,
    echo=False  # Set to True for SQL query logging in development
)


def get_engine():
    """Return the database engine instance."""
    return engine