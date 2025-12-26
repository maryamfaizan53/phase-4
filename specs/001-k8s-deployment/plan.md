# Implementation Plan: Phase IV - Kubernetes Deployment for Todo Chatbot

**Branch**: `001-k8s-deployment` | **Date**: 2025-12-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-k8s-deployment/spec.md`

---

## Summary

Deploy the completed Phase III Todo Chatbot application (Next.js 14 frontend + FastAPI backend + PostgreSQL database) to a local Kubernetes cluster using Minikube. Leverage AI-assisted DevOps tooling (Docker AI Gordon for containerization, kubectl-ai for Kubernetes operations, Kagent for cluster observability) to achieve infrastructure-as-code with minimal manual YAML authoring. This plan defines a 7-phase execution strategy from environment readiness through validated deployment, with explicit agent assignments, AI tool integration points, and rollback mechanisms.

**Primary Requirement**: Containerized deployment to Minikube with Helm packaging, achieving ≤5 minute deployment time and ≤8GB total resource footprint.

**Technical Approach**: Multi-agent workflow using Gordon for Dockerfile generation, Helm for Kubernetes packaging, kubectl-ai for natural language operations, and Kagent for cluster diagnostics. Sequential phase execution with checkpoints after each task.

---

## Technical Context

**Language/Version**:
- Frontend: JavaScript (Node.js 18+), Next.js 14
- Backend: Python 3.11+, FastAPI
- Infrastructure: Docker 24+, Kubernetes 1.28+ (Minikube), Helm 3.12+

**Primary Dependencies**:
- **Containerization**: Docker Desktop 4.53+, Docker AI Agent (Gordon)
- **Kubernetes**: Minikube 1.32+, kubectl 1.28+, kubectl-ai
- **Packaging**: Helm 3.12+
- **Observability**: Kagent (AI cluster diagnostics)

**Storage**:
- PostgreSQL database (containerized or host-based)
- Minikube local Docker registry for image storage
- Kubernetes ConfigMaps for configuration
- Kubernetes Secrets for credentials

**Testing**:
- Manual validation via `docker run` (container-level)
- `helm lint` and `helm template` (chart validation)
- `kubectl get pods` and E2E functional testing (deployment validation)
- Kagent cluster health checks

**Target Platform**:
- Local development environment (Windows/macOS/Linux with Minikube)
- Single-node Kubernetes cluster (Minikube with default bridge networking)

**Project Type**: Infrastructure deployment (web application containers)

**Performance Goals**:
- Docker image build time: ≤5 minutes per service
- Helm install to all pods Running: ≤3 minutes
- Total deployment time (build + deploy): ≤5 minutes
- Pod startup time: ≤30 seconds per pod

**Constraints**:
- Total resource usage: ≤8GB RAM (Minikube ≤4GB, frontend ≤256MB/pod, backend ≤512MB/pod)
- Local-only deployment (no cloud provider dependencies)
- No manual YAML authoring (Helm templates only, AI-generated Dockerfiles)
- No application code changes (frontend/backend source untouched except environment config)
- Sequential task execution with mandatory checkpoints

**Scale/Scope**:
- 2 containerized services (frontend, backend)
- 3-5 Kubernetes resources per service (Deployment, Service, ConfigMap)
- 1 Helm chart with 2-3 replicas per service
- Single Minikube cluster with 1 node

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Phase IV Constitution v2.0.0 Compliance**:

### ✅ I. Spec-Driven Development
- **Requirement**: Specification → Plan → Tasks → Implementation
- **Status**: PASS - Specification created (spec.md), Plan in progress, Tasks deferred to `/sp.tasks`
- **Evidence**: `specs/001-k8s-deployment/spec.md` (352 lines, all 13 quality checklist items PASS)

### ✅ II. Agentic Execution
- **Requirement**: All work executed by explicitly defined agents within scope boundaries
- **Status**: PASS - 4 agents defined with clear scopes (see Agent Responsibility Matrix below)
- **Evidence**: Constitution sections 4.1-4.4 define Containerization, Packaging, Operations, AIOps agents

### ✅ III. AI-First DevOps
- **Requirement**: Prefer AI-assisted tools (Gordon, kubectl-ai, Kagent) over manual CLI
- **Status**: PASS - All phases integrate AI tools with fallback strategies
- **Evidence**: Gordon for Dockerfiles (Phase 2), kubectl-ai for deployments (Phase 4), Kagent for diagnostics (Phase 5)

### ✅ IV. Single-Task Execution
- **Requirement**: Sequential task execution with checkpoints after each task
- **Status**: PASS - Plan defines 7 phases with explicit validation gates and rollback procedures
- **Evidence**: Each phase includes "Validation Criteria" and "Rollback Strategy" sections

**Re-check After Phase 1**: Verify data model (N/A for infra), contracts (Dockerfile/Helm specs), and quickstart documentation maintain constitutional compliance.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-k8s-deployment/
├── plan.md                  # This file (/sp.plan command output)
├── research.md              # Phase 0 output - tool versions, base images, Helm patterns
├── data-model.md            # N/A for infrastructure work
├── quickstart.md            # Phase 1 output - getting started with deployment
├── contracts/               # Phase 1 output - Dockerfile/Helm specs
│   ├── dockerfile-spec.md   # Docker image requirements
│   └── helm-spec.md         # Kubernetes resource specifications
├── checklists/
│   └── requirements.md      # Quality validation (created during /sp.specify)
└── tasks.md                 # NOT created by /sp.plan - use /sp.tasks command
```

