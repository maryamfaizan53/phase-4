# Deployment Guide - Todo App Dashboard

## Overview

This guide covers deploying the full-stack Todo App to production, including:
- Frontend (Next.js) deployment to Vercel
- Backend (FastAPI) deployment to Railway/Render
- Database (PostgreSQL) on Neon
- Environment configuration
- Post-deployment verification

---

## Prerequisites

### Required Accounts

1. **Vercel** (frontend hosting)
   - Sign up: https://vercel.com/signup
   - Install Vercel CLI: `npm i -g vercel`

2. **Railway/Render** (backend hosting)
   - Railway: https://railway.app/
   - OR Render: https://render.com/

3. **Neon** (PostgreSQL database)
   - Sign up: https://neon.tech/

### Required Tools

```bash
# Node.js 18+
node --version

# Python 3.11+
python --version

# Git
git --version

# Vercel CLI (optional but recommended)
npm install -g vercel
```

---

## Phase 1: Database Setup (Neon PostgreSQL)

### 1.1 Create Neon Project

1. Go to https://console.neon.tech/
2. Click "Create Project"
3. Project settings:
   - Name: `todo-app-production`
   - Region: Choose closest to your users
   - PostgreSQL version: 15 or 16
4. Click "Create Project"

### 1.2 Get Connection String

1. In Neon dashboard, click "Connection Details"
2. Copy the connection string (Pooled connection recommended)
3. Format: `postgresql://user:password@host/database?sslmode=require`
4. Save this as `DATABASE_URL` for backend deployment

### 1.3 Initialize Database

Run migrations on Neon database:

```bash
# From backend directory
cd backend

# Set DATABASE_URL temporarily
export DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Run migrations (if you have alembic)
alembic upgrade head

# Or run your initialization script
python -m src.init_db
```

---

## Phase 2: Backend Deployment (FastAPI)

### Option A: Deploy to Railway

#### 2A.1 Prepare Backend

1. Ensure `backend/requirements.txt` exists and is updated:
   ```bash
   cd backend
   pip freeze > requirements.txt
   ```

2. Create `backend/Procfile`:
   ```
   web: uvicorn src.api.main:app --host 0.0.0.0 --port $PORT
   ```

3. Create `backend/railway.json` (optional):
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "uvicorn src.api.main:app --host 0.0.0.0 --port $PORT",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

#### 2A.2 Deploy to Railway

1. Go to https://railway.app/
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Root directory: `backend`
5. Add environment variables:
   ```
   DATABASE_URL=<your-neon-connection-string>
   JWT_SECRET=<generate-strong-secret>
   CLAUDE_API_KEY=<your-claude-api-key>
   ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   ```
6. Click "Deploy"
7. Note the Railway URL (e.g., `https://your-app.railway.app`)

### Option B: Deploy to Render

#### 2B.1 Prepare Backend

Same as Railway preparation (Procfile, requirements.txt)

#### 2B.2 Deploy to Render

1. Go to https://dashboard.render.com/
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Settings:
   - Name: `todo-app-backend`
   - Root Directory: `backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn src.api.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (same as Railway)
6. Choose instance type (Free tier for testing)
7. Click "Create Web Service"
8. Note the Render URL (e.g., `https://your-app.onrender.com`)

---

## Phase 3: Frontend Deployment (Next.js to Vercel)

### 3.1 Prepare Frontend

1. Update environment variables in `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```

2. Ensure `frontend/package.json` has build script:
   ```json
   {
     "scripts": {
       "build": "next build",
       "start": "next start"
     }
   }
   ```

3. Test production build locally:
   ```bash
   cd frontend
   npm run build
   npm start
   ```

### 3.2 Deploy to Vercel (Method 1: Vercel CLI)

```bash
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? todo-app-frontend
# - Directory? ./
# - Override settings? No
```

### 3.3 Deploy to Vercel (Method 2: GitHub Integration)

1. Go to https://vercel.com/new
2. Import your Git repository
3. Configure project:
   - Framework Preset: `Next.js`
   - Root Directory: `frontend`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```
5. Click "Deploy"
6. Note your frontend URL (e.g., `https://todo-app-frontend.vercel.app`)

### 3.4 Update Backend CORS

After frontend deployment, update backend `ALLOWED_ORIGINS`:

```python
# backend/src/config.py or backend/src/api/main.py

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://todo-app-frontend.vercel.app",  # Production
        "https://your-custom-domain.com",        # Custom domain if any
        "http://localhost:3000",                  # Local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Redeploy backend after this change.

---

## Phase 4: Environment Variables

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-256-bit-secret` |
| `CLAUDE_API_KEY` | Anthropic API key | `sk-ant-api...` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `https://your-app.vercel.app` |
| `PORT` | Server port (auto-set by host) | `8000` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `https://api.example.com` |

---

## Phase 5: Custom Domain (Optional)

### 5.1 Frontend Custom Domain (Vercel)

1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add your domain (e.g., `app.yourdomain.com`)
4. Follow DNS configuration instructions
5. Vercel will auto-provision SSL certificate

### 5.2 Backend Custom Domain (Railway/Render)

1. In Railway/Render dashboard
2. Settings → Custom Domain
3. Add domain (e.g., `api.yourdomain.com`)
4. Configure DNS CNAME record
5. SSL certificate auto-provisioned

