# Event Streaming Architecture

This document describes the event streaming architecture using Kafka and Dapr for the todo application.

## Overview

The application implements an event-driven architecture using Apache Kafka for reliable message streaming and Dapr for simplified service integration. Events flow through the system enabling asynchronous processing and loose coupling between services.

## Architecture Components

### 1. Kafka Cluster

The Kafka cluster handles all event streaming with the following topics:

- `task-events`: Stores all task-related events (creation, updates, completion, deletion)
- `reminders`: Handles reminder notifications and scheduling events
- `task-updates`: Captures task status changes and updates

### 2. Kafka Producers

Located in `backend/src/services/kafka_producer.py`, the producers handle:

- Publishing task creation events
- Publishing task update events
- Publishing reminder scheduling events
- Publishing audit log events

### 3. Kafka Consumers

Located in `backend/src/services/kafka_consumer.py`, the consumers handle:

- Processing task events
- Handling reminder notifications
- Processing recurring task triggers
- Processing audit events

### 4. Event Handlers

Located in `backend/src/kafka_handlers/`, the handlers process specific event types:

- `task_events_handler.py`: Processes task-related events
- `reminder_events_handler.py`: Handles reminder events
- `recurring_task_processor.py`: Processes recurring task triggers
- `reminder_processor.py`: Processes reminder triggers

## Event Flows

### Task Creation Flow

1. User creates a task via the API
2. API publishes a "task_created" event to the `task-events` topic
3. Task event handler processes the event
4. Audit service logs the event for compliance
5. Dapr pubsub component may forward the event to other services if needed

### Task Update Flow

1. User updates a task via the API
2. API publishes a "task_updated" event to the `task-events` topic
3. Task event handler processes the update
4. Relevant services are notified via Dapr pubsub if subscribed
5. Audit service logs the update event

### Reminder Flow

1. A task with a due date is created
2. Reminder service schedules a notification for the appropriate time
3. At the scheduled time, a reminder event is published to the `reminders` topic
4. Reminder notification service processes the event and sends notification
5. Audit service logs the reminder event

### Recurring Task Flow

1. A recurring task is completed
2. Recurring task service processes the completion
3. A new task is created based on the recurrence pattern
4. A "recurring_task_processed" event is published
5. The new task is persisted and becomes available to users

## Dapr Integration

### Pub/Sub Component

The Kafka pub/sub component is configured in `deploy/dapr_components/kafka-pubsub.yaml` and enables:

- Reliable message delivery between services
- Automatic retry mechanisms
- Dead letter queues for failed messages
- Message ordering guarantees where needed

### State Management

Dapr state management is configured in `deploy/dapr_components/postgresql-state.yaml` and provides:

- Distributed state storage
- Transactional operations
- Consistency guarantees
- Automatic persistence

## Schema Definition

Events follow Avro schema definitions located in `kafka/schemas/`:

- `task-event.avsc`: Defines the structure for task events
- `reminder-event.avsc`: Defines the structure for reminder events

Schema evolution is supported following Avro backward compatibility rules.

## Error Handling

### Producer Error Handling

- Retry mechanism with exponential backoff
- Circuit breaker pattern for resilience
- Error logging and metrics collection

### Consumer Error Handling

- Dead letter queue for poison messages
- Retry policies with configurable attempts
- Error reporting and alerting

## Performance Considerations

### Consumer Groups

- Properly configured consumer groups for scalability
- Load balancing across consumer instances
- Offset management for reliability

### Message Partitioning

- Strategic partitioning for load distribution
- Partition key selection for ordered processing
- Monitoring of partition lag

## Monitoring and Observability

### Metrics

- Event throughput rates
- Consumer lag
- Error rates
- Processing times

### Tracing

- End-to-end request tracing across services
- Kafka producer/consumer spans
- Dapr sidecar integration traces

## Security

### Authentication

- SASL/SCRAM for Kafka authentication
- TLS encryption for data in transit
- Dapr secret management for credentials

### Authorization

- ACLs for topic access control
- Role-based access for event streams
- Audit trails for security monitoring

## Scaling Strategies

### Horizontal Scaling

- Consumer group scaling based on load
- Partition count adjustments for throughput
- Auto-scaling based on metrics

### Vertical Scaling

- Broker resources adjustment
- Consumer instance sizing
- Network bandwidth optimization

## Backup and Recovery

### Topic Replication

- Multi-replica configuration for durability
- Cross-datacenter replication for disaster recovery
- Automated failover mechanisms

### Data Retention

- Configurable retention policies
- Compaction for key-based events
- Archive strategies for historical data