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

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


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
# Allowed origins are configured via environment variable
allowed_origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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
