"""
JWT authentication handler with Dapr secrets integration.
"""
import os
import jwt
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from sqlmodel import Session
from ..config.database import get_session
from ..models.user import User
from dapr.clients import DaprClient


security = HTTPBearer()
logger = logging.getLogger(__name__)


class JWTHandler:
    """
    Handler for JWT token creation, validation, and management using Dapr secrets.
    """

    def __init__(self):
        self.algorithm = "HS256"
        self.access_token_expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
        self.refresh_token_expire_days = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

        # Get JWT secret from Dapr secrets store
        try:
            with DaprClient() as dapr_client:
                secret_response = dapr_client.get_secret(
                    store_name="secrets-store",
                    key="jwt-secret-key"
                )
                self.secret_key = secret_response.secrets.get("jwt-secret-key", os.getenv("JWT_SECRET_KEY", "fallback-secret-key"))
        except Exception as e:
            logger.warning(f"Dapr secrets not available, falling back to environment variable: {e}")
            self.secret_key = os.getenv("JWT_SECRET_KEY", "fallback-secret-key")

    def create_access_token(self, data: Dict[str, Any]) -> str:
        """
        Create an access token with the provided data.

        Args:
            data: Dictionary containing the data to encode in the token

        Returns:
            Encoded JWT token string
        """
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        to_encode.update({"exp": expire, "type": "access"})

        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def create_refresh_token(self, user_id: str) -> str:
        """
        Create a refresh token for the user.

        Args:
            user_id: User ID to encode in the token

        Returns:
            Encoded refresh token string
        """
        to_encode = {"sub": user_id}
        expire = datetime.utcnow() + timedelta(days=self.refresh_token_expire_days)
        to_encode.update({"exp": expire, "type": "refresh"})

        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Verify and decode a JWT token.

        Args:
            token: JWT token string to verify

        Returns:
            Decoded token payload if valid, None otherwise
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except JWTError as e:
            logger.error(f"Token verification failed: {e}")
            return None

    def get_current_user(self, token: str, db_session: Session) -> Optional[User]:
        """
        Get the current user from the token.

        Args:
            token: JWT token string
            db_session: Database session

        Returns:
            User object if valid, None otherwise
        """
        payload = self.verify_token(token)
        if payload is None:
            return None

        user_id: str = payload.get("sub")
        if user_id is None:
            return None

        user = db_session.get(User, user_id)
        return user


# Global JWT handler instance
jwt_handler = JWTHandler()


def get_current_user_from_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db_session: Session = Depends(get_session)
) -> User:
    """
    Dependency to get the current user from the JWT token in the request.

    Args:
        credentials: HTTP authorization credentials
        db_session: Database session

    Returns:
        Current user if token is valid

    Raises:
        HTTPException: If token is invalid or user not found
    """
    token = credentials.credentials
    user = jwt_handler.get_current_user(token, db_session)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


def create_access_token(data: Dict[str, Any]) -> str:
    """
    Create an access token using the global JWT handler.

    Args:
        data: Dictionary containing the data to encode in the token

    Returns:
        Encoded JWT token string
    """
    return jwt_handler.create_access_token(data)


def create_refresh_token(user_id: str) -> str:
    """
    Create a refresh token using the global JWT handler.

    Args:
        user_id: User ID to encode in the token

    Returns:
        Encoded refresh token string
    """
    return jwt_handler.create_refresh_token(user_id)


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify and decode a JWT token using the global JWT handler.

    Args:
        token: JWT token string to verify

    Returns:
        Decoded token payload if valid, None otherwise
    """
    return jwt_handler.verify_token(token)