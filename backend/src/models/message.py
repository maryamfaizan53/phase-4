"""Message model for Todo AI Chatbot"""
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class Message(SQLModel, table=True):
    """Message entity - represents a user or assistant message"""

    __tablename__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(index=True, foreign_key="conversations.id")
    user_id: str = Field(index=True, foreign_key="users.user_id", max_length=255)
    role: str = Field(max_length=20)  # "user" | "assistant" | "system"
    content: str = Field(max_length=10000)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Tool invocation metadata (for audit trail FR-014)
    tool_name: Optional[str] = Field(default=None, max_length=100)
    tool_input: Optional[str] = Field(default=None, max_length=5000)  # JSON string
    tool_output: Optional[str] = Field(default=None, max_length=5000)  # JSON string

    class Config:
        json_schema_extra = {
            "example": {
                "id": 123,
                "conversation_id": 7,
                "user_id": "user_12345",
                "role": "user",
                "content": "Remind me to buy groceries",
                "created_at": "2025-12-15T10:30:00Z",
                "tool_name": None,
                "tool_input": None,
                "tool_output": None,
            }
        }