### Infrastructure Code (repository root)

```text
# Infrastructure additions to existing web application
frontend/
├── Dockerfile               # Phase 2 output (Gordon-generated)
├── .dockerignore            # Phase 2 output
└── [existing Next.js code]  # UNTOUCHED

backend/
├── Dockerfile               # Phase 2 output (Gordon-generated)
├── .dockerignore            # Phase 2 output
└── [existing FastAPI code]  # UNTOUCHED (except .env for K8s)

charts/
└── todo-chatbot/            # Phase 3 output
    ├── Chart.yaml           # Helm chart metadata
    ├── values.yaml          # Configuration values
    └── templates/           # Kubernetes manifests
        ├── frontend-deployment.yaml
        ├── frontend-service.yaml
        ├── backend-deployment.yaml
        ├── backend-service.yaml
        ├── configmap.yaml
        └── secrets.yaml

# Existing application code (NOT modified in Phase IV)
frontend/app/                # Next.js pages
backend/src/                 # FastAPI routes/models
```

**Structure Decision**: Infrastructure-as-code approach. All Dockerfiles, Helm charts, and Kubernetes manifests are new files in existing repository. No changes to `frontend/app/` or `backend/src/` directories except environment variable configuration. PostgreSQL database runs separately (containerized or on host) and is referenced via ConfigMap.

---

## Complexity Tracking

**No constitutional violations requiring justification.**

All work fits within Phase IV Constitution v2.0.0 principles:
- Spec-driven workflow followed strictly
- 4 agents operate within defined scopes (no cross-boundary operations)
- AI tools used with documented fallbacks
- Single-task execution with checkpoints enforced

---

## Agent Responsibility Matrix

| Phase | Agent | Role | Tools | Scope | Inputs | Outputs |
|-------|-------|------|-------|-------|--------|---------|
| **0** | Orchestrator | Environment verification | Docker CLI, kubectl, helm | System environment | Tool version requirements | Environment readiness report |
| **1** | Orchestrator | Documentation & contracts | Git, text editor | `specs/001-k8s-deployment/` | Spec.md, constitution.md | quickstart.md, contracts/ |
| **2** | Containerization Agent | Dockerfile creation | Docker AI (Gordon), docker CLI | `frontend/Dockerfile`, `backend/Dockerfile` | Phase III codebase | Dockerfiles, .dockerignore, built images |
| **3** | Kubernetes Packaging Agent | Helm chart creation | Helm CLI, kubectl-ai | `charts/todo-chatbot/` | Docker images, container specs | Chart.yaml, values.yaml, templates/ |
| **4** | Kubernetes Operations Agent | Minikube deployment | Minikube, kubectl, kubectl-ai | Cluster operations | Helm chart | Running Minikube cluster, deployed pods |
| **5** | Kubernetes Operations Agent + AIOps Agent | AI-assisted operations | kubectl-ai, Kagent | Cluster management | Running deployment | Scaling demos, diagnostics reports |
| **6** | Orchestrator + All Agents | Validation & rollback | All tools | Full system | Deployed cluster | Test results, rollback verification |

**Agent Interaction Rules**:
- **Orchestrator (Claude Code)** assigns tasks to specialized agents but does NOT implement
- **Containerization Agent** works ONLY on Dockerfiles (no Kubernetes manifests)
- **Packaging Agent** works ONLY on Helm charts (no application code)
- **Operations Agent** works ONLY on running cluster (no chart modifications)
- **AIOps Agent** performs read-only diagnostics unless explicitly authorized to remediate

---

## Phase 0: Environment Readiness & Research

### Purpose
Verify all required tools are installed and accessible, determine technical decisions for Docker base images and Helm chart patterns, and document findings in research.md.

### Responsible Agent(s)
**Orchestrator (Claude Code)** - System validation and research documentation

### AI Tools Involved
- None (prerequisite verification phase)

### Inputs Required
1. Phase IV Constitution v2.0.0 (tooling requirements in section 5)
2. Phase III codebase structure (frontend/backend directories)
3. System environment (Docker Desktop, Minikube, Helm, kubectl installed by user)

