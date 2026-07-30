# API Interface & REST Contract

Base API Route: `/api/v1`

## 1. Authentication Endpoints

### `POST /auth/register`
* **Access:** Public
* **Payload:** `{ "username": "student_dev", "password": "securepassword123" }`
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": { "id": "64f1...", "username": "student_dev", "role": "student" }
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

---

## 2. Blog Posts & Tags Endpoints

### `GET /blogs`
* **Access:** Public
* **Query Params:** `tag`, `search`, `page`, `limit`
* **Example Route:** `/api/v1/blogs?tag=Artificial+Intelligence`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 12,
    "data": [
      {
        "_id": "64f2...",
        "author": { "_id": "64f1...", "username": "student_dev" },
        "originalUrl": "https://student-portfolio.vercel.app/ai-project",
        "title": "Building an AI Image Classifier",
        "description": "A deep dive into neural networks.",
        "thumbnail": "https://student-portfolio.vercel.app/og.png",
        "tags": ["artificial intelligence", "information technology"],
        "isPublished": true,
        "isBroken": false,
        "createdAt": "2026-07-30T10:00:00.000Z"
      }
    ]
  }
  ```

### `POST /blogs`
* **Access:** Authenticated (Student / Admin)
* **Headers:** `Authorization: Bearer <token>`
* **Payload:** 
  ```json
  {
    "originalUrl": "https://student-portfolio.vercel.app/ai-project",
    "title": "Building an AI Image Classifier",
    "thumbnail": "https://student-portfolio.vercel.app/custom-cover.jpg",
    "tags": ["Artificial Intelligence", "Information Technology", "Agriculture"]
  }
  ```
* **Response (201 Created):** Returns created post document.

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

---

## 3. Administrator Endpoints

### `PATCH /admin/blogs/:id/toggle-publish`
* **Access:** Admin Only
* **Payload:** `{ "isPublished": false }`
* **Response (200 OK):** Returns updated post object.

### `POST /admin/health-check`
* **Access:** Admin Only
* **Payload:** None
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "scanned": 45,
    "brokenDetected": 2,
    "flaggedPostIds": ["64f21...", "64f22..."]
  }
  ```