# Quick Start Deployment Guide

This is a condensed deployment guide for deploying the Phase-4 Todo Dashboard to Vercel (frontend) and Railway (backend).

**Time to deploy**: ~15-20 minutes

---

## Prerequisites

- GitHub account with this repository pushed
- Vercel account (https://vercel.com)
- Railway account (https://railway.app)
- API keys ready (OpenRouter or OpenAI for LLM functionality)

---

## Step 1: Deploy Backend to Railway (10 mins)

### 1.1 Create Railway Project

1. Go to https://railway.app → Sign in with GitHub
2. **New Project** → **Deploy from GitHub repo**
3. Select your `phase-4` repository

### 1.2 Add PostgreSQL Database

1. Click **+ New** → **Database** → **Add PostgreSQL**
2. Railway auto-creates `DATABASE_URL` variable

### 1.3 Configure Backend Service

1. Click backend service → **Settings** tab
2. Set **Root Directory**: `backend`
3. Railway auto-detects `Dockerfile`

### 1.4 Set Environment Variables

Go to **Variables** tab and add:

```bash
# Database (Railway auto-generates this)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT (generate with: openssl rand -base64 32)
JWT_SECRET_KEY=your-32-char-random-string
JWT_ALGORITHM=HS256

# LLM (get free key at https://openrouter.ai/keys)
LLM_PROVIDER=openrouter
LLM_MODEL=xiaomi/mimo-v2-flash:free
LLM_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_API_KEY=your-api-key

# API Settings
API_HOST=0.0.0.0
API_PORT=8000
ENV=production
DEBUG=false

# CORS (update after Vercel deployment)
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### 1.5 Deploy & Get URL

1. Railway auto-deploys (wait 2-5 minutes)
2. **Settings** → **Networking** → **Generate Domain**
3. Copy URL: `https://your-app.up.railway.app`
4. **Save this URL** for frontend config

### 1.6 Run Migrations

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link
railway login
railway link

# Run migrations
railway run alembic upgrade head
```

### 1.7 Verify

Visit: `https://your-app.up.railway.app/health`

Should see: `{"status":"healthy"}`

---

## Step 2: Deploy Frontend to Vercel (5 mins)

### 2.1 Create Vercel Project

1. Go to https://vercel.com → Sign in with GitHub
2. **Add New** → **Project**
3. Import your `phase-4` repository

### 2.2 Configure Build

- **Framework**: Next.js (auto-detected)
- **Root Directory**: `frontend`
- Leave build commands as defaults

### 2.3 Add Environment Variables

In "Environment Variables" section:

```bash
# Your Railway backend URL from Step 1.5
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app

# Auth secret (same as in frontend/.env.local)
BETTER_AUTH_SECRET=CzkwMM4kba6uzC8l7Z9HtfRZNHFS9T26
```

### 2.4 Deploy & Get URL

1. Click **Deploy** (wait 1-3 minutes)
2. Copy Vercel URL: `https://your-project.vercel.app`
3. **Save this URL** for CORS config

---

## Step 3: Update CORS (1 min)

### 3.1 Update Backend CORS

1. Go back to **Railway** → Backend service → **Variables**
2. Edit `ALLOWED_ORIGINS`:
   ```bash
   ALLOWED_ORIGINS=https://your-project.vercel.app
   ```
3. Railway auto-redeploys

---

## Step 4: Verify Deployment (2 mins)

1. Visit your Vercel URL
2. Test:
   - Login → redirects to `/todos`
   - Create task at `/todos/new`
   - View dashboard at `/dashboard`
   - Toggle/edit/delete tasks
   - Chat widget (if enabled)

---

## Troubleshooting

**CORS errors?**
- Check `ALLOWED_ORIGINS` in Railway matches Vercel URL exactly
- No trailing slashes in URLs

**API not connecting?**
- Verify `NEXT_PUBLIC_API_URL` in Vercel matches Railway URL
- Check Railway backend health endpoint

**Database errors?**
- Verify migrations ran: `railway run alembic upgrade head`
- Check `DATABASE_URL` variable exists in Railway

**Build failures?**
- Frontend: Check Vercel deployment logs
- Backend: Check Railway deployment logs

---

## Environment Variable Reference

### Backend (Railway)

| Variable | Example | How to Get |
|----------|---------|------------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Auto-created by Railway |
| `JWT_SECRET_KEY` | Random 32+ chars | `openssl rand -base64 32` |
| `OPENROUTER_API_KEY` | `sk-or-v1-...` | https://openrouter.ai/keys |
| `ALLOWED_ORIGINS` | `https://app.vercel.app` | Your Vercel URL |

### Frontend (Vercel)

| Variable | Example | How to Get |
|----------|---------|------------|
| `NEXT_PUBLIC_API_URL` | `https://api.railway.app` | Your Railway URL |
| `BETTER_AUTH_SECRET` | From `.env.local` | See `frontend/.env.local` |

---

## Cost Estimate

- **Railway**: $0-20/month (free tier available, usage-based)
- **Vercel**: $0 (Hobby tier) or $20/month (Pro for commercial)
- **Total**: $0-40/month for low to medium traffic

---

## Next Steps

1. Add custom domains (optional)
2. Set up monitoring
3. Configure database backups
4. Implement Better Auth for production
5. Add automated tests

---

## Need More Details?

See the full deployment guide: `DEPLOYMENT.md`

## Support

- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs
- Issues: GitHub repository
