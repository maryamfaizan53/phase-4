# Deployment Guide: Todo Chatbot Kubernetes Deployment

This guide provides comprehensive instructions for deploying the Todo Chatbot application to a Kubernetes cluster using Minikube and Helm.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Build Instructions](#build-instructions)
3. [Deployment Instructions](#deployment-instructions)
4. [Verification Steps](#verification-steps)
5. [Troubleshooting](#troubleshooting)
6. [Scaling and Management](#scaling-and-management)
7. [Uninstall](#uninstall)

## Prerequisites

Before deploying the Todo Chatbot application, ensure you have the following tools installed:

### Required Tools
- **Docker Desktop** (v4.53+) - Container runtime
  - Install from: https://www.docker.com/products/docker-desktop/
  - Verify: `docker --version`
  - Ensure Docker daemon is running

- **Minikube** (v1.32+) - Local Kubernetes cluster
  - Install from: https://minikube.sigs.k8s.io/docs/start/
  - Verify: `minikube version`

- **Helm** (v3.12+) - Kubernetes package manager
  - Install from: https://helm.sh/docs/intro/install/
  - Verify: `helm version`

- **kubectl** (v1.28+) - Kubernetes command-line tool
  - Install from: https://kubernetes.io/docs/tasks/tools/
  - Verify: `kubectl version --client`

### System Requirements
- **Operating System**: Windows 10/11, macOS, or Linux
- **Memory**: 8GB RAM minimum (4GB for Minikube, 2GB for host OS, 2GB buffer)
- **Disk Space**: 5GB free space for Docker images and Minikube VM
- **CPU**: 2+ cores recommended
- **Virtualization**: Intel VT-x/AMD-V enabled in BIOS (for Minikube)

## Build Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd phase-4
```

### 2. Build Docker Images

#### Frontend Image
```bash
cd frontend


```

#### Backend Image
```bash
cd ../backend
docker build -t todo-backend:latest .
```

#### Verify Images
```bash
docker images | grep todo-
```

**Expected Image Sizes**:
- `todo-frontend:latest` ≤ 500MB
- `todo-backend:latest` ≤ 400MB

### 3. Load Images into Minikube

```bash
# Load frontend image
minikube image load todo-frontend:latest

# Load backend image
minikube image load todo-backend:latest

# Verify images are available in Minikube
minikube image ls | grep todo
```

## Deployment Instructions

### 1. Start Minikube Cluster

```bash
# Start Minikube with 4GB memory and 2 CPUs
minikube start --memory=4096 --cpus=2
```

### 2. Verify Cluster Status

```bash
# Check cluster information
kubectl cluster-info

# Verify node status
kubectl get nodes
```

### 3. Deploy with Helm

```bash
# Navigate to the charts directory
cd charts/todo-chatbot

# Install the Helm chart
helm install todo-chatbot . --timeout=10m
```

### 4. Monitor Deployment

```bash
# Watch pods start up
kubectl get pods -w
```

**Expected Output**:
```
NAME                                READY   STATUS    RESTARTS   AGE
todo-chatbot-frontend-7d5b8c9c4-abc12   1/1     Running   0          30s
todo-chatbot-frontend-7d5b8c9c4-def34   1/1     Running   0          30s
todo-chatbot-backend-6f4c7d8e3-ghi56    1/1     Running   0          35s
todo-chatbot-backend-6f4c7d8e3-jkl78    1/1     Running   0          35s
```

## Verification Steps

### 1. Check All Resources

```bash
# Check deployments
kubectl get deployments

# Check services
kubectl get services

# Check pods
kubectl get pods
```

### 2. Get Frontend Service URL

```bash
# Get the external URL for the frontend
minikube service todo-chatbot-frontend --url
```

**Expected Output**: A URL like `http://192.168.49.2:31234`

### 3. Access the Application

Open the URL returned by the previous command in your web browser to access the Todo Chatbot application.

### 4. Verify Backend Communication

```bash
# Check backend logs for API requests
kubectl logs deployment/todo-chatbot-backend --tail=20
```

### 5. Test End-to-End Functionality

1. Open the frontend URL in a browser
2. Test the login functionality
3. Create a new task
4. Verify the task appears in the task list
5. Test task completion/deletion

## Troubleshooting

### Common Issues and Solutions

#### Issue: Minikube fails to start
**Symptoms**: `minikube start` hangs or returns an error
**Solutions**:
1. Check that virtualization is enabled in BIOS settings
2. Ensure no other hypervisors are running (VirtualBox, Hyper-V)
3. Try a different driver: `minikube start --driver=docker`
4. Close other applications to free up system resources

#### Issue: Pods stuck in Pending state
**Symptoms**: `kubectl get pods` shows pods in "Pending" state
**Solutions**:
1. Check resource allocation: `kubectl describe nodes`
2. Verify Docker images loaded: `minikube image ls | grep todo`
3. Check resource requests in values.yaml

#### Issue: Pods in CrashLoopBackOff
**Symptoms**: `kubectl get pods` shows pods in "CrashLoopBackOff" state
**Solutions**:
1. Check pod logs: `kubectl logs <pod-name>`
2. Verify environment variables: `kubectl describe pod <pod-name>`
3. Check resource limits: `kubectl describe pod <pod-name>`

#### Issue: Frontend service inaccessible
**Symptoms**: `minikube service frontend-service --url` fails or URL doesn't load
**Solutions**:
1. Verify service exists: `kubectl get services`
2. Check service type: `kubectl describe service todo-chatbot-frontend`
3. Try accessing via minikube IP: `minikube ip` + NodePort

#### Issue: Frontend → Backend communication fails
**Symptoms**: Frontend loads but API calls to backend fail
**Solutions**:
1. Verify NEXT_PUBLIC_API_URL in ConfigMap points to backend service
2. Check backend service is ClusterIP type and accessible via internal DNS
3. Test backend health endpoint: `kubectl port-forward service/todo-chatbot-backend 8000:8000`

### Useful Commands

```bash
# Check cluster status
minikube status

# View all resources in the namespace
kubectl get all

# Port forward for direct access (debugging)
kubectl port-forward service/todo-chatbot-frontend 3000:3000
kubectl port-forward service/todo-chatbot-backend 8000:8000

# View detailed pod information
kubectl describe pod <pod-name>

# View logs for specific deployments
kubectl logs deployment/todo-chatbot-frontend
kubectl logs deployment/todo-chatbot-backend

# Scale deployments
kubectl scale deployment todo-chatbot-frontend --replicas=3
kubectl scale deployment todo-chatbot-backend --replicas=3

# Check resource usage
kubectl top nodes
kubectl top pods

# View Helm release information
helm list
helm status todo-chatbot
```

## Scaling and Management

### Scaling Applications

```bash
# Scale frontend to 3 replicas
kubectl scale deployment todo-chatbot-frontend --replicas=3

# Scale backend to 3 replicas
kubectl scale deployment todo-chatbot-backend --replicas=3

# Check current replica count
kubectl get deployments
```

### Updating Configuration

```bash
# Update values in a custom values file (e.g., my-values.yaml)
# Then upgrade the release
helm upgrade todo-chatbot . -f my-values.yaml
```

### Rolling Back

```bash
# Roll back to previous version
helm rollback todo-chatbot

# Roll back to specific revision
helm rollback todo-chatbot 1
```

## Uninstall

### Uninstall the Helm Release

```bash
# Uninstall the Todo Chatbot deployment
helm uninstall todo-chatbot
```

### Stop and Delete Minikube Cluster

```bash
# Stop Minikube
minikube stop

# Delete Minikube cluster (if needed)
minikube delete
```

### Clean Up Docker Images (Optional)

```bash
# Remove Docker images if no longer needed
docker rmi todo-frontend:latest
docker rmi todo-backend:latest
```

## Architecture Overview

### Components

1. **Frontend Service**: Next.js 14 application serving the user interface
   - Type: NodePort service for external access
   - Replicas: 2 (configurable)
   - Port: 3000

2. **Backend Service**: FastAPI application handling API requests and AI integration
   - Type: ClusterIP service for internal access
   - Replicas: 2 (configurable)
   - Port: 8000

3. **ConfigMap**: Stores non-sensitive configuration values

### Network Flow

```
Internet → Frontend Service (NodePort) → Backend Service (ClusterIP) → Database
```

The frontend communicates with the backend via Kubernetes internal DNS (`http://todo-chatbot-backend:8000`).

## Security Considerations

- All containers run as non-root users
- Resource limits prevent resource exhaustion
- Proper network segmentation with service types
- Environment variables for configuration (not hardcoded secrets)

## Performance Tuning

### Resource Configuration

Default resource requests and limits are set conservatively:

- Frontend: 128Mi/256Mi memory, 100m/500m CPU
- Backend: 256Mi/512Mi memory, 200m/1000m CPU

Adjust these values in `values.yaml` based on your specific requirements.

### Scaling Recommendations

- For production: Consider using Horizontal Pod Autoscaler
- Monitor resource usage with `kubectl top pods`
- Adjust replica counts based on traffic patterns