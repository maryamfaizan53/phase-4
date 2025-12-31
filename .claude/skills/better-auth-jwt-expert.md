---
name: better-auth-jwt-expert
description: Advanced specialist for Better Auth and JWT authentication systems. Handles configuration, implementation, troubleshooting, and integration of Better Auth (frontend) with FastAPI JWT verification (backend). Expert in token lifecycle, security best practices, middleware patterns, and auth flow debugging.
inputs:
- operation: string (configure|implement|debug|integrate|test|secure|analyze)
- auth_system: string (better-auth|jwt|both)
- component: string (frontend|backend|middleware|hooks|routes)
- issue_description: string (optional - for debugging)
- requirements: object (optional - auth requirements, user roles, permissions)
outputs:
- result: object (success status, configuration, code examples, error fixes)
- security_recommendations: list[string]
- implementation_steps: list[string]
- test_plan: object (optional - auth testing scenarios)
usage: Primary skill for all authentication work including Better Auth configuration, JWT implementation, frontend-backend integration, security audits, and troubleshooting auth issues.
---

# Better Auth and JWT Specialist Expert

## Core Responsibilities

### 1. **Better Auth (Frontend)**
- Configure Better Auth in Next.js applications
- Implement authentication flows (email/password, OAuth, magic links)
- Set up JWT token issuance from Better Auth
- Integrate with Next.js App Router
- Handle client-side authentication state
- **Primary Use Case:** Frontend authentication UI and token generation

### 2. **JWT (Backend)**
- Implement JWT verification in FastAPI
- Create authentication middleware
- Decode and validate JWT tokens
- Extract user information from tokens
- Handle token expiration and refresh
- **Primary Use Case:** Backend API authentication and authorization

### 3. **Integration (Full-Stack)**
- Connect Better Auth (frontend) with FastAPI JWT verification (backend)
- Ensure token format compatibility
- Configure shared secrets (JWT_SECRET_KEY)
- Handle CORS for auth endpoints
- Implement secure token storage
- **Primary Use Case:** End-to-end auth flow across frontend and backend

---

## Better Auth Configuration (Frontend)

### Installation

```bash
npm install better-auth
```

### Basic Configuration

**File:** `frontend/lib/better-auth.ts` (or `.js`)

```typescript
import { BetterAuth } from "better-auth/client";
import { nextCookies } from "better-auth/client/plugins";

export const auth = new BetterAuth({
  // Base URL of your auth endpoints
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000",

  // Database adapter (Prisma, Drizzle, or custom)
  database: {
    provider: "postgresql", // or "mysql", "sqlite"
    url: process.env.DATABASE_URL,
  },

  // Email provider for verification
  emailProvider: {
    type: "smtp",
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookie: {
      name: "better-auth.session",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  },

  // User schema
  user: {
    fields: {
      email: {
        required: true,
        unique: true,
      },
      name: {
        required: false,
      },
    },
  },

  // Plugins
  plugins: [nextCookies()],
});
```

### Environment Variables (Frontend)

```env
# .env.local
NEXT_PUBLIC_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
JWT_SECRET_KEY=your-secret-key-minimum-32-characters-long
NODE_ENV=development
```

### Better Auth API Routes (Next.js 14)

**File:** `frontend/app/api/auth/[...all]/route.ts`

```typescript
import { auth } from "@/lib/better-auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return auth.handler(request);
}

export async function POST(request: NextRequest) {
  return auth.handler(request);
}
```

This creates all necessary auth endpoints:
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/session` - Get current session
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

---

## JWT Configuration (Backend)

### Installation

```bash
pip install python-jose[cryptography] passlib[bcrypt] python-multipart
```

### JWT Utility Functions

**File:** `backend/src/auth/jwt_utils.py`

```python
"""JWT token generation and verification utilities"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

# Configuration
SECRET_KEY = "your-secret-key-minimum-32-characters-long"  # Load from env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create JWT access token

    Args:
        data: Payload data (must include 'sub' for user ID)
        expires_delta: Optional custom expiration time

    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire, "iat": datetime.utcnow()})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """
    Create JWT refresh token with longer expiration

    Args:
        data: Payload data (must include 'sub' for user ID)

    Returns:
        Encoded refresh token string
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode and verify JWT access token

    Args:
        token: JWT token string

    Returns:
        Decoded payload if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def get_user_id_from_token(token: str) -> Optional[str]:
    """
    Extract user ID from JWT token

    Args:
        token: JWT token string

    Returns:
        User ID if valid, None otherwise
    """
    payload = decode_access_token(token)
    if payload:
        return payload.get("sub")
    return None
