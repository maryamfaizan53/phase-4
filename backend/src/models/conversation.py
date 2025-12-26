"""Conversation model for Todo AI Chatbot"""
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class Conversation(SQLModel, table=True):
    """Conversation entity - represents a chat session"""

    __tablename__ = "conversations"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, foreign_key="users.user_id", max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Metadata
    is_active: bool = Field(default=True)  # False if session expired
    last_activity_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "id": 7,
                "user_id": "user_12345",
                "created_at": "2025-12-15T09:00:00Z",
                "updated_at": "2025-12-15T10:45:00Z",
                "is_active": True,
                "last_activity_at": "2025-12-15T10:45:00Z",
            }
        }
