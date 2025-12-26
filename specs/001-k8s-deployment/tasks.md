# Tasks: Phase IV - Kubernetes Deployment for Todo Chatbot

**Feature Branch**: `001-k8s-deployment`
**Input**: Design documents from `/specs/001-k8s-deployment/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Organization**: Tasks are grouped by deployment phase following the AI-assisted DevOps workflow. Each phase builds upon the previous phase, with explicit validation and rollback strategies.

**Tests**: No automated tests required for infrastructure work. Validation is performed via manual verification of deployment artifacts and running services.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different systems, no dependencies)
- **[Story]**: Which user story this task belongs to (US1=Containerization, US2=Helm, US3=Minikube, US4=kubectl-ai, US5=Kagent)
- **Agent**: Responsible agent from constitution (Orchestrator, Containerization, Packaging, Operations, AIOps)
- Include exact file paths and AI tool usage in descriptions

---

## Path Conventions

This is an infrastructure deployment project adding Kubernetes support to existing web application:

- **Frontend**: `frontend/` (existing Next.js 14 application - UNTOUCHED except Dockerfile)
- **Backend**: `backend/` (existing FastAPI application - UNTOUCHED except Dockerfile)
- **Helm Charts**: `charts/todo-chatbot/` (new Kubernetes packaging)
- **Documentation**: `specs/001-k8s-deployment/` (planning artifacts)
- **Evidence**: `specs/001-k8s-deployment/evidence/` (hackathon demo materials)

---

## Phase 0: Environment Readiness & Research (10 tasks)

**Purpose**: Verify all required tools are installed, check AI tool availability, and document technical decisions for containerization and deployment.

**Agent**: Orchestrator (Claude Code)

**Independent Test**: All mandatory tools report valid versions, AI tool availability documented with fallbacks, research.md contains concrete decisions.

### Environment Verification

- [ ] T001 Verify Docker Desktop installation and daemon status via `docker --version` and `docker ps`
- [ ] T002 Verify Minikube installation via `minikube version` (must NOT be running yet)
- [ ] T003 Verify Helm installation via `helm version`
- [ ] T004 Verify kubectl installation via `kubectl version --client`

### AI Tool Availability Checks

- [ ] T005 [P] Check Docker AI Agent (Gordon) availability via `docker ai --version` or document fallback to manual Dockerfile generation
- [ ] T006 [P] Check kubectl-ai availability via command existence or document fallback to standard kubectl
- [ ] T007 [P] Check Kagent availability or document fallback to kubectl top/describe commands

### Technical Research

- [ ] T008 [P] Research Docker base images for Next.js 14 (node:18-alpine recommended) and document in specs/001-k8s-deployment/research.md
- [ ] T009 [P] Research Docker base images for FastAPI Python 3.11 (python:3.11-slim recommended) and document in specs/001-k8s-deployment/research.md
- [ ] T010 Document Helm chart best practices for web applications (Deployment/Service patterns, resource limits, probes) in specs/001-k8s-deployment/research.md

**Validation Criteria**:
- [ ] All tools in T001-T004 report valid version numbers
- [ ] Docker daemon is running (docker ps succeeds)
- [ ] Minikube status shows "Stopped" or "Does Not Exist" (not running yet)
- [ ] AI tool availability documented with fallback strategies (T005-T007)
- [ ] research.md exists with concrete technical decisions (no "TBD" placeholders)

**Rollback**: N/A (read-only verification phase)

**Evidence**: Screenshot of tool versions, research.md file

---

## Phase 1: Foundation Documentation & Contracts (4 tasks)

**Purpose**: Create developer quickstart guide and formal contracts defining Dockerfile and Helm chart specifications.

**Agent**: Orchestrator (Claude Code)

**Independent Test**: Documentation is clear and unambiguous, contracts define measurable requirements, no [NEEDS CLARIFICATION] markers.

- [ ] T011 Create quickstart guide in specs/001-k8s-deployment/quickstart.md with prerequisites, build steps, deployment steps, troubleshooting
- [ ] T012 [P] Create Dockerfile specification contract in specs/001-k8s-deployment/contracts/dockerfile-spec.md defining base images, multi-stage build requirements, env var contracts, health checks, image size targets (frontend ≤500MB, backend ≤400MB)
- [ ] T013 [P] Create Helm chart specification contract in specs/001-k8s-deployment/contracts/helm-spec.md defining resource limits (frontend 256Mi/500m CPU, backend 512Mi/1000m CPU), service types (NodePort/ClusterIP), ConfigMap structure, probe configurations, replica defaults
- [ ] T014 Document environment variable mappings in contracts (frontend NEXT_PUBLIC_API_URL → backend service DNS, backend DATABASE_URL → PostgreSQL connection)

**Validation Criteria**:
- [ ] quickstart.md has clear step-by-step instructions
- [ ] dockerfile-spec.md defines measurable requirements (image size limits, base images)
- [ ] helm-spec.md defines all required Kubernetes resources (Deployment, Service, ConfigMap)
- [ ] Environment variable mappings documented for K8s DNS resolution

**Rollback**: N/A (documentation-only phase)

**Evidence**: quickstart.md, contracts/dockerfile-spec.md, contracts/helm-spec.md

---

## Phase 2: Container Boundary Definition (6 tasks)

**Purpose**: Analyze frontend and backend applications to determine containerization requirements without building containers yet.

**Agent**: Containerization Agent

**Independent Test**: Analysis documents exist defining entrypoints, ports, environment variables, and dependencies for both services.

### Frontend Analysis

- [ ] T015 [P] [US1] Analyze frontend/package.json to identify dependencies and build process (npm install, npm build, npm start)
- [ ] T016 [P] [US1] Analyze frontend/next.config.js to determine Next.js configuration and port (default 3000)
- [ ] T017 [P] [US1] Document frontend container requirements in specs/001-k8s-deployment/contracts/frontend-container.md: entrypoint (npm start), exposed port (3000), environment variables (NEXT_PUBLIC_API_URL), health check endpoint (/)

### Backend Analysis

- [ ] T018 [P] [US1] Analyze backend/requirements.txt or backend/pyproject.toml to identify Python dependencies
- [ ] T019 [P] [US1] Analyze backend/src/api/main.py to determine FastAPI entrypoint and port (default 8000, uvicorn server)
- [ ] T020 [P] [US1] Document backend container requirements in specs/001-k8s-deployment/contracts/backend-container.md: entrypoint (uvicorn src.api.main:app), exposed port (8000), environment variables (DATABASE_URL, JWT_SECRET_KEY), health check endpoint (/health)

**Validation Criteria**:
- [ ] Frontend analysis identifies correct build process and runtime command
- [ ] Backend analysis identifies correct uvicorn entrypoint
- [ ] Both container requirement documents define ports, env vars, health checks
- [ ] No container images built yet (analysis only)

**Rollback**: Delete analysis documents if incorrect

**Evidence**: frontend-container.md, backend-container.md

---

## Phase 3: User Story 1 - Containerize Applications with Gordon (Priority: P1) 🎯 MVP Foundation

**Goal**: Use Docker AI Agent (Gordon) to generate optimized Dockerfiles for frontend and backend, build images locally, and verify containers run successfully.

**Agent**: Containerization Agent

**Independent Test**: Run `docker build` and `docker run` locally. Frontend accessible at localhost:3000, backend /health responds at localhost:8000.

### Frontend Containerization (10 tasks)

- [ ] T021 [US1] Use Docker AI Agent (Gordon) to generate frontend/Dockerfile via prompt: "Generate production Dockerfile for Next.js 14 app using node:18-alpine base with multi-stage build (dependencies → build → production runtime)"
- [ ] T022 [US1] Review Gordon-generated frontend/Dockerfile for multi-stage build pattern (builder stage with npm install/build, production stage with minimal runtime)
- [ ] T023 [US1] Create frontend/.dockerignore to exclude node_modules/, .next/, .git/, .env.local, README.md
- [ ] T024 [US1] Build frontend Docker image via `docker build -t todo-frontend:latest ./frontend` and capture build time (must be ≤5 minutes)
- [ ] T025 [US1] Verify frontend image size via `docker images todo-frontend:latest` (must be ≤500MB per contract)
- [ ] T026 [US1] Test frontend container locally via `docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:8000 todo-frontend:latest`
- [ ] T027 [US1] Verify frontend UI accessible at http://localhost:3000 in browser
- [ ] T028 [US1] Check frontend container logs via `docker logs <container-id>` for successful startup
- [ ] T029 [US1] Stop frontend test container via `docker stop <container-id>`

### Backend Containerization (10 tasks)

- [ ] T030 [US1] Use Docker AI Agent (Gordon) to generate backend/Dockerfile via prompt: "Generate production Dockerfile for FastAPI Python 3.11 app using python:3.11-slim base with multi-stage build (dependencies with pip → runtime with uvicorn server on port 8000)"
- [ ] T031 [US1] Review Gordon-generated backend/Dockerfile for multi-stage build pattern (pip install stage, runtime stage with uvicorn)
- [ ] T032 [US1] Create backend/.dockerignore to exclude __pycache__/, .venv/, venv/, .git/, .env, *.pyc, .pytest_cache/
- [ ] T033 [US1] Build backend Docker image via `docker build -t todo-backend:latest ./backend` and capture build time (must be ≤5 minutes)
- [ ] T034 [US1] Verify backend image size via `docker images todo-backend:latest` (must be ≤400MB per contract)
- [ ] T035 [US1] Test backend container locally via `docker run -p 8000:8000 -e DATABASE_URL=postgresql://user:pass@host.docker.internal:5432/phase4_db -e JWT_SECRET_KEY=test-secret todo-backend:latest`
- [ ] T036 [US1] Verify backend /health endpoint responds via `curl http://localhost:8000/health` (expect 200 OK)
- [ ] T037 [US1] Check backend container logs via `docker logs <container-id>` for uvicorn startup message
- [ ] T038 [US1] Stop backend test container via `docker stop <container-id>`

