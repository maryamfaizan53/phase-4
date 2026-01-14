# Quickstart Guide: Cloud Deployment with Kubernetes, Dapr, and Kafka

## Prerequisites
- Docker and Docker Desktop
- Kubernetes cluster (Minikube, Kind, or cloud provider)
- Dapr CLI installed
- Helm 3.x installed
- kubectl configured for your cluster
- Python 3.11 with pip
- Git

## Setup Steps

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/phase-4.git
cd phase-4
```

### 2. Install Dapr in your Kubernetes cluster
```bash
dapr init -k
```

### 3. Deploy Kafka using Strimzi
```bash
# Create namespace for Kafka
kubectl create namespace kafka

# Install Strimzi operator
kubectl create -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka

# Wait for the operator to be ready
kubectl wait --for=condition=established --timeout=30s crd/kafkas.kafka.strimzi.io
kubectl wait --for=condition=ready pod -l name=strimzi-cluster-operator -n kafka --timeout=300s

# Deploy Kafka cluster
cat <<EOF | kubectl apply -f -
apiVersion: kafka.strimzi.io/v1beta2
kind: Kafka
metadata:
  name: taskflow-kafka
  namespace: kafka
spec:
  kafka:
    replicas: 1
    listeners:
      - name: plain
        port: 9092
        type: internal
        tls: false
    config:
      offsets.topic.replication.factor: 1
      transaction.state.log.replication.factor: 1
      transaction.state.log.min.isr: 1
      default.replication.factor: 1
      min.insync.replicas: 1
    storage:
      type: jbod
      volumes:
      - id: 0
        type: persistent-claim
        size: 10Gi
        deleteClaim: false
  zookeeper:
    replicas: 1
    storage:
      type: persistent-claim
      size: 5Gi
      deleteClaim: false
  entityOperator:
    topicOperator: {}
    userOperator: {}
EOF

# Wait for Kafka cluster to be ready
kubectl wait --for=condition=Ready=True kafkas/taskflow-kafka -n kafka --timeout=600s
```

### 4. Deploy Dapr Components
```bash
# Create Dapr components directory if it doesn't exist
mkdir -p deploy/dapr_components

# Create Kafka pubsub component
cat <<EOF | kubectl apply -f -
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
  namespace: default
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: "taskflow-kafka-kafka-brokers.kafka.svc:9092"
  - name: consumerGroup
    value: "todo-service"
  - name: authType
    value: "none"
  - name: maxMessageBytes
    value: 2097152
  - name: timeout
    value: 30s
EOF

# Create PostgreSQL state component
cat <<EOF | kubectl apply -f -
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
  namespace: default
spec:
  type: state.postgresql
  version: v1
  metadata:
  - name: connectionString
    value: "host=postgres.default.svc.cluster.local user=postgres password=postgres dbname=todoapp port=5432 sslmode=disable"
  - name: actorStateStore
    value: "true"
EOF

# Create secrets component (using Kubernetes secrets)
cat <<EOF | kubectl apply -f -
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: secrets-store
  namespace: default
spec:
  type: secretstores.kubernetes
  version: v1
  metadata: []
EOF
```

### 5. Deploy the Application
```bash
# Navigate to the helm charts directory
cd deploy/helm_charts/todo-app

# Install using Helm with default values
helm install todo-app . \
  --set image.repository=localhost/todo-backend \
  --set image.tag=latest \
  --set dapr.enabled=true \
  --set kafka.brokers="taskflow-kafka-kafka-brokers.kafka.svc:9092" \
  --wait
```

### 6. Verify Installation
```bash
# Check pods
kubectl get pods

# Check services
kubectl get svc

# Check Dapr sidecars
kubectl get pods -l app=todo-backend -o yaml | grep dapr

# Check Kafka topics
kubectl -n kafka run kafka-producer -ti --image=strimzi/kafka:latest-kafka-3.6.0 --rm=true --restart=Never -- bin/kafka-topics.sh --list --bootstrap-server taskflow-kafka-kafka-brokers:9092
```

## Advanced Features Setup

### Configure Recurring Tasks and Reminders
```bash
# Deploy the advanced services for recurring tasks and reminders
kubectl apply -f deploy/k8s_manifests/recurring-tasks-service.yaml
kubectl apply -f deploy/k8s_manifests/reminders-service.yaml

# Configure Dapr bindings for scheduled jobs
cat <<EOF | kubectl apply -f -
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: cron-job
  namespace: default
spec:
  type: bindings.cron
  version: v1
  metadata:
  - name: schedule
    value: "@every 1m"
EOF
```

## Testing the Application

### Test Basic Functionality
```bash
# Port forward to access the application
kubectl port-forward svc/todo-backend 8000:80

