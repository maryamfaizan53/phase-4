# Feature Specification: Phase IV - Kubernetes Deployment for Todo Chatbot

**Feature Branch**: `001-k8s-deployment`
**Created**: 2025-12-26
**Status**: Draft
**Input**: User description: "Phase IV: Cloud-Native Local Kubernetes Deployment for Todo Chatbot using Minikube, Docker, Helm, and AI-assisted DevOps (Gordon, kubectl-ai, Kagent)"

---

## 1. Executive Summary

### Purpose
Deploy the existing Phase III Todo Chatbot application (frontend + backend) to a local Kubernetes cluster using Minikube, leveraging AI-assisted DevOps tools (Gordon for Docker, kubectl-ai for Kubernetes operations, Kagent for cluster analysis).

### Business Value
- **Local K8s Environment**: Production-like deployment without cloud costs
- **AI-Assisted Infrastructure**: Faster iteration with Gordon/kubectl-ai/Kagent
- **Hackathon Showcase**: Demonstrates Spec-Driven Development for infrastructure
- **Cloud-Ready**: Architecture transfers to production Kubernetes clusters

### Scope
**In Scope**: Containerization (Docker), Helm packaging, Minikube deployment, AI tool usage

**Out of Scope**: Application changes, cloud deployment, production security/monitoring

---

## 2. System Overview

### Logical Architecture
**Layer 1 - Applications**: Next.js frontend + FastAPI backend + PostgreSQL database

**Layer 2 - Containers**: Dockerized frontend and backend

**Layer 3 - Kubernetes**: Minikube cluster with Deployments and Services

**Layer 4 - AI DevOps**: Gordon (Dockerfiles) + kubectl-ai (operations) + Kagent (diagnostics)

###Interaction Flow
1. Developer → Gordon → Optimized Dockerfiles generated
2. Docker build → Frontend/backend images created
3. Helm install → Kubernetes Deployments/Services created
4. Minikube → Pods running, frontend accessible via NodePort
5. kubectl-ai → Scaling/troubleshooting via natural language
6. Kagent → Cluster health analysis and optimization recommendations

---

## 3. User Scenarios & Testing

### User Story 1 - Containerize Applications with Gordon (Priority: P1)

DevOps engineer uses Gordon to generate optimized Dockerfiles, builds images, and verifies local container execution.

**Why this priority**: Foundation for Kubernetes deployment - without containers, nothing else works.

**Independent Test**: Run `docker build` and `docker run` locally. Success = containers start and serve traffic on localhost.

**Acceptance Scenarios**:
1. **Given** Phase III codebase, **When** engineer asks Gordon "Generate Dockerfile for Next.js 14 app", **Then** Gordon outputs multi-stage Dockerfile
2. **Given** Dockerfile exists, **When** `docker build -t todo-frontend:latest ./frontend`, **Then** image builds in <5 min
3. **Given** image built, **When** `docker run -p 3000:3000 todo-frontend:latest`, **Then** UI accessible at localhost:3000
4. **Given** backend Dockerfile, **When** container runs, **Then** `/health` endpoint responds successfully

---

### User Story 2 - Package with Helm Charts (Priority: P2)

DevOps engineer creates Helm charts with Deployment/Service templates, validates with `helm lint`, and generates manifests.

**Why this priority**: Helm enables repeatable Kubernetes deployments after containers exist (P1).

**Independent Test**: Run `helm lint` and `helm template`. Success = valid manifests generated.

**Acceptance Scenarios**:
1. **Given** Docker images, **When** engineer creates `charts/todo-chatbot/`, **Then** Chart.yaml, values.yaml, and templates/ exist
2. **Given** Helm chart, **When** `helm lint charts/todo-chatbot`, **Then** no errors reported
3. **Given** chart valid, **When** `helm template todo-chatbot charts/todo-chatbot`, **Then** Deployment and Service manifests generated
4. **Given** values.yaml, **When** manifests inspected, **Then** resource limits (CPU/memory) are defined

---

### User Story 3 - Deploy to Minikube (Priority: P3)

DevOps engineer starts Minikube, deploys Todo Chatbot via Helm, and verifies all pods reach Running state.

**Why this priority**: Core Phase IV deliverable - running Kubernetes deployment (depends on P1, P2).

**Independent Test**: `minikube start` → `helm install` → `kubectl get pods`. Success = all pods Running.

**Acceptance Scenarios**:
1. **Given** Docker/Minikube installed, **When** `minikube start`, **Then** cluster ready in <2 min
2. **Given** Minikube running, **When** `helm install todo-chatbot charts/todo-chatbot`, **Then** Deployments/Services created
3. **Given** Helm release installed, **When** `kubectl get pods`, **Then** frontend + backend pods show "Running" in <3 min
4. **Given** pods running, **When** `minikube service frontend-service --url`, **Then** URL returned and UI accessible
5. **Given** frontend accessible, **When** user creates task, **Then** frontend communicates with backend via K8s DNS

