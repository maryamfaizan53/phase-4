---
description: "Task list for Cloud Deployment with Kubernetes, Dapr, and Kafka"
---

# Tasks: Cloud Deployment with Kubernetes, Dapr, and Kafka

**Input**: Design documents from `/specs/[002-cloud-deployment]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No explicit test requirements in feature specification, so tests are not included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- **Deployment**: `deploy/`, `k8s_manifests/`, `helm_charts/`
- **Kafka**: `kafka/`, `kafka_handlers/`
- **Dapr**: `dapr_components/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan in deploy/, kafka/, and backend/
- [x] T002 Initialize Python 3.11 project with FastAPI dependencies in backend/
- [x] T003 [P] Configure linting and formatting tools in backend/.flake8, backend/pyproject.toml
- [x] T004 [P] Set up Docker configuration in backend/Dockerfile, backend/docker-compose.yml
- [x] T005 Install Dapr CLI and initialize in Kubernetes cluster

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Set up Kubernetes cluster (Minikube/AKS/GKE) per plan.md requirements
- [x] T007 Install Dapr in Kubernetes cluster with dapr init -k
- [x] T008 [P] Deploy Kafka using Strimzi in kafka/kafka-cluster.yaml, deploy/k8s_manifests/kafka-strimzi-operator.yaml
- [x] T009 [P] Create Dapr Kafka pubsub component in deploy/dapr_components/kafka-pubsub.yaml
- [x] T010 [P] Create Dapr PostgreSQL state component in deploy/dapr_components/postgresql-state.yaml
- [x] T011 Configure PostgreSQL connection in backend/src/config/database.py
- [x] T012 Set up Helm chart structure in deploy/helm_charts/todo-app/
- [x] T013 Create basic backend service structure in backend/src/main.py, backend/src/api/, backend/src/models/

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Deploy Application to Kubernetes (Priority: P1) 🎯 MVP

**Goal**: Deploy the application to Kubernetes (Minikube locally, AKS/GKE in cloud) with scalable, production-ready deployment infrastructure.

**Independent Test**: Deploy the application to Minikube and verify all services are running and communicating properly, delivering the basic application functionality in a containerized environment.

### Implementation for User Story 1

- [x] T014 [P] [US1] Create basic Kubernetes deployment manifest in deploy/k8s_manifests/backend-deployment.yaml
- [x] T015 [P] [US1] Create Kubernetes service manifest in deploy/k8s_manifests/backend-service.yaml
- [x] T016 [US1] Create resource limits and requests in deploy/k8s_manifests/backend-resources.yaml
- [x] T017 [US1] Add liveness and readiness probes in deploy/k8s_manifests/backend-health-checks.yaml
- [x] T018 [US1] Configure Dapr sidecar injection in deploy/k8s_manifests/backend-dapr-config.yaml
- [x] T019 [US1] Create basic FastAPI app with health check endpoint in backend/src/main.py
- [x] T020 [US1] Create Helm chart templates for backend service in deploy/helm_charts/todo-app/templates/
- [x] T021 [US1] Deploy to Minikube and verify all services start successfully

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Integrate Dapr for Service Communication (Priority: P2)

**Goal**: Integrate Dapr (Distributed Application Runtime) to achieve loose coupling between services and simplify infrastructure interactions.

**Independent Test**: Implement Dapr sidecars alongside services and verify inter-service communication works through Dapr's service invocation.

### Implementation for User Story 2

- [x] T022 [P] [US2] Create Dapr service invocation component configuration in deploy/dapr_components/service-invocation.yaml
- [x] T023 [P] [US2] Create Dapr secrets component configuration in deploy/dapr_components/secrets.yaml
- [x] T024 [US2] Modify backend to use Dapr service invocation for inter-service communication in backend/src/services/dapr_client.py
- [x] T025 [US2] Implement Dapr state management for conversation state in backend/src/services/dapr_state.py
- [x] T026 [US2] Update deployment manifests to include Dapr sidecars with proper annotations in deploy/k8s_manifests/backend-dapr-sidecar.yaml
- [x] T027 [US2] Test service-to-service communication via Dapr in deploy/test/dapr-service-invocation-test.py
- [x] T028 [US2] Test pub/sub communication via Dapr in deploy/test/dapr-pubsub-test.py

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Implement Kafka Event Streaming (Priority: P3)