### Minikube Image Loading (2 tasks)

- [ ] T039 [US1] Load frontend image into Minikube registry via `minikube image load todo-frontend:latest` (prerequisite for Helm deployment)
- [ ] T040 [US1] Load backend image into Minikube registry via `minikube image load todo-backend:latest` and verify both images with `minikube image ls | grep todo`

**Validation Criteria**:
- [ ] Frontend Dockerfile uses multi-stage build (npm install → npm build → production stage)
- [ ] Backend Dockerfile uses multi-stage build (pip install → runtime)
- [ ] Frontend image builds in ≤5 minutes, size ≤500MB
- [ ] Backend image builds in ≤5 minutes, size ≤400MB
- [ ] Frontend container serves UI at localhost:3000
- [ ] Backend container responds to /health at localhost:8000
- [ ] Both images loaded into Minikube registry (minikube image ls shows todo-frontend:latest and todo-backend:latest)

**Rollback Strategy**:
1. Delete Dockerfiles: `rm frontend/Dockerfile backend/Dockerfile`
2. Delete images: `docker rmi todo-frontend:latest todo-backend:latest`
3. Remove from Minikube: `minikube image rm todo-frontend:latest todo-backend:latest`

**Evidence**: Dockerfile files, docker build logs, docker run screenshots, image size output, curl /health response

