# Quickstart Guide: Kubernetes Deployment for Todo Chatbot

**Feature**: Phase IV - Kubernetes Deployment for Todo Chatbot
**Target Platform**: Local Minikube cluster
**Prerequisites**: Docker, Minikube, Helm, kubectl

---

## Prerequisites

Before deploying the Todo Chatbot application to Kubernetes, ensure you have the following tools installed:

### Required Tools

1. **Docker Desktop** (v4.53+)
   - Install from: https://www.docker.com/products/docker-desktop/
   - Verify: `docker --version`
   - Ensure Docker daemon is running

2. **Minikube** (v1.32+)
   - Install from: https://minikube.sigs.k8s.io/docs/start/
   - Verify: `minikube version`

3. **Helm** (v3.12+)
   - Install from: https://helm.sh/docs/intro/install/
   - Verify: `helm version`

4. **kubectl** (v1.28+)
   - Install from: https://kubernetes.io/docs/tasks/tools/
   - Verify: `kubectl version --client`

### System Requirements
- **Operating System**: Windows 10/11, macOS, or Linux
- **Memory**: 8GB RAM minimum (4GB for Minikube, 2GB for host OS, 2GB buffer)
- **Disk Space**: 5GB free space for Docker images and Minikube VM
- **CPU**: 2+ cores recommended
- **Virtualization**: Intel VT-x/AMD-V enabled in BIOS (for Minikube)

---

## Build Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd phase-4
```

### 2. Build Docker Images

**Navigate to the repository root directory** and build both frontend and backend images:

```bash
# Build frontend image
cd frontend
docker build -t todo-frontend:latest .

# Build backend image
cd ../backend
docker build -t todo-backend:latest .

# Verify images were built
docker images | grep todo-
```

**Expected Image Sizes**:
- `todo-frontend:latest` ≤ 500MB
- `todo-backend:latest` ≤ 400MB

### 3. Load Images into Minikube

```bash
# Load images into Minikube's local registry
minikube image load todo-frontend:latest
minikube image load todo-backend:latest

# Verify images are available
minikube image ls | grep todo
```

---

## Deployment Instructions

### 1. Start Minikube Cluster

```bash
# Start Minikube with 4GB memory and 2 CPUs
minikube start --memory=4096 --cpus=2

# Verify cluster is ready
kubectl cluster-info
```

### 2. Deploy with Helm

```bash
# Navigate to the charts directory (if exists) or repository root
cd charts/todo-chatbot  # or cd to repository root

# Install the Helm chart
helm install todo-chatbot ./todo-chatbot

# Verify the release was installed
helm list
```

### 3. Monitor Deployment

```bash
# Watch pods start up
kubectl get pods -w

# Check services
kubectl get services

# Check deployments
kubectl get deployments
```

**Expected Status**: All pods should reach "Running" status within 3 minutes.

---

## Verification Steps

### 1. Check Pod Status
```bash
kubectl get pods
```
**Expected**: All pods show "Running" status with READY column showing "2/2" or "1/1".

### 2. Get Frontend Service URL
```bash
minikube service frontend-service --url
```
**Expected**: Returns a URL like `http://192.168.49.2:30123`

### 3. Test Frontend Accessibility
```bash
# Open browser to the service URL
minikube service frontend-service --url
```
**Expected**: Todo Chatbot UI loads successfully.

### 4. Verify Backend Communication
```bash
# Check backend logs for API requests
kubectl logs -l app=backend --tail=20
```
**Expected**: Shows API requests from frontend (POST/GET logs).

### 5. End-to-End Test
1. Open the frontend URL in a browser
2. Test the login functionality
3. Create a new task
4. Verify the task appears in the task list
5. Test task completion/deletion

---

## Troubleshooting Guide

### Common Issues and Solutions

#### Issue: Minikube fails to start
**Symptoms**: `minikube start` hangs or returns an error
**Solutions**:
1. Check virtualization is enabled in BIOS
2. Ensure no other hypervisors are running (VirtualBox, Hyper-V)
3. Try a different driver: `minikube start --driver=docker`
4. Increase system resources if available

#### Issue: Pods stuck in Pending or CrashLoopBackOff
**Symptoms**: `kubectl get pods` shows pods in "Pending" or "CrashLoopBackOff" state
**Solutions**:
1. Check resource limits: `kubectl describe pods`
2. Verify Docker images loaded: `minikube image ls | grep todo`
3. Check pod logs: `kubectl logs <pod-name>`
4. Ensure ConfigMap has correct environment variables

#### Issue: Frontend service inaccessible
**Symptoms**: `minikube service frontend-service --url` fails or URL doesn't load
**Solutions**:
1. Verify service exists: `kubectl get services`
2. Check service type: `kubectl describe service frontend-service` (should be NodePort)
3. Try accessing via minikube IP: `minikube ip` + NodePort

#### Issue: Frontend → Backend communication fails
**Symptoms**: Frontend loads but API calls to backend fail
**Solutions**:
1. Verify NEXT_PUBLIC_API_URL in ConfigMap points to backend service
2. Check backend service is ClusterIP type and accessible via internal DNS
3. Verify backend health endpoint: `kubectl port-forward service/backend-service 8000:8000`

#### Issue: Docker build fails
**Symptoms**: `docker build` returns errors
**Solutions**:
1. Ensure all required files exist in frontend/backend directories
2. Check Dockerfile syntax
3. Verify dependencies in package.json or requirements.txt

### Useful Commands

```bash
# Check cluster status
minikube status

# View all resources
kubectl get all

# Port forward for direct access (debugging)
kubectl port-forward service/frontend-service 3000:3000
kubectl port-forward service/backend-service 8000:8000

# View detailed pod information
kubectl describe pod <pod-name>

# View logs for specific pods
kubectl logs deployment/frontend-deployment
kubectl logs deployment/backend-deployment

# Scale deployments
kubectl scale deployment frontend-deployment --replicas=3
kubectl scale deployment backend-deployment --replicas=3

# Uninstall the Helm release
helm uninstall todo-chatbot

# Stop Minikube
minikube stop

# Delete Minikube cluster (if needed)
minikube delete
```

---

## Next Steps

Once deployment is successful:
1. Test all application features through the UI
2. Monitor resource usage with `kubectl top nodes` and `kubectl top pods`
3. Scale deployments to test horizontal scaling
4. Test rollback capabilities with `helm rollback todo-chatbot 1`
5. Document performance metrics and any optimization opportunities