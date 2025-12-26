"""FastAPI application for Todo AI Chatbot"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from src.config import settings
from src.api.dependencies import limiter

# Create FastAPI app instance
app = FastAPI(
    title="Todo AI Chatbot API",
    description="Conversational AI todo management system with agentic architecture",
    version="0.1.0",
    debug=settings.DEBUG,
)

# Rate limiting temporarily disabled due to slowapi compatibility issue
# TODO: Fix slowapi integration or use alternative rate limiting solution
# app.state.limiter = limiter
# app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# Security Headers Middleware (T090)
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware to inject security headers into all responses."""

    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        return response


# CORS Configuration (T086)
# TODO: Configure allowed origins via environment variable for production
# In production, restrict to frontend domain only (e.g., https://yourdomain.com)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Development frontend URL
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Add security headers middleware
app.add_middleware(SecurityHeadersMiddleware)


@app.get("/")
async def root():
    """
    Root endpoint with API information.

    Returns:
        dict: Welcome message and available endpoints
    """
    return {
        "message": "Welcome to Todo AI Chatbot API",
        "version": "0.1.0",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "chat": "/api/{user_id}/chat (POST)"
        }
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint.

    Returns:
        dict: Health status and environment info
    """
    return {
        "status": "ok",
        "environment": settings.ENV,
        "service": "todo-ai-chatbot",
    }


# Include routes
from src.api.routes import router as chat_router
from src.api.auth_routes import router as auth_router
from src.api.task_routes import router as task_router

app.include_router(auth_router)
app.include_router(task_router)
app.include_router(chat_router)