**Checkpoint**: At this point, containerization (User Story 1) should be complete with both services running in Docker locally.

---

## Phase 4: User Story 2 - Package with Helm Charts (Priority: P2)

**Goal**: Create Helm chart with Deployment and Service templates for frontend and backend, validate with helm lint, and generate manifests.

**Agent**: Kubernetes Packaging Agent

**Independent Test**: Run `helm lint` and `helm template`. Success = valid manifests generated with no errors.

### Helm Chart Structure (3 tasks)

- [ ] T041 [US2] Create Helm chart directory structure: charts/todo-chatbot/ with subdirectories templates/ and files Chart.yaml, values.yaml
- [ ] T042 [US2] Create charts/todo-chatbot/Chart.yaml with metadata: name=todo-chatbot, version=0.1.0, appVersion=1.0.0, description="Todo Chatbot Kubernetes Deployment"
- [ ] T043 [US2] Create charts/todo-chatbot/values.yaml with configuration defaults: frontend (replicas=2, image=todo-frontend:latest, imagePullPolicy=Never, resources.limits.memory=256Mi, resources.limits.cpu=500m), backend (replicas=2, image=todo-backend:latest, imagePullPolicy=Never, resources.limits.memory=512Mi, resources.limits.cpu=1000m)

### Frontend Kubernetes Resources (3 tasks)

- [ ] T044 [P] [US2] Create charts/todo-chatbot/templates/frontend-deployment.yaml with Deployment manifest: image from values, replicas from values, resource limits from values, readiness probe (httpGet / port 3000 initialDelaySeconds=10), liveness probe (httpGet / port 3000 initialDelaySeconds=30), env NEXT_PUBLIC_API_URL from ConfigMap
- [ ] T045 [P] [US2] Create charts/todo-chatbot/templates/frontend-service.yaml with NodePort Service manifest: selector matches frontend deployment, port=3000, targetPort=3000, type=NodePort (for external access via minikube service)
- [ ] T046 [P] [US2] Verify frontend templates use Helm templating syntax: {{ .Values.frontend.image }}, {{ .Values.frontend.replicas }}, {{ .Values.frontend.resources }}

### Backend Kubernetes Resources (3 tasks)

- [ ] T047 [P] [US2] Create charts/todo-chatbot/templates/backend-deployment.yaml with Deployment manifest: image from values, replicas from values, resource limits from values, readiness probe (httpGet /health port 8000 initialDelaySeconds=10), liveness probe (httpGet /health port 8000 initialDelaySeconds=30), env DATABASE_URL and JWT_SECRET_KEY from ConfigMap/Secrets
- [ ] T048 [P] [US2] Create charts/todo-chatbot/templates/backend-service.yaml with ClusterIP Service manifest: selector matches backend deployment, port=8000, targetPort=8000, type=ClusterIP (internal-only for frontend → backend communication)
- [ ] T049 [P] [US2] Verify backend templates use Helm templating syntax: {{ .Values.backend.image }}, {{ .Values.backend.replicas }}, {{ .Values.backend.resources }}

### ConfigMap and Validation (4 tasks)

