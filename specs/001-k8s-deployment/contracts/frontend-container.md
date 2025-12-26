# Frontend Container Requirements: Todo Chatbot

**Feature**: Phase IV - Kubernetes Deployment
**Service**: Next.js 14 Frontend
**Date**: 2025-12-27

---

## Container Analysis

### Application Overview
- **Framework**: Next.js 14
- **Name**: todo-frontend
- **Version**: 1.0.0
- **Type**: Client-side rendered web application with API integration

### Dependencies Analysis
From `package.json`:
- **Next.js**: 14.0.4 (framework)
- **React**: 18.2.0 (UI library)
- **React DOM**: 18.2.0 (DOM renderer)
- **Recharts**: 2.10.3 (data visualization)
- **Date-fns**: 3.0.0 (date utilities)

### Build Process
- **Build command**: `npm run build` (creates `.next/` directory)
- **Development command**: `npm run dev`
- **Production command**: `npm run start`
- **Dependencies**: Install via `npm ci --only=production`

### Configuration Files
- **Next.js config**: `next.config.js` (minimal configuration)
- **Tailwind CSS**: `tailwind.config.js`
- **PostCSS**: `postcss.config.js`
- **Environment**: `.env.local` (for local development)

---

## Container Requirements

### Entrypoint
- **Production**: `npm start` (executes `next start`)
- **Development**: `npm run dev` (not for production container)

### Exposed Port
- **Port**: 3000 (TCP)
- **Purpose**: HTTP server for Next.js application
- **Default**: Next.js serves on port 3000 unless `PORT` environment variable is set

### Environment Variables
- **NEXT_PUBLIC_API_URL**: API base URL for backend communication
  - Default: `http://localhost:8000` (development)
  - Kubernetes: `http://backend-service:8000` (service DNS)
- **PORT**: Port to bind to (optional, default 3000)
  - Default: 3000
  - Kubernetes: 3000

### Health Check Endpoint
- **Endpoint**: `/` (root path)
- **Method**: HTTP GET
- **Purpose**: Verify application is responding to requests
- **Timing**:
  - Initial delay: 10 seconds (for startup)
  - Interval: 10 seconds
  - Timeout: 5 seconds
  - Threshold: 3 attempts

### Working Directory
- **Path**: `/app`
- **Purpose**: Application code location in container
- **Structure**: Contains source code, built assets, and dependencies

### User Permissions
- **User**: Non-root user (UID > 1000)
- **Group**: Non-root group (GID > 1000)
- **Purpose**: Security best practice for containerized applications

---

## Multi-Stage Build Pattern

### Stage 1: Builder
- **Base Image**: `node:18-alpine`
- **Purpose**: Install dependencies and build application
- **Steps**:
  1. Set working directory to `/app`
  2. Copy `package*.json` files
  3. Install production dependencies: `npm ci --only=production`
  4. Copy source code: `COPY . .`
  5. Build application: `npm run build`

### Stage 2: Production
- **Base Image**: `node:18-alpine`
- **Purpose**: Minimal runtime environment
- **Steps**:
  1. Set working directory to `/app`
  2. Create non-root user and group
  3. Copy only necessary files from builder stage:
     - `package*.json` files
     - Production `node_modules`
     - Built application assets (`.next/` directory)
     - Public assets (`public/` directory)
  4. Set proper ownership to non-root user
  5. Switch to non-root user
  6. Expose port 3000
  7. Add health check
  8. Set entrypoint to `npm start`

---

## Resource Requirements

### CPU Requirements
- **Request**: 100m (0.1 CPU core)
- **Limit**: 500m (0.5 CPU core)
- **Rationale**: Next.js server is lightweight for static content serving

### Memory Requirements
- **Request**: 128Mi (131,072 KiB)
- **Limit**: 256Mi (262,144 KiB)
- **Rationale**: Sufficient for Next.js application with reasonable buffer

### Storage Requirements
- **Image Size Target**: ≤ 500MB
- **Build Artifacts**: `.next/` directory after optimization
- **Dependencies**: Production-only `node_modules`

---

## Security Requirements

### Container Security
- **Run as Non-Root**: Use dedicated user (UID > 1000)
- **No Secrets in Image**: Do not embed sensitive information
- **Minimal Attack Surface**: Only production dependencies
- **Read-Only Filesystem**: Not required (may break Next.js runtime)

### Network Security
- **Inbound Traffic**: Port 3000 (HTTP)
- **Outbound Traffic**: To backend service (port 8000)
- **Service Discovery**: Use Kubernetes DNS for backend communication

---

## Kubernetes Integration

### Service Configuration
- **Service Type**: NodePort (external access)
- **Port**: 3000
- **Target Port**: 3000
- **Node Port**: Auto-assigned (30000-32767 range)

### Environment Variables in Kubernetes
- **NEXT_PUBLIC_API_URL**: `http://backend-service:8000`
- **Purpose**: Frontend communicates with backend via Kubernetes service DNS

### Probes Configuration
- **Readiness Probe**: HTTP GET on `/` port 3000
- **Liveness Probe**: HTTP GET on `/` port 3000
- **Initial Delay**: 10 seconds for readiness, 30 seconds for liveness

---

## Files to Include in Container

### Essential Files
- `package.json` - Application metadata and dependencies
- `package-lock.json` - Deterministic dependency installation
- `.next/` directory - Built application assets
- `public/` directory - Static assets
- `node_modules/` - Production dependencies (from builder stage)

### Configuration Files
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - CSS framework configuration
- `postcss.config.js` - CSS processing configuration

---

## Files to Exclude from Container

### Build Artifacts (via .dockerignore)
- `node_modules/` (during build stage, copy from builder instead)
- `.next/` (during build stage, copy from build result instead)
- `.git/` - Git repository metadata
- `*.log` - Log files
- `.env.local` - Local environment variables
- `README.md` - Documentation (not needed in runtime)
- `Dockerfile*` - Docker files
- `docker-compose*` - Compose files
- `*.md` - Markdown documentation files

---

## Build Optimization

### Layer Caching Strategy
1. Copy `package*.json` first to leverage Docker layer caching
2. Install dependencies before copying source code
3. Copy build artifacts from builder stage efficiently
4. Copy only necessary runtime files

### Image Size Optimization
- Use Alpine base image for smaller footprint
- Multi-stage build to exclude build dependencies
- Remove unnecessary files and dependencies
- Use production-only dependency installation

---

## Validation Criteria

### Build Validation
- [ ] Dockerfile builds successfully
- [ ] Build completes within 5 minutes
- [ ] Image size ≤ 500MB

### Runtime Validation
- [ ] Container starts successfully
- [ ] Application serves on port 3000
- [ ] Health check passes
- [ ] Environment variables properly configured

### Kubernetes Validation
- [ ] Pod reaches Running state
- [ ] Service can route traffic to pod
- [ ] Environment variables correctly set for K8s
- [ ] Probes configured and passing