---

### User Story 4 - Use kubectl-ai for Operations (Priority: P4)

DevOps engineer uses kubectl-ai for scaling, log viewing, and troubleshooting with natural language.

**Why this priority**: Demonstrates AI tooling but not critical for core deployment.

**Independent Test**: Run kubectl-ai commands. Success = natural language translates to correct kubectl.

**Acceptance Scenarios**:
1. **Given** deployed app, **When** `kubectl-ai "scale backend to 3 replicas"`, **Then** kubectl scale executed
2. **Given** running pods, **When** `kubectl-ai "show frontend logs"`, **Then** kubectl logs output displayed
3. **Given** failing pod, **When** `kubectl-ai "diagnose pod issues"`, **Then** troubleshooting steps suggested

---

### User Story 5 - Analyze with Kagent (Priority: P5)

DevOps engineer uses Kagent to analyze cluster health and receive optimization recommendations.

**Why this priority**: Nice-to-have for demo - not essential for deployment.

**Independent Test**: Run Kagent analysis. Success = actionable insights returned.

**Acceptance Scenarios**:
1. **Given** running cluster, **When** `kagent analyze cluster`, **Then** CPU/memory utilization reported
2. **Given** metrics available, **When** "Which pods use most resources?", **Then** pods ranked by usage
3. **Given** analysis complete, **When** requesting optimizations, **Then** resource limit adjustments suggested

---

### Edge Cases

- **What happens when Docker image fails to build?** → Build errors halt deployment; Gordon provides diagnostics
- **How does system handle pod CrashLoopBackOff?** → kubectl-ai diagnoses crash; logs examined for root cause
- **What if Minikube runs out of resources?** → Reduce replica counts or allocate more RAM/CPU to Minikube
- **What if Gordon/kubectl-ai/Kagent unavailable?** → Fallback to manual Docker/kubectl commands with best practices

---

## 4. Requirements

### Functional Requirements

**FR-001: Containerization** - Frontend and backend MUST be packaged as Docker images that build successfully and run locally

**FR-002: Helm Packaging** - Kubernetes resources MUST be packaged as Helm chart with Deployment/Service templates passing `helm lint`

**FR-003: Minikube Deployment** - Todo Chatbot MUST deploy to Minikube with all pods reaching "Running" state in ≤3 minutes

**FR-004: Service Communication** - Frontend pods MUST communicate with backend pods via Kubernetes internal DNS

**FR-005: Gordon Integration** - Gordon MUST generate at least one Dockerfile (frontend or backend) with multi-stage build

**FR-006: kubectl-ai Integration** - kubectl-ai MUST successfully execute at least one operation (scale, logs, or troubleshoot)

**FR-007: Kagent Integration** - Kagent MUST provide cluster analysis report with CPU/memory metrics

**FR-008: Configuration Management** - Database URLs, API endpoints, resource limits MUST be configurable via Helm values.yaml

**FR-009: Health Checks** - Deployments MUST include readiness/liveness probes for pod health monitoring

**FR-010: Rollback Capability** - `helm rollback` MUST restore previous deployment version in ≤2 minutes

---

### Non-Functional Requirements

**NFR-001: Deployment Time** - Complete deployment (helm install → all pods Running) in ≤5 minutes

**NFR-002: Resource Constraints** - System MUST run on 8GB RAM laptop (Minikube ≤4GB, frontend ≤256MB/pod, backend ≤512MB/pod)

**NFR-003: Startup Reliability** - Pods MUST start successfully 95% of the time on first attempt

**NFR-004: Developer Experience** - Developer with basic K8s knowledge MUST deploy in ≤30 minutes following docs

**NFR-005: AI Tool Effectiveness** - AI tools MUST reduce manual effort by ≥30% vs traditional CLI

---

### Key Entities

**Frontend Pod**: Next.js container serving UI, connects to backend via K8s Service

**Backend Pod**: FastAPI container exposing REST API, connects to database

**Helm Release**: Versioned deployment bundle managing K8s resources

**Service (Frontend)**: NodePort exposing frontend to external traffic

**Service (Backend)**: ClusterIP exposing backend API within cluster

---

## 5. Success Criteria

Phase IV complete when ALL criteria met:

**SC-001: Containers Build** - Frontend and backend Docker images build and run locally

**SC-002: Helm Validated** - Chart passes `helm lint` and generates valid manifests

**SC-003: Deployment Succeeds** - Minikube deploys app with all pods Running in ≤3 min

**SC-004: E2E Flow Works** - User can login → create task → view tasks through deployed frontend

**SC-005: AI Tools Used** - Gordon generates ≥1 Dockerfile, kubectl-ai executes ≥1 operation, Kagent provides ≥1 analysis

**SC-006: No Manual YAML** - All Kubernetes manifests generated via Helm templates

**SC-007: Fast Deployment** - Helm install to Running state completes in ≤5 min