- [ ] T050 [US2] Create charts/todo-chatbot/templates/configmap.yaml with environment variables: NEXT_PUBLIC_API_URL=http://backend-service:8000, DATABASE_URL=postgresql://user:pass@host.docker.internal:5432/phase4_db (NOTE: adjust for actual DB endpoint)
- [ ] T051 [US2] Validate Helm chart via `helm lint charts/todo-chatbot` (must report 0 errors)
- [ ] T052 [US2] Generate manifests via `helm template todo-chatbot charts/todo-chatbot > specs/001-k8s-deployment/evidence/manifests.yaml` to verify YAML syntax
- [ ] T053 [US2] Review generated manifests.yaml to confirm all resources defined: 2 Deployments, 2 Services, 1 ConfigMap with correct values interpolated

**Validation Criteria**:
- [ ] `helm lint` reports 0 errors
- [ ] `helm template` generates valid YAML without syntax errors
- [ ] Frontend Deployment includes resource limits (256Mi memory, 500m CPU)
- [ ] Backend Deployment includes resource limits (512Mi memory, 1000m CPU)
- [ ] Frontend Service uses NodePort type (external access)
- [ ] Backend Service uses ClusterIP type (internal-only)
- [ ] ConfigMap includes NEXT_PUBLIC_API_URL pointing to backend-service:8000
- [ ] Readiness and liveness probes defined for both services

**Rollback Strategy**:
1. Delete Helm chart directory: `rm -rf charts/todo-chatbot/`
2. No cluster changes (chart not yet installed)

**Evidence**: Chart.yaml, values.yaml, all template files, helm lint output, manifests.yaml

**Checkpoint**: At this point, Helm packaging (User Story 2) should be complete with valid chart ready for deployment.

---

## Phase 5: User Story 3 - Deploy to Minikube (Priority: P3) 🎯 CORE DELIVERABLE

**Goal**: Start Minikube cluster, deploy Todo Chatbot via Helm, verify all pods reach Running state, and confirm frontend accessibility with E2E flow.

**Agent**: Kubernetes Operations Agent

**Independent Test**: `minikube start` → `helm install` → `kubectl get pods`. Success = all pods Running, frontend accessible via minikube service, E2E flow works (login → create task → view tasks).

### Minikube Cluster Setup (4 tasks)

- [ ] T054 [US3] Start Minikube cluster via `minikube start --memory=4096 --cpus=2` and capture startup time (must be ≤2 minutes)
- [ ] T055 [US3] Verify cluster ready via `kubectl cluster-info` (should show Kubernetes control plane and CoreDNS running)
- [ ] T056 [US3] Verify images available in Minikube via `minikube image ls | grep todo` (should show todo-frontend:latest and todo-backend:latest from Phase 3 T039-T040)
- [ ] T057 [US3] Create Kubernetes namespace (optional) via `kubectl create namespace todo-chatbot` or use default namespace

### Helm Deployment (5 tasks)

- [ ] T058 [US3] Install Helm chart via `helm install todo-chatbot charts/todo-chatbot` and capture install timestamp
- [ ] T059 [US3] Watch pod startup via `kubectl get pods -w` until all pods reach Running status (must complete in ≤3 minutes per spec SC-003)
- [ ] T060 [US3] Verify Helm release status via `helm list` (should show STATUS=deployed, CHART=todo-chatbot-0.1.0)
- [ ] T061 [US3] Check pod status via `kubectl get pods` (frontend-* should show 2/2 Ready, backend-* should show 2/2 Ready)
- [ ] T062 [US3] Describe pods if any issues via `kubectl describe pods` and check Events section for errors (should show no CrashLoopBackOff or ImagePullBackOff)

### Service Accessibility and E2E Testing (5 tasks)

