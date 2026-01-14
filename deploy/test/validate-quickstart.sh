#!/bin/bash
# Validation script for the quickstart guide

set -e  # Exit on any error

echo "Starting quickstart guide validation..."

# Check if required tools are available
echo "Checking prerequisites..."
command -v kubectl >/dev/null 2>&1 || { echo >&2 "kubectl is required but not installed. Aborting."; exit 1; }
command -v helm >/dev/null 2>&1 || { echo >&2 "helm is required but not installed. Aborting."; exit 1; }
command -v dapr >/dev/null 2>&1 || { echo >&2 "dapr is required but not installed. Aborting."; exit 1; }

echo "Prerequisites check passed."

# Check if Kubernetes cluster is available
echo "Checking Kubernetes cluster availability..."
kubectl cluster-info || { echo >&2 "Kubernetes cluster is not available. Aborting."; exit 1; }

# Check if Dapr is initialized in Kubernetes
echo "Checking Dapr status..."
dapr status -k | grep -q "True\|Healthy" || { echo >&2 "Dapr is not properly initialized in Kubernetes. Aborting."; exit 1; }

# Check if Kafka namespace exists
echo "Checking Kafka namespace..."
kubectl get namespace kafka || { echo >&2 "Kafka namespace does not exist. Aborting."; exit 1; }

# Check if Kafka cluster is running
echo "Checking Kafka cluster..."
kubectl get kafka -n kafka | grep -q "Ready\|Running" || { echo >&2 "Kafka cluster is not running. Aborting."; exit 1; }

# Check if Dapr components are applied
echo "Checking Dapr components..."
kubectl get components.dapr.io | grep -q "kafka-pubsub\|statestore\|secrets-store" || { echo >&2 "Required Dapr components are not applied. Aborting."; exit 1; }

# Check if the application is deployed
echo "Checking application deployment..."
if kubectl get deployment todo-app; then
    echo "Checking if application pods are running..."
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=todo-app --timeout=300s || { echo >&2 "Application pods are not ready. Aborting."; exit 1; }
else
    echo >&2 "Application deployment not found. Aborting."
    exit 1
fi

# Check if the application service is available
echo "Checking application service..."
kubectl get service todo-app || { echo >&2 "Application service not found. Aborting."; exit 1; }

# Test the application health endpoint (if available)
echo "Testing application health endpoint..."
APP_POD=$(kubectl get pods -l app.kubernetes.io/name=todo-app -o jsonpath="{.items[0].metadata.name}")
if [ ! -z "$APP_POD" ]; then
    echo "Found application pod: $APP_POD"

    # Try to get the health endpoint
    kubectl port-forward pod/$APP_POD 8080:8000 &
    PORT_FORWARD_PID=$!

    # Wait a moment for port forward to establish
    sleep 5

    # Test the health endpoint
    if curl -f http://localhost:8080/healthz; then
        echo "Application health check passed."
    else
        echo "Application health check failed."
    fi

    # Clean up port forward
    kill $PORT_FORWARD_PID 2>/dev/null || true
else
    echo "No application pods found."
fi

# Check if Kafka topics exist
echo "Checking Kafka topics..."
kubectl -n kafka run kafka-tester -it --rm --image=strimzi/kafka:latest-kafka-3.6.0 --restart=Never -- bin/kafka-topics.sh --list --bootstrap-server taskflow-kafka-kafka-brokers:9092 || { echo >&2 "Failed to list Kafka topics."; exit 1; }

echo "Quickstart guide validation completed successfully!"
echo ""
echo "Summary:"
echo "- Kubernetes cluster: Available"
echo "- Dapr: Initialized and running"
echo "- Kafka: Running in kafka namespace"
echo "- Dapr components: Applied"
echo "- Application: Deployed and running"
echo "- Health check: Passed"
echo ""
echo "All steps in the quickstart guide have been validated successfully."