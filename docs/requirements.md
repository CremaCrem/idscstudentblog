# System Requirements & Functional Specifications

## 1. User Roles & Capabilities

### 1.1 Unauthenticated Visitor
* Browse the public feed of active, published blog posts via an infinite scroll interface.
* Search posts by title, author name, or tag keywords.
* Filter feed dynamically by genre tags. The tag selection is dynamically populated from the database based on popularity (most used tags appear first).
* Filter feed by date ranges (e.g., "This Week", "This Month", "All Time").
* Click cards to navigate to student blogs in a new browser tab (`target="_blank"`).

### 1.2 Registered Student
* **Authentication:** Register and log in using unique username and password credentials.
* **Identity Verification:** Registration does **not** grant immediate access. Every student must submit their:
  * **Full Name** (legal name as registered with IDSC)
  * **Student ID Number** (unique IDSC-issued identifier)
  * **Username**, **Email**, and **Password**
* **Pre-Submission Review:**
  * **Registration Review:** Before dispatching the registration request, students must review a summary modal (`<FormReviewModal />`) displaying their entered Full Name, Student ID, Username, and Email (Password masked) to prevent typos that cause admin rejection.
  * **Blog Submission Preview:** Before saving a blog post link, the submission modal transitions to a Step 2 live `<Card />` preview screen allowing the student to inspect title, tags, and formatting.
* **Account Status:** After registration, the account is created with `verificationStatus = "pending"`. The student **cannot log in** until an administrator approves the account.
* **Login Gate:** A student who attempts to log in while `pending` or `rejected` receives a clear status message explaining their account state.
* **Profile Management:** View a personal dashboard containing all submitted links and their publication status (visible only after account approval).
* **Submission Workflow:** 
  * Paste a URL to submit a blog post.
  * Enter or override the post **Title** and **Thumbnail Image URL**.
  * Attach single or multiple **Genre Tags** with real-time suggestion/autocomplete support.
  * Review the live preview before final submission.
* **Post Management:** Edit target URLs, titles, images, or genre tags, and delete personal submissions (deletions require a `<ConfirmationModal />`).

### 1.3 Administrator (Admin)
* **All Student Capabilities:** Full permissions to create and manage personal posts.
* **Content Moderation:** Toggle `isPublished` status on any student post or delete problematic posts.
* **Automated Link Health Check:** Trigger batch HTTP verification on all database links to detect 404/500 errors or connection timeouts.
* **Student Identity Verification:** Review the pending registration queue and verify each student's **Full Name** and **Student ID Number** against the IDSC student roster.
  * **Approve** an account: Sets `verificationStatus = "approved"` and records `verifiedAt` and `verifiedBy`.
  * **Reject** an account: Sets `verificationStatus = "rejected"` and optionally records a reason.
  * **Delete** a rejected or erroneous registration to release the `studentId` and `email` for re-registration.
* **User Management:** Ability to revoke user posting access or delete accounts if necessary.

## 2. Non-Functional Requirements

### 2.1 Performance
* Open Graph scraping and SSRF pre-flight validation must time out within **5.0 seconds** (5000ms) to prevent API blocking when student overrides are not provided.
* Tag autocomplete queries must return matching suggestions within **100ms**.
* Health check requests must be non-blocking and execute asynchronously or with strict per-link timeouts (3.0s).
* Client HTTP requests must configure an extended network timeout threshold of **45 to 60 seconds** in `apiClient.ts` to accommodate backend container boot duration on Render free-tier cold starts.
* To optimize bandwidth, feed images must utilize native browser `loading="lazy"` attributes, and the feed itself must implement paginated batching and an `IntersectionObserver` to trigger infinite scroll dynamically.

### 2.2 Security & Compliance
* Passwords must be hashed using `bcryptjs` with a minimum salt factor of 10.
* State management must utilize signed JSON Web Tokens (JWT) with HTTP-only cookies or secure headers.
* API endpoints performing write/delete/admin actions must enforce middleware-level role authorization checks.
* Sanitize all user-input strings (titles, image URLs, tags) and scraped content to prevent stored XSS attacks.
* Require authoritative backend validation (`termsAccepted: true`) and record non-sensitive audit metadata (`termsAcceptedAt`, `termsVersion`) upon account creation. See `docs/legal-compliance.md`.

### 2.3 Reliability & Fallbacks
* If a student leaves title or thumbnail fields blank during submission, default to scraped Open Graph metadata or fallback generic assets.
* Non-HTTPS preview thumbnails must be sanitized or mapped to fallback HTTPS placeholders to prevent mixed-content browser warnings.

### 2.4 Identity Verification
* The platform is restricted exclusively to Infotech Development Systems College (IDSC) students.
* No institutional email addresses are available for automated email-domain verification; verification is manual.
* OAuth is not used. Verification is performed entirely by the administrator against the IDSC student roster.
* Expected user count: approximately 100 students. Manual verification is an acceptable and deliberate design choice at this scale.

### 2.5 Mobile Responsiveness & Touch Accessibility
* The application UI must be fully functional and usable on viewports ranging from 320px to 768px+ (smartphones, tablets, desktops).
* Mobile navigation links must be accessible via a collapsible menu drawer toggle on `< md` screens.
* Interactive buttons, links, checkboxes, and close icons must maintain a minimum touch tap target of 44×44px.
* Administrative data tables and legal policies must present responsive stacked card sub-views on mobile viewports (`block md:hidden`) to eliminate horizontal scroll overflow.
* Modals must constrain max-height (`max-h-[90vh]`) with vertical scrolling to accommodate soft virtual keyboards and landscape mobile viewports.