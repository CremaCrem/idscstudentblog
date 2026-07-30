# Deployment & Infrastructure Guide

This guide covers setup, environment parameters, build processes, and deployment execution across local development, Vercel (Frontend), Render (Backend), and MongoDB Atlas (Database).

---

## Environment Variables Configuration

### Frontend Environment Variables (`frontend/.env.local`)

| Variable | Description | Example / Allowed Values |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Fully qualified base URL of the Render backend. | `https://student-blog-api.onrender.com/api` |

### Backend Environment Variables (`backend/.env`)

| Variable | Description | Example / Allowed Values |
| :--- | :--- | :--- |
| `NODE_ENV` | Application execution environment. | `production` / `development` |
| `PORT` | HTTP server port. | `5000` |
| `MONGODB_URI` | MongoDB Atlas TLS connection string. | `mongodb+srv://<user>:<pwd>@cluster.mongodb.net/hub` |
| `JWT_SECRET` | Cryptographic secret for JWT signing. | `[Strong 64-character random string]` |
| `JWT_EXPIRES_IN` | Validity window for issued access tokens. | `1d` or `7d` |
| `ALLOWED_ORIGIN` | Allowed client origin for CORS header matching. | `https://student-blog-hub.vercel.app` |

---

## Local Development Setup

### 1. Clone & Install Dependencies

```bash
# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

### 2. Configure Local Environment Files

* **Backend:** Create `backend/.env` based on `backend/.env.example`.
* **Frontend:** Create `frontend/.env.local` setting:
  ```env
  VITE_API_BASE_URL=http://localhost:5000/api
  ```

### 3. Run Concurrent Local Services

```bash
# Start backend (Port 5000)
cd backend
npm run dev

# Start frontend (Port 5173)
cd frontend
npm run dev
```

---

## Production Deployment Workflow

### 1. Database Setup: MongoDB Atlas

1. **Create Cluster:** Set up a dedicated MongoDB Atlas Cluster.
2. **Configure Database Access:** Create a dedicated database user with read/write roles for the application database.
3. **Configure Network Access:** Add Render's IP outbound ranges or allow access (`0.0.0.0/0`) with user password constraints enabled.
4. **Retrieve Connection String:** Copy the standard MongoDB SRV connection string.

### 2. Backend Deployment: Render

1. **Connect Repository:** Link the GitHub repository to a new Render Web Service.
2. **Configure Settings:**
   * **Environment:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `node server.js` or `npm start`
3. **Configure Environment Secrets:** Populate `NODE_ENV`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `ALLOWED_ORIGIN`.

### 3. Frontend Deployment: Vercel

1. **Import Repository:** Import the repository into the Vercel Dashboard.
2. **Select Framework Preset:** `Vite`
3. **Set Root Directory:** `frontend` (if a monorepo structure is configured).
4. **Build and Output Settings:**
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
5. **Configure Environment Variable:** Add `VITE_API_BASE_URL` pointing to the live Render backend host.

---

## Deployment Verification Checklist

- [ ] MongoDB Atlas cluster is accessible and TLS is active.
- [ ] Environment secrets properly set across Vercel and Render dashboards.
- [ ] CORS `ALLOWED_ORIGIN` matches the live Vercel domain exactly.
- [ ] API routes return proper JSON headers and structured errors.
- [ ] SPA routing fallback configuration verified on Vercel (`vercel.json` rewrites for React Router).

---

## Rollback Considerations

* **Frontend:** Utilize Vercel's instantaneous rollback feature to redeploy previous immutable build artifacts.
* **Backend:** Revert to the prior deployment commit directly via the Render deployment history tab.
* **Database:** Ensure Point-in-Time Recovery (PITR) backups are enabled within MongoDB Atlas prior to executing schema migrations or major updates.