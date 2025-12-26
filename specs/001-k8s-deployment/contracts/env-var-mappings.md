# Environment Variable Mappings: Todo Chatbot Kubernetes Deployment

**Feature**: Phase IV - Kubernetes Deployment
**Document Type**: Configuration Mapping
**Version**: 1.0
**Date**: 2025-12-27

---

## Purpose

This document defines the mapping between environment variables used in the Todo Chatbot application and their Kubernetes equivalents. It specifies how environment variables should be configured for the Kubernetes deployment, including which variables should be stored in ConfigMaps versus Secrets.

---

## Frontend Environment Variables

### Public Variables (ConfigMap)

#### NEXT_PUBLIC_API_URL
- **Purpose**: API base URL for backend communication
- **Kubernetes Service DNS**: `http://backend-service:8000`
- **Default Value**: `http://backend-service:8000`
- **Usage**: Frontend uses this to make API calls to the backend service
- **Kubernetes Source**: ConfigMap entry in `configmap.yaml`
- **Security Classification**: Public (safe to log/display)

#### PORT
- **Purpose**: Port number for the frontend server to bind to
- **Default Value**: `3000`
- **Usage**: Next.js server port binding
- **Kubernetes Source**: ConfigMap entry in `configmap.yaml`
- **Security Classification**: Public (non-sensitive)

### Variables Summary (Frontend)
```yaml
# In ConfigMap (templates/configmap.yaml)
frontend-env:
  NEXT_PUBLIC_API_URL: "http://backend-service:8000"
  PORT: "3000"
```

---

## Backend Environment Variables

### Public Variables (ConfigMap)

#### PORT
- **Purpose**: Port number for the backend server to bind to
- **Default Value**: `8000`
- **Usage**: FastAPI/Uvicorn server port binding
- **Kubernetes Source**: ConfigMap entry in `configmap.yaml`
- **Security Classification**: Public (non-sensitive)

#### API_HOST
- **Purpose**: Host address for the backend server to bind to
- **Default Value**: `0.0.0.0`
- **Usage**: FastAPI/Uvicorn host binding
- **Kubernetes Source**: ConfigMap entry in `configmap.yaml`
- **Security Classification**: Public (non-sensitive)

#### ENV
- **Purpose**: Environment mode (development, production, staging)
- **Default Value**: `production`
- **Usage**: Controls application behavior based on environment
- **Kubernetes Source**: ConfigMap entry in `configmap.yaml`
- **Security Classification**: Public (non-sensitive)

### Sensitive Variables (Secrets)

#### JWT_SECRET_KEY
- **Purpose**: Secret key used for signing and verifying JWT tokens
- **Default Value**: `"your-secret-key-minimum-32-characters-long"` (for development only)
- **Usage**: Authentication token signing/verification
- **Kubernetes Source**: Secret in `secrets.yaml` or external secret management
- **Security Classification**: SECRET (never log or display)
- **Minimum Length**: 32 characters (recommended 64+)
- **Generation**: Should be randomly generated for production

#### DATABASE_URL
- **Purpose**: PostgreSQL connection string with credentials
- **Format**: `postgresql://username:password@host:port/database_name`
- **Example**: `postgresql://user:pass@postgresql:5432/todo_chatbot`
- **Usage**: Database connection configuration
- **Kubernetes Source**: Secret in `secrets.yaml` or external secret management
- **Security Classification**: SECRET (contains credentials)
- **Connection Pooling**: May require `?pool_timeout=30` suffix

#### DATABASE_PASSWORD
- **Purpose**: Separate password for database authentication (alternative to DATABASE_URL)
- **Usage**: Database connection configuration (when using separate connection components)
- **Kubernetes Source**: Secret in `secrets.yaml`
- **Security Classification**: SECRET (database credential)

---

## Kubernetes Service Discovery Mappings

### Internal Service Communication

#### Frontend → Backend Communication
- **Frontend Env Var**: `NEXT_PUBLIC_API_URL`
- **Kubernetes Service**: `backend-service` (ClusterIP)
- **Port**: `8000`
- **Full URL**: `http://backend-service:8000`
- **Usage**: Frontend makes API calls to backend service via Kubernetes DNS

#### Backend → Database Communication
- **Backend Env Var**: `DATABASE_URL`
- **Kubernetes Service**: `postgresql` (ClusterIP) - assuming PostgreSQL is deployed separately
- **Port**: `5432`
- **Format**: `postgresql://user:$(DATABASE_PASSWORD)@postgresql:5432/todo_chatbot`

