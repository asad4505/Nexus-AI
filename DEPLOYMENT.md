# 🚀 Nexus AI Deployment Guide

This guide walks you through deploying the **Nexus AI Backend on Render** and the **Nexus AI Frontend on Vercel**.

---

## 🏗️ Architecture Overview

```
                      ┌──────────────────────┐
                      │   Vercel Frontend    │
                      │  (Vite + React SPA)  │
                      └──────────┬───────────┘
                                 │
                   HTTPS / CORS  │ VITE_SERVER_URL
                                 ▼
                      ┌──────────────────────┐
                      │    Render Backend    │
                      │  (Gateway Port 8000) │
                      └──────────┬───────────┘
            ┌────────────────────┼────────────────────┐
            ▼                    ▼                    ▼
   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
   │  Auth Service   │  │  Chat Service   │  │  Agent Service  │
   │  (Port 8001)    │  │  (Port 8002)    │  │  (Port 8003)    │
   └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
            │                    │                    │
            └──────────┬─────────┴─────────┬──────────┘
                       ▼                   ▼
                ┌─────────────┐     ┌─────────────┐
                │ MongoDB Atlas│    │ Redis Cloud │
                │  Database   │     │  (Upstash)  │
                └─────────────┘     └─────────────┘
```

All 4 backend microservices (`gateway`, `auth`, `chat`, and `agent`) are orchestrated seamlessly inside a **single Render Web Service** using [`start-all.js`](file:///d:/Nexus%20AI/backend/start-all.js). This ensures:
- **100% Free-tier friendly**: Uses only 1 Render Web Service (saving hours and preventing sleep-cascading timeouts).
- **Zero latency**: Internal communication between Gateway and microservices happens via `localhost` loopback.
- **Maximum security**: Only the Gateway is exposed publicly to the internet.

---

## 📋 Prerequisites

1. A **GitHub account**
2. A **Render account** ([render.com](https://render.com))
3. A **Vercel account** ([vercel.com](https://vercel.com))
4. A **MongoDB Atlas cluster** ([mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
5. A **Redis instance** (We recommend free cloud Redis from [Upstash](https://upstash.com) or Render Key-Value)

---

## Step 1: Push Code to GitHub

Open PowerShell in the project root (`d:\Nexus AI`):

```powershell
# 1. Initialize git
git init

# 2. Stage all files (sensitive files like .env and serviceAccountKey.json are excluded by .gitignore)
git add .

# 3. Commit
git commit -m "Configure Nexus AI for Render and Vercel deployment"

# 4. Rename default branch to main
git branch -M main

# 5. Link your GitHub repository
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 6. Push to GitHub
git push -u origin main
```

---

## Step 2: Set Up Free Cloud Redis (Upstash)

The backend requires Redis for session management and rate limiting:

1. Sign up at [console.upstash.com](https://console.upstash.com).
2. Click **Create Database**.
3. Name it `nexus-redis`, select the region closest to your Render region, and click **Create**.
4. In the database dashboard, find **Connect to your database** and copy the **Node.js (ioredis)** connection string or the **`rediss://...`** URL:
   ```
   rediss://default:<password>@<endpoint>.upstash.io:6379
   ```
   *(Keep this URL handy for Step 3).*

---

## Step 3: Deploy Backend on Render

### Method A: Manual Setup (Recommended)

1. Go to [dashboard.render.com](https://dashboard.render.com) and click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the service settings:
   - **Name**: `nexus-ai-backend`
   - **Region**: Choose closest to you (e.g., Frankfurt, Singapore, Oregon)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm run install:all`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Expand **Advanced Settings**:
   - **Health Check Path**: `/health`
5. Under **Environment Variables**, add the following:

| Key | Example / Description |
|---|---|
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://<your-app>.vercel.app` *(temporary placeholder until Vercel is deployed, e.g. `*`)* |
| `REDIS_URL` | Your Upstash Redis URL (`rediss://...`) |
| `MONGODB_URI` | `mongodb+srv://<user>:<password>@cluster0.../nexus` |
| `FIREBASE_SERVICE_ACCOUNT` | Paste the **entire JSON string** of your `serviceAccountKey.json` |
| `GROQ_API_KEY` | Your Groq API key |
| `GOOGLE_API_KEY` | Your Google Gemini API key |
| `TAVILY_API_KEY` | Your Tavily Search API key |
| `OPENROUTER_API_KEY` | Your OpenRouter API key |
| `AWS_REGION` | e.g. `eu-north-1` |
| `AWS_ACCESS_KEY_ID` | Your AWS Access Key |
| `AWS_SECRET_KEY` | Your AWS Secret Key |
| `AWS_BUCKET_NAME` | Your AWS S3 Bucket Name |
| `QDRANT_API_KEY` | Your Qdrant API Key |
| `QDRANT_URL` | Your Qdrant Cluster URL |

6. Click **Create Web Service**.
7. Once deployment finishes, copy your Render Web Service URL (e.g. `https://nexus-ai-backend.onrender.com`).
   - You can test it by visiting: `https://nexus-ai-backend.onrender.com/health` in your browser. It should return `{"status":"ok", ...}`.

---

## Step 4: Deploy Frontend on Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard) and click **Add New...** -> **Project**.
2. Select your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`frontend`**
   - **Build Command**: `npm run build` (Default)
   - **Output Directory**: `dist` (Default)
4. Expand **Environment Variables** and add:

| Key | Value |
|---|---|
| `VITE_SERVER_URL` | Your Render Backend URL **without trailing slash** (e.g. `https://nexus-ai-backend.onrender.com`) |
| `VITE_FIREBASE_API_KEY` | Your Firebase Client API Key (e.g. `AIzaSyBO2seylNkM-FpejDLYOwNd9UzFcA5c3j0`) |
| `VITE_RAZORPAY_KEY_ID` | Your Razorpay Key ID *(if payment is used)* |

5. Click **Deploy**.
6. Once deployed, Vercel will give you a domain like `https://nexus-ai-frontend.vercel.app`.

---

## Step 5: Link Frontend & Backend Together

To finalize CORS configuration:
1. Copy your Vercel deployment URL (e.g. `https://nexus-ai-frontend.vercel.app`).
2. Go to **Render Dashboard** -> Your `nexus-ai-backend` service -> **Environment**.
3. Update `FRONTEND_URL` with your Vercel URL:
   ```
   FRONTEND_URL=https://nexus-ai-frontend.vercel.app
   ```
4. Click **Save Changes** (Render will automatically redeploy with the updated CORS origin).

---

## 🔍 Verification & Troubleshooting

1. **Verify Backend Health**:
   Visit `https://<your-render-app>.onrender.com/health` — should return `200 OK`.
2. **Verify Frontend**:
   Open `https://<your-vercel-app>.vercel.app` and test login and agent chat.
3. **CORS Issues**:
   Ensure `FRONTEND_URL` on Render has **no trailing slash** (e.g., `https://my-app.vercel.app`, NOT `https://my-app.vercel.app/`).
4. **Render Free Tier Cold Starts**:
   Render free web services spin down after 15 minutes of inactivity. The first request after sleep may take ~30-50 seconds to boot up.