### Outputs Produced
1. **Environment Verification Report**: Tool versions and readiness status
2. **research.md**: Technical decisions documented:
   - Docker base images (node:18-alpine for frontend, python:3.11-slim for backend)
   - Multi-stage build patterns (builder → production stages)
   - Helm chart structure (standard Deployment/Service pattern)
   - Minikube configuration (resource limits, networking)
   - Gordon/kubectl-ai/Kagent availability status

### Tasks
1. **T0.1**: Verify Docker Desktop installed and running (`docker --version`, `docker ps`)
2. **T0.2**: Verify Minikube installed (`minikube version`)
3. **T0.3**: Verify Helm installed (`helm version`)
4. **T0.4**: Verify kubectl installed (`kubectl version --client`)
5. **T0.5**: Check Gordon availability (`docker ai` or fallback to manual Dockerfile)
6. **T0.6**: Check kubectl-ai availability (command existence or fallback to kubectl)
7. **T0.7**: Check Kagent availability (installation status or fallback to kubectl top)
8. **T0.8**: Research Docker base images for Next.js 14 and FastAPI
9. **T0.9**: Research Helm chart best practices for web applications
10. **T0.10**: Document all findings in `specs/001-k8s-deployment/research.md`

### Validation Criteria
- [ ] All mandatory tools report valid version numbers
- [ ] Docker daemon is running (docker ps succeeds)
- [ ] Minikube is NOT running yet (minikube status shows "Stopped" or "Does Not Exist")
- [ ] AI tool availability documented with fallback strategies
- [ ] research.md contains concrete technical decisions (no "TBD" placeholders)

### Risks & Mitigations
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Gordon unavailable | Medium | Medium | Fallback: Claude Code generates Dockerfiles following best practices |
| kubectl-ai unavailable | Medium | Low | Fallback: Use standard kubectl commands |
| Kagent unavailable | High | Low | Fallback: Manual kubectl top and describe commands |
| Docker Desktop not installed | Low | High | HALT: User must install Docker Desktop before proceeding |
| Minikube not installed | Low | High | HALT: User must install Minikube before proceeding |

### Rollback Strategy
**N/A** - Read-only verification phase with no system changes.

---

## Phase 1: Foundation Documentation & Contracts

### Purpose
Create developer quickstart guide and formal contracts defining Dockerfile specifications and Helm chart requirements.

### Responsible Agent(s)
**Orchestrator (Claude Code)** - Documentation creation

### AI Tools Involved
- None (documentation phase)

### Inputs Required
1. research.md from Phase 0
2. spec.md (user stories and requirements)
3. Phase III codebase (frontend/backend structure)

### Outputs Produced
1. **quickstart.md**: Step-by-step guide for deploying Todo Chatbot to Minikube
2. **contracts/dockerfile-spec.md**: Docker image requirements
   - Base images (node:18-alpine, python:3.11-slim)
   - Multi-stage build requirements
   - Environment variable contracts
   - Health check endpoints
   - Resource constraints (image size targets)
3. **contracts/helm-spec.md**: Kubernetes resource specifications
   - Deployment resource limits (CPU/memory)
   - Service types (NodePort for frontend, ClusterIP for backend)
   - ConfigMap structure (API URLs, database connection)
   - Readiness/liveness probe configurations
   - Replica count defaults

### Tasks
1. **T1.1**: Create `quickstart.md` with prerequisites, build steps, deployment steps
2. **T1.2**: Create `contracts/dockerfile-spec.md` defining Docker image contracts
3. **T1.3**: Create `contracts/helm-spec.md` defining Kubernetes resource contracts
4. **T1.4**: Document environment variable mappings (frontend → backend, backend → database)

### Validation Criteria
- [ ] quickstart.md has clear step-by-step instructions (no ambiguity)
- [ ] dockerfile-spec.md defines measurable requirements (e.g., "image size ≤500MB")
- [ ] helm-spec.md defines all Kubernetes resources needed (Deployment, Service, ConfigMap)
- [ ] No [NEEDS CLARIFICATION] markers in any document

### Risks & Mitigations
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Incomplete contracts cause implementation confusion | Medium | Medium | Review contracts against spec.md requirements before proceeding to Phase 2 |
| Quickstart assumes unavailable tools | Low | Medium | Base instructions on Phase 0 verification results |

### Rollback Strategy
**N/A** - Documentation-only phase with no system changes.

---

## Phase 2: AI-Assisted Container Build

### Purpose
Use Docker AI (Gordon) to generate optimized Dockerfiles for frontend and backend, build images locally, and verify containers run successfully.

### Responsible Agent(s)
**Containerization Agent** - Dockerfile creation and image building

### AI Tools Involved
- **Gordon (Docker AI Agent)**: Dockerfile generation with multi-stage builds
- **Fallback**: Claude Code generates Dockerfiles if Gordon unavailable

