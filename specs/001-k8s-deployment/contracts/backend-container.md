# Backend Container Requirements: Todo Chatbot

**Feature**: Phase IV - Kubernetes Deployment
**Service**: FastAPI Backend
**Date**: 2025-12-27

---

## Container Analysis

### Application Overview
- **Framework**: FastAPI (Python 3.11)
- **Name**: todo-backend
- **Version**: 1.0.0
- **Type**: REST API with AI integration for conversational features

### Dependencies Analysis
From `pyproject.toml`:
- **FastAPI**: >=0.100.0 (web framework)
- **Uvicorn**: >=0.25.0 (ASGI server)
- **SQLModel**: >=0.0.14 (ORM with SQL Alchemy + Pydantic)
- **Psycopg2-binary**: >=2.9.0 (PostgreSQL adapter)
- **Pydantic**: >=2.5.0 (data validation)
- **Pydantic-settings**: >=2.1.0 (settings management)
- **Python-dotenv**: >=1.0.0 (environment variable loading)
- **OpenAI**: >=1.0.0 (AI integration)
- **PyJWT**: >=2.8.0 (JWT token handling)
- **Slowapi**: >=0.1.9 (rate limiting)
- **Alembic**: >=1.13.0 (database migrations)

### Python Version
- **Required**: Python 3.11+ (from pyproject.toml)
- **Runtime**: Python 3.11 (confirmed from backend structure)

### Application Structure
- **Entry Point**: `src.api.main:app` (FastAPI application instance)
- **Server**: Uvicorn ASGI server
- **Components**: API routes, database models, agents, configuration

### Build Process
- **Dependency installation**: `pip install --no-cache-dir -r requirements.txt`
- **Development server**: `uvicorn src.api.main:app --reload`
- **Production server**: `uvicorn src.api.main:app --host 0.0.0.0 --port 8000`

---

## Container Requirements

### Entrypoint
- **Production**: `uvicorn src.api.main:app --host 0.0.0.0 --port 8000`
- **Alternative**: `python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000`
- **Development**: `uvicorn src.api.main:app --reload` (not for production container)

### Exposed Port
- **Port**: 8000 (TCP)
- **Purpose**: HTTP server for FastAPI application
- **Default**: FastAPI serves on port 8000 unless `PORT` environment variable is set
- **Host Binding**: Must bind to `0.0.0.0` to accept external connections in container

### Environment Variables
- **DATABASE_URL**: PostgreSQL connection string
  - Default: `postgresql://user:pass@localhost:5432/phase4_db` (development)
  - Kubernetes: `postgresql://user:pass@postgresql:5432/todo_chatbot` (service DNS)
- **JWT_SECRET_KEY**: JWT signing key for authentication
  - Default: `your-secret-key-minimum-32-characters-long` (for development)
  - Kubernetes: Should be stored in Secret
- **PORT**: Port to bind to (optional, default 8000)
  - Default: 8000
  - Kubernetes: 8000
- **API_HOST**: Host to bind to (optional, default 0.0.0.0)
  - Default: `0.0.0.0`
  - Kubernetes: `0.0.0.0`
- **ENV**: Environment mode (development, production)
  - Default: `development`
  - Kubernetes: `production`
- **DEBUG**: Debug mode flag
  - Default: `true`
  - Kubernetes: `false`

### Health Check Endpoint
- **Endpoint**: `/health` (dedicated health check endpoint)
- **Method**: HTTP GET
- **Purpose**: Verify application is responding and database connection is available
- **Timing**:
  - Initial delay: 10 seconds (for startup)
  - Interval: 10 seconds
  - Timeout: 5 seconds
  - Threshold: 3 attempts

### Working Directory
- **Path**: `/app`
- **Purpose**: Application code location in container
- **Structure**: Contains source code, dependencies, and configuration

### User Permissions
- **User**: Non-root user (UID > 1000)
- **Group**: Non-root group (GID > 1000)
- **Purpose**: Security best practice for containerized applications

---

## Multi-Stage Build Pattern

### Stage 1: Dependencies
- **Base Image**: `python:3.11-slim`
- **Purpose**: Install Python dependencies and build packages
- **Steps**:
  1. Set working directory to `/app`
  2. Install system dependencies if needed: `build-essential`, etc.
  3. Copy `requirements.txt` (or `pyproject.toml`)
  4. Install Python packages: `pip install --no-cache-dir -r requirements.txt`
  5. Cache dependencies for layer optimization

