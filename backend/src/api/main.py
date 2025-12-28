"""FastAPI application for Todo AI Chatbot"""
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import os
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


# Custom CORS Middleware (replaces problematic CORSMiddleware)
class CustomCORSMiddleware(BaseHTTPMiddleware):
    """Custom CORS middleware to handle all CORS requirements."""

    async def dispatch(self, request, call_next):
        # Handle preflight OPTIONS requests
        if request.method == "OPTIONS":
            response = Response(content="", status_code=200)
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "*"
            response.headers["Access-Control-Max-Age"] = "600"
            return response

        # Process the request
        response = await call_next(request)

        # Add CORS headers to all responses
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"

        return response


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


# Add middlewares (execution order: Custom CORS -> Security Headers -> routes)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(CustomCORSMiddleware)


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


@app.get("/debug/middlewares")
async def debug_middlewares():
    """Debug endpoint to check loaded middlewares"""
    return {
        "middlewares": [
            {"type": type(m).__name__, "cls": m.cls.__name__ if hasattr(m, 'cls') else "N/A"}
            for m in app.user_middleware
        ]
    }


# Include routes
from src.api.routes import router as chat_router
from src.api.auth_routes import router as auth_router
from src.api.task_routes import router as task_router

app.include_router(auth_router)
app.include_router(task_router)
app.include_router(chat_router)
