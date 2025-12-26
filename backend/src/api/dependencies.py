"""API dependencies for Todo AI Chatbot"""
from typing import Generator
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, create_engine
from slowapi import Limiter
from slowapi.util import get_remote_address
import jwt

from src.config import settings

# Database engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,  # Handle connection drops
)

# HTTP Bearer for JWT token extraction
security = HTTPBearer()


def get_db() -> Generator[Session, None, None]:
    """
    Database session dependency.

    Yields:
        Session: SQLModel database session
    """
    with Session(engine) as session:
        yield session


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """
    JWT authentication dependency.

    Extracts and validates JWT token from Authorization header,
    returns user_id from "sub" claim.

    Args:
        credentials: HTTP Bearer credentials from request header

    Returns:
        str: user_id extracted from JWT token

    Raises:
        HTTPException: 401 if token is invalid, expired, or missing user_id
    """
    try:
        # Decode JWT token
        payload = jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )

        # Extract user_id from "sub" claim
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token: missing user_id",
            )

        return user_id

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token expired",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )


def get_user_id_for_rate_limit(request: Request) -> str:
    """
    Extract user_id from request for rate limiting.

    Used as key_func for slowapi Limiter to rate limit by authenticated user
    rather than IP address.

    Args:
        request: FastAPI request object

    Returns:
        str: user_id from JWT token, or IP address as fallback
    """
    try:
        # Try to extract JWT token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return get_remote_address(request)  # Fallback to IP

        token = auth_header.split(" ")[1]
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        user_id = payload.get("sub")

        return user_id if user_id else get_remote_address(request)

    except Exception:
        # If anything fails, fallback to IP-based rate limiting
        return get_remote_address(request)


# Rate limiter instance (100 requests per minute per user)
limiter = Limiter(
    key_func=get_user_id_for_rate_limit,
    default_limits=[settings.RATE_LIMIT],
)
