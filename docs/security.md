# Security Architecture & Data Protection Guidelines

This document details the security posture, authentication scheme, data handling standards, and defensive controls for the Student Blog Showcase Hub.

---

## 1. Authentication & Password Security

* **Hashing Algorithm:** Passwords must be hashed using `bcrypt` prior to database persistence.
* **Salt Factor:** A cost factor (work factor) of 10 to 12 must be used.
* **Policy Constraints:**
  * Minimum password length: 8 characters.
  * Cleartext passwords must never be logged, cached, stored, or returned in API payloads.

---

## 2. JWT Authentication & Authorization Architecture

* **Token Delivery:** Issued upon successful authentication (`/api/auth/login`) **only when `verificationStatus === "approved"`**. Registration (`/api/auth/register`) does not issue a token.
* **Claims Payload:** Include essential claims only (`userId`, `role`). Exclude passwords, personal identity data, `studentId`, and `verificationStatus`.
* **Validation:** Verified via middleware on all protected routes:
  * `authenticate`: Checks token validity and expiration.
  * `authorizeRoles(...roles)`: Verifies role checks (e.g., Admin vs. Student).
* **Storage Recommendation:** JWTs must be managed securely on the frontend (stored securely in memory or HTTP-only cookies where applicable) to reduce XSS token theft risks.

---

## 3. IDSC Student Identity Verification

* **Scope:** The platform is restricted exclusively to IDSC students. Open self-registration is not permitted.
* **Mechanism:** Manual administrator review. No OAuth, no email domain validation.
* **Registration Flow Gate:**
  * All new student accounts are created with `verificationStatus = "pending"`.
  * JWT tokens are **never issued** for `pending` or `rejected` accounts.
  * The backend login endpoint (`POST /auth/login`) must check `verificationStatus` **after** password verification passes. If not `approved`, respond with appropriate 403 error codes (`ACCOUNT_PENDING_APPROVAL` or `ACCOUNT_REJECTED`).
* **Admin Verification Duties:** The administrator cross-references the submitted `fullName` and `studentId` against the official IDSC student roster before approving. This is the single identity assurance boundary for the platform.
* **Uniqueness Enforcement:** `studentId`, `username`, and `email` fields must each carry a `unique: true` MongoDB index. Duplicate registrations must be caught and communicated clearly to avoid confusion with pending accounts.
* **First Admin Bootstrap:** The initial admin account must be provisioned via a server-side seed script to bypass the pending queue. Admin accounts are exempt from `verificationStatus` gating.

---

## 3. Input Validation, XSS & Injection Defense

* **NoSQL Injection Defense:** All incoming request parameters (`req.body`, `req.query`, `req.params`) must be validated using schema-based validators (e.g., `express-validator`). Mongoose strict mode schema mapping prevents field injection.
* **XSS (Cross-Site Scripting) Defense:**
  * User inputs rendered on the React frontend must rely on standard JSX escaping mechanisms.
  * Metadata scraped from external sites (titles, descriptions) must be sanitized before presentation.
* **SSRF (Server-Side Request Forgery) Defense in Scraper:**
  * The backend URL scraper must validate incoming target URLs.
  * Disallow requests pointing to `localhost` (`127.0.0.1`), internal private networks (`10.0.0.0/8`, `192.168.0.0/16`), or cloud metadata IP endpoints.

---

## 4. HTTP Headers & CORS Strategy

* **Helmet Middleware:** Enforce secure HTTP headers via `helmet`:
  * `X-Content-Type-Options: nosniff`
  * `X-Frame-Options: DENY`
  * `Strict-Transport-Security` (HSTS enabled in production)
* **CORS Configuration:** Limit allowed origins exclusively to trusted application frontend deployments:
  ```javascript
  const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  };
  ```

---

## 5. Rate Limiting Recommendations

To protect the platform against Denial of Service (DoS) and brute-force credential attempts:

* **Auth Endpoints (`/api/auth/*`):** Maximum 10 requests per 15-minute window per IP.
* **General API Endpoints:** Maximum 100 requests per 15-minute window per IP using `express-rate-limit`.

---

## 6. Environment Variables & Secret Handling

* Secrets (JWT secrets, MongoDB connection URIs) must never be committed to Git.
* Include a `.env.example` file in repository roots containing blank keys for local configuration.
* Continuous Integration (CI) and deployment providers (Vercel, Render) inject values via platform environment settings.