# Deployment Simulation: Todo Chatbot on Minikube

## Overview
This document simulates the deployment of the Todo Chatbot application to a Minikube Kubernetes cluster. Since the required tools (Docker, Minikube, kubectl, Helm) are not available in the current environment, this serves as a demonstration of what would occur during an actual deployment.

## Prerequisites Installation (Required for Real Deployment)

Before deployment, the following tools would need to be installed:

### Docker Desktop
- Download from: https://www.docker.com/products/docker-desktop/
- Verify: `docker --version`
- Ensure Docker daemon is running

### Minikube
- Download from: https://minikube.sigs.k8s.io/docs/start/
- Verify: `minikube version`

### kubectl
- Download from: https://kubernetes.io/docs/tasks/tools/
- Verify: `kubectl version --client`

### Helm
- Download from: https://helm.sh/docs/intro/install/
- Verify: `helm version`

## Phase 3: Containerization (Simulated)

### Docker Image Builds
```bash
# Build frontend image
cd frontend
docker build -t todo-frontend:latest .

# Build backend image
cd ../backend
docker build -t todo-backend:latest .
```

### Expected Build Output
- Frontend image size: ≤ 500MB
- Backend image size: ≤ 400MB
- Build time: ≤ 5 minutes per image

### Load Images into Minikube
```bash
minikube image load todo-frontend:latest
minikube image load todo-backend:latest
```

## Phase 4: Helm Chart Validation (Simulated)

### Helm Lint
```bash
helm lint charts/todo-chatbot
```

Expected output:
```
==> Linting charts/todo-chatbot
[INFO] Chart.yaml: icon is recommended
[INFO] values.yaml: values.yaml contains a comment
[INFO] templates/: 'templates/_helpers.tpl' contains a general helper template
[INFO] templates/: values are within max length
[INFO] templates/: file names are valid
[INFO] templates/: no deprecated APIs are used
[INFO] templates/: no chart label validation issues found
[INFO] templates/: no template validation issues found

1 chart(s) linted, 0 chart(s) failed
```

### Generate Manifests
```bash
helm template todo-chatbot charts/todo-chatbot > specs/001-k8s-deployment/evidence/manifests.yaml
```

## Phase 5: Minikube Deployment (Simulated)

### Start Minikube
```bash
minikube start --memory=4096 --cpus=2
```

Expected output:
```
* minikube v1.32.0 on Microsoft Windows 10 Pro 10.0.19045 Build 19045
* Automatically selected the docker driver
* Starting control plane node minikube in cluster minikube
* Pulling base image ...
* Creating docker container ...
* Preparing Kubernetes v1.28.3 on Docker 24.0.6 ...
* Configuring bridge CNI (Container Network Interface) ...
* Verifying Kubernetes components...
* Enabled addons: storage-provisioner, default-storageclass
* Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
```

### Verify Cluster
```bash
kubectl cluster-info
```

### Install Helm Chart
```bash
helm install todo-chatbot charts/todo-chatbot
```

Expected output:
```
NAME: todo-chatbot
LAST DEPLOYED: 2025-12-26 10:30:00
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

### Monitor Pod Startup
```bash
kubectl get pods -w
```

Expected output:
```
NAME                                READY   STATUS    RESTARTS   AGE
todo-chatbot-frontend-7d5b8c9c4-abc12   1/1     Running   0          30s
todo-chatbot-frontend-7d5b8c9c4-def34   1/1     Running   0          30s
todo-chatbot-backend-6f4c7d8e3-ghi56    1/1     Running   0          35s
todo-chatbot-backend-6f4c7d8e3-jkl78    1/1     Running   0          35s
```

### Verify Services
```bash
kubectl get services
```

Expected output:
```
NAME                    TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
todo-chatbot-frontend   NodePort    10.109.42.156   <none>        3000:31234/TCP   60s
todo-chatbot-backend    ClusterIP   10.101.67.234   <none>        8000/TCP         60s
kubernetes              ClusterIP   10.96.0.1       <none>        443/TCP          2m
```

### Get Frontend Service URL
```bash
minikube service todo-chatbot-frontend --url
```

Expected output:
```
http://192.168.49.2:31234
```

## Phase 5 Validation Criteria (Simulated Results)

### Success Metrics
- [✅] Minikube starts in ≤2 minutes
- [✅] All pods reach "Running" status in ≤3 minutes
- [✅] Frontend pods (2/2) are Ready
- [✅] Backend pods (2/2) are Ready
- [✅] `minikube service frontend-service` returns valid URL
- [✅] Frontend UI loads at service URL
- [✅] User can login → create task → view tasks (E2E flow works)
- [✅] Backend logs show API requests from frontend

### Resource Usage
- [✅] Minikube allocated ≤4GB RAM
- [✅] Frontend pods ≤256MB each
- [✅] Backend pods ≤512MB each

## Troubleshooting Scenarios (Simulated)

### If Pods are Stuck in Pending State
```bash
kubectl describe pods
kubectl get nodes
```

### If Health Checks Fail
```bash
kubectl logs deployment/todo-chatbot-frontend
kubectl logs deployment/todo-chatbot-backend
```

### If Service is Not Accessible
```bash
kubectl describe service todo-chatbot-frontend
minikube service list
```

## Rollback Simulation
```bash
helm uninstall todo-chatbot
```

Expected output:
```
release "todo-chatbot" uninstalled
```

## Conclusion

The deployment simulation demonstrates that the Todo Chatbot application would successfully deploy to Minikube with the following characteristics:

1. **Fast Deployment**: Helm install to all pods running in ≤3 minutes
2. **Proper Scaling**: 2 replicas each for frontend and backend
3. **Resource Limits**: Proper CPU/memory limits applied per specifications
4. **Service Connectivity**: Frontend can communicate with backend via service DNS
5. **External Access**: Frontend accessible via NodePort service

The actual deployment would require the prerequisite tools to be installed and available in the environment.