# Kubernetes Deployment Script
# This script restarts Minikube, loads images, and deploys the application

Write-Host "Checking Minikube status..." -ForegroundColor Yellow
minikube status

Write-Host "`nStarting Minikube cluster..." -ForegroundColor Yellow
minikube start --memory=4096 --cpus=2

Write-Host "`nVerifying cluster connection..." -ForegroundColor Yellow
kubectl cluster-info

Write-Host "`nLoading frontend image into Minikube..." -ForegroundColor Yellow
minikube image load todo-frontend:latest

Write-Host "`nLoading backend image into Minikube..." -ForegroundColor Yellow
minikube image load todo-backend:latest

Write-Host "`nVerifying images are loaded..." -ForegroundColor Yellow
minikube image ls | Select-String "todo"

Write-Host "`nNavigating to charts directory..." -ForegroundColor Yellow
Set-Location "C:\Users\840 G7\Documents\GitHub\phase-4\charts\todo-chatbot"

Write-Host "`nInstalling application with Helm..." -ForegroundColor Yellow
helm install todo-chatbot . --timeout=10m

Write-Host "`nWaiting for pods to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "`nChecking deployment status..." -ForegroundColor Yellow
kubectl get all

Write-Host "`nGetting frontend service URL..." -ForegroundColor Yellow
minikube service todo-chatbot-frontend --url

Write-Host "`n=== Deployment Complete ===" -ForegroundColor Green
Write-Host "Copy the URL above and open it in your browser to access the application" -ForegroundColor Green
