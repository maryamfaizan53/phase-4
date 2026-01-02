"""Authentication routes for user registration and login"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field, field_validator
from sqlmodel import Session, select
from typing import Optional
from datetime import datetime
import uuid
import jwt
import re

from src.api.dependencies import get_db, get_current_user
from src.api.auth_utils import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from src.models.user import User
from src.models.refresh_token import RefreshToken
from src.config import settings

router = APIRouter(prefix="/api/auth", tags=["authentication"])

class RegisterRequest(BaseModel):
    """User registration request"""
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=100)  # Simplified for demo
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=255)


class LoginRequest(BaseModel):
    """User login request"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Authentication token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    full_name: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    """Refresh token request"""
    refresh_token: str


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user.

    Creates a new user account with email and password, then returns
    authentication tokens.

    Args:
        request: Registration details (email, password, full_name)
        db: Database session

    Returns:
        TokenResponse: Access and refresh tokens with user info

    Raises:
        HTTPException: 400 if email already exists
    """
    # Check if user already exists
    existing_user = db.exec(
        select(User).where(User.email == request.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Generate unique user_id
    user_id = f"user_{uuid.uuid4().hex[:12]}"

    # Hash password
    password_hash = hash_password(request.password)

    # Create user
    user = User(
        user_id=user_id,
        email=request.email,
        password_hash=password_hash,
        full_name=request.full_name,
        is_active=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate tokens
    access_token = create_access_token(user.user_id)
    refresh_token_str, refresh_expires_at = create_refresh_token(user.user_id)

    # Save refresh token to DB
    db_refresh_token = RefreshToken(
        user_id=user.user_id,
        token=refresh_token_str,
        expires_at=refresh_expires_at
    )
    db.add(db_refresh_token)
    db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token_str,
        user_id=user.user_id,
        email=user.email,
        full_name=user.full_name
    )


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate a user and return tokens.

    DEMO MODE: Automatically creates a user if they don't exist.
    This is for development/demo purposes only.

    Args:
        request: Login credentials (email, password)
        db: Database session

    Returns:
        TokenResponse: Access and refresh tokens with user info

    Raises:
        HTTPException: 401 if credentials are invalid
    """
    # Find user by email
    user = db.exec(
        select(User).where(User.email == request.email)
    ).first()

    # AUTO-CREATE MODE: Check if enabled in settings
    if not user:
        if settings.AUTH_AUTO_CREATE_USERS:
            # Generate unique user_id
            user_id = f"user_{uuid.uuid4().hex[:12]}"

            # Hash password
            password_hash = hash_password(request.password)

            # Create user automatically
            user = User(
                user_id=user_id,
                email=request.email,
                password_hash=password_hash,
                full_name=request.email.split('@')[0],  # Use email prefix as name
                is_active=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )

            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Auto-creation disabled, fail the login
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
    else:
        # Verify password for existing users
        if not verify_password(request.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive"
            )

    # Generate tokens
    access_token = create_access_token(user.user_id)
    refresh_token_str, refresh_expires_at = create_refresh_token(user.user_id)

    # Save refresh token to DB
    db_refresh_token = RefreshToken(
        user_id=user.user_id,
        token=refresh_token_str,
        expires_at=refresh_expires_at
    )
    db.add(db_refresh_token)
    db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token_str,
        user_id=user.user_id,
        email=user.email,
        full_name=user.full_name
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """
    Refresh an access token using a refresh token.

    Args:
        request: Refresh token
        db: Database session

    Returns:
        TokenResponse: New access and refresh tokens

    Raises:
        HTTPException: 401 if refresh token is invalid
    """
    try:
        # Decode and basic JWT validation
        payload = decode_token(request.refresh_token)

        # Verify token type
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )

        # Verify rotation: Check if token exists in DB and is not revoked
        db_token = db.exec(
            select(RefreshToken).where(RefreshToken.token == request.refresh_token)
        ).first()

        if not db_token or db_token.revoked:
            # If a token is reused after being revoked, it's a security risk
            # Revoke ALL tokens for this user for safety
            if db_token:
                other_tokens = db.exec(
                    select(RefreshToken).where(RefreshToken.user_id == db_token.user_id)
                ).all()
                for t in other_tokens:
                    t.revoked = True
                db.add_all(other_tokens)
                db.commit()
            
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or revoked refresh token"
            )

        if db_token.expires_at < datetime.utcnow():
            db_token.revoked = True
            db.add(db_token)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token expired"
            )

        user_id = db_token.user_id
        
        # Get user from database
        user = db.exec(
            select(User).where(User.user_id == user_id)
        ).first()

        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )

        # TOKEN ROTATION: Revoke current token
        db_token.revoked = True
        db.add(db_token)

        # Generate new tokens
        access_token = create_access_token(user.user_id)
        new_refresh_token_str, new_refresh_expires_at = create_refresh_token(user.user_id)

        # Save new refresh token
        new_db_token = RefreshToken(
            user_id=user.user_id,
            token=new_refresh_token_str,
            expires_at=new_refresh_expires_at
        )
        db.add(new_db_token)
        db.commit()

        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token_str,
            user_id=user.user_id,
            email=user.email,
            full_name=user.full_name
        )

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )


@router.get("/me")
async def get_current_user_info(current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get current authenticated user information.

    Args:
        current_user: User ID from JWT token
        db: Database session

    Returns:
        dict: User information (without password hash)
    """
    user = db.exec(
        select(User).where(User.user_id == current_user)
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {
        "user_id": user.user_id,
        "email": user.email,
        "full_name": user.full_name,
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat()
    }


@router.post("/logout")
async def logout(current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Log out the current user by revoking all their refresh tokens.
    """
    tokens = db.exec(
        select(RefreshToken).where(RefreshToken.user_id == current_user)
    ).all()
    
    for t in tokens:
        t.revoked = True
        
    db.add_all(tokens)
    db.commit()
    
    return {"message": "Successfully logged out"}
