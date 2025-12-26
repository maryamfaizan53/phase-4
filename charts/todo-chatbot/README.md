# Todo Chatbot Helm Chart

This Helm chart deploys the Todo Chatbot application, which consists of a Next.js frontend and a FastAPI backend.

## Prerequisites

- Kubernetes 1.28+
- Helm 3.12+

## Chart Components

This chart deploys:

- Frontend: Next.js 14 application
- Backend: FastAPI application
- Services to expose the applications
- ConfigMap for configuration

## Installing the Chart

To install the chart with the release name `todo-chatbot`:

```bash
helm install todo-chatbot .
```

## Configuration

The following table lists the configurable parameters of the todo-chatbot chart and their default values.

### Frontend Parameters

| Parameter                      | Description                                     | Default                            |
| ------------------------------ | ----------------------------------------------- | ---------------------------------- |
| `frontend.image.repository`    | Frontend image repository                       | `todo-frontend`                    |
| `frontend.image.tag`           | Frontend image tag                              | `latest`                           |
| `frontend.image.pullPolicy`    | Frontend image pull policy                      | `Never`                            |
| `frontend.replicas`            | Number of frontend replicas                     | `2`                                |
| `frontend.service.type`        | Frontend service type                           | `NodePort`                         |
| `frontend.service.port`        | Frontend service port                           | `3000`                             |
| `frontend.service.targetPort`  | Frontend service target port                    | `3000`                             |
| `frontend.env.NEXT_PUBLIC_API_URL` | Backend API URL for frontend                  | `http://backend-service:8000`      |
| `frontend.env.PORT`            | Frontend port                                   | `3000`                             |
| `frontend.resources`           | Frontend resource limits/requests               | `{limits: {memory: "256Mi", cpu: "500m"}, requests: {memory: "128Mi", cpu: "100m"}}` |

### Backend Parameters

| Parameter                      | Description                                     | Default                            |
| ------------------------------ | ----------------------------------------------- | ---------------------------------- |
| `backend.image.repository`     | Backend image repository                        | `todo-backend`                     |
| `backend.image.tag`            | Backend image tag                               | `latest`                           |
| `backend.image.pullPolicy`     | Backend image pull policy                       | `Never`                            |
| `backend.replicas`             | Number of backend replicas                      | `2`                                |
| `backend.service.type`         | Backend service type                            | `ClusterIP`                        |
| `backend.service.port`         | Backend service port                            | `8000`                             |
| `backend.service.targetPort`   | Backend service target port                     | `8000`                             |
| `backend.env.DATABASE_URL`     | Database connection string                      | `postgresql://user:pass@host.docker.internal:5432/phase4_db` |
| `backend.env.JWT_SECRET_KEY`   | JWT secret key                                  | `your-secret-key-minimum-32-characters-long` |
| `backend.env.PORT`             | Backend port                                    | `8000`                             |
| `backend.env.API_HOST`         | Backend host                                    | `0.0.0.0`                          |
| `backend.env.ENV`              | Environment (development/production)           | `production`                       |
| `backend.env.DEBUG`            | Debug mode                                      | `false`                            |
| `backend.resources`            | Backend resource limits/requests                | `{limits: {memory: "512Mi", cpu: "1000m"}, requests: {memory: "256Mi", cpu: "200m"}}` |

## Uninstalling the Chart

To uninstall/delete the `todo-chatbot` release:

```bash
helm delete todo-chatbot
```

## Values

The default values are defined in `values.yaml`. Override them by providing your own values file:

```bash
helm install todo-chatbot . -f my-values.yaml
```