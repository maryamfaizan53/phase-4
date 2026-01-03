# Railway Backend Deployment - Step-by-Step Guide

Follow these exact steps to deploy your FastAPI backend to Railway.

---

## Step 1: Create Railway Account & Project (3 minutes)

### 1.1 Sign Up for Railway
1. Go to https://railway.app
2. Click **"Login"** or **"Start a New Project"**
3. Sign in with your **GitHub account**
4. Authorize Railway to access your GitHub

### 1.2 Create New Project
1. Click **"New Project"** button
2. Select **"Deploy from GitHub repo"**
3. You'll see a list of your repositories
4. Find and select **`phase-4`** (or `maryamfaizan53/phase-4`)
5. Click on it to import

---

## Step 2: Add PostgreSQL Database (2 minutes)

### 2.1 Add Database Service
1. In your Railway project dashboard, you'll see your backend service
2. Click the **"+ New"** button in the project
3. Select **"Database"**
4. Choose **"Add PostgreSQL"**
5. Railway will create a PostgreSQL database automatically

### 2.2 Verify Database Created
- You should now see TWO services in your project:
  - Your backend app (from GitHub)
  - PostgreSQL database
- The database will auto-generate a `DATABASE_URL` variable

---

## Step 3: Configure Backend Service (5 minutes)

### 3.1 Set Root Directory
1. Click on your **backend service** (not the database)
2. Go to **"Settings"** tab
3. Scroll to **"Root Directory"**
4. Click **"/"** to edit
5. Type: `backend`
6. Press Enter to save

### 3.2 Verify Dockerfile Detection
- Railway should automatically detect the `Dockerfile` in the `backend` directory
- You'll see "Docker" as the build method
- No additional configuration needed here

---

## Step 4: Set Environment Variables (5 minutes)

### 4.1 Go to Variables Tab
1. Still in your backend service (not database)
2. Click on **"Variables"** tab
3. You'll add multiple environment variables here

### 4.2 Add Required Variables

Click **"+ New Variable"** for each of these:

**DATABASE_URL** (Reference to PostgreSQL)
```
Variable name: DATABASE_URL
Value: ${{Postgres.DATABASE_URL}}
```
Note: This references the Railway PostgreSQL database you created

**JWT Configuration**
```
Variable name: JWT_SECRET_KEY
Value: e15c4146e3b3c6828c8aaf9338835fdd08a73160e284b105050fb2f3e4b0f5b4
```

```
Variable name: JWT_ALGORITHM
Value: HS256
```

**OpenAI API Key**
```
Variable name: OPENAI_API_KEY
Value: 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
```

**OpenRouter API Key**
```
Variable name: OPENROUTER_API_KEY
Value: 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
```

**LLM Configuration**
```
Variable name: LLM_PROVIDER
Value: openrouter
```

```
Variable name: LLM_MODEL
Value: xiaomi/mimo-v2-flash:free
```

```
Variable name: LLM_BASE_URL
Value: https://openrouter.ai/api/v1
```

**API Configuration**
```
Variable name: API_HOST
Value: 0.0.0.0
```

```
Variable name: API_PORT
Value: 8000
```

```
Variable name: ENV
Value: production
```

```
Variable name: DEBUG
Value: False
```