### Inputs Required
1. contracts/dockerfile-spec.md (base images, build requirements)
2. Phase III frontend code (`frontend/package.json`, `frontend/next.config.js`)
3. Phase III backend code (`backend/requirements.txt`, `backend/src/api/main.py`)

### Outputs Produced
1. **frontend/Dockerfile**: Multi-stage Dockerfile (builder + production)
2. **frontend/.dockerignore**: Exclude node_modules, .next, .env.local
3. **backend/Dockerfile**: Multi-stage Dockerfile (dependencies + runtime)
4. **backend/.dockerignore**: Exclude __pycache__, .venv, .env
5. **Docker images**: `todo-frontend:latest`, `todo-backend:latest`

### Tasks
1. **T2.1**: Use Gordon to generate `frontend/Dockerfile` for Next.js 14 production build
   - Prompt: "Generate Dockerfile for Next.js 14 app with production build, node:18-alpine base"
2. **T2.2**: Create `frontend/.dockerignore` (exclude node_modules, .next, build artifacts)
3. **T2.3**: Build frontend image: `docker build -t todo-frontend:latest ./frontend`
4. **T2.4**: Test frontend container locally: `docker run -p 3000:3000 todo-frontend:latest`
5. **T2.5**: Use Gordon to generate `backend/Dockerfile` for FastAPI with uvicorn
   - Prompt: "Generate Dockerfile for FastAPI Python 3.11 app, python:3.11-slim base, uvicorn server"
6. **T2.6**: Create `backend/.dockerignore` (exclude __pycache__, .venv, *.pyc)
7. **T2.7**: Build backend image: `docker build -t todo-backend:latest ./backend`
8. **T2.8**: Test backend container locally: `docker run -p 8000:8000 todo-backend:latest`
9. **T2.9**: Verify backend /health endpoint responds: `curl http://localhost:8000/health`
10. **T2.10**: Load images into Minikube registry: `minikube image load todo-frontend:latest todo-backend:latest`

### Validation Criteria
- [ ] Frontend Dockerfile uses multi-stage build (npm install → npm build → production stage)
- [ ] Backend Dockerfile uses multi-stage build (pip install → runtime)
- [ ] Frontend image builds in ≤5 minutes
- [ ] Backend image builds in ≤5 minutes
- [ ] Frontend image size ≤500MB
- [ ] Backend image size ≤400MB
- [ ] Frontend container serves UI at localhost:3000
- [ ] Backend container responds to /health at localhost:8000
- [ ] Images loaded into Minikube registry (minikube image ls shows both)

### Risks & Mitigations
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Gordon unavailable or produces invalid Dockerfile | Medium | Medium | Claude Code generates Dockerfile using contracts/dockerfile-spec.md |
| Build fails due to missing dependencies | Medium | High | Test build locally before loading into Minikube |
| Image size exceeds limits | Low | Low | Use alpine base images, multi-stage builds to minimize layers |
| Container crashes on startup | Medium | High | Test docker run locally with logs before Minikube deployment |

### Rollback Strategy
1. Delete Dockerfiles: `rm frontend/Dockerfile backend/Dockerfile`
2. Delete images: `docker rmi todo-frontend:latest todo-backend:latest`
3. Remove from Minikube: `minikube image rm todo-frontend:latest todo-backend:latest`

---

## Phase 3: Helm Chart Design & Packaging

### Purpose
Create Helm chart with Deployment and Service templates for frontend and backend, validate with `helm lint`, and generate manifests.

### Responsible Agent(s)
**Kubernetes Packaging Agent** - Helm chart creation

### AI Tools Involved
- **kubectl-ai** (optional): Generate Kubernetes manifests via natural language
- **Fallback**: Manual Helm template creation following contracts/helm-spec.md

### Inputs Required
1. contracts/helm-spec.md (resource limits, service types, probe configs)
2. Docker images from Phase 2 (todo-frontend:latest, todo-backend:latest)
3. Environment variable mappings from Phase 1

### Outputs Produced
1. **charts/todo-chatbot/Chart.yaml**: Helm chart metadata (name, version, appVersion)
2. **charts/todo-chatbot/values.yaml**: Configuration values (replicas, resources, image tags)
3. **charts/todo-chatbot/templates/frontend-deployment.yaml**: Frontend Deployment manifest
4. **charts/todo-chatbot/templates/frontend-service.yaml**: Frontend NodePort Service
5. **charts/todo-chatbot/templates/backend-deployment.yaml**: Backend Deployment manifest
6. **charts/todo-chatbot/templates/backend-service.yaml**: Backend ClusterIP Service
7. **charts/todo-chatbot/templates/configmap.yaml**: Environment variables (API_URL, DATABASE_URL)