```

### FastAPI Authentication Middleware

**File:** `backend/src/api/dependencies.py`

```python
"""FastAPI dependency injection for authentication"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session
from typing import Optional

from src.auth.jwt_utils import decode_access_token
from src.database import get_session

# HTTP Bearer token scheme
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    Dependency to get current authenticated user from JWT token

    Args:
        credentials: HTTP Authorization header with Bearer token

    Returns:
        User ID (from token 'sub' claim)

    Raises:
        HTTPException: 401 if token is invalid or missing
    """
    token = credentials.credentials

    # Decode token
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract user ID from 'sub' claim
    user_id: str = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing user ID",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id


def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[str]:
    """
    Optional dependency to get current user (doesn't raise error if not authenticated)

    Returns:
        User ID if authenticated, None otherwise
    """
    if credentials is None:
        return None

    payload = decode_access_token(credentials.credentials)
    if payload is None:
        return None

    return payload.get("sub")
```

### Protected Endpoint Example

```python
from fastapi import APIRouter, Depends
from src.api.dependencies import get_current_user

router = APIRouter(prefix="/api", tags=["tasks"])


@router.get("/{user_id}/tasks")
async def list_tasks(
    user_id: str,
    current_user: str = Depends(get_current_user),
):
    """
    List tasks for authenticated user

    Args:
        user_id: User ID from path
        current_user: Authenticated user ID from JWT

    Raises:
        HTTPException: 403 if user_id doesn't match authenticated user
    """
    # User isolation: ensure user can only access their own tasks
    if user_id != current_user:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Cannot access other users' tasks"
        )

    # Proceed with fetching tasks...
    return {"message": f"Tasks for user {user_id}"}
```

---

## Frontend-Backend Integration

### Token Flow Diagram

```
┌──────────────┐         ┌─────────────┐         ┌──────────────┐
│   Frontend   │         │ Better Auth │         │   Backend    │
│  (Next.js)   │         │  (Next.js)  │         │   (FastAPI)  │
└──────┬───────┘         └──────┬──────┘         └──────┬───────┘
       │                        │                       │
       │  1. Sign In            │                       │
       ├────────────────────────>                       │
       │                        │                       │
       │  2. JWT Token          │                       │
       <────────────────────────┤                       │
       │                        │                       │
       │  3. API Request + JWT  │                       │
       ├────────────────────────────────────────────────>
       │                        │                       │
       │                        │  4. Verify JWT        │
       │                        │<──────────────────────┤
       │                        │                       │
       │  5. API Response       │                       │
       <────────────────────────────────────────────────┤
       │                        │                       │
```

### Frontend Auth Client

**File:** `frontend/lib/auth.js`

```javascript
import { auth } from '@/lib/better-auth';

/**
 * Sign up a new user
 */