# In another terminal, test the API
curl -X GET http://localhost:8000/healthz
```

### Test Kafka Integration
```bash
# Publish a test event via Dapr
curl -X POST http://localhost:3500/v1.0/publish/kafka-pubsub/task-events \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "created",
    "task_id": 1,
    "task_data": {
      "id": 1,
      "title": "Test Task",
      "description": "A test task for the event system",
      "completed": false
    },
    "user_id": "test-user",
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  }'
```

### Test Event Processing
```bash
# Check application logs for event processing
kubectl logs -l app=todo-backend -c todo-app

# Monitor Kafka topics
kubectl -n kafka run kafka-consumer -ti --image=strimzi/kafka:latest-kafka-3.6.0 --rm=true --restart=Never -- bin/kafka-console-consumer.sh --bootstrap-server taskflow-kafka-kafka-brokers:9092 --topic task-events --from-beginning
```

## Testing Advanced Features

### Test Recurring Tasks
```bash
# Create a recurring task
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Daily Standup",
    "description": "Daily team standup meeting",
    "is_recurring": true,
    "recurrence_pattern": "daily",
    "due_date": "2023-12-31T09:00:00Z"
  }'

# Complete the recurring task to trigger creation of next occurrence
curl -X PUT http://localhost:8000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Test Reminder Notifications
```bash
# Create a task with a reminder
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meeting Reminder",
    "description": "Important meeting",
    "due_date": "2023-12-31T10:00:00Z",
    "remind_at": "2023-12-31T09:30:00Z"
  }'
```

## Security Hardening

### Configure JWT Authentication with Dapr Secrets
```bash
# Create a secret for JWT
kubectl create secret generic jwt-secret \
  --from-literal=jwt-secret-key="your-super-secret-jwt-key-here"

# Update the secrets component to use this secret
cat <<EOF | kubectl apply -f -
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: secrets-store
  namespace: default
spec:
  type: secretstores.kubernetes
  version: v1
  metadata: []
EOF

# Update your application configuration to use the secret
cat <<EOF | kubectl apply -f -
apiVersion: dapr.io/v1alpha1
kind: Configuration
metadata:
  name: appconfig
  namespace: default
spec:
  tracing:
    samplingRate: "1"
    zipkin:
      endpointAddress: "http://jaeger-collector:9411/api/v2/spans"
EOF
```

## Performance Optimization

### Tune Kafka Consumer Groups and Dapr Configuration
```bash
# Update Kafka configuration for better performance
kubectl patch kafka/taskflow-kafka -n kafka --type='merge' -p='{
  "spec": {
    "kafka": {
      "config": {
        "num.network.threads": 8,
        "num.io.threads": 16,
        "socket.send.buffer.bytes": 102400,
        "socket.receive.buffer.bytes": 102400,
        "socket.request.max.bytes": 104857600,
        "num.partitions": 3,
        "log.retention.hours": 168
      }
    }
  }
}'
```

## Monitoring Setup

### Set up Prometheus Metrics
```bash
# Install Prometheus and Grafana using Helm
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack

# Expose metrics from your application
kubectl port-forward svc/prometheus-grafana 3000:80
```

### Configure Distributed Tracing with Jaeger
```bash
# Deploy Jaeger
kubectl apply -f https://github.com/jaegertracing/jaeger-operator/releases/download/v1.46.0/jaeger-operator.yaml
kubectl create -f - <<EOF
apiVersion: jaegertracing.io/v1
kind: Jaeger
metadata:
  name: simplest
  namespace: default
spec:
  strategy: allInOne
EOF

# Wait for Jaeger to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=simplest --timeout=300s
```

## Troubleshooting

### Common Issues
1. **Dapr sidecar not injected**: Ensure the namespace has the `dapr.io/enabled=true` annotation
2. **Kafka connectivity**: Check that the Kafka broker address is correct in the Dapr component
3. **State store issues**: Verify PostgreSQL connection string and credentials
4. **Application startup failures**: Check that all required environment variables are set

### Useful Commands
```bash
# Check Dapr status
dapr status -k

# Check component status
kubectl get components.dapr.io

# View Dapr logs
dapr logs

# Port forward to Dapr sidecar for debugging
kubectl port-forward <pod-name> 3500:3500

# Check all resources
kubectl get all

# Describe a pod for detailed information
kubectl describe pod <pod-name>

# Check logs for specific containers
kubectl logs <pod-name> -c <container-name>
```

## Next Steps
1. Configure your cloud provider (AKS/GKE) for production deployment
2. Set up monitoring with Prometheus and Grafana
3. Configure managed Kafka service (Redpanda Cloud/Confluent)
4. Implement additional security measures (TLS, authentication)
5. Set up CI/CD pipelines for automated deployments