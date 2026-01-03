# Deployment Guide - Todo App Dashboard

## Overview

This guide covers deploying the full-stack Todo App to production, including:
- **Frontend (Next.js)** deployment to **Vercel**
- **Backend (FastAPI)** deployment to **Railway** (with Docker)
- **Database (PostgreSQL)** on Railway
- Environment configuration
- Post-deployment verification

**Quick Start**: Follow Phases 1-3 for basic deployment. This project uses Docker for the backend.

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

## Phase 1: Backend Deployment to Railway

Railway will handle both the backend application and PostgreSQL database. We'll set this up first so the frontend can connect to it.

### 1.1 Create Railway Project

1. Go to https://railway.app and sign in with GitHub
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select your repository (`phase-4`)

### 1.2 Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically provision a PostgreSQL instance
4. The `DATABASE_URL` variable will be auto-created and linked to your backend service

### 1.3 Configure Backend Service

1. Click on your backend service in the Railway dashboard
2. Go to **"Settings"** tab
3. Set **Root Directory** to `backend`
4. Railway will auto-detect the `Dockerfile` in the backend directory
5. Build and deploy will happen automatically using Docker

---

## Phase 2: Configure Backend Environment Variables

### 2.1 Set Required Environment Variables

In your Railway backend service, go to the **"Variables"** tab and add these environment variables:

```bash
# Database (auto-created by Railway PostgreSQL - reference it)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT Configuration (generate a strong secret!)
JWT_SECRET_KEY=your-secure-random-string-minimum-32-characters-long
JWT_ALGORITHM=HS256

# LLM Configuration - Choose OpenRouter (free tier) or OpenAI
LLM_PROVIDER=openrouter
LLM_MODEL=xiaomi/mimo-v2-flash:free
LLM_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_API_KEY=your-openrouter-api-key

# OR for OpenAI (comment out OpenRouter above):
# LLM_PROVIDER=openai
# OPENAI_API_KEY=your-openai-api-key

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
ENV=production
DEBUG=false

# CORS - Will update after Vercel deployment
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**Important Notes:**
- Generate `JWT_SECRET_KEY` using: `openssl rand -base64 32` (or any 32+ character random string)
- Get free OpenRouter API key at https://openrouter.ai/keys
- We'll update `ALLOWED_ORIGINS` after deploying the frontend in Phase 3

### 2.2 Deploy Backend

1. Railway will automatically build and deploy using the `Dockerfile`
2. Monitor deployment in the **"Deployments"** tab
3. Wait for build to complete (typically 2-5 minutes)
4. Once deployed, go to **"Settings"** → **"Networking"** → **"Generate Domain"**
5. Copy your backend URL (e.g., `https://your-app.up.railway.app`)
6. **Save this URL** - you'll need it for frontend configuration

### 2.3 Run Database Migrations

You need to run Alembic migrations to initialize the database schema:

**Option A: Using Railway CLI (Recommended)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run alembic upgrade head
```

**Option B: Add migration command to Dockerfile**
The `backend/Dockerfile` already handles running the application. For one-time migration, use Option A.

### 2.4 Verify Backend Deployment

1. Visit your Railway backend URL
2. Check the health endpoint: `https://your-app.up.railway.app/health`
3. You should see: `{"status":"healthy"}` or similar response

---

## Phase 3: Frontend Deployment to Vercel

### 3.1 Deploy to Vercel via GitHub

Vercel will automatically detect Next.js and handle the build process. **No Dockerfile needed** for frontend.

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository (`phase-4`)
4. Vercel will auto-detect the Next.js framework

### 3.2 Configure Build Settings

In the project configuration screen:

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (default, leave as-is)
- **Output Directory**: `.next` (default, leave as-is)
- **Install Command**: `npm install` (default, leave as-is)

### 3.3 Set Environment Variables

**Before deploying**, add environment variables in the Vercel configuration:

1. In the "Environment Variables" section, add:

```bash
# Backend API URL (use your Railway backend URL from Phase 2.2)
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app

# Better Auth Secret (same as in your local .env.local)
BETTER_AUTH_SECRET=CzkwMM4kba6uzC8l7Z9HtfRZNHFS9T26
```

**Important**: Replace `https://your-app.up.railway.app` with the actual Railway backend URL you saved in Phase 2, Step 2.2.

### 3.4 Deploy Frontend

1. Click **"Deploy"**
2. Vercel will:
   - Install dependencies
   - Build the Next.js app
   - Deploy to production (typically 1-3 minutes)
3. Once complete, Vercel will provide a deployment URL
4. Example: `https://phase-4.vercel.app` or `https://your-project-name.vercel.app`
5. **Save this URL** - you need it for the next step

### 3.5 Update Backend CORS Settings

Now that you have the Vercel frontend URL, update the backend CORS configuration:

1. Go back to **Railway** → Your backend service → **"Variables"**
2. Update the `ALLOWED_ORIGINS` variable:
   ```bash
   ALLOWED_ORIGINS=https://your-project-name.vercel.app
   ```
3. Replace with your actual Vercel URL from step 3.4
4. Railway will automatically redeploy the backend with the new CORS settings

### 3.6 Verify Full Stack Deployment

1. Visit your Vercel frontend URL
2. Test the following flow:
   - **Login**: Should redirect to `/todos` after login
   - **Create Task**: Navigate to `/todos/new` and create a task
   - **Dashboard**: Visit `/dashboard` to see KPIs and charts
   - **Task Management**: Toggle complete, edit, or delete tasks
   - **Chat** (if enabled): Test the chat widget

If everything works, your deployment is complete!

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