**CORS Configuration** (temporary - we'll update this after deployment)
```
Variable name: ALLOWED_ORIGINS
Value: http://localhost:3000
```

**Rate Limiting**
```
Variable name: RATE_LIMIT
Value: 100/minute
```

### 4.3 Verify All Variables
You should have **14 environment variables** total:
- ✅ DATABASE_URL
- ✅ JWT_SECRET_KEY
- ✅ JWT_ALGORITHM
- ✅ OPENAI_API_KEY
- ✅ OPENROUTER_API_KEY
- ✅ LLM_PROVIDER
- ✅ LLM_MODEL
- ✅ LLM_BASE_URL
- ✅ API_HOST
- ✅ API_PORT
- ✅ ENV
- ✅ DEBUG
- ✅ ALLOWED_ORIGINS
- ✅ RATE_LIMIT

---

## Step 5: Deploy Backend (3 minutes)

### 5.1 Trigger Deployment
1. Railway should automatically start deploying after you set the root directory
2. If not, go to **"Deployments"** tab
3. Click **"Deploy"** button

### 5.2 Monitor Deployment
1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. You'll see build logs in real-time
4. Wait for the build to complete (typically 2-5 minutes)
5. Look for messages like:
   - "Building Dockerfile"
   - "Successfully built"
   - "Deployment successful"

### 5.3 Check for Errors
- If build fails, check the logs for errors
- Common issues:
  - Missing dependencies in `requirements.txt`
  - Dockerfile errors
  - Missing environment variables

---

## Step 6: Get Your Railway Backend URL (1 minute)

### 6.1 Generate Public Domain
1. In your backend service, go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Railway will create a public URL like: `https://phase-4-production-xxxx.up.railway.app`

### 6.2 Save Your URL
**COPY THIS URL** - You'll need it for:
- Updating CORS settings
- Connecting your Vercel frontend

Example URL: `https://phase-4-production-a1b2.up.railway.app`

---

## Step 7: Verify Backend is Running (2 minutes)

### 7.1 Test Health Endpoint
1. Open a new browser tab
2. Go to: `https://your-railway-url.up.railway.app/health`
3. Replace `your-railway-url` with your actual Railway domain
4. You should see:
```json
{
  "status": "ok",
  "environment": "production",
  "service": "todo-ai-chatbot"
}
```

### 7.2 Test Root Endpoint
1. Go to: `https://your-railway-url.up.railway.app/`
2. You should see:
```json
{
  "message": "Welcome to Todo AI Chatbot API",
  "version": "0.1.0",
  "endpoints": { ... }
}
```

### 7.3 Check API Docs
1. Go to: `https://your-railway-url.up.railway.app/docs`
2. You should see the FastAPI interactive documentation (Swagger UI)

---

## Step 8: Run Database Migrations (3 minutes)

Your database needs to be initialized with the proper schema.

### 8.1 Install Railway CLI
Open your terminal and run:
```bash
npm install -g @railway/cli
```

### 8.2 Login to Railway
```bash
railway login
```
- This will open your browser
- Authorize the Railway CLI

### 8.3 Link to Your Project
```bash
# Navigate to your project directory
cd C:\Users\840 G7\Documents\GitHub\phase-4

# Link to Railway project
railway link
```
- Select your project from the list
- Select your backend service (not the database)

### 8.4 Run Migrations
```bash
# Run Alembic migrations
railway run alembic upgrade head
```

You should see output like:
```
INFO  [alembic.runtime.migration] Running upgrade -> xxxxx
INFO  [alembic.runtime.migration] Running upgrade xxxxx -> yyyyy
```

---

## Step 9: Update CORS Settings (2 minutes)

Now that you have both URLs, update CORS to allow your Vercel frontend.

### 9.1 Get Your Vercel URL
From your Vercel deployment, you should have a URL like:
- `https://phase-4-xyz123.vercel.app`

### 9.2 Update ALLOWED_ORIGINS in Railway
1. Go to Railway → Your backend service → **"Variables"**
2. Find **ALLOWED_ORIGINS** variable
3. Click to edit it
4. Update the value to include your Vercel URL:
```
https://your-vercel-url.vercel.app,http://localhost:3000
```
Replace `your-vercel-url` with your actual Vercel deployment URL

Example:
```
https://phase-4-xyz123.vercel.app,http://localhost:3000
```

5. Save the change
6. Railway will automatically redeploy (takes ~1 minute)

---

## Step 10: Update Vercel Frontend (2 minutes)

Connect your frontend to the Railway backend.

### 10.1 Update Vercel Environment Variable
1. Go to https://vercel.com/maryams-projects-5804c59d
2. Click on your **phase-4** project
3. Go to **"Settings"** → **"Environment Variables"**
4. Find **NEXT_PUBLIC_API_URL**
5. Click the three dots → **"Edit"**
6. Update the value to your Railway URL:
```
https://your-railway-url.up.railway.app
```

7. Click **"Save"**

### 10.2 Redeploy Frontend
1. Go to **"Deployments"** tab in Vercel
2. Click on the latest deployment
3. Click the three dots **"..."** menu
4. Select **"Redeploy"**
5. Click **"Redeploy"** to confirm
6. Wait for redeployment (1-2 minutes)

---

## Step 11: Final Verification (3 minutes)

### 11.1 Test Full Stack
1. Visit your Vercel frontend URL
2. Try to **login** (or create an account)
3. After login, go to `/todos/new`
4. Create a new task
5. Go to `/dashboard`
6. Verify:
   - KPIs display correctly
   - Charts show data
   - Task table shows your tasks
   - You can toggle/edit/delete tasks

### 11.2 Check Network Tab
1. Open browser DevTools (F12)
2. Go to **"Network"** tab
3. Perform an action (like creating a task)
4. Verify API calls are going to your Railway URL
5. Check for any CORS errors (there should be none)

### 11.3 Test Chat (if enabled)
1. Open the chat widget
2. Send a message
3. Verify you get a response from Claude

---

## Troubleshooting Common Issues

### Backend Build Fails
**Error**: "No such file or directory: requirements.txt"
**Solution**: Verify Root Directory is set to `backend`

**Error**: "python: not found"
**Solution**: Railway should use Python 3.11 automatically with Docker

### Database Connection Errors
**Error**: "could not connect to database"
**Solution**:
1. Check DATABASE_URL variable is set to `${{Postgres.DATABASE_URL}}`
2. Verify PostgreSQL service is running
3. Check Railway logs for connection errors

### CORS Errors in Frontend
**Error**: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Solution**:
1. Verify ALLOWED_ORIGINS includes your Vercel URL
2. Make sure there are no trailing slashes
3. Check Railway redeployed after changing the variable

### Migrations Not Applied
**Error**: "relation does not exist"
**Solution**:
1. Run: `railway run alembic upgrade head`
2. Check Railway logs for migration errors
3. Verify database connection is working

### Frontend Can't Connect to Backend
**Error**: "Failed to fetch" or "Network Error"
**Solution**:
1. Verify NEXT_PUBLIC_API_URL in Vercel is correct
2. Check Railway backend health endpoint is accessible
3. Redeploy Vercel after changing environment variables

---

## Success Checklist

✅ Railway project created
✅ PostgreSQL database added
✅ Backend service configured with root directory `backend`
✅ All 14 environment variables set
✅ Backend deployed successfully
✅ Public domain generated
✅ Health endpoint returns `{"status": "ok"}`
✅ Database migrations completed
✅ CORS updated with Vercel URL
✅ Vercel frontend updated with Railway URL
✅ Frontend can create/read/update/delete tasks
✅ Dashboard displays data correctly

---

## Your Deployment URLs

**Frontend (Vercel)**: https://_______________________.vercel.app

**Backend (Railway)**: https://_______________________.up.railway.app

**Database**: Railway PostgreSQL (managed automatically)

---

## Cost Estimate

**Railway**:
- Free tier: $5 credit/month
- PostgreSQL: ~$5-10/month (usage-based)
- Backend service: ~$5-10/month (usage-based)
- **Estimated**: $0-20/month depending on usage

**Total with Vercel**: $0-20/month (Vercel free tier for frontend)

---

## Next Steps After Deployment

1. ✅ Set up custom domain (optional)
2. ✅ Configure monitoring and alerts
3. ✅ Set up database backups (Railway Pro feature)
4. ✅ Add CI/CD pipeline with GitHub Actions
5. ✅ Implement proper authentication (Better Auth)
6. ✅ Add automated tests
7. ✅ Set up error tracking (Sentry)

---

## Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Vercel Docs**: https://vercel.com/docs
- **Project Issues**: GitHub repository

---

**Need help?** Check the full deployment guide in `DEPLOYMENT.md` or `DEPLOYMENT_QUICKSTART.md`