- [ ] T063 [US3] Get frontend service URL via `minikube service frontend-service --url` (returns NodePort URL like http://192.168.49.2:30123)
- [ ] T064 [US3] Test frontend accessibility by opening browser to service URL (should load Todo Chatbot UI)
- [ ] T065 [US3] Verify backend service via `kubectl get svc backend-service` (should show ClusterIP type with port 8000)
- [ ] T066 [US3] Test E2E flow: Login → Create task → View tasks through deployed frontend (validates frontend → backend communication via K8s DNS)
- [ ] T067 [US3] Check backend logs for API requests via `kubectl logs -l app=backend --tail=50` (should show POST/GET requests from frontend)

**Validation Criteria**:
- [ ] Minikube starts in ≤2 minutes
- [ ] All pods reach "Running" status in ≤3 minutes (per spec FR-003)
- [ ] Frontend pods (2/2) are Ready
- [ ] Backend pods (2/2) are Ready
- [ ] `minikube service frontend-service` returns valid URL
- [ ] Frontend UI loads at service URL
- [ ] User can login → create task → view tasks (E2E flow works per spec SC-004)
- [ ] Backend logs show API requests from frontend (confirms K8s service DNS resolution)

**Rollback Strategy**:
1. Uninstall Helm release: `helm uninstall todo-chatbot`
2. Stop Minikube: `minikube stop`
3. Delete cluster if corrupted: `minikube delete`

**Evidence**: minikube start logs, helm install output, kubectl get pods screenshot, minikube service URL, browser screenshot of running UI, E2E test video/screenshots, backend logs showing API calls

**Checkpoint**: At this point, Minikube deployment (User Story 3) should be complete with full application running in Kubernetes and E2E flow validated.

---

## Phase 6: User Story 4 - Use kubectl-ai for Operations (Priority: P4)

**Goal**: Demonstrate kubectl-ai for scaling, log viewing, and troubleshooting with natural language commands.

**Agent**: Kubernetes Operations Agent

**Independent Test**: Run kubectl-ai commands. Success = natural language translates to correct kubectl commands and operations succeed.

### kubectl-ai Scaling Demonstration (3 tasks)

- [ ] T068 [US4] Use kubectl-ai to scale backend via command `kubectl-ai "scale backend deployment to 3 replicas"` and verify it translates to correct kubectl scale command
- [ ] T069 [US4] Verify scaling via `kubectl get deployments` (backend deployment should show READY=3/3, UP-TO-DATE=3, AVAILABLE=3)
- [ ] T070 [US4] Scale backend back to 2 replicas via `kubectl-ai "scale backend to 2 replicas"` and verify via kubectl get deployments

### kubectl-ai Logs and Troubleshooting (3 tasks)

- [ ] T071 [US4] Use kubectl-ai to view frontend logs via `kubectl-ai "show me frontend logs from last 5 minutes"` and verify output shows recent Next.js logs
- [ ] T072 [US4] Use kubectl-ai to troubleshoot pods via `kubectl-ai "diagnose any pod issues in the cluster"` (should report no issues or provide diagnostic steps)
- [ ] T073 [US4] Document kubectl-ai commands used and time saved vs manual kubectl in specs/001-k8s-deployment/evidence/kubectl-ai-report.md (must demonstrate ≥30% time reduction per spec NFR-005)

**Validation Criteria**:
- [ ] kubectl-ai successfully translates natural language to correct kubectl commands (per spec FR-006)
- [ ] Backend scales from 2 → 3 → 2 replicas without errors
- [ ] kubectl-ai logs command shows recent pod output
- [ ] Troubleshooting command provides actionable insights or confirms no issues
- [ ] kubectl-ai report documents ≥1 successful operation (satisfies spec SC-005 requirement)

**Fallback Strategy**: If kubectl-ai unavailable, use standard kubectl commands and document in evidence/kubectl-ai-report.md

**Rollback Strategy**:
1. Revert scaling changes: `kubectl scale deployment backend --replicas=2` (if kubectl-ai commands fail)
2. No destructive changes - kubectl-ai operations are safe

**Evidence**: kubectl-ai command outputs, kubectl get deployments screenshots, kubectl-ai-report.md comparing AI vs manual time

**Checkpoint**: At this point, kubectl-ai usage (User Story 4) should be demonstrated with evidence of AI-assisted Kubernetes operations.

---

## Phase 7: User Story 5 - Analyze with Kagent (Priority: P5)

**Goal**: Use Kagent to analyze cluster health, rank resource usage, and receive optimization recommendations.

**Agent**: AIOps Agent

**Independent Test**: Run Kagent analysis commands. Success = actionable insights returned with CPU/memory metrics.

### Kagent Cluster Analysis (4 tasks)

- [ ] T074 [US5] Use Kagent to analyze cluster health via `kagent analyze cluster` and capture CPU/memory utilization report
- [ ] T075 [US5] Use Kagent to rank resource usage via `kagent "which pods are using the most resources?"` and verify output shows pods ranked by CPU/memory consumption
- [ ] T076 [US5] Request Kagent optimization recommendations via `kagent "suggest resource limit adjustments for better efficiency"` and document suggestions
- [ ] T077 [US5] Document Kagent usage and insights in specs/001-k8s-deployment/evidence/kagent-report.md including cluster metrics, top resource consumers, optimization recommendations (satisfies spec FR-007 requirement)

**Validation Criteria**:
- [ ] Kagent reports CPU/memory utilization metrics (per spec FR-007)
- [ ] Kagent provides resource ranking (top pods by usage)
- [ ] Kagent provides actionable optimization recommendations (or documents "no optimizations needed" if cluster is efficient)
- [ ] kagent-report.md contains ≥1 analysis (satisfies spec SC-005 requirement)

**Fallback Strategy**: If Kagent unavailable, use `kubectl top nodes` and `kubectl top pods` manually and document in evidence/kagent-report.md

**Rollback Strategy**: N/A - Kagent is read-only observability tool

**Evidence**: Kagent command outputs, cluster metrics screenshots, kagent-report.md with insights

**Checkpoint**: At this point, Kagent usage (User Story 5) should be demonstrated with evidence of AI-powered cluster diagnostics.

---

## Phase 8: Validation, Testing & Rollback Verification (10 tasks)

**Purpose**: Execute comprehensive validation of all 8 success criteria from spec.md, test rollback procedures, and measure performance metrics.

**Agent**: Orchestrator (Claude Code) coordinating all agents

**Independent Test**: All 8 success criteria PASS, E2E test completes, rollback verified working in ≤2 minutes.

### Success Criteria Validation (8 tasks)

- [ ] T078 Validate SC-001: Containers Build - Verify Phase 3 evidence shows frontend and backend images built and ran locally (docker build logs, docker run screenshots)
- [ ] T079 Validate SC-002: Helm Validated - Verify Phase 4 evidence shows helm lint passed with 0 errors and manifests.yaml generated
- [ ] T080 Validate SC-003: Deployment Succeeds - Verify Phase 5 evidence shows all pods reached Running in ≤3 minutes (kubectl get pods timestamps)
- [ ] T081 Validate SC-004: E2E Flow Works - Verify Phase 5 evidence shows login → create task → view tasks E2E test completed (screenshots/video)
- [ ] T082 Validate SC-005: AI Tools Used - Verify Gordon generated ≥1 Dockerfile (Phase 3), kubectl-ai executed ≥1 operation (Phase 6), Kagent provided ≥1 analysis (Phase 7) per evidence reports
- [ ] T083 Validate SC-006: No Manual YAML - Verify all Kubernetes manifests exist only in charts/todo-chatbot/templates/ (no manual YAML files in repository root or other locations)
- [ ] T084 Validate SC-007: Fast Deployment - Verify Phase 5 helm install to Running state completed in ≤5 minutes (check timestamps in helm install logs and kubectl get pods)
- [ ] T085 Validate SC-008: Zero Critical Errors - Verify kubectl get pods shows no CrashLoopBackOff, ImagePullBackOff, or Error states; check kubectl describe pods Events for errors

### Rollback Testing and Performance Metrics (2 tasks)

- [ ] T086 Test Helm rollback capability via `helm upgrade todo-chatbot charts/todo-chatbot --set backend.replicas=3` (make change), then `helm rollback todo-chatbot 1` and verify rollback completes in ≤2 minutes per spec FR-010
- [ ] T087 Measure and document performance metrics in specs/001-k8s-deployment/evidence/performance-metrics.md: deployment time (helm install → Running), resource usage (kubectl top pods showing frontend ≤256Mi, backend ≤512Mi), startup reliability (pods started successfully on first attempt = 95%+ per spec NFR-003)

**Validation Criteria**:
- [ ] All 8 success criteria PASS with evidence
- [ ] E2E test (login → create task → view tasks) completes without errors
- [ ] Helm rollback completes in ≤2 minutes
- [ ] No pods in CrashLoopBackOff or Error state
- [ ] Resource usage within limits: Minikube ≤4GB RAM, frontend ≤256MB/pod, backend ≤512MB/pod
- [ ] Deployment time: helm install → Running ≤5 minutes
- [ ] Startup reliability: Pods start successfully 95%+ of time

**Rollback Strategy**: N/A (this is the validation phase - if validation fails, return to originating phase and re-execute)

**Evidence**: Validation checklist with PASS/FAIL for all 8 SC, rollback test logs, performance-metrics.md

**Checkpoint**: At this point, all success criteria validated and rollback capability verified. Phase IV deployment is complete and ready for hackathon demonstration.

---

## Phase 9: Documentation & Handoff (4 tasks)

**Purpose**: Consolidate all documentation, create deployment guide for hackathon demo, and prepare handoff materials.

**Agent**: Orchestrator (Claude Code)

**Independent Test**: Documentation is complete, links are valid, demo script fits within 10-minute time limit.

- [ ] T088 Create DEPLOYMENT.md at repository root with comprehensive deployment guide: prerequisites (Docker Desktop, Minikube, Helm versions), build instructions (docker build for both services), deployment instructions (minikube start, helm install), verification steps (kubectl get pods, minikube service), troubleshooting guide (common issues: CrashLoopBackOff, ImagePullBackOff, resource limits)
- [ ] T089 Create completion report in specs/001-k8s-deployment/COMPLETION.md summarizing: all 8 success criteria validated (with evidence references), agent contributions (which agent executed which tasks), AI tool effectiveness (Gordon/kubectl-ai/Kagent usage and time saved), performance metrics (deployment time, resource usage)
- [ ] T090 Create Prompt History Record (PHR) for tasks generation session following `.specify/templates/phr-template.prompt.md` structure in history/prompts/001-k8s-deployment/002-phase-iv-k8s-tasks.tasks.prompt.md
- [ ] T091 Create hackathon demo script in specs/001-k8s-deployment/DEMO-SCRIPT.md with: live deployment walkthrough (5-10 minutes), AI tool demonstrations (Gordon Dockerfile generation, kubectl-ai scaling, Kagent cluster analysis), Spec-Driven workflow evidence (spec → plan → tasks → implementation), success criteria checklist

**Validation Criteria**:
- [ ] DEPLOYMENT.md has clear step-by-step instructions (non-technical user can follow)
- [ ] All links in documentation are valid (spec.md, plan.md, tasks.md, evidence/)
- [ ] COMPLETION.md includes evidence for all 8 success criteria
- [ ] PHR follows template structure with no unresolved placeholders
- [ ] DEMO-SCRIPT.md fits within 10-minute time limit (practice walkthrough to verify)

**Rollback Strategy**: N/A (documentation-only phase)

**Evidence**: DEPLOYMENT.md, COMPLETION.md, PHR file, DEMO-SCRIPT.md

**Checkpoint**: At this point, all documentation complete and project ready for hackathon submission and demonstration.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 0 (Environment Readiness)**: No dependencies - can start immediately
- **Phase 1 (Foundation Documentation)**: Depends on Phase 0 completion (research.md must exist)
- **Phase 2 (Container Boundary Definition)**: Depends on Phase 1 completion (contracts must exist)
- **Phase 3 (User Story 1 - Containerization)**: Depends on Phase 2 completion (container requirements defined)
- **Phase 4 (User Story 2 - Helm Packaging)**: Depends on Phase 3 completion (Docker images must exist)
- **Phase 5 (User Story 3 - Minikube Deployment)**: Depends on Phase 4 completion (Helm chart must be valid)
- **Phase 6 (User Story 4 - kubectl-ai)**: Depends on Phase 5 completion (cluster must be running)
- **Phase 7 (User Story 5 - Kagent)**: Depends on Phase 5 completion (cluster must be running) - CAN run in parallel with Phase 6
- **Phase 8 (Validation)**: Depends on Phases 3-7 completion (all user stories implemented)
- **Phase 9 (Documentation)**: Depends on Phase 8 completion (validation results needed)

### User Story Dependencies

- **User Story 1 (Containerization - P1)**: FOUNDATIONAL - All other stories depend on this
- **User Story 2 (Helm Packaging - P2)**: Depends on US1 (needs Docker images)
- **User Story 3 (Minikube Deployment - P3)**: Depends on US2 (needs Helm chart)
- **User Story 4 (kubectl-ai - P4)**: Depends on US3 (needs running cluster)
- **User Story 5 (Kagent - P5)**: Depends on US3 (needs running cluster) - Independent of US4

### Critical Path

**Phase 0 → Phase 1 → Phase 2 → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3) → Phase 8 (Validation)**

