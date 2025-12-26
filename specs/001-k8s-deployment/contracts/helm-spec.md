# Helm Chart Specification Contract: Todo Chatbot

**Feature**: Phase IV - Kubernetes Deployment
**Contract Type**: Kubernetes Packaging Specification
**Version**: 1.0
**Date**: 2025-12-27

---

## Purpose

This specification defines the requirements for the Helm chart that packages the Todo Chatbot application for Kubernetes deployment. The chart must support deployment of both frontend and backend services with proper resource limits, health checks, and service connectivity.

---

## Chart Metadata (Chart.yaml)

### Required Fields
- **name**: `todo-chatbot`
- **version**: `0.1.0` (semantic versioning)
- **appVersion**: `1.0.0` (application version)
- **description**: "Todo Chatbot Kubernetes Deployment"
- **type**: `application`
- **apiVersion**: `v2`

### Optional Fields
- **home**: URL to project documentation
- **sources**: Repository URLs
- **maintainers**: List of maintainers with name and email
- **icon**: URL to chart icon
- **keywords**: List of relevant keywords

---

## Default Values (values.yaml)

### Frontend Configuration
```yaml
frontend:
  # Image configuration
  image:
    repository: "todo-frontend"
    tag: "latest"
    pullPolicy: "Never"  # For local Minikube deployment

  # Replicas configuration
  replicas: 2

  # Resource limits (per spec requirements)
  resources:
    limits:
      memory: "256Mi"
      cpu: "500m"
    requests:
      memory: "128Mi"
      cpu: "100m"

  # Service configuration
  service:
    type: "NodePort"
    port: 3000
    targetPort: 3000

  # Environment variables
  env:
    NEXT_PUBLIC_API_URL: "http://backend-service:8000"
    PORT: "3000"

  # Health checks
  probes:
    readiness:
      httpGet:
        path: "/"
        port: 3000
      initialDelaySeconds: 10
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3
    liveness:
      httpGet:
        path: "/"
        port: 3000
      initialDelaySeconds: 30
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3
```

### Backend Configuration
```yaml
backend:
  # Image configuration
  image:
    repository: "todo-backend"
    tag: "latest"
    pullPolicy: "Never"  # For local Minikube deployment

  # Replicas configuration
  replicas: 2

  # Resource limits (per spec requirements)
  resources:
    limits:
      memory: "512Mi"
      cpu: "1000m"
    requests:
      memory: "256Mi"
      cpu: "200m"

  # Service configuration
  service:
    type: "ClusterIP"
    port: 8000
    targetPort: 8000

  # Environment variables
  env:
    DATABASE_URL: "postgresql://user:pass@host.docker.internal:5432/phase4_db"
    JWT_SECRET_KEY: "your-secret-key-minimum-32-characters-long"
    PORT: "8000"
    API_HOST: "0.0.0.0"

  # Health checks
  probes:
    readiness:
      httpGet:
        path: "/health"
        port: 8000
      initialDelaySeconds: 10
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3
    liveness:
      httpGet:
        path: "/health"
        port: 8000
      initialDelaySeconds: 30
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3
```

### Global Configuration
```yaml
global:
  # Common labels to apply to all resources
  labels: {}

  # Common annotations to apply to all resources
  annotations: {}

  # Image pull secrets (if needed)
  imagePullSecrets: []

# Common annotations for all resources
commonAnnotations: {}

# Common labels for all resources
commonLabels: {}
```

---

## Kubernetes Resources Required

### Frontend Resources
1. **Deployment** (`templates/frontend-deployment.yaml`)
   - Use frontend values from `values.yaml`
   - Include resource limits from spec
   - Configure environment variables from ConfigMap
   - Include readiness and liveness probes
   - Set proper image pull policy

2. **Service** (`templates/frontend-service.yaml`)
   - Type: NodePort (for external access)
   - Port: 3000
   - TargetPort: 3000
   - Selector matching frontend deployment

### Backend Resources
1. **Deployment** (`templates/backend-deployment.yaml`)
   - Use backend values from `values.yaml`
   - Include resource limits from spec
   - Configure environment variables from ConfigMap/Secrets
   - Include readiness and liveness probes
   - Set proper image pull policy

2. **Service** (`templates/backend-service.yaml`)
   - Type: ClusterIP (internal-only access)
   - Port: 8000
   - TargetPort: 8000
   - Selector matching backend deployment

### Shared Resources
3. **ConfigMap** (`templates/configmap.yaml`)
   - Contains environment variables for both services
   - NEXT_PUBLIC_API_URL: Points to backend service DNS
   - Other configuration values as needed

4. **Secrets** (if needed) (`templates/secrets.yaml`)
   - Sensitive information like database passwords
   - JWT secrets
   - API keys

---

## Template Requirements

### Helm Template Syntax
- Use proper Helm template syntax: `{{ .Values.key.path }}`
- Include proper indentation and YAML formatting
- Use `{{- }}` for template actions that should not create newlines
- Include proper error handling with `default` functions

### Template Functions
- Use `include` for reusable templates
- Use `required` for required values
- Use `default` for optional values with defaults
- Use `quote` and `toString` for proper type handling

