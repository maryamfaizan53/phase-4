"""User model for Todo AI Chatbot"""
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class User(SQLModel, table=True):
    """User entity - authenticated via JWT"""

    __tablename__ = "users"

    user_id: str = Field(primary_key=True, max_length=255)
    email: str = Field(unique=True, index=True, max_length=255)
    password_hash: str = Field(max_length=255)
    full_name: Optional[str] = Field(default=None, max_length=255)
    is_active: bool = Field(default=True)
    language_preference: str = Field(default="en", max_length=10)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user_12345",
                "email": "user@example.com",
                "full_name": "John Doe",
                "is_active": True,
                "created_at": "2025-12-15T10:00:00Z",
                "updated_at": "2025-12-15T10:00:00Z",
            }
        }
