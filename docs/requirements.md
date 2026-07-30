# System Requirements & Functional Specifications

## 1. User Roles & Capabilities

### 1.1 Unauthenticated Visitor
* Browse the public feed of active, published blog posts.
* Search posts by title, author name, or tag keywords.
* Filter feed dynamically by genre tags (e.g., *Artificial Intelligence*, *Information Technology*, *Agriculture*).
* Click cards to navigate to student blogs in a new browser tab (`target="_blank"`).

### 1.2 Registered Student
* **Authentication:** Register and log in using unique username and password credentials.
* **Profile Management:** View a personal dashboard containing all submitted links and their publication status.
* **Submission Workflow:** 
  * Paste a URL to submit a blog post.
  * Enter or override the post **Title** and **Thumbnail Image URL**.
  * Attach single or multiple **Genre Tags** with real-time suggestion/autocomplete support.
* **Post Management:** Edit target URLs, titles, images, or genre tags, and delete personal submissions.

### 1.3 Administrator (Admin)
* **All Student Capabilities:** Full permissions to create and manage personal posts.
* **Content Moderation:** Toggle `isPublished` status on any student post or delete problematic posts.
* **Automated Link Health Check:** Trigger batch HTTP verification on all database links to detect 404/500 errors or connection timeouts.
* **User Management:** Ability to revoke user posting access or delete accounts if necessary.

## 2. Non-Functional Requirements

### 2.1 Performance
* Open Graph scraping must time out within **4.0 seconds** to prevent API blocking when student overrides are not provided.
* Tag autocomplete queries must return matching suggestions within **100ms**.
* Health check requests must be non-blocking and execute asynchronously or with strict per-link timeouts (3.0s).

### 2.2 Security
* Passwords must be hashed using `bcryptjs` with a minimum salt factor of 10.
* State management must utilize signed JSON Web Tokens (JWT) with HTTP-only cookies or secure headers.
* API endpoints performing write/delete/admin actions must enforce middleware-level role authorization checks.
* Sanitize all user-input strings (titles, image URLs, tags) and scraped content to prevent stored XSS attacks.

### 2.3 Reliability & Fallbacks
* If a student leaves title or thumbnail fields blank during submission, default to scraped Open Graph metadata or fallback generic assets.
* Non-HTTPS preview thumbnails must be sanitized or mapped to fallback HTTPS placeholders to prevent mixed-content browser warnings.