### Tasks
1. **T3.1**: Create `charts/todo-chatbot/` directory structure
2. **T3.2**: Create `Chart.yaml` (name: todo-chatbot, version: 0.1.0, appVersion: 1.0.0)
3. **T3.3**: Create `values.yaml` with defaults:
   - frontend.replicas: 2
   - frontend.image: todo-frontend:latest
   - frontend.resources: limits (256Mi memory, 500m CPU)
   - backend.replicas: 2
   - backend.image: todo-backend:latest
   - backend.resources: limits (512Mi memory, 1000m CPU)
4. **T3.4**: Create `templates/frontend-deployment.yaml` with:
   - Image: {{ .Values.frontend.image }}
   - Replicas: {{ .Values.frontend.replicas }}
   - Resources: {{ .Values.frontend.resources }}
   - Readiness probe: HTTP GET / on port 3000
   - Liveness probe: HTTP GET / on port 3000
5. **T3.5**: Create `templates/frontend-service.yaml` (type: NodePort, port: 3000)
6. **T3.6**: Create `templates/backend-deployment.yaml` (similar structure, port 8000)
7. **T3.7**: Create `templates/backend-service.yaml` (type: ClusterIP, port: 8000)
8. **T3.8**: Create `templates/configmap.yaml` (NEXT_PUBLIC_API_URL, DATABASE_URL)
9. **T3.9**: Validate chart: `helm lint charts/todo-chatbot`
10. **T3.10**: Generate manifests: `helm template todo-chatbot charts/todo-chatbot > /tmp/manifests.yaml`

### Validation Criteria
- [ ] `helm lint` reports 0 errors
- [ ] `helm template` generates valid YAML (no syntax errors)
- [ ] Frontend Deployment includes resource limits (256Mi memory)
- [ ] Backend Deployment includes resource limits (512Mi memory)
- [ ] Frontend Service uses NodePort type (external access)
- [ ] Backend Service uses ClusterIP type (internal-only)
- [ ] ConfigMap includes all environment variables from Phase 1 contracts
- [ ] Readiness and liveness probes defined for both services

### Risks & Mitigations
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Helm lint fails due to invalid template syntax | Medium | Medium | Use kubectl-ai to generate templates or follow Helm docs examples |
| Resource limits too restrictive (pods fail to start) | Medium | High | Start with generous limits, adjust based on kubectl top in Phase 5 |
| ConfigMap missing environment variables | Low | High | Cross-reference contracts/helm-spec.md before validation |
| Service types incorrect (frontend inaccessible) | Low | High | Test minikube service command in Phase 4 before E2E validation |

### Rollback Strategy
1. Delete Helm chart directory: `rm -rf charts/todo-chatbot/`
2. No cluster changes (chart not yet installed)

---

## Phase 4: Minikube Deployment

### Purpose
Start Minikube cluster, deploy Todo Chatbot via Helm, verify all pods reach Running state, and confirm frontend accessibility.

### Responsible Agent(s)
**Kubernetes Operations Agent** - Cluster operations and deployment

### AI Tools Involved
- **kubectl-ai** (optional): Natural language deployment commands
- **Fallback**: Standard kubectl and helm commands

### Inputs Required
1. Helm chart from Phase 3 (`charts/todo-chatbot/`)
2. Docker images loaded in Phase 2 (todo-frontend:latest, todo-backend:latest)
3. Minikube installed (Phase 0 verification)

### Outputs Produced
1. **Running Minikube cluster** (single node, 4GB RAM allocation)
2. **Helm release** named `todo-chatbot`
3. **Running pods**: frontend-<hash> (2 replicas), backend-<hash> (2 replicas)
4. **Accessible frontend** via `minikube service frontend-service --url`

### Tasks
1. **T4.1**: Start Minikube: `minikube start --memory=4096 --cpus=2`
2. **T4.2**: Verify cluster ready: `kubectl cluster-info`
3. **T4.3**: Verify images available: `minikube image ls | grep todo`
4. **T4.4**: Install Helm chart: `helm install todo-chatbot charts/todo-chatbot`
5. **T4.5**: Watch pod startup: `kubectl get pods -w` (wait for Running status)
6. **T4.6**: Check Helm release status: `helm list`
7. **T4.7**: Describe pods if issues: `kubectl describe pods`
8. **T4.8**: Get frontend service URL: `minikube service frontend-service --url`
9. **T4.9**: Test frontend accessibility: Open browser to service URL
10. **T4.10**: Verify frontend → backend communication (create task via UI, check backend logs)

### Validation Criteria
- [ ] Minikube starts in ≤2 minutes
- [ ] All pods reach "Running" status in ≤3 minutes
- [ ] Frontend pods (2/2) are Ready
- [ ] Backend pods (2/2) are Ready
- [ ] `minikube service frontend-service` returns valid URL
- [ ] Frontend UI loads at service URL
- [ ] User can login → create task → view tasks (E2E flow works)
- [ ] Backend logs show API requests from frontend

