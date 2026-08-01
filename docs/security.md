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
* **Fail-Fast Environment Enforcement:** `server/src/utils/jwt.js` performs a mandatory startup check. If `JWT_SECRET` is missing from the environment, the server immediately throws a fatal exception and refuses to start.
* **Standing Policy on Secrets:** **No secret, private key, or credential may ever have a hardcoded fallback value in application code, under any file or circumstance.** If a secret environment variable is missing, the application must fail fast.

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
* **Strict Role Assignment & Non-Trust Rule:**
  * **Client-supplied `role` fields are never trusted, anywhere in the codebase.**
  * Self-registration (`POST /api/v1/auth/register`) hardcodes `role: 'student'` inside `authService.js`. The input validator (`authValidator.js`) does not accept a `role` parameter.
  * **Standing Architecture Rule:** No endpoint may allow a user to set or mutate their own `role` or any other user's `role` except through an explicit, dedicated, admin-only route guarded by `authorizeRoles('admin')`.

---

## 4. Input Validation, XSS & Injection Defense

* **NoSQL Injection Defense:** All incoming request parameters (`req.body`, `req.query`, `req.params`) must be validated using schema-based validators (e.g., `express-validator`). Mongoose strict mode schema mapping prevents field injection.
* **XSS (Cross-Site Scripting) Defense:**
  * User inputs rendered on the React frontend must rely on standard JSX escaping mechanisms.
  * Metadata scraped from external sites (titles, descriptions) must be sanitized before presentation.
* **SSRF (Server-Side Request Forgery) Defense Engine:**
  * The backend URL scraper (`server/src/services/scraperService.js`) routes all external link pings through pre-flight validation (`server/src/utils/ssrfProtect.js`).
  * **Protocol Whitelist:** Only `http:` and `https:` schemes are permitted. Schemes such as `file:`, `ftp:`, `gopher:`, or `data:` are rejected immediately.
  * **Comprehensive IPv4 CIDR Blocklist:** Pre-flight DNS resolution evaluates resolved IP addresses against 11 private/reserved IPv4 CIDR ranges:
    * `0.0.0.0/8` (This network), `10.0.0.0/8` (Private A), `100.64.0.0/10` (CGNAT), `127.0.0.0/8` (Loopback), `169.254.0.0/16` (Link-Local / AWS Metadata), `172.16.0.0/12` (Private B), `192.0.0.0/24` (IETF Assignment), `192.168.0.0/16` (Private C), `198.18.0.0/15` (Benchmarking), `224.0.0.0/4` (Multicast), `240.0.0.0/4` (Reserved).
  * **IPv6 & IPv4-Mapped IPv6 Handling:** Explicitly blocks IPv6 loopback (`::1`), link-local (`fe80::/10`), unique-local (`fc00::/7`), multicast (`ff00::/8`), and IPv4-mapped IPv6 literals (`::ffff:x.x.x.x`).
  * **Per-Hop Manual Redirect Validation:** Axios automatic redirects are disabled (`maxRedirects: 0`). The scraper manually intercepts `3xx` `Location` headers and re-runs full DNS pre-flight validation against every redirect target before following (up to 5 hops, 5000ms timeout).
  * **Known Residual Limitation (TOCTOU):** A Time-of-Check to Time-of-Use (TOCTOU) race window exists between our pre-flight DNS check in `validateUrlForSsrf` and Axios's subsequent socket connection DNS resolution. This DNS rebinding risk is acknowledged and accepted given the platform's current scale and threat model.

---

## 5. HTTP Headers & CORS Strategy

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

## 6. Rate Limiting Recommendations

To protect the platform against Denial of Service (DoS) and brute-force credential attempts:

* **Auth Endpoints (`/api/auth/*`):** Maximum 10 requests per 15-minute window per IP.
* **General API Endpoints:** Maximum 100 requests per 15-minute window per IP using `express-rate-limit`.

---

## 7. Environment Variables & Secret Handling

* Secrets (JWT secrets, MongoDB connection URIs) must never be committed to Git.
* Include a `.env.example` file in repository roots containing blank keys for local configuration.
* Continuous Integration (CI) and deployment providers (Vercel, Render) inject values via platform environment settings.