This is the minimum path to achieve core deployment. Phases 6-7 (kubectl-ai, Kagent) can be added after Phase 5 for full feature set.

### Parallel Opportunities

**Within Phase 0**:
- T005 (Gordon check), T006 (kubectl-ai check), T007 (Kagent check) can run in parallel
- T008 (frontend research), T009 (backend research) can run in parallel

**Within Phase 1**:
- T012 (Dockerfile contract), T013 (Helm contract) can run in parallel

**Within Phase 2**:
- T015-T017 (frontend analysis) and T018-T020 (backend analysis) can run in parallel

**Within Phase 3**:
- Frontend containerization (T021-T029) and Backend containerization (T030-T038) are MOSTLY parallel except:
  - Gordon prompts (T021, T030) can run in parallel
  - Image builds (T024, T033) can run in parallel
  - Local testing (T026-T028, T035-T037) can run in parallel
  - Minikube loading (T039, T040) must run sequentially after local testing

**Within Phase 4**:
- T044-T046 (frontend templates) and T047-T049 (backend templates) can run in parallel

**Between Phases 6 and 7**:
- kubectl-ai demonstration (Phase 6) and Kagent analysis (Phase 7) can run in parallel after Phase 5 completes

---

## Parallel Example: Phase 3 (User Story 1)

