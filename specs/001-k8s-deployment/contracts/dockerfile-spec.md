# Dockerfile Specification Contract: Todo Chatbot

**Feature**: Phase IV - Kubernetes Deployment
**Contract Type**: Container Build Specification
**Version**: 1.0
**Date**: 2025-12-27

---

## Purpose

This specification defines the requirements for Dockerfiles that containerize the Todo Chatbot application components (frontend Next.js 14 app and backend FastAPI app). These Dockerfiles must meet performance, security, and deployment requirements for Kubernetes orchestration.

---

## Frontend Dockerfile Requirements (Next.js 14)

### Base Image Requirements
- **Primary**: `node:18-alpine`
- **Alternative**: `node:18-slim` (if alpine compatibility issues arise)
- **Version**: Node.js 18.x LTS for Next.js 14 compatibility

### Build Pattern
- **Multi-stage build required** with distinct builder and production stages
- **Builder stage**:
  - Install dependencies: `npm ci --only=production`
  - Build application: `npm run build`
  - Copy source files: `COPY . .`
- **Production stage**:
  - Minimal runtime environment
  - Copy only necessary build artifacts
  - No development dependencies

### Port Configuration
- **Exposed Port**: 3000 (TCP)
- **Environment Variable**: `PORT=3000` (or use Next.js default)

### Health Check
- **Endpoint**: `/` (root path)
- **Method**: HTTP GET
- **Timeout**: 30 seconds
- **Interval**: 10 seconds
- **Threshold**: 3 attempts

### Environment Variables
- `NEXT_PUBLIC_API_URL`: API base URL for backend communication
- `PORT`: Port to bind to (default: 3000)

### Security Requirements
- **Non-root user**: Run as non-root user (UID > 1000)
- **No secrets in image**: Do not bake secrets into image
- **Minimal packages**: Only install production dependencies

### Performance Requirements
- **Build Time**: ≤ 5 minutes
- **Image Size**: ≤ 500MB total
- **Layer optimization**: Use `.dockerignore` to exclude unnecessary files
- **Cache optimization**: Leverage Docker layer caching for dependencies

### Files to Include
- Built application assets (`.next/` directory)
- Production dependencies
- Runtime configuration files
- Health check scripts (if needed)

### Files to Exclude (via .dockerignore)
- `node_modules/`
- `.next/` (during build stage)
- `.git/`
- `*.log`
- `.env.local`
- `README.md`
- `Dockerfile*`
- `docker-compose*`

### Example Structure
```dockerfile
# Builder stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 3000
HEALTHCHECK --timeout=30s --interval=10s --retries=3 CMD curl -f http://localhost:3000/ || exit 1
CMD ["npm", "start"]
```

---

## Backend Dockerfile Requirements (FastAPI Python 3.11)

### Base Image Requirements
- **Primary**: `python:3.11-slim`
- **Alternative**: `python:3.11-alpine` (if size optimization needed)
- **Version**: Python 3.11.x for FastAPI compatibility

### Build Pattern
- **Multi-stage build required** with distinct dependencies and production stages
- **Dependencies stage**:
  - Install Python packages: `pip install --no-cache-dir -r requirements.txt`
  - Build Python dependencies
- **Production stage**:
  - Minimal runtime environment
  - Copy only necessary dependencies and code
  - No build tools or compilation dependencies

### Port Configuration
- **Exposed Port**: 8000 (TCP)
- **Environment Variable**: `PORT=8000`

### Health Check
- **Endpoint**: `/health` (or `/` if health check not available)
- **Method**: HTTP GET
- **Timeout**: 30 seconds
- **Interval**: 10 seconds
- **Threshold**: 3 attempts

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET_KEY`: JWT signing key
- `PORT`: Port to bind to (default: 8000)
- `API_HOST`: Host to bind to (default: 0.0.0.0)

### Security Requirements
- **Non-root user**: Run as non-root user (UID > 1000)
- **No secrets in image**: Do not bake secrets into image
- **Minimal packages**: Only install production dependencies

### Performance Requirements
- **Build Time**: ≤ 5 minutes
- **Image Size**: ≤ 400MB total
- **Layer optimization**: Use `.dockerignore` to exclude unnecessary files
- **Cache optimization**: Leverage Docker layer caching for dependencies

### Files to Include
- Python source code (`src/` directory)
- Production dependencies
- Runtime configuration files
- Health check scripts (if needed)

### Files to Exclude (via .dockerignore)
- `__pycache__/`
- `.venv/`
- `venv/`
- `.git/`
- `*.pyc`
- `.env`
- `*.log`
- `.pytest_cache/`
- `Dockerfile*`

### Example Structure
```dockerfile
# Dependencies stage
FROM python:3.11-slim AS dependencies
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim AS production
WORKDIR /app
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser:appuser /app
COPY --from=dependencies /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --chown=appuser:appuser . .
USER appuser
EXPOSE 8000
HEALTHCHECK --timeout=30s --interval=10s --retries=3 CMD curl -f http://localhost:8000/health || exit 1
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Common Requirements (Both Services)

### Build Context
- **Build context**: Should be minimal, only include necessary files
- **Build arguments**: Support optional build arguments if needed
- **Labels**: Include standard labels like `org.opencontainers.image.title`, `org.opencontainers.image.version`

### Testing
- **Local test**: Dockerfile must build and run successfully locally
- **Health check**: Health check must pass within 30 seconds of container start
- **Port binding**: Service must bind to the specified port (3000 for frontend, 8000 for backend)

### Kubernetes Compatibility
- **Resource constraints**: Dockerfile should not require excessive resources during build
- **Init containers**: Should not require complex init container setup
- **Sidecar compatibility**: Should work with service mesh sidecars if deployed

### Versioning
- **Tagging**: Images should be tagged with semantic version (e.g., `todo-frontend:latest`, `todo-frontend:1.0.0`)
- **Multi-arch**: Consider multi-architecture support if deploying across different platforms

---

## Validation Criteria

### Build Validation
- [ ] Dockerfile builds successfully: `docker build -t <image-name> .`
- [ ] Build completes within 5 minutes
- [ ] Image size ≤ 500MB (frontend) or ≤ 400MB (backend)

### Runtime Validation
- [ ] Container starts successfully: `docker run -p <port>:<port> <image-name>`
- [ ] Service responds on specified port
- [ ] Health check passes within 30 seconds
- [ ] Service handles requests properly

### Security Validation
- [ ] Container runs as non-root user
- [ ] No secrets baked into image
- [ ] Minimal attack surface (fewest packages possible)

### Kubernetes Validation
- [ ] Works in Kubernetes environment
- [ ] Proper resource utilization
- [ ] Correct environment variable handling
- [ ] Graceful shutdown support

---

## Success Metrics

- **Build Time**: ≤ 5 minutes for each service
- **Image Size**: ≤ 500MB (frontend), ≤ 400MB (backend)
- **Startup Time**: Service ready within 60 seconds
- **Resource Usage**: Minimal during build and runtime
- **Security Score**: Passes Docker security scanning (if available)