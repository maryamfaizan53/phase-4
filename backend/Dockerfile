# Backend Dockerfile for Todo Chatbot
# Multi-stage build for FastAPI application
# Based on dockerfile-spec.md and backend-container.md requirements

# Dependencies stage
FROM python:3.11-slim AS dependencies

WORKDIR /app

# Install system dependencies if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python packages
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim AS production

WORKDIR /app

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash appuser && \
    chown -R appuser:appuser /app

# Copy Python packages and executables from dependencies stage
COPY --from=dependencies /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=dependencies /usr/local/bin /usr/local/bin

# Copy application source code
COPY --chown=appuser:appuser . .

# Switch to non-root user
USER appuser

# Expose port 8000
EXPOSE 8000

# Add health check
HEALTHCHECK --timeout=30s --interval=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start the application with uvicorn
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]