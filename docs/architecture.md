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
  ├── Link Scraper Module (open-graph-scraper)
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
  1. Client sends `POST /api/v1/blogs` with `{ originalUrl, title?, thumbnail?, tags: [...] }`.
  2. Express validates URL syntax and sanitizes tag inputs.
  3. If title or thumbnail is missing, Express executes `open-graph-scraper` (4000ms timeout) to fill in missing metadata.
  4. Tags are normalized (lowercase/trimmed) and stored in MongoDB.
  5. Validated record is persisted in MongoDB and returned to the React client.