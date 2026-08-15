# API Interface & REST Contract

Base API Route: `/api/v1`

## 1. Authentication Endpoints

### `POST /auth/register`
* **Access:** Public
* **Payload:**
  ```json
  {
    "fullName": "Juan dela Cruz",
    "studentId": "2021-00123",
    "username": "student_dev",
    "email": "student@example.com",
    "password": "securepassword123",
    "termsAccepted": true
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registration submitted successfully. Your account is pending admin approval.",
    "data": { "status": "pending" }
  }
  ```
* **Behavior:** Creates the user account with `verificationStatus = "pending"`. Records `termsAcceptedAt` timestamp and `termsVersion` ('1.0') in MongoDB (see `docs/legal-compliance.md`). **Does not issue a JWT token.** The student cannot log in until an admin approves the account.
* **Error (400 Bad Request):** If mandatory fields are missing, invalid, or `termsAccepted` is not boolean `true`:
  ```json
  {
    "success": false,
    "error": { "code": "VALIDATION_ERROR", "message": "You must accept the Privacy Policy and Terms of Use to register." }
  }
  ```
* **Error (409 Conflict):** If `username`, `email`, or `studentId` already exists:
  ```json
  {
    "success": false,
    "error": { "code": "DUPLICATE_FIELD", "message": "Student ID already registered. If you recently submitted a registration, your account is pending admin review." }
  }
  ```

### `POST /auth/login`
* **Access:** Public
* **Payload:** `{ "username": "student_dev", "password": "securepassword123" }`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": { "id": "64f1...", "username": "student_dev", "role": "student" }
  }
  ```
* **Error — Account Pending (403 Forbidden):**
  ```json
  {
    "success": false,
    "error": { "code": "ACCOUNT_PENDING_APPROVAL", "message": "Your account is pending administrator verification. Please wait for approval before logging in." }
  }
  ```
* **Error — Account Rejected (403 Forbidden):**
  ```json
  {
    "success": false,
    "error": { "code": "ACCOUNT_REJECTED", "message": "Your registration was not approved. Please contact the IDSC administrator for more information." }
  }
  ```

---

## 2. Blog Posts & Tags Endpoints

### `GET /blogs`
* **Access:** Public
* **Query Params:** `tag`, `page`, `limit`, `dateFrom`, `dateTo`
* **Example Route:** `/api/v1/blogs?tag=Artificial+Intelligence&dateFrom=2026-08-01T00:00:00.000Z`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "64f2...",
        "authorId": { "_id": "64f1...", "username": "student_dev" },
        "targetUrl": "https://student-portfolio.vercel.app/ai-project",
        "title": "Building an AI Image Classifier",
        "thumbnailUrl": "https://student-portfolio.vercel.app/og.png",
        "tags": ["artificial intelligence", "information technology"],
        "isPublished": true,
        "isScrapedFallback": false,
        "lastHealthCheckStatus": "healthy",
        "httpStatusCode": 200,
        "lastCheckedAt": "2026-07-30T10:00:00.000Z",
        "createdAt": "2026-07-30T10:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 12,
      "totalPages": 1
    }
  }
  ```

### `POST /blogs`
* **Access:** Authenticated (Student / Admin)
* **Headers:** `Authorization: Bearer <token>`
* **Payload:** 
  ```json
  {
    "targetUrl": "https://student-portfolio.vercel.app/ai-project",
    "title": "Building an AI Image Classifier",
    "thumbnailUrl": "https://res.cloudinary.com/idsc/image/upload/v1722400000/thumbnails/sample.webp",
    "cloudinaryPublicId": "thumbnails/sample",
    "tags": ["Artificial Intelligence", "Information Technology", "Agriculture"]
  }
  ```
* **Response (201 Created):** Returns created post document.
* **Error (400 Bad Request):** If URL syntax is invalid or resolves to a blocked private/reserved IP (SSRF):
  ```json
  {
    "success": false,
    "error": { "code": "SSRF_BLOCKED", "message": "The requested URL resolves to a restricted internal network address." }
  }
  ```

