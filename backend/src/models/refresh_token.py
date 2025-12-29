"""RefreshToken model for Todo AI Chatbot"""
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class RefreshToken(SQLModel, table=True):
    """RefreshToken entity - tracks issued refresh tokens for rotation"""

    __tablename__ = "refresh_tokens"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, foreign_key="users.user_id", max_length=255)
    token: str = Field(index=True, unique=True, max_length=511)
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    revoked: bool = Field(default=False)