### Stage 2: Production
- **Base Image**: `python:3.11-slim`
- **Purpose**: Minimal runtime environment
- **Steps**:
  1. Set working directory to `/app`
  2. Create non-root user and group
  3. Copy only necessary files from dependencies stage and source:
     - Python packages from dependencies stage
     - Source code from host (`src/` directory)
     - Configuration files
     - Database migration files
  4. Set proper ownership to non-root user
  5. Switch to non-root user
  6. Expose port 8000
  7. Add health check
  8. Set entrypoint to uvicorn command

---

## Resource Requirements

### CPU Requirements
- **Request**: 200m (0.2 CPU core)
- **Limit**: 1000m (1.0 CPU core)
- **Rationale**: FastAPI with AI integration requires more processing power

### Memory Requirements
- **Request**: 256Mi (262,144 KiB)
- **Limit**: 512Mi (524,288 KiB)
- **Rationale**: Sufficient for FastAPI application with AI processing and reasonable buffer

### Storage Requirements
- **Image Size Target**: ≤ 400MB
- **Dependencies**: Python packages installed
- **Source Code**: Python application code
- **Migrations**: Database migration files

---

## Security Requirements

### Container Security
- **Run as Non-Root**: Use dedicated user (UID > 1000)
- **No Secrets in Image**: Do not embed sensitive information
- **Minimal Attack Surface**: Only production dependencies
- **System Package Installation**: Minimize to reduce attack surface

### Network Security
- **Inbound Traffic**: Port 8000 (HTTP)
- **Outbound Traffic**: To PostgreSQL database, AI services (OpenAI)
- **Service Discovery**: Use Kubernetes DNS for database communication

---

## Kubernetes Integration

### Service Configuration
- **Service Type**: ClusterIP (internal-only access)
- **Port**: 8000
- **Target Port**: 8000
- **Purpose**: Internal access from frontend service only

### Environment Variables in Kubernetes
- **DATABASE_URL**: `postgresql://user:$(DATABASE_PASSWORD)@postgresql:5432/todo_chatbot` (service DNS)
- **JWT_SECRET_KEY**: From Kubernetes Secret
- **ENV**: `production`
- **DEBUG**: `false`

### Probes Configuration
- **Readiness Probe**: HTTP GET on `/health` port 8000
- **Liveness Probe**: HTTP GET on `/health` port 8000
- **Initial Delay**: 10 seconds for readiness, 30 seconds for liveness

---

## Files to Include in Container

### Essential Files
- `pyproject.toml` - Dependency specification
- `src/` directory - Python application source code
- `migrations/` directory - Database migration files
- `alembic.ini` - Alembic configuration
- `scripts/` directory - Utility scripts

### Python Packages
- All dependencies installed via pip from requirements.txt
- Runtime libraries only (no development dependencies)

---

## Files to Exclude from Container

### Build Artifacts (via .dockerignore)
- `__pycache__/` - Python cache files
- `.venv/` - Virtual environment
- `venv/` - Virtual environment
- `.git/` - Git repository metadata
- `*.pyc` - Python compiled files
- `.env` - Environment variables file
- `*.log` - Log files
- `Dockerfile*` - Docker files
- `.pytest_cache/` - Pytest cache
- `tests/` - Test files (not needed in runtime)
- `pytest.ini` - Test configuration (if exists)

---

## Build Optimization

### Layer Caching Strategy
1. Copy dependency specification first (`requirements.txt`) to leverage Docker layer caching
2. Install dependencies before copying source code
3. Copy source code after dependencies are installed
4. Copy only necessary runtime files

### Image Size Optimization
- Use slim base image for smaller footprint
- Multi-stage build to exclude build dependencies
- Remove unnecessary files and dependencies
- Use production-only dependency installation

### Python-Specific Optimization
- Use `--no-cache-dir` with pip to reduce image size
- Install only required dependencies (not optional dev dependencies)
- Consider using Alpine if compatibility allows

---

## Validation Criteria

### Build Validation
- [ ] Dockerfile builds successfully
- [ ] Build completes within 5 minutes
- [ ] Image size ≤ 400MB

### Runtime Validation
- [ ] Container starts successfully
- [ ] Application serves on port 8000
- [ ] Health check passes
- [ ] Environment variables properly configured

### Kubernetes Validation
- [ ] Pod reaches Running state
- [ ] Service can route traffic to pod
- [ ] Environment variables correctly set for K8s
- [ ] Probes configured and passing
- [ ] Database connectivity established
- [ ] AI service connectivity (if required) established