### Risks & Mitigations
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Minikube fails to start (resource exhaustion) | Medium | High | Check system resources (8GB RAM minimum), close other apps |
| Pods stuck in Pending (resource limits too high) | Medium | High | Adjust values.yaml resource limits, helm upgrade |
| Pods in CrashLoopBackOff (image issues) | Medium | High | Check kubectl logs, verify images loaded correctly |
| Frontend inaccessible (service misconfigured) | Low | Medium | Verify NodePort service created, check minikube service list |
| Frontend → backend communication fails | Medium | High | Check ConfigMap NEXT_PUBLIC_API_URL points to backend service DNS |

### Rollback Strategy
1. Uninstall Helm release: `helm uninstall todo-chatbot`
2. Stop Minikube: `minikube stop`
3. Delete cluster: `minikube delete` (if cluster is corrupted)

---

## Phase 5: AI-Assisted Operations & Observability

### Purpose
Demonstrate kubectl-ai for scaling and troubleshooting, use Kagent for cluster diagnostics, and validate AI tool effectiveness.

### Responsible Agent(s)
- **Kubernetes Operations Agent** - kubectl-ai demonstrations
- **AIOps Agent** - Kagent cluster analysis

### AI Tools Involved
- **kubectl-ai**: Natural language Kubernetes operations
- **Kagent**: AI-powered cluster diagnostics and optimization

### Inputs Required
1. Running Minikube deployment from Phase 4
2. kubectl-ai installation status from Phase 0
3. Kagent installation status from Phase 0

### Outputs Produced
1. **Scaling demonstration**: Backend scaled from 2 → 3 → 2 replicas via kubectl-ai
2. **Troubleshooting demonstration**: kubectl-ai diagnoses pod issues (if any)
3. **Kagent cluster report**: CPU/memory utilization, resource optimization recommendations
4. **AI tool effectiveness report**: Comparison of AI vs manual commands (time saved, accuracy)

### Tasks
1. **T5.1**: Use kubectl-ai to scale backend: `kubectl-ai "scale backend to 3 replicas"`
2. **T5.2**: Verify scaling: `kubectl get deployments` (backend shows 3/3)
3. **T5.3**: Use kubectl-ai to view logs: `kubectl-ai "show frontend logs"`
4. **T5.4**: Use kubectl-ai to troubleshoot: `kubectl-ai "diagnose pod issues"` (if any pods failing)
5. **T5.5**: Scale backend back: `kubectl-ai "scale backend to 2 replicas"`
6. **T5.6**: Use Kagent to analyze cluster: `kagent analyze cluster`
7. **T5.7**: Use Kagent to rank resource usage: `kagent "which pods use most resources?"`
8. **T5.8**: Request Kagent optimizations: `kagent "suggest resource limit adjustments"`
9. **T5.9**: Document AI tool usage in `specs/001-k8s-deployment/ai-tools-report.md`
10. **T5.10**: Compare AI tool time vs manual kubectl commands

### Validation Criteria
- [ ] kubectl-ai successfully translates natural language to correct kubectl commands
- [ ] Backend scales from 2 → 3 → 2 replicas without errors
- [ ] kubectl-ai logs command shows recent pod output
- [ ] Kagent reports CPU/memory utilization metrics
- [ ] Kagent provides actionable optimization recommendations
- [ ] AI tools reduce command execution time by ≥30% vs manual (per NFR-005)

### Risks & Mitigations
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| kubectl-ai unavailable | Medium | Low | Fallback: Use standard kubectl scale, logs, describe commands |
| Kagent unavailable | High | Low | Fallback: Use kubectl top nodes, kubectl top pods manually |
| AI tools produce incorrect commands | Low | Medium | Verify all AI-generated commands before execution |
| No optimization recommendations (cluster too small) | Medium | Low | Document "no optimizations needed" as valid outcome |

### Rollback Strategy
1. Revert scaling changes: `kubectl scale deployment backend --replicas=2` (if AI commands fail)
2. **No destructive changes** - Phase 5 is observability-focused (read-only except scaling)

---

## Phase 6: Validation, Testing & Rollback Verification

### Purpose
Execute comprehensive end-to-end testing, verify success criteria from spec.md, test rollback procedures, and document results.

### Responsible Agent(s)
**Orchestrator (Claude Code)** - Coordinates all agents for validation

### AI Tools Involved
- All tools from previous phases (validation of complete workflow)

### Inputs Required
1. Running Minikube deployment from Phase 4
2. AI tool demonstrations from Phase 5
3. Success criteria from spec.md (SC-001 through SC-008)

### Outputs Produced
1. **Validation report**: All 8 success criteria checked (PASS/FAIL)
2. **Test results**: E2E functional testing (login, create task, view tasks)
3. **Rollback verification**: helm rollback tested and confirmed working
4. **Performance metrics**: Deployment time, resource usage, startup reliability
5. **Deployment guide**: Final consolidated documentation for hackathon demo