export async function signUp(email, password, name) {
  try {
    const result = await auth.signUp.email({
      email,
      password,
      name,
    });

    if (result.data) {
      // Store token in localStorage (or use secure cookie)
      localStorage.setItem('auth_token', result.data.accessToken);
      localStorage.setItem('refresh_token', result.data.refreshToken);
      localStorage.setItem('auth_user', JSON.stringify(result.data.user));
      return result.data.user;
    }

    throw new Error(result.error?.message || 'Sign up failed');
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(email, password) {
  try {
    const result = await auth.signIn.email({
      email,
      password,
    });

    if (result.data) {
      // Store token
      localStorage.setItem('auth_token', result.data.accessToken);
      localStorage.setItem('refresh_token', result.data.refreshToken);
      localStorage.setItem('auth_user', JSON.stringify(result.data.user));
      return result.data.user;
    }

    throw new Error(result.error?.message || 'Sign in failed');
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  try {
    await auth.signOut();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
  } catch (error) {
    console.error('Sign out error:', error);
    // Clear local storage even if API call fails
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
  }
}

/**
 * Get current auth token
 */
export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Get current user
 */
export function getUser() {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('auth_user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getToken();
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const result = await auth.refresh({ refreshToken });

    if (result.data) {
      localStorage.setItem('auth_token', result.data.accessToken);
      localStorage.setItem('refresh_token', result.data.refreshToken);
      return result.data.accessToken;
    }

    throw new Error('Token refresh failed');
  } catch (error) {
    // Refresh failed, clear all auth data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    throw error;
  }
}
```

### API Client with JWT

**File:** `frontend/lib/api.js`

```javascript
import { getToken, refreshAccessToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized - attempt refresh
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        // Retry original request with new token
        headers['Authorization'] = `Bearer ${newToken}`;
        const retryResponse = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers,
        });
        if (retryResponse.ok) return await retryResponse.json();
      }

      // Refresh failed, redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}
```

---

## Common Issues & Solutions

### Issue 1: JWT Signature Verification Failed

**Symptom:**
```python
jose.exceptions.JWTError: Signature verification failed
```

**Root Cause:**
- Frontend and backend using different `JWT_SECRET_KEY`
- Token signed with one key, verified with another

**Solution:**
1. Ensure both frontend and backend use **same secret key**
2. Load from environment variable:

**Frontend:** `.env.local`
```env
JWT_SECRET_KEY=your-secret-key-minimum-32-characters-long
```

**Backend:** `.env`
```env
JWT_SECRET_KEY=your-secret-key-minimum-32-characters-long
```

3. Verify secrets match:
```bash
# Frontend
echo $JWT_SECRET_KEY

# Backend
python -c "from src.config import settings; print(settings.JWT_SECRET_KEY)"
```

### Issue 2: CORS Blocking Auth Requests

**Symptom:**
```
Access to fetch at 'http://localhost:8000/api/login' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**Solution:**
```python
# backend/src/api/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,  # ✅ IMPORTANT for auth
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
```

### Issue 3: Token Expiration Not Handled

**Symptom:**
- User suddenly logged out
- "Invalid token" errors randomly

**Solution:**
Implement token refresh flow:

```javascript
// frontend/lib/api.js (excerpt from above)
if (response.status === 401) {
  const newToken = await refreshAccessToken();
  if (newToken) {
    // Retry with new token
    headers['Authorization'] = `Bearer ${newToken}`;
    const retryResponse = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    return await retryResponse.json();
  }
}
```

### Issue 4: Middleware Not Applied to Routes

**Symptom:**
- Protected routes accessible without token
- No 401 errors when token missing

**Solution:**
Ensure dependency injection in route:

```python
@router.get("/{user_id}/tasks")
async def list_tasks(
    user_id: str,
    current_user: str = Depends(get_current_user),  # ✅ REQUIRED
):
    # User isolation check
    if user_id != current_user:
        raise HTTPException(status_code=403, detail="Forbidden")

    # Proceed...
```

### Issue 5: Better Auth Not Issuing JWT

**Symptom:**
- Better Auth sign in succeeds but no JWT token returned
- `result.data.accessToken` is undefined

**Solution:**
Configure Better Auth to issue JWT:

```typescript
// frontend/lib/better-auth.ts
export const auth = new BetterAuth({
  // ... other config ...

  jwt: {
    enabled: true,  // ✅ Enable JWT
    secret: process.env.JWT_SECRET_KEY,
    algorithm: "HS256",
    expiresIn: "7d",
  },
});
```

---

## Security Best Practices

### 1. **Never Hardcode Secrets**

❌ **BAD:**
```javascript
const SECRET_KEY = "my-secret-key-123";
```

✅ **GOOD:**
```javascript
const SECRET_KEY = process.env.JWT_SECRET_KEY;
```

### 2. **Use Strong Secret Keys**

```bash
# Generate secure random key
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Minimum 32 characters, random, unique per environment.

### 3. **Set Appropriate Token Expiration**

```python
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Short-lived
REFRESH_TOKEN_EXPIRE_DAYS = 7    # Longer-lived for refresh
```

### 4. **Use HTTPS in Production**

```python
# frontend/lib/better-auth.ts
session: {
  cookie: {
    secure: process.env.NODE_ENV === "production",  # HTTPS only
    httpOnly: true,  # Prevent XSS
    sameSite: "strict",  # CSRF protection
  },
}
```

### 5. **Validate User Isolation**

```python
# ALWAYS check user_id matches token
if user_id != current_user:
    raise HTTPException(status_code=403, detail="Forbidden")
```

### 6. **Hash Passwords Properly**

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed = pwd_context.hash(plain_password)  # ✅
```

### 7. **Implement Rate Limiting**

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/api/auth/login")
@limiter.limit("5/minute")  # Max 5 login attempts per minute
async def login():
    # ...
```

### 8. **Store Tokens Securely**

**Options (in order of security):**
1. **HTTP-only cookies** (best, not accessible by JavaScript)
2. **Memory** (lost on page refresh)
3. **LocalStorage** (vulnerable to XSS, acceptable for demo/dev)

❌ **Never:** Plain cookies, URL params, or query strings

---

## Testing Auth Flow

### Manual Testing Checklist

- [ ] User can sign up with email/password
- [ ] User receives verification email (if enabled)
- [ ] User can sign in with correct credentials
- [ ] Sign in fails with incorrect password
- [ ] JWT token is returned after sign in
- [ ] Token is stored (cookie or localStorage)
- [ ] Protected routes require token
- [ ] Protected routes return 401 without token
- [ ] User can access only their own data (user isolation)
- [ ] Token refresh works before expiration
- [ ] Expired token triggers re-authentication
- [ ] Sign out clears token
- [ ] CORS allows auth requests from frontend

### Automated Tests (PyTest)

```python
import pytest
from src.auth.jwt_utils import create_access_token, decode_access_token

def test_create_and_decode_token():
    """Test JWT token creation and decoding"""
    user_data = {"sub": "user_123", "email": "test@example.com"}
    token = create_access_token(user_data)

    # Decode token
    decoded = decode_access_token(token)

    assert decoded is not None
    assert decoded["sub"] == "user_123"
    assert decoded["email"] == "test@example.com"


def test_invalid_token():
    """Test decoding invalid token returns None"""
    invalid_token = "invalid.jwt.token"
    decoded = decode_access_token(invalid_token)

    assert decoded is None


def test_protected_endpoint(client, auth_headers):
    """Test protected endpoint requires authentication"""
    # Without token
    response = client.get("/api/user_123/tasks")
    assert response.status_code == 401

    # With valid token
    response = client.get("/api/user_123/tasks", headers=auth_headers)
    assert response.status_code == 200


def test_user_isolation(client, auth_headers):
    """Test users cannot access other users' data"""
    # User trying to access another user's tasks
    response = client.get("/api/user_456/tasks", headers=auth_headers)
    assert response.status_code == 403
```

---

## Quick Reference

### Environment Variables

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
JWT_SECRET_KEY=your-secret-key-minimum-32-characters-long
DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
```

**Backend (.env):**
```env
JWT_SECRET_KEY=your-secret-key-minimum-32-characters-long
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
```

### Commands

```bash
# Generate secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Test JWT token
python -c "from src.auth.jwt_utils import create_access_token; print(create_access_token({'sub': 'test'}))"

# Verify backend dependencies
pip install python-jose[cryptography] passlib[bcrypt]

# Verify frontend dependencies
npm install better-auth
```

---

**Stack:**
- Frontend: Next.js 14 + Better Auth
- Backend: FastAPI + python-jose + passlib
- Tokens: JWT (HS256 algorithm)
- Storage: HTTP-only cookies (production) or localStorage (dev)
- Database: PostgreSQL (shared between Better Auth and FastAPI)