### Example Template Structure
```yaml
# templates/frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "todo-chatbot.frontend.fullname" . }}
  labels:
    {{- include "todo-chatbot.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.frontend.replicas }}
  selector:
    matchLabels:
      {{- include "todo-chatbot.frontend.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "todo-chatbot.frontend.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.frontend.image.repository }}:{{ .Values.frontend.image.tag }}"
          imagePullPolicy: {{ .Values.frontend.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ .Values.frontend.service.targetPort }}
              protocol: TCP
          env:
            - name: NEXT_PUBLIC_API_URL
              value: {{ .Values.frontend.env.NEXT_PUBLIC_API_URL | quote }}
            - name: PORT
              value: {{ .Values.frontend.env.PORT | quote }}
          resources:
            {{- toYaml .Values.frontend.resources | nindent 12 }}
          {{- if .Values.frontend.probes }}
          readinessProbe:
            {{- toYaml .Values.frontend.probes.readiness | nindent 12 }}
          livenessProbe:
            {{- toYaml .Values.frontend.probes.liveness | nindent 12 }}
          {{- end }}
```

---

## Resource Limits (Per Spec Requirements)

### Frontend Limits
- **Memory**: 256Mi limit, 128Mi request
- **CPU**: 500m limit, 100m request
- **Storage**: Not specified (use default)

### Backend Limits
- **Memory**: 512Mi limit, 256Mi request
- **CPU**: 1000m limit, 200m request
- **Storage**: Not specified (use default)

### Pod Scheduling
- **Node affinity**: Not required (default scheduling)
- **Tolerations**: Not required (default tolerations)
- **Priority class**: Not required (default priority)

---

## Service Configuration

### Frontend Service
- **Type**: NodePort (external access to UI)
- **Port**: 3000 (Next.js default)
- **TargetPort**: 3000
- **NodePort**: Auto-assigned (30000-32767 range)
- **Session affinity**: None (default)

### Backend Service
- **Type**: ClusterIP (internal-only access)
- **Port**: 8000 (FastAPI default)
- **TargetPort**: 8000
- **Session affinity**: None (default)

### Service Discovery
- Frontend should access backend via: `http://backend-service:8000`
- Backend service should be accessible from frontend pods via Kubernetes DNS

---

## Health Checks

### Frontend Health Checks
- **Readiness Probe**: HTTP GET on `/` port 3000
  - Initial delay: 10 seconds
  - Period: 10 seconds
  - Timeout: 5 seconds
  - Failure threshold: 3

- **Liveness Probe**: HTTP GET on `/` port 3000
  - Initial delay: 30 seconds
  - Period: 10 seconds
  - Timeout: 5 seconds
  - Failure threshold: 3

### Backend Health Checks
- **Readiness Probe**: HTTP GET on `/health` port 8000
  - Initial delay: 10 seconds
  - Period: 10 seconds
  - Timeout: 5 seconds
  - Failure threshold: 3

- **Liveness Probe**: HTTP GET on `/health` port 8000
  - Initial delay: 30 seconds
  - Period: 10 seconds
  - Timeout: 5 seconds
  - Failure threshold: 3

---

## Security Requirements

### Pod Security Standards
- **Run as non-root**: Containers should run as non-root user
- **Read-only root filesystem**: Not required (may break applications)
- **Privilege escalation**: Disabled
- **Capabilities**: Drop all and add only required

### Network Security
- **Network policies**: Not required (default behavior)
- **Ingress**: Not required (NodePort service provides external access)

---

## Configuration Management

### Environment Variables
- Use ConfigMap for non-sensitive configuration
- Use Secrets for sensitive information
- Externalize all configurable values to `values.yaml`
- Support environment-specific overrides

### Configuration Validation
- Validate required values are present
- Validate value types and ranges
- Provide sensible defaults for optional values

---

## Deployment Strategy

### Update Strategy
- **Type**: RollingUpdate (default)
- **Max surge**: 25% (default)
- **Max unavailable**: 25% (default)

### Rollback Strategy
- Support Helm rollback functionality
- Maintain deployment history
- Support zero-downtime deployments

---

## Testing Requirements

### Helm Validation
- **helm lint**: Must pass with 0 errors and 0 warnings
- **helm template**: Must generate valid YAML
- **helm install**: Must complete successfully
- **helm upgrade**: Must support version upgrades

### Kubernetes Validation
- **Resource validation**: All generated resources must be valid Kubernetes objects
- **Schema validation**: Resources must conform to Kubernetes API schemas
- **Connectivity**: Services must be accessible as specified

### Performance Validation
- **Startup time**: All pods should reach Ready state within 3 minutes
- **Resource utilization**: Must stay within specified limits
- **Scalability**: Should support scaling up to 10 replicas

---

## Success Metrics

### Functional Metrics
- [ ] All Kubernetes resources deploy successfully
- [ ] Frontend service accessible via NodePort
- [ ] Backend service accessible internally via ClusterIP
- [ ] Frontend can communicate with backend service
- [ ] Health checks pass for all pods

### Performance Metrics
- [ ] All pods reach Ready state within 3 minutes
- [ ] Resource usage within specified limits
- [ ] Zero-downtime deployments supported
- [ ] Rollback functionality works

### Quality Metrics
- [ ] Helm lint passes with 0 errors
- [ ] All templates use proper Helm syntax
- [ ] Values are properly parameterized
- [ ] Documentation is complete and accurate