---

## Phase 6: Post-Deployment Verification

### 6.1 Health Checks

**Backend Health Check**
```bash
curl https://your-backend-url.railway.app/health

# Expected response:
{"status": "ok"}
```

**Frontend Health Check**
```bash
curl https://your-frontend.vercel.app/

# Should return HTML
```

### 6.2 Functional Testing

1. **User Registration**
   - Navigate to frontend
   - Register new account
   - Verify email stored in database

2. **Task Management**
   - Create a task
   - Mark task complete
   - Delete task
   - Verify all operations work

3. **Chat Widget**
   - Open chat
   - Send message
   - Verify AI response
   - Check task creation via chat

4. **Dashboard Features**
   - Verify KPI calculations
   - Check chart rendering
   - Test search/filter
   - Verify pagination

### 6.3 Performance Testing

Run Lighthouse audit on production:

1. Open DevTools in Chrome
2. Navigate to Lighthouse tab
3. Run audit on production URL
4. Verify scores:
   - Performance: 85+ (Desktop), 75+ (Mobile)
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 85+

---

## Phase 7: Monitoring & Logging

### 7.1 Vercel Analytics (Frontend)

1. In Vercel dashboard → Analytics
2. Enable Web Analytics
3. Monitor:
   - Page views
   - Unique visitors
   - Core Web Vitals

### 7.2 Railway/Render Logs (Backend)

**Railway:**
- Dashboard → Deployments → View Logs
- Monitor API requests and errors

**Render:**
- Dashboard → Logs tab
- Real-time log streaming

### 7.3 Sentry (Error Tracking - Optional)

```bash
# Install Sentry
npm install @sentry/nextjs @sentry/node

# Configure Sentry
# Follow: https://docs.sentry.io/platforms/javascript/guides/nextjs/
```

---

## Phase 8: Continuous Deployment

### 8.1 Automatic Deployments

Both Vercel and Railway/Render support automatic deployments:

**Main Branch (Production)**
- Push to `main` → Auto-deploy to production

**Feature Branches (Preview)**
- Push to any branch → Auto-deploy preview URL

### 8.2 GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Run tests
        run: cd frontend && npm test
      - name: Build
        run: cd frontend && npm run build

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: cd backend && pip install -r requirements.txt
      - name: Run tests
        run: cd backend && pytest
```

---

## Phase 9: Rollback Strategy

### 9.1 Vercel Rollback

1. Go to Vercel dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"
4. Instant rollback

### 9.2 Railway/Render Rollback

**Railway:**
1. Deployments tab
2. Select previous deployment
3. Click "Redeploy"

**Render:**
1. Manual Deploys tab
2. Select previous commit
3. Click "Deploy"

---

## Troubleshooting

### Common Issues

**1. CORS Errors**
```
Solution: Verify ALLOWED_ORIGINS in backend includes frontend URL
Check: Backend logs for rejected requests
```

**2. Database Connection Errors**
```
Solution: Verify DATABASE_URL is correct
Check: Neon dashboard → Connection Details
Ensure: SSL mode is enabled (?sslmode=require)
```

**3. Environment Variables Not Loading**
```
Solution: Restart deployment after adding env vars
Check: Vercel/Railway dashboard → Environment Variables
```

**4. Build Failures**
```
Frontend: Check package.json dependencies
Backend: Verify requirements.txt has all dependencies
```

**5. Slow Performance**
```
Check: Lighthouse report
Verify: All optimizations enabled (lazy loading, memoization)
Monitor: Neon database performance
```

---

## Security Checklist

- [ ] All API keys in environment variables (never committed)
- [ ] JWT_SECRET is strong (256+ bits)
- [ ] HTTPS enabled on all domains
- [ ] CORS properly configured (no `allow_origins=["*"]`)
- [ ] Database credentials rotated regularly
- [ ] Rate limiting enabled on backend
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (SQLModel/SQLAlchemy)
- [ ] XSS protection (React auto-escaping)
- [ ] CSP headers configured

---

## Success Criteria

✅ **Deployment Complete When:**

1. Frontend accessible at production URL
2. Backend health check returns 200 OK
3. User can register and login
4. Tasks CRUD operations work
5. Chat widget functions correctly
6. All charts render properly
7. No console errors
8. Lighthouse scores meet targets
9. Monitoring/logging configured
10. Team has access to dashboards

---

## Post-Deployment Checklist

- [ ] Production URLs documented
- [ ] Environment variables secured
- [ ] Monitoring enabled
- [ ] Error tracking configured
- [ ] Backup strategy defined
- [ ] Rollback procedure tested
- [ ] Team trained on deployment process
- [ ] Documentation updated
- [ ] Stakeholders notified
- [ ] Post-deployment review scheduled

---

## Support & Maintenance

### Regular Maintenance Tasks

**Weekly:**
- Review error logs
- Check performance metrics
- Monitor database size

**Monthly:**
- Dependency updates
- Security patches
- Performance optimization review

**Quarterly:**
- Disaster recovery test
- Security audit
- Cost optimization review

### Emergency Contacts

- **Vercel Support**: https://vercel.com/support
- **Railway Support**: https://railway.app/help
- **Neon Support**: https://neon.tech/docs/introduction/support

---

## Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Neon Documentation](https://neon.tech/docs/introduction)