**SC-008: Zero Critical Errors** - No pods in CrashLoopBackOff; no service failures; clean logs

---

## 6. Agent Model

### AGENT 0: Orchestrator (Claude Code)
**Role**: Coordinate agents, enforce constitution

**Responsibilities**: Create plan/tasks, assign work, validate outputs, halt after each task

**Tools**: Git, planning tools, documentation

**Restrictions**: MUST NOT implement (delegated to specialized agents)

---

### AGENT 1: Containerization Agent
**Role**: Create Docker containers

**Responsibilities**: Use Gordon for Dockerfiles, build images, test locally, optimize size

**Tools**: Docker Desktop, Gordon, docker CLI

**Scope**: `frontend/Dockerfile`, `backend/Dockerfile`, `.dockerignore`

**Restrictions**: MUST NOT modify app code; MUST use Gordon or best-practice templates

---

### AGENT 2: Kubernetes Packaging Agent
**Role**: Create Helm charts

**Responsibilities**: Define Deployments/Services, configure resources/probes, validate with `helm lint`

**Tools**: Helm CLI, kubectl-ai, text editors

**Scope**: `charts/todo-chatbot/Chart.yaml`, `values.yaml`, `templates/*.yaml`

**Restrictions**: MUST use Helm templates; no manual YAML outside templates/

---

### AGENT 3: Kubernetes Operations Agent
**Role**: Deploy and manage on Minikube

**Responsibilities**: Start Minikube, install Helm release, scale with kubectl-ai, troubleshoot pods

**Tools**: Minikube, kubectl, kubectl-ai, Helm

**Scope**: Cluster operations, resource inspection, service access

**Restrictions**: MUST NOT modify Helm charts or Dockerfiles

---

### AGENT 4: AIOps Agent
**Role**: Monitor and optimize cluster

**Responsibilities**: Analyze CPU/memory, identify bottlenecks, recommend optimizations

**Tools**: Kagent, kubectl top, kubectl describe

**Scope**: Read-only cluster metrics, pod inspection

**Restrictions**: Read-only by default; changes require approval

---

## 7. AI Tooling Usage

### Gordon (Docker AI)
- **Dockerfile Generation**: "Create Dockerfile for Next.js 14 production build" → Multi-stage Dockerfile
- **Optimization**: "Reduce image size" → Layer caching, minimal base images
- **Debugging**: "Why is container exiting?" → CMD/env analysis
- **Fallback**: If unavailable, use best-practice templates (node:18-alpine, python:3.11-slim)

### kubectl-ai
- **Deployments**: "Deploy backend with 2 replicas" → kubectl create deployment
- **Scaling**: "Scale frontend to 3 pods" → kubectl scale
- **Troubleshooting**: "Why is pod failing?" → kubectl describe + logs
- **Fallback**: Standard kubectl commands via Orchestrator translation

### Kagent
- **Health Analysis**: "Analyze cluster health" → Node/pod status, resource utilization
- **Resource Optimization**: "Which pods use most resources?" → Ranked list with recommendations
- **Proactive Suggestions**: "Improve stability" → Health probes, limits, replica advice
- **Fallback**: Manual analysis with kubectl top, get, describe

---

## 8. Assumptions

1. Docker Desktop, Minikube, Helm, kubectl pre-installed
2. Phase III codebase available in `frontend/`, `backend/`
3. PostgreSQL runs as separate container or on host
4. Minikube uses default bridge networking
5. Gordon/kubectl-ai/Kagent accessible (fallbacks defined)
6. Single-node Minikube cluster (no multi-node)
7. Local dev focus (not production deployment)
8. No external service dependencies
9. Images loaded into Minikube local registry
10. Secrets managed via Kubernetes Secrets (manual or Helm)

---

## 9. Constraints & Governance

**C1: Spec → Plan → Tasks → Implement** - Sequential workflow enforced

**C2: No Manual YAML** - All manifests Helm-generated; Dockerfiles AI-generated or templated

**C3: Agent Scope Boundaries** - Agents restricted to defined file paths and tools

**C4: Single-Task Execution** - One task at a time with checkpoints

**C5: Constitution Compliance** - Phase IV Constitution v2.0.0 governs all work

**C6: No App Changes** - Source code untouched except config (env vars, build scripts)

**C7: Local-Only** - Minikube only; no cloud-specific configs

---

## 10. Deliverables

**D1**: This specification (`specs/001-k8s-deployment/spec.md`)

**D2**: Implementation plan (`specs/001-k8s-deployment/plan.md` via `/sp.plan`)

**D3**: Task breakdown (`specs/001-k8s-deployment/tasks.md` via `/sp.tasks`)

**D4**: Running deployment (Docker images, Helm chart, deployed Minikube cluster)

---

**Next Steps**:
1. Review/approve specification
2. Run `/sp.plan` for implementation plan
3. Run `/sp.tasks` for task breakdown
4. Begin implementation per agent assignments