---

## Helm Value Mappings

### values.yaml to Environment Variables

#### Frontend Mapping
```yaml
# Source: values.yaml
frontend:
  env:
    NEXT_PUBLIC_API_URL: "http://backend-service:8000"
    PORT: "3000"

# Destination: ConfigMap
data:
  NEXT_PUBLIC_API_URL: {{ .Values.frontend.env.NEXT_PUBLIC_API_URL | quote }}
  FRONTEND_PORT: {{ .Values.frontend.env.PORT | quote }}
```

#### Backend Mapping
```yaml
# Source: values.yaml
backend:
  env:
    DATABASE_URL: "postgresql://user:pass@host.docker.internal:5432/phase4_db"
    JWT_SECRET_KEY: "your-secret-key-minimum-32-characters-long"
    PORT: "8000"
    API_HOST: "0.0.0.0"
    ENV: "production"

# Destination: ConfigMap and Secrets
data:  # ConfigMap
  BACKEND_PORT: {{ .Values.backend.env.PORT | quote }}
  API_HOST: {{ .Values.backend.env.API_HOST | quote }}
  ENV: {{ .Values.backend.env.ENV | quote }}

stringData:  # Secrets
  JWT_SECRET_KEY: {{ .Values.backend.env.JWT_SECRET_KEY | quote }}
  DATABASE_URL: {{ .Values.backend.env.DATABASE_URL | quote }}
```

---

## Default Values and Overrides

### Development Environment
```yaml
# For development deployments
frontend:
  env:
    NEXT_PUBLIC_API_URL: "http://localhost:8000"  # During local development
    PORT: "3000"

backend:
  env:
    DATABASE_URL: "postgresql://devuser:devpass@localhost:5432/todo_dev"
    JWT_SECRET_KEY: "dev-secret-key-for-local-development"
    PORT: "8000"
    ENV: "development"
```

### Production Environment
```yaml
# For production deployments
frontend:
  env:
    NEXT_PUBLIC_API_URL: "http://backend-service:8000"  # Kubernetes service DNS
    PORT: "3000"

backend:
  env:
    DATABASE_URL: "postgresql://produser:{{ .Values.secrets.databasePassword }}@postgresql:5432/todo_prod"
    JWT_SECRET_KEY: "{{ .Values.secrets.jwtSecret }}"  # From secret management
    PORT: "8000"
    ENV: "production"
```

---

## Security Considerations

### Secrets Management
- **Never commit secrets** to version control
- **Use Kubernetes Secrets** or external secret management (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault)
- **Rotate secrets regularly** especially JWT_SECRET_KEY and database credentials
- **Limit secret access** using RBAC and Pod Security Policies

### ConfigMap Considerations
- **Public configuration only** - no sensitive information in ConfigMaps
- **Environment-specific values** can be overridden in values files
- **Application behavior settings** belong in ConfigMaps (not secrets)

### Environment Variable Best Practices
1. **Use meaningful names** that clearly indicate purpose
2. **Provide defaults** where appropriate
3. **Validate required variables** at application startup
4. **Document all variables** in this mapping document
5. **Group related variables** logically

---

## Validation Checklist

### Pre-deployment Validation
- [ ] All sensitive variables mapped to Secrets (not ConfigMaps)
- [ ] Database URLs contain proper credentials and hosts
- [ ] JWT secret keys meet minimum length requirements
- [ ] Service DNS names match actual Kubernetes service names
- [ ] Port numbers match service definitions
- [ ] Environment variables have proper fallbacks/default values

### Post-deployment Validation
- [ ] Verify Secrets are not visible in ConfigMaps
- [ ] Confirm environment variables are properly set in pods
- [ ] Test application functionality with configured variables
- [ ] Verify secure communication between services
- [ ] Validate that no secrets appear in logs or error messages

---

## Migration Path

### From Local Development to Kubernetes
1. **Change NEXT_PUBLIC_API_URL** from `http://localhost:8000` to `http://backend-service:8000`
2. **Update DATABASE_URL** to use Kubernetes service DNS for database
3. **Move sensitive variables** from local `.env` files to Kubernetes Secrets
4. **Verify all environment variables** are properly configured in Helm values

### From Test to Production
1. **Generate new JWT_SECRET_KEY** for production environment
2. **Update database credentials** in production secrets
3. **Change ENV variable** from "test" to "production"
4. **Verify all mappings** work correctly in production environment