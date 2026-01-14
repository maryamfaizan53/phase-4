# Data Model: Cloud Deployment with Kubernetes, Dapr, and Kafka

## Overview
This document defines the data models and entity relationships for the cloud deployment feature with Kubernetes, Dapr, and Kafka integration.

## Key Entities

### Task Event
**Description**: Represents a task operation (create, update, complete, delete) in the event-driven architecture
**Fields**:
- event_type: string (enum: created, updated, completed, deleted)
- task_id: integer (unique identifier for the task)
- task_data: object (full task object with all properties)
- user_id: string (identifier for the user who performed the action)
- timestamp: datetime (when the event occurred)

**Relationships**:
- Belongs to a User
- Represents changes to a Task entity

### Reminder Event
**Description**: Represents a scheduled notification for task reminders
**Fields**:
- task_id: integer (the task ID)
- title: string (task title for notification)
- due_at: datetime (when task is due)
- remind_at: datetime (when to send reminder)
- user_id: string (user to notify)

**Relationships**:
- Belongs to a Task
- Belongs to a User

### Kafka Topic
**Description**: Named channel for event streaming in the system
**Fields**:
- name: string (unique topic name: task-events, reminders, task-updates)
- partitions: integer (number of partitions for scalability)
- replication_factor: integer (replication factor for durability)
- retention_policy: string (retention policy for events)

**Relationships**:
- Contains multiple Events of different types

### Dapr Component
**Description**: Configuration for Dapr building blocks (pub/sub, state, secrets, etc.)
**Fields**:
- name: string (component name)
- type: string (component type: pubsub.kafka, state.postgresql, secretstores.kubernetes)
- version: string (version of the component)
- metadata: object (configuration properties)

**Relationships**:
- Configures Dapr runtime behavior
- References external services (Kafka, PostgreSQL, Kubernetes secrets)

### Kubernetes Service
**Description**: Containerized application component deployed in the cluster
**Fields**:
- name: string (service name)
- replicas: integer (number of pod replicas)
- cpu_request: string (CPU resource request)
- cpu_limit: string (CPU resource limit)
- memory_request: string (memory resource request)
- memory_limit: string (memory resource limit)
- liveness_probe: object (health check configuration)
- readiness_probe: object (readiness check configuration)

**Relationships**:
- Deploys application code
- May include Dapr sidecar

## State Transitions

### Task Event States
- **Initial State**: No event exists for a task
- **Created**: When task is initially created (event_type: created)
- **Updated**: When task properties are modified (event_type: updated)
- **Completed**: When task is marked as completed (event_type: completed)
- **Deleted**: When task is removed (event_type: deleted)

### Reminder Event States
- **Scheduled**: Reminder is planned but not yet triggered
- **Processed**: Reminder has been sent to the user
- **Cancelled**: Reminder was cancelled due to task completion

## Validation Rules

### Task Event Validation
- event_type must be one of: created, updated, completed, deleted
- task_id must be a positive integer
- timestamp must be in ISO 8601 format
- user_id must not be empty

### Reminder Event Validation
- remind_at must be after current time
- remind_at must be before or equal to due_at
- user_id must correspond to an existing user

### Kafka Topic Validation
- topic name must follow naming convention (lowercase, hyphens only)
- partitions must be between 1 and 1000
- replication_factor must be odd number between 1 and 5

### Dapr Component Validation
- component name must be unique within the application
- type must be one of the supported Dapr component types
- metadata must contain required configuration fields

## Relationships

### Event Sourcing Pattern
- All changes to Task entities are recorded as Task Events
- Task state is derived by replaying events in chronological order
- Events are immutable and append-only

### Pub/Sub Relationships
- Publishers (services) send events to Kafka topics
- Subscribers (services) consume events from Kafka topics
- Dapr pub/sub building block manages the connection between services and Kafka

### Service Dependencies
- Frontend services depend on Dapr for service invocation
- Backend services depend on Dapr for state management
- All services depend on Dapr for secrets management