```bash
# Launch Gordon prompts together:
Task T021: "Use Gordon for frontend Dockerfile"
Task T030: "Use Gordon for backend Dockerfile"

# Build images together after Dockerfiles created:
Task T024: "docker build -t todo-frontend:latest ./frontend"
Task T033: "docker build -t todo-backend:latest ./backend"

# Test containers together:
Task T026: "docker run frontend container"
Task T035: "docker run backend container"
```

---

## Implementation Strategy

### MVP Foundation (User Stories 1-3)

1. Complete Phase 0: Environment Readiness (10 tasks)
2. Complete Phase 1: Foundation Documentation (4 tasks)
3. Complete Phase 2: Container Boundary Definition (6 tasks)
4. Complete Phase 3: User Story 1 - Containerization (20 tasks)
5. **STOP and VALIDATE**: Verify both Docker images build and run locally
6. Complete Phase 4: User Story 2 - Helm Packaging (13 tasks)
7. **STOP and VALIDATE**: Verify helm lint passes and manifests generated
8. Complete Phase 5: User Story 3 - Minikube Deployment (14 tasks)
9. **STOP and VALIDATE**: Verify E2E flow works in Kubernetes
10. **MVP COMPLETE**: Functional Kubernetes deployment ready

### Full Feature Set (Add AI Tooling Demonstrations)

