# Architectural Overview & Technology Stack

## 1. Stack Blueprint (MERN)
* **Frontend:** React.js (Client-Side Rendering) with `react-router-dom` for client routing.
* **Backend:** Node.js with Express framework for RESTful API services, server-side scraping, and tag querying.
* **Database:** MongoDB hosted on MongoDB Atlas, modeled via Mongoose ORM.
* **Authentication:** JWT (JSON Web Tokens) with local `bcryptjs` password encryption.

## 2. System Architecture Diagram

```text
[ React Client (Browser) ]
  ├── Tag Autocomplete & Search Bar
  ├── Blog Feed & 2-Step Submission Wizard
  ├── Pre-Submission Verification Layer (<FormReviewModal />)
  └── Auth Flow: Register -> Pre-Submit Review -> Pending Approval -> Login (on Approval)
       │
       │ HTTP / REST API (JSON)
       ▼
[ Node.js + Express API ]
  ├── Auth Middleware (JWT + verificationStatus Gate)
  ├── IDSC Student Verification Layer (Pending / Approve / Reject)
  ├── Tag Autocomplete & Filter Service
  ├── SSRF-Safe Link Scraper Engine (ssrfProtect + Cheerio)
  └── Link Health Verification Engine
       │                 │
       │ (Mongoose)      │ HTTP HEAD / GET Pings (3s Timeout)
       ▼                 ▼
[ MongoDB Atlas ]   [ External Student Blogs ]
 (Users / Posts)    (Vercel, Netlify, GitHub Pages)
```

## 3. Server-Side Link Processing & Tag Strategy
* **Scraping Separation:** To bypass browser Cross-Origin Resource Sharing (CORS) blocks, Open Graph fetching occurs exclusively on the Node.js backend.
* **Data Flow on Submission:**
  1. Client sends `POST /api/v1/blogs` with `{ targetUrl, title?, thumbnailUrl?, cloudinaryPublicId?, tags: [...] }`.
  2. Express validates URL syntax and sanitizes tag inputs.
  3. If title or thumbnail is missing, the backend runs pre-flight SSRF validation (`ssrfProtect.js`), resolving hostnames against blocked IPv4/IPv6 private ranges and manually validating redirect hops (`maxRedirects: 0`, 5000ms timeout).
  4. Cheerio parses Open Graph tags from safe responses.
  5. Tags are normalized (lowercase/trimmed) and stored in MongoDB.
  6. Validated record is persisted in MongoDB and returned to the React client.

## 4. Container Sleep & Cold Start Mitigation Topology
To manage Render free-tier container sleep latency (30–60+ seconds), the system implements a 2-tier mitigation topology:
* **Primary Defense (Infrastructure):** An external monitoring pinger issues a `GET /health` request every 14 minutes to maintain warm container instances. The `/health` route sits above authentication and rate-limiting middleware. See `docs/deployment.md` Section 2.4.
* **Fallback UX Defense (Client Layer):** In the event of a cold start, client data-fetching components manage a centralized progressive timer:
  * 0–3s: Standard pulse skeleton loader.
  * 3s+: Smoothly transitions to display an informative progressive status banner (`/src/components/ui/ServerStatusBanner.tsx`).
  * Axios client timeout configured to 45–60s for initial read operations to prevent premature request cancellation.
  * See `design/interaction-patterns.md` Section 7 for full specification.