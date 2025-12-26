# Research: Phase IV - Kubernetes Deployment for Todo Chatbot

**Date**: 2025-12-27
**Feature**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)
**Tasks**: [tasks.md](./tasks.md)

---

## Environment Verification Report

### Tool Availability Status

| Tool | Status | Version | Notes |
|------|--------|---------|-------|
| Docker Desktop | ❌ NOT FOUND | N/A | Command `docker --version` failed with exit code 127 |
| Minikube | ❌ NOT FOUND | N/A | Command `minikube version` failed with exit code 127 |
| Helm | ❌ NOT FOUND | N/A | Command `helm version` failed with exit code 127 |
| kubectl | ❌ NOT FOUND | N/A | Command `kubectl version --client` failed with exit code 127 |
| Docker AI (Gordon) | ❌ NOT FOUND | N/A | Cannot run without Docker |
| kubectl-ai | ❌ NOT FOUND | N/A | Cannot run without kubectl |
| Kagent | ❌ NOT FOUND | N/A | Not installed |

### Prerequisites Check

**Status**: ❌ FAILED - All mandatory tools are missing

**Required Actions Before Proceeding**:
1. Install Docker Desktop 4.53+ (https://www.docker.com/products/docker-desktop/)
2. Install Minikube 1.32+ (https://minikube.sigs.k8s.io/docs/start/)
3. Install Helm 3.12+ (https://helm.sh/docs/intro/install/)
4. Install kubectl 1.28+ (https://kubernetes.io/docs/tasks/tools/)

### Minikube Status Check

```
$ minikube status
minikube: Nonexistent
cluster: Nonexistent
kubectl: Nonexistent
```

### AI Tool Availability Status

- **Gordon (Docker AI Agent)**: ❌ Not available (requires Docker)
- **kubectl-ai**: ❌ Not available (requires kubectl)
- **Kagent**: ❌ Not available (not installed)

### Fallback Strategies

Since all AI tools are unavailable, fallback strategies will be employed:

1. **Gordon Fallback**: Claude Code will generate Dockerfiles following Dockerfile best practices
2. **kubectl-ai Fallback**: Standard kubectl commands will be used
3. **Kagent Fallback**: Manual kubectl top/describe commands will be used

---

## Docker Base Image Research

### Frontend (Next.js 14) Docker Base Images

**Recommended**: `node:18-alpine`
- Small size (~180MB base)
- Alpine Linux for minimal footprint
- Node.js 18 LTS for Next.js 14 compatibility
- Multi-stage build pattern recommended:
  - Builder stage: Install dependencies and build
  - Production stage: Copy build artifacts to minimal runtime

**Alternatives**:
- `node:18-slim` (~200MB) - Debian-based, slightly larger but more compatible
- `node:18-bookworm-slim` - Newer Debian base

### Backend (FastAPI Python 3.11) Docker Base Images

**Recommended**: `python:3.11-slim`
- Small size (~130MB base)
- Python 3.11 for FastAPI compatibility
- Multi-stage build pattern recommended:
  - Dependencies stage: Install Python packages
  - Production stage: Copy packages to minimal runtime

**Alternatives**:
- `python:3.11-alpine` (~50MB smaller but potential compatibility issues)
- `python:3.11-bookworm-slim` - Newer Debian base

### Multi-Stage Build Pattern

**Frontend Pattern**:
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
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

**Backend Pattern**:
```dockerfile
# Dependencies stage
FROM python:3.11-slim AS dependencies
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim AS production
WORKDIR /app
COPY --from=dependencies /app/requirements.txt /app/requirements.txt
COPY --from=dependencies /app/.venv /app/.venv
COPY . .
EXPOSE 8000
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Helm Chart Best Practices for Web Applications

### Standard Resource Structure

Each service should have:
1. **Deployment** - Manages pod replicas
2. **Service** - Exposes pods internally/externally
3. **ConfigMap** - Externalizes configuration
4. **Secret** - Stores sensitive data (credentials)

### Resource Limits (Per spec requirements)

**Frontend**:
- Memory: 256Mi limit, 128Mi request
- CPU: 500m limit, 100m request

**Backend**:
- Memory: 512Mi limit, 256Mi request
- CPU: 1000m limit, 200m request

### Service Types

- **Frontend**: NodePort (external access for UI)
- **Backend**: ClusterIP (internal-only, accessed by frontend)

### Health Checks

- **Readiness Probe**: Check if service is ready to accept traffic
- **Liveness Probe**: Check if service is running properly

### Helm Template Structure

```
charts/todo-chatbot/
├── Chart.yaml          # Metadata
├── values.yaml         # Default values
├── templates/
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── configmap.yaml
│   └── secrets.yaml
└── README.md
```

---

## Technical Decisions Summary

### Immediate Actions Required
1. Install Docker Desktop before proceeding with containerization
2. Install Minikube for local Kubernetes cluster
3. Install Helm for package management
4. Install kubectl for cluster operations

### Docker Implementation Plan (Fallback)
- Generate Dockerfiles manually based on research
- Use multi-stage builds for optimization
- Target image sizes: Frontend ≤500MB, Backend ≤400MB

### Kubernetes Implementation Plan
- Create Helm chart with standard resource structure
- Use resource limits per spec requirements
- Implement health checks for both services
- Use proper service types (NodePort for frontend, ClusterIP for backend)

### AI Tool Implementation Plan
- When tools become available, implement Gordon for Dockerfile generation
- Use kubectl-ai for natural language Kubernetes operations
- Use Kagent for cluster analysis and optimization