11. Complete Phase 6: User Story 4 - kubectl-ai (6 tasks)
12. Complete Phase 7: User Story 5 - Kagent (4 tasks) - can run in parallel with Phase 6
13. Complete Phase 8: Validation (10 tasks)
14. Complete Phase 9: Documentation (4 tasks)
15. **FULL DEPLOYMENT COMPLETE**: All 5 user stories validated, ready for hackathon demo

### Incremental Delivery Checkpoints

- **Checkpoint 1 (Phase 2)**: Container requirements defined, ready to containerize
- **Checkpoint 2 (Phase 3)**: Docker images built and tested locally, ready to package for K8s
- **Checkpoint 3 (Phase 4)**: Helm chart validated, ready to deploy to Minikube
- **Checkpoint 4 (Phase 5)**: Running deployment in Kubernetes, E2E validated - **CORE DELIVERABLE COMPLETE**
- **Checkpoint 5 (Phase 6-7)**: AI tooling demonstrated (kubectl-ai, Kagent)
- **Checkpoint 6 (Phase 8-9)**: All success criteria validated, documentation complete - **READY FOR DEMO**

---

## Global Acceptance Criteria

Phase IV is considered complete ONLY IF:

- [ ] All containers are AI-generated (Gordon used or fallback documented)
- [ ] Helm deployment succeeds on Minikube (all pods Running)
- [ ] Frontend and backend communicate correctly (E2E flow works)
- [ ] kubectl-ai usage is demonstrated (≥1 operation executed)
- [ ] Kagent usage is demonstrated (≥1 cluster analysis performed)
- [ ] No manual infrastructure scripting is present (all YAML in Helm templates, all Dockerfiles AI-generated)
- [ ] Evidence artifacts exist for review (screenshots, logs, reports in specs/001-k8s-deployment/evidence/)
- [ ] All 8 success criteria from spec.md validated (SC-001 through SC-008)
- [ ] Deployment guide exists (DEPLOYMENT.md at repository root)
- [ ] Hackathon demo script ready (DEMO-SCRIPT.md with 5-10 minute walkthrough)

---

## Task Summary

**Total Tasks**: 91 tasks across 9 phases

**Phase Breakdown**:
- Phase 0 (Environment Readiness): 10 tasks
- Phase 1 (Foundation Documentation): 4 tasks
- Phase 2 (Container Boundary Definition): 6 tasks
- Phase 3 (User Story 1 - Containerization): 20 tasks
- Phase 4 (User Story 2 - Helm Packaging): 13 tasks
- Phase 5 (User Story 3 - Minikube Deployment): 14 tasks
- Phase 6 (User Story 4 - kubectl-ai): 6 tasks
- Phase 7 (User Story 5 - Kagent): 4 tasks
- Phase 8 (Validation): 10 tasks
- Phase 9 (Documentation): 4 tasks

**MVP Scope (Phases 0-5)**: 67 tasks (achieves core Kubernetes deployment)

**Full Feature Set (Phases 0-9)**: 91 tasks (includes AI tooling demos and complete validation)

**Parallel Opportunities**: ~15-20 tasks can run in parallel within phases, reducing overall execution time by ~20-30%

**Independent Test Criteria**:
- US1: Docker containers run locally (localhost:3000, localhost:8000)
- US2: Helm chart passes lint and generates manifests
- US3: All pods Running, E2E flow works in K8s
- US4: kubectl-ai executes ≥1 operation successfully
- US5: Kagent provides ≥1 cluster analysis

**Suggested MVP Scope**: User Stories 1-3 (Phases 0-5, 67 tasks) - delivers functional Kubernetes deployment without optional AI tooling demonstrations.

---

## Notes

- **[P]** tasks = different systems/files, no dependencies within phase
- **[Story]** label maps task to specific user story (US1-US5) for traceability
- **Agent** assignments follow Phase IV Constitution v2.0.0
- Each user story has independent test criteria and can be validated separately
- Commit after each phase or logical group of tasks
- Stop at checkpoints to validate story independently before proceeding
- All AI tool usage must be documented with evidence (screenshots, command outputs, reports)
- Fallback strategies documented for all AI tools (Gordon, kubectl-ai, Kagent)
- All task IDs (T001-T091) execute in sequential dependency order - do NOT reorder