### `POST /upload/thumbnail`
* **Access:** Authenticated (Student / Admin)
* **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
* **Form Field:** `file` (Image binary file, max size: 5MB, allowed formats: PNG, JPG, WEBP)
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "url": "https://res.cloudinary.com/idsc/image/upload/v1722400000/thumbnails/sample.webp",
      "publicId": "thumbnails/sample"
    }
  }
  ```
* **Error (400 Bad Request):** If file size exceeds 5MB or invalid file format:
  ```json
  {
    "success": false,
    "error": { "code": "INVALID_FILE", "message": "File exceeds 5MB limit or is not an allowed image format (PNG, JPG, WEBP)." }
  }
  ```

### `GET /tags/suggestions`
* **Access:** Public
* **Query Params:** `q` (search query string)
* **Example Route:** `/api/v1/tags/suggestions?q=agri`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "suggestions": ["Agriculture", "AgriTech"]
  }
  ```

### `GET /tags/popular`
* **Access:** Public
* **Query Params:** `limit` (default: 10)
* **Example Route:** `/api/v1/tags/popular?limit=15`
* **Description:** Returns the most frequently used tags, sorted by usage count descending. Used to populate the dynamic TagFilterBar. Future implementation should restrict this to counting only tags from *published* blog posts.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": ["Information Technology", "Artificial Intelligence", "Web Development"]
  }
  ```

---

## 3. Administrator Endpoints

### `PATCH /admin/blogs/:id/publish`
* **Access:** Admin Only
* **Payload:** `{}`
* **Response (200 OK):** Returns updated post object with toggled `isPublished` status.

### `POST /admin/health-scan`
* **Access:** Admin Only
* **Payload:** None
* **Description:** Triggers an asynchronous background batch scan of all active target URLs.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Health scan started in the background."
  }
  ```

### `POST /admin/blogs/:id/health-check`
* **Access:** Admin Only
* **Payload:** None
* **Description:** Performs an immediate health check ping on a single blog post's target URL.
* **Response (200 OK):** Returns updated blog post object with updated `lastHealthCheckStatus`, `httpStatusCode`, and `lastCheckedAt`.

---

## 4. Student Verification Endpoints (Admin Only)

### `GET /admin/users/pending`
* **Access:** Admin Only
* **Description:** Returns a list of all users with `verificationStatus = "pending"`, sorted oldest-first to support a first-in-first-out review queue.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "64f3...",
        "fullName": "Juan dela Cruz",
        "studentId": "2021-00123",
        "username": "student_dev",
        "email": "student@example.com",
        "verificationStatus": "pending",
        "createdAt": "2026-07-31T12:00:00.000Z"
      }
    ]
  }
  ```

### `PATCH /admin/users/:id/approve`
* **Access:** Admin Only
* **Payload:** None
* **Description:** Sets the user's `verificationStatus` to `"approved"`, records `verifiedBy = adminUserId`, and sets `verifiedAt` to the current timestamp. After this, the student may log in.
* **Response (200 OK):** Returns updated user object with `verificationStatus: "approved"`.

### `PATCH /admin/users/:id/reject`
* **Access:** Admin Only
* **Payload:** `{ "rejectionReason": "Student ID not found in IDSC roster." }` *(optional)*
* **Description:** Sets the user's `verificationStatus` to `"rejected"` and records the optional rejection reason. The student's `studentId` and `email` remain locked until the admin deletes the account.
* **Response (200 OK):** Returns updated user object with `verificationStatus: "rejected"`.

### `DELETE /admin/users/:id`
* **Access:** Admin Only
* **Description:** Permanently deletes a user account. Intended for rejected or erroneous registrations to allow the student to re-register with corrected details.
* **Response (200 OK):** `{ "success": true, "message": "User account deleted." }`