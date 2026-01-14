# Cloud Deployment Guide

This document provides instructions for deploying the application to Kubernetes with Dapr and Kafka integration.

## Prerequisites

- Kubernetes cluster (Minikube, AKS, or GKE)
- Dapr CLI installed
- kubectl configured
- Docker installed

## Installation Steps

### 1. Install Dapr in Kubernetes

```bash
dapr init -k
```

### 2. Deploy Kafka using Strimzi

```bash
kubectl apply -f kafka/kafka-cluster.yaml
kubectl apply -f deploy/k8s_manifests/kafka-strimzi-operator.yaml
```

Wait for Kafka to be ready:

```bash
kubectl wait --for=condition=ready pod -l strimzi.io/name=my-cluster-kafka -n default
```

### 3. Apply Dapr Components

```bash
kubectl apply -f deploy/dapr_components/kafka-pubsub.yaml
kubectl apply -f deploy/dapr_components/postgresql-state.yaml
kubectl apply -f deploy/dapr_components/service-invocation.yaml
kubectl apply -f deploy/dapr_components/secrets.yaml
```

### 4. Deploy the Application

Using Helm:

```bash
helm install todo-app deploy/helm_charts/todo-app/
```

Or using kubectl:

```bash
kubectl apply -f deploy/k8s_manifests/backend-deployment.yaml
kubectl apply -f deploy/k8s_manifests/backend-service.yaml
kubectl apply -f deploy/k8s_manifests/backend-resources.yaml
kubectl apply -f deploy/k8s_manifests/backend-health-checks.yaml
kubectl apply -f deploy/k8s_manifests/backend-dapr-config.yaml
```

### 5. Verify the Deployment

Check that all pods are running:

```bash
kubectl get pods
```

Check that Dapr sidecars are injected:

```bash
kubectl get pods -l app=todo-backend -o yaml | grep dapr
```

## Scaling the Application

To scale the backend service:

```bash
kubectl scale deployment todo-backend --replicas=3
```

## Monitoring

Monitor the application with:

```bash
kubectl get pods,svc,configmaps,secrets
dapr status -k
```

## Troubleshooting

### Common Issues

1. **Dapr sidecar not injected**: Ensure the deployment has the `dapr.io/enabled: "true"` annotation
2. **Kafka connectivity issues**: Verify that the Kafka cluster is running and accessible
3. **Database connection failures**: Check that PostgreSQL is running and connection details are correct

### Logs

View application logs:

```bash
kubectl logs -l app=todo-backend
```

View Dapr logs:

```bash
kubectl logs -l app=todo-backend -c daprd
```

## Uninstallation

To uninstall the application:

```bash
helm uninstall todo-app
```

Or if deployed with kubectl:

```bash
kubectl delete -f deploy/k8s_manifests/backend-deployment.yaml
kubectl delete -f deploy/k8s_manifests/backend-service.yaml
kubectl delete -f deploy/k8s_manifests/backend-resources.yaml
kubectl delete -f deploy/k8s_manifests/backend-health-checks.yaml
kubectl delete -f deploy/k8s_manifests/backend-dapr-config.yaml
```

To remove Dapr from the cluster:

```bash
dapr uninstall -k
```