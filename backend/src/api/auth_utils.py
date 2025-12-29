"""Authentication utilities for JWT and password hashing"""
from datetime import datetime, timedelta
from typing import Optional
import bcrypt
import jwt
from src.config import settings


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.

    Args:
        password: Plain text password

    Returns:
        str: Hashed password
    """
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.

    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password to compare against

    Returns:
        bool: True if password matches, False otherwise
    """
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    except Exception:
        return False


def create_access_token(
    user_id: str,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token.

    Args:
        user_id: User ID to encode in token
        expires_delta: Token expiration time (default: 24 hours)

    Returns:
        str: Encoded JWT token
    """
    if expires_delta is None:
        expires_delta = timedelta(hours=24)

    expire = datetime.utcnow() + expires_delta

    payload = {
        "sub": user_id,
        "iat": datetime.utcnow(),
        "exp": expire,
        "type": "access"
    }

    encoded_jwt = jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )

    return encoded_jwt


def create_refresh_token(user_id: str) -> tuple[str, datetime]:
    """
    Create a JWT refresh token (valid for 30 days).

    Args:
        user_id: User ID to encode in token

    Returns:
        tuple[str, datetime]: (Encoded JWT refresh token, Expiration time)
    """
    expires_delta = timedelta(days=30)
    expire = datetime.utcnow() + expires_delta

    payload = {
        "sub": user_id,
        "iat": datetime.utcnow(),
        "exp": expire,
        "type": "refresh"
    }

    encoded_jwt = jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )

    return encoded_jwt, expire


def decode_token(token: str) -> dict:
    """
    Decode and validate a JWT token.

    Args:
        token: JWT token to decode

    Returns:
        dict: Decoded token payload

    Raises:
        jwt.ExpiredSignatureError: If token is expired
        jwt.InvalidTokenError: If token is invalid
    """
    payload = jwt.decode(
        token,
        settings.JWT_SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM]
    )
    return payload