**Goal**: Implement Kafka event streaming to achieve event-driven architecture with reliable messaging between services.

**Independent Test**: Publish events to Kafka topics and verify consumers successfully process them.

### Implementation for User Story 3

- [x] T029 [P] [US3] Create Kafka topic configurations for task-events, reminders, task-updates in kafka/topics/
- [x] T030 [P] [US3] Create Kafka event schemas in kafka/schemas/task-event.avsc, kafka/schemas/reminder-event.avsc
- [x] T031 [US3] Implement Kafka producer wrapper in backend/src/services/kafka_producer.py
- [x] T032 [US3] Implement Kafka consumer wrapper in backend/src/services/kafka_consumer.py
- [x] T033 [US3] Create Kafka handler for task events in backend/src/kafka_handlers/task_events_handler.py
- [x] T034 [US3] Create Kafka handler for reminder events in backend/src/kafka_handlers/reminder_events_handler.py
- [x] T035 [US3] Integrate Kafka with Dapr pubsub component to publish task events in backend/src/api/task_endpoints.py
- [x] T036 [US3] Test Kafka event publishing and consumption in deploy/test/kafka-integration-test.py

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Enable Advanced Features with Event-Driven Architecture (Priority: P4)

**Goal**: Enable recurring tasks and reminder notifications to be handled asynchronously so that the system remains responsive and reliable.

**Independent Test**: Create a recurring task and verify it generates subsequent tasks automatically, or set a reminder and receive notification at the scheduled time.

### Implementation for User Story 4

- [x] T037 [P] [US4] Create recurring task service in backend/src/services/recurring_task_service.py
- [x] T038 [P] [US4] Create reminder notification service in backend/src/services/reminder_notification_service.py
- [x] T039 [US4] Implement Dapr Jobs API for scheduled reminders in backend/src/services/dapr_jobs_scheduler.py
- [x] T040 [US4] Create event processor for recurring task triggers in backend/src/kafka_handlers/recurring_task_processor.py
- [x] T041 [US4] Create event processor for reminder triggers in backend/src/kafka_handlers/reminder_processor.py
- [x] T042 [US4] Implement audit logging via event sourcing in backend/src/services/audit_service.py
- [x] T043 [US4] Test recurring task creation after completion in deploy/test/recurring-task-test.py
- [x] T044 [US4] Test reminder notifications at scheduled times in deploy/test/reminder-notification-test.py

**Checkpoint**: All user stories should now be independently functional with advanced features

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T045 [P] Documentation updates in docs/deployment-guide.md, docs/event-streaming-architecture.md
- [x] T046 [P] Update quickstart guide with complete deployment instructions in specs/002-cloud-deployment/quickstart.md
- [x] T047 Security hardening: JWT authentication with Dapr secrets in backend/src/auth/jwt_handler.py
- [x] T048 Performance optimization: tune Kafka consumer groups and Dapr configuration
- [x] T049 Run quickstart.md validation to ensure all steps work correctly
- [x] T050 Set up monitoring with Prometheus metrics in backend/src/monitoring/metrics.py
- [x] T051 Configure distributed tracing with Jaeger in deploy/k8s_manifests/tracing-config.yaml

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 (Kubernetes foundation)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US1 (Kubernetes) and US2 (Dapr)
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Depends on US1, US2, US3 (full infrastructure)

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members after their prerequisites are met

---

## Parallel Example: User Story 2

```bash
# Launch all Dapr component configurations together:
Task: "Create Dapr service invocation component configuration in deploy/dapr_components/service-invocation.yaml"
Task: "Create Dapr secrets component configuration in deploy/dapr_components/secrets.yaml"

# Launch backend service modifications together:
Task: "Modify backend to use Dapr service invocation for inter-service communication in backend/src/services/dapr_client.py"
Task: "Implement Dapr state management for conversation state in backend/src/services/dapr_state.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2 (after US1 foundation)
   - Developer C: User Story 3 (after US1, US2 foundations)
   - Developer D: User Story 4 (after US1, US2, US3 foundations)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Dependencies: US2 depends on US1, US3 depends on US1&US2, US4 depends on US1&US2&US3