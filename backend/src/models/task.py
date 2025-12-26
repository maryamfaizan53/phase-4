"""Task model for Todo AI Chatbot"""
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class Task(SQLModel, table=True):
    """Task entity - represents a todo item"""

    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, foreign_key="users.user_id", max_length=255)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    status: str = Field(default="pending", max_length=20)  # "pending" | "completed"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "id": 42,
                "user_id": "user_12345",
                "title": "buy groceries",
                "description": "milk, eggs, bread",
                "status": "pending",
                "created_at": "2025-12-15T10:30:00Z",
                "updated_at": "2025-12-15T10:30:00Z",
            }
        }
