# Legal Compliance & Terms Acceptance Specification

This document serves as the canonical specification for legal compliance, Privacy Policy, and Terms of Use enforcement within **IDSC Pulse**.

---

## 1. Regulatory & Institutional Context

IDSC Pulse is a non-commercial, internal academic directory application built exclusively for students of **Infotech Development Systems College (IDSC)** in Ligao City, Albay. The system operates on a small scale (~100 students) and stores only metadata and canonical web links pointing to student-hosted portfolios and articles.

To ensure institutional transparency, protect student intellectual property rights, and comply with standard web data privacy principles, IDSC Pulse requires explicit legal agreement during student registration.

---

## 2. Terms Acceptance Flow

Registration requires explicit, mandatory consent before an account application can be submitted.

```text
[ Registration Form (/register) ]
    │
    ├─> Student inputs: Full Name, Student ID, Username, Email, Password
    │
    ├─> Mandatory Checkbox: 
    │   [x] "I have read and agree to the Terms of Use and Privacy Policy"
    │       ├── "Terms of Use" links to /terms (opens in new tab or overlay modal)
    │       └── "Privacy Policy" links to /privacy (opens in new tab or overlay modal)
    │
    ├─> Pre-Submission Trigger: "Review Details" button is disabled until checkbox is checked
    │
    ▼
[ Pre-Submission Modal (<FormReviewModal />) ]
    ├─> Summary Table: Displays Full Name, Student ID, Username, Email (Masked Password)
    ├─> Legal Acceptance Badge: "✔ Agreed to Privacy Policy & Terms of Use (v1.0)"
    │
    └─> Click "Confirm & Submit" -> POST /api/v1/auth/register { ..., termsAccepted: true }
```

### Key Flow Principles
1. **Form State Protection:** Clicking `/privacy` or `/terms` links opens the documents in a new browser tab (`target="_blank"`) or inside an overlay modal. Under no circumstances may navigating to policy documents clear or reset entered form inputs.
2. **UX vs. Enforcement Separation:** Checking the frontend checkbox enables form submission, but backend validation (`authValidator.js`) is the single authoritative gatekeeper enforcing legal consent.

---

## 3. Backend Enforcement Architecture

The backend API contract (`POST /api/v1/auth/register`) strictly requires `termsAccepted: true` in the request body.

### Validation Logic (`authValidator.js`)
- If `termsAccepted` is `false`, `null`, `undefined`, or not a boolean `true`, the validator immediately halts processing and returns a `400 Bad Request` response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "You must accept the Privacy Policy and Terms of Use to register."
  }
}
```

### Persistence Logic (`authService.js`)
Upon passing validation, `authService.registerUser()` attaches audit metadata to the new user record:
- `termsAcceptedAt`: Set to current timestamp (`new Date()`).
- `termsVersion`: Set to `'1.0'` (or current active version string).

---

## 4. Database Schema & Audit Metadata

Legal consent is recorded as non-sensitive audit metadata directly on the `User` document in MongoDB (`User.js`):

```javascript
// --- Legal & Terms Acceptance Fields ---
termsAcceptedAt: {
  type: Date,
  required: [true, 'Terms acceptance timestamp is required'],
  default: Date.now
},
termsVersion: {
  type: String,
  required: true,
  default: '1.0'
}
```

### Visibility & Exposure Rules
- **Non-Sensitive Audit Data:** `termsAcceptedAt` and `termsVersion` are accessible to the account owner via `GET /api/v1/auth/me` and to administrators via `GET /api/v1/admin/users/pending`.
- **Public Masking:** These fields are strictly omitted from public endpoints (`GET /api/v1/blogs`).

---

## 5. Summary of Policy Documents

Two dedicated static public routes present the legal documents for unauthenticated visitors and registering students:

### 5.1 Privacy Policy (`/privacy`)
The Privacy Policy explicitly outlines data practices as documented in the system's Legal Specification:
- **Personal Data Collected:** Full Name, Student ID Number, Username, Email Address, bcrypt-hashed Password, submitted blog URLs/metadata, and uploaded thumbnail images.
- **Data Processing Purposes:**
  1. Student Identity Verification: Submitted name and student ID are reviewed exclusively by administrators against the official IDSC student roster.
  2. Directory Feed Display: Usernames and submitted blog metadata are presented publicly in the platform directory.
  3. Automated Link Health Checks: Submitted URLs are pinged periodically to verify reachability and flag broken links.
- **Third-Party Infrastructure Services:** Explains data hosting on MongoDB Atlas (database), Render (backend API), Vercel/Netlify (frontend SPA), and Cloudinary (thumbnail image storage/CDN).
- **Cookie & Storage Policy:** Clarifies that no tracking, advertising, or third-party cookies are used. Explains that authentication tokens are stored locally in the browser (`localStorage` / HTTP-only cookie).

### 5.2 Terms of Use (`/terms`)
The Terms of Use governs platform participation:
- **Student Eligibility:** Access is restricted exclusively to currently enrolled students of Infotech Development Systems College (IDSC).
- **Content Ownership & Intellectual Property:** Students retain 100% full ownership of their externally hosted blog posts and portfolios. IDSC Pulse stores only index metadata and links; it does not host, claim ownership of, or license student articles.
- **Directory Indexing Consent:** By submitting a link, students grant IDSC Pulse permission to index metadata, generate card previews, and perform automated link health checks.
- **Prohibited Submissions:** Users may not submit URLs pointing to malicious code, phishing pages, internal/private IP addresses (SSRF targets), or content violating IDSC institutional policies.
- **Moderation & Removal Rights:** System administrators reserve the right to unpublish posts, reject pending account applications, or delete user accounts violating platform terms.

---

## 6. Scope & Account Legacy Policy

- **Legacy Accounts:** Accounts registered prior to the implementation of this feature retain their existing status. No forced retroactive re-acceptance or database migration is required for this phase.
- **Policy Version Updates:** If major revisions to `/terms` or `/privacy` occur in future phases, `termsVersion` will be incremented (e.g. `'2.0'`), and re-acceptance logic may be introduced.
