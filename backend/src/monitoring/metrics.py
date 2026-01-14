"""
Module for setting up Prometheus metrics for the application.
"""
import time
from typing import Callable, Any
from fastapi import Request, Response
from prometheus_client import Counter, Histogram, Gauge, generate_latest
from prometheus_client.registry import CollectorRegistry


# Create a custom registry for our metrics
registry = CollectorRegistry()

# Define metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status'],
    registry=registry
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint'],
    registry=registry
)

ACTIVE_REQUESTS = Gauge(
    'http_active_requests',
    'Number of active HTTP requests',
    registry=registry
)

TASK_OPERATIONS = Counter(
    'task_operations_total',
    'Total task operations',
    ['operation'],
    registry=registry
)

DAPR_COMPONENT_HEALTH = Gauge(
    'dapr_component_health',
    'Health status of Dapr components',
    ['component'],
    registry=registry
)

KAFKA_MESSAGE_PROCESSED = Counter(
    'kafka_messages_processed_total',
    'Total Kafka messages processed',
    ['topic', 'success'],
    registry=registry
)


def increment_task_operation(operation: str):
    """
    Increment the task operation counter.

    Args:
        operation: The type of operation (create, update, delete, complete)
    """
    TASK_OPERATIONS.labels(operation=operation).inc()


def record_dapr_component_health(component: str, healthy: bool):
    """
    Record the health status of a Dapr component.

    Args:
        component: Name of the Dapr component
        healthy: Whether the component is healthy (1 for healthy, 0 for unhealthy)
    """
    DAPR_COMPONENT_HEALTH.labels(component=component).set(int(healthy))


def record_kafka_message_processed(topic: str, success: bool = True):
    """
    Record a Kafka message processing event.

    Args:
        topic: The Kafka topic
        success: Whether the processing was successful
    """
    KAFKA_MESSAGE_PROCESSED.labels(topic=topic, success=str(success)).inc()


async def metrics_middleware(request: Request, call_next: Callable) -> Response:
    """
    Middleware to collect metrics for each request.

    Args:
        request: The incoming request
        call_next: The next middleware or route handler

    Returns:
        The response from the next handler
    """
    start_time = time.time()
    ACTIVE_REQUESTS.inc()

    try:
        response = await call_next(request)
    finally:
        ACTIVE_REQUESTS.dec()

    # Calculate request duration
    duration = time.time() - start_time

    # Extract endpoint from request
    endpoint = request.url.path

    # Record metrics
    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=endpoint,
        status=response.status_code
    ).inc()

    REQUEST_DURATION.labels(
        method=request.method,
        endpoint=endpoint
    ).observe(duration)

    return response


def get_metrics():
    """
    Get the current metrics in Prometheus format.

    Returns:
        Metrics in Prometheus text format
    """
    return generate_latest(registry)


# Initialize some default values
record_dapr_component_health("kafka-pubsub", 1)
record_dapr_component_health("statestore", 1)
record_dapr_component_health("secrets-store", 1)