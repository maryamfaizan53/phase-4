"""
Main entry point for the Todo application with Dapr and Kafka integration.
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dapr.ext.fastapi import DaprApp
import uvicorn
from .api.main import app as api_app
from .config.database import get_engine
from sqlmodel import SQLModel


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager for startup and shutdown events.
    """
    # Startup
    logger.info("Initializing application...")

    # Initialize database
    engine = get_engine()
    # Create tables
    SQLModel.metadata.create_all(bind=engine)

    logger.info("Application initialized successfully")

    yield

    # Shutdown
    logger.info("Shutting down application...")


# Initialize FastAPI app with lifespan
app = FastAPI(
    title="Todo AI Chatbot API",
    description="Conversational AI todo management system with agentic architecture",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Dapr extension
dapr_app = DaprApp(app)

# Include API routes from the existing structure
app.include_router(api_app)

@app.get("/")
async def root():
    """Root endpoint for health check."""
    return {"message": "Todo AI Chatbot API is running!"}

@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "service": "todo-app"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)