### Tasks
1. **T6.1**: Validate **SC-001** - Containers build and run locally (check Phase 2 docker run logs)
2. **T6.2**: Validate **SC-002** - Helm chart passes lint (check Phase 3 helm lint output)
3. **T6.3**: Validate **SC-003** - Minikube deployment succeeds in ≤3 min (check Phase 4 timestamps)
4. **T6.4**: Validate **SC-004** - E2E flow works (manual test: login → create task → view)
5. **T6.5**: Validate **SC-005** - AI tools used (Gordon ≥1 Dockerfile, kubectl-ai ≥1 operation, Kagent ≥1 analysis)
6. **T6.6**: Validate **SC-006** - No manual YAML (verify all manifests in charts/templates/)
7. **T6.7**: Validate **SC-007** - Fast deployment (helm install to Running ≤5 min, check Phase 4 logs)
8. **T6.8**: Validate **SC-008** - Zero critical errors (check kubectl get pods, no CrashLoopBackOff)
9. **T6.9**: Test rollback: `helm upgrade todo-chatbot charts/todo-chatbot` (make change), `helm rollback todo-chatbot 1` (verify ≤2 min per FR-010)
10. **T6.10**: Document all results in validation report

### Validation Criteria
- [ ] All 8 success criteria PASS
- [ ] E2E test (login → create task → view tasks) completes without errors
- [ ] Helm rollback completes in ≤2 minutes
- [ ] No pods in CrashLoopBackOff or Error state
- [ ] Resource usage: Minikube ≤4GB RAM, frontend ≤256MB/pod, backend ≤512MB/pod (verify with kubectl top)
- [ ] Deployment time: helm install → Running ≤5 minutes
- [ ] Startup reliability: Pods start successfully on first attempt (95% reliability per NFR-003)

### Risks & Mitigations
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Success criteria fail due to Phase 1-5 errors | Medium | High | Fix underlying issues, re-run phases if needed |
| E2E test fails (frontend → backend communication broken) | Low | High | Check ConfigMap, service DNS, pod logs |
| Rollback fails or exceeds 2-minute limit | Low | Medium | Test rollback multiple times, verify Helm history |
| Resource usage exceeds limits | Medium | Medium | Adjust values.yaml, redeploy with helm upgrade |

### Rollback Strategy
**N/A** - This is the validation phase. If validation fails, return to the phase where the issue originated and re-execute.

---

## Phase 7: Documentation & Handoff

### Purpose
Consolidate all documentation, create deployment guide for hackathon demo, and prepare handoff materials.

### Responsible Agent(s)
**Orchestrator (Claude Code)** - Documentation consolidation

### AI Tools Involved
- None (documentation phase)

### Inputs Required
1. All outputs from Phases 0-6
2. Validation report from Phase 6
3. AI tools report from Phase 5

### Outputs Produced
1. **DEPLOYMENT.md**: Comprehensive deployment guide (prerequisites, build, deploy, verify)
2. **specs/001-k8s-deployment/COMPLETION.md**: Phase IV completion report
3. **Prompt History Record (PHR)**: Document entire planning session
4. **Hackathon demo script**: Step-by-step walkthrough for judges

### Tasks
1. **T7.1**: Create `DEPLOYMENT.md` at repository root with:
   - Prerequisites (Docker, Minikube, Helm installed)
   - Build instructions (`docker build` for both services)
   - Deployment instructions (`minikube start`, `helm install`)
   - Verification steps (`kubectl get pods`, `minikube service`)
   - Troubleshooting guide (common issues and fixes)
2. **T7.2**: Create completion report summarizing:
   - All 8 success criteria validated
   - Agent contributions (which agent did what)
   - AI tool effectiveness (time saved, commands generated)
   - Performance metrics (deployment time, resource usage)
3. **T7.3**: Create PHR for planning session (this plan.md creation)
4. **T7.4**: Create hackathon demo script:
   - Live deployment walkthrough (5-10 minutes)
   - AI tool demonstrations (Gordon, kubectl-ai, Kagent)
   - Spec-driven workflow evidence (spec → plan → tasks → implementation)

### Validation Criteria
- [ ] DEPLOYMENT.md has clear step-by-step instructions (non-technical user can follow)
- [ ] All links in documentation are valid (spec.md, plan.md, tasks.md)
- [ ] Completion report includes evidence for all 8 success criteria
- [ ] PHR follows `.specify/templates/phr-template.prompt.md` structure
- [ ] Demo script fits within 10-minute time limit

### Risks & Mitigations
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Documentation incomplete or unclear | Low | Medium | Review against spec.md requirements before finalizing |
| Demo script too long for hackathon time limit | Medium | Low | Practice walkthrough, cut non-essential steps |

### Rollback Strategy
**N/A** - Documentation-only phase with no system changes.

---

## Risk Management Summary

### High-Priority Risks (Across All Phases)

1. **Docker Desktop or Minikube not installed** (Phase 0)
   - **Impact**: HIGH - Blocks all subsequent phases
   - **Mitigation**: HALT execution, require user installation before proceeding

2. **Pods stuck in CrashLoopBackOff** (Phase 4)
   - **Impact**: HIGH - Deployment fails, E2E testing impossible
   - **Mitigation**: Check kubectl logs, verify images, adjust resource limits, rollback with helm uninstall

3. **Frontend → Backend communication fails** (Phase 4)
   - **Impact**: HIGH - E2E flow broken, SC-004 fails
   - **Mitigation**: Verify ConfigMap NEXT_PUBLIC_API_URL, check service DNS resolution

4. **Resource limits too restrictive** (Phase 3/4)
   - **Impact**: MEDIUM - Pods fail to start or crash under load
   - **Mitigation**: Start with generous limits, adjust based on kubectl top in Phase 5

### Medium-Priority Risks

5. **AI tools unavailable** (Phases 2, 4, 5)
   - **Impact**: MEDIUM - Fallback to manual commands (slower, more error-prone)
   - **Mitigation**: Document fallback strategies in research.md, use Claude Code for generation

6. **Helm chart lint fails** (Phase 3)
   - **Impact**: MEDIUM - Invalid manifests, deployment will fail
   - **Mitigation**: Use kubectl-ai for template generation, follow Helm docs examples

### Low-Priority Risks

7. **Image size exceeds limits** (Phase 2)
   - **Impact**: LOW - Longer build/pull times, more disk usage
   - **Mitigation**: Use alpine base images, multi-stage builds

8. **No Kagent optimization recommendations** (Phase 5)
   - **Impact**: LOW - Demonstration less impressive but functionality unaffected
   - **Mitigation**: Document "no optimizations needed" as valid outcome for small clusters

---

## Dependencies & Prerequisites

### External Dependencies
- Docker Desktop 4.53+ (container runtime)
- Minikube 1.32+ (local Kubernetes cluster)
- Helm 3.12+ (Kubernetes package manager)
- kubectl 1.28+ (Kubernetes CLI)
- 8GB RAM minimum (4GB for Minikube, 2GB for host OS, 2GB buffer)

### Optional AI Tools
- Docker AI (Gordon) - Dockerfile generation
- kubectl-ai - Natural language Kubernetes operations
- Kagent - AI cluster diagnostics

### Phase Dependencies
- **Phase 1** depends on **Phase 0** (environment verified before documentation)
- **Phase 2** depends on **Phase 1** (contracts define Dockerfile requirements)
- **Phase 3** depends on **Phase 2** (Docker images must exist before Helm templates)
- **Phase 4** depends on **Phase 3** (Helm chart must be valid before deployment)
- **Phase 5** depends on **Phase 4** (cluster must be running for AI operations)
- **Phase 6** depends on **Phases 1-5** (validation requires complete deployment)
- **Phase 7** depends on **Phase 6** (documentation requires validation results)

**Critical Path**: Phase 0 → Phase 2 → Phase 3 → Phase 4 (must complete sequentially; Phases 1, 5, 6, 7 are documentation/validation)

---

## Timeline Estimates (Effort-Based, Not Calendar Time)

**Note**: Per constitution principle "Planning without timelines", these are effort estimates for scope understanding, not calendar commitments. User decides scheduling.

| Phase | Estimated Effort | Tasks | Critical? |
|-------|------------------|-------|-----------|
| **0** | 30-45 minutes | 10 tasks (verification + research) | YES |
| **1** | 45-60 minutes | 4 tasks (documentation) | NO |
| **2** | 60-90 minutes | 10 tasks (Dockerfiles + builds) | YES |
| **3** | 60-90 minutes | 10 tasks (Helm chart creation) | YES |
| **4** | 30-45 minutes | 10 tasks (deployment) | YES |
| **5** | 30-45 minutes | 10 tasks (AI demonstrations) | NO |
| **6** | 45-60 minutes | 10 tasks (validation) | YES |
| **7** | 30-45 minutes | 4 tasks (documentation) | NO |
| **TOTAL** | 5-7 hours | 68 tasks | - |

**Critical path effort**: ~3.5-5 hours (Phases 0, 2, 3, 4, 6)

---

## Next Steps

1. **Review this plan** with user for approval
2. **Run `/sp.tasks`** to generate detailed task breakdown (tasks.md)
3. **Begin Phase 0** execution: Environment verification and research
4. **Checkpoint after each phase** for user review (per Single-Task Execution principle)

**Reminder**: Per Phase IV Constitution v2.0.0, no code implementation until tasks.md is created and approved.
