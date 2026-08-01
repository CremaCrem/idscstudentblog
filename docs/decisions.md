# Architecture Decision Records (ADRs)

## ADR 01: Dynamic Tag Array with Lowercased Indexing
* **Status:** Approved
* **Context:** The platform requires genre-based categorization (e.g., Artificial Intelligence, Agriculture, IT) with real-time suggestions and filtering.
* **Decision:** Store tags as an array of lowercased strings (`tags: [String]`) inside each `BlogPost` document in MongoDB with multikey indexing.
* **Rationale:** Case-insensitive lowercased indexing ensures robust searching without duplicate tags like "Agriculture" and "agriculture", while keeping database schema ultra-lightweight.

## ADR 02: Hybrid Metadata Strategy (Custom Input + Open Graph Fallback)
* **Status:** Approved
* **Context:** Students requested the ability to directly set custom titles and images instead of strictly relying on auto-scraped metadata.
* **Decision:** Allow optional student input fields for `title` and `thumbnail`. Scrape Open Graph metadata only when these fields are left blank.
* **Rationale:** Gives students total creative control while retaining effortless auto-scraping as a fallback for simple submissions.

## ADR 03: Native Link Redirection over Direct Content Storage
* **Status:** Approved
* **Context:** The goal is to highlight student work without replicating full text, images, or assets locally.
* **Decision:** The platform acts strictly as a directory feed. All cards redirect users directly to the original hosted student URL via `target="_blank"`.
* **Rationale:** Keeps database requirements under ~10MB even for thousands of submissions, eliminates host liability for blog content, and ensures traffic flows directly to the students' own portfolios.

## ADR 04: Reusable React Confirmation Modal Replaces Browser-Native Dialogs
* **Status:** Approved
* **Context:** The initial implementation used `window.confirm()`, `window.prompt()`, and `window.alert()` for confirmation and input flows on destructive or state-altering actions (e.g., approving/rejecting students, deleting blog posts). These browser-native dialogs are unstyled, inaccessible, cannot be customized, break the application's design system, and block the JavaScript event loop.
* **Decision:** All confirmation, input, and alert interactions must use the project-wide `<ConfirmationModal />` React component. `window.confirm()`, `window.prompt()`, and `window.alert()` are permanently prohibited in application code.
* **Rationale:** A reusable React modal component enforces design consistency, is fully accessible (keyboard navigation, focus trap, ARIA attributes), supports loading states, provides a better user experience, and allows the rejection reason flow to be handled entirely within the application without context-breaking browser popups. This is consistent with the project's design principles of clarity, simplicity, and consistency.
* **Scope:** Applies to all current and future features. Any code that uses native browser dialogs for user interaction is classified as a bug and must be remediated. See `design/interaction-patterns.md` Section 4 for the full implementation specification.

## ADR 05: Separation of Action Confirmation Modals and Pre-Submission Review Modals
* **Status:** Approved
* **Context:** Pre-submission data verification (e.g. reviewing Student ID before registration, or previewing a blog card before publishing) serves a different UX purpose than post-action risk warnings (e.g. deleting a post or rejecting a student). Using a single modal type or stacking modals on top of existing modal windows creates UI anti-patterns (`z-index` collisions, multiple dark backdrops, focus trap deadlocks).
* **Decision:** 
  1. Action Confirmation (`<ConfirmationModal />`) is strictly restricted to post-action risk warnings, administrative state changes (Approve/Reject), and destructive actions.
  2. Pre-Submission Review for standalone page forms (e.g. Registration) must use the reusable `<FormReviewModal />` component, presenting a 2-column key-value summary with masked password fields.
  3. Pre-Submission Review for modal-based forms (e.g. Blog Submission) must use an internal 2-step wizard within the existing modal shell (`Step 1: Form Input` → `Step 2: Live Card Preview`). Stacking modals over existing modals is permanently prohibited.
* **Rationale:** Eliminates modal stacking bugs, guarantees password masking security, reduces administrative rejections due to mistyped IDs, and gives users total visual confidence before publishing. See `design/interaction-patterns.md` Section 6 for full technical specification.

## ADR 06: Server-Mediated Cloudinary Image Storage with Synchronous Sharp WebP Conversion
* **Status:** Approved
* **Context:** Thumbnail file uploads were previously read via `FileReader.readAsDataURL` on the client and stored directly in MongoDB as Base64 data URIs. Storing raw image data in database text fields bloats payload sizes, increases network latency, and degrades query performance. Furthermore, client-only validation allowed bypassable size and MIME type limits.
* **Decision:**
  1. Approve the addition of `cloudinary` and `sharp` server-side dependencies (exempt from the "no unapproved dependencies" policy).
  2. All custom image uploads must use a **signed, server-mediated flow** via `POST /api/v1/upload/thumbnail`. API keys and secrets reside strictly on the server; unsigned client-to-Cloudinary uploads are prohibited.
  3. The Node.js backend validates file size (max 5MB via Multer) and MIME type (PNG, JPG, WEBP), synchronously converts the image to optimized WebP format via Sharp within the request lifecycle, uploads the converted file to Cloudinary, and returns `{ url, publicId }`.
  4. The returned CDN URL is stored in `BlogPost.thumbnail` and `publicId` in `BlogPost.cloudinaryPublicId`.
  5. **Orphan Cleanup:** Replacing a thumbnail triggers `cloudinary.destroy(oldPublicId)` prior to record update. Deleting a blog post triggers a Mongoose post-delete hook calling `cloudinary.destroy(publicId)`. If upload succeeds on Cloudinary but the subsequent blog post creation fails, the resulting orphan is accepted as a known limitation for this project's scale (~100 posts, ~50 concurrent users) and will be cleaned manually via the Cloudinary Media Library.
* **Rationale:** Eliminates Base64 database bloat, enforces authoritative server-side file validation, ensures consistent WebP compression, avoids exposing Cloudinary credentials to the client, and keeps architecture simple without adding job queues or external cache layers.

## ADR 07: Fail-Fast Startup Enforcement for Environment Secrets
* **Status:** Approved (Applied: 2026-08-01)
* **Context:** A security audit revealed that `server/src/utils/jwt.js` contained a hardcoded fallback string for `JWT_SECRET`. If `JWT_SECRET` was unconfigured in production environment variables, the application silently degraded to signing tokens with a publicly exposed default key.
* **Decision:** Remove all hardcoded fallback secrets. Add a mandatory startup guard in `jwt.js` that throws a fatal error and prevents server boot if `JWT_SECRET` is undefined.
* **Vulnerability Closed:** Insecure default secret fallback / weak token signing vulnerability.
* **Rationale:** Enforces fail-fast behavior at startup, guaranteeing the application cannot execute in a dangerous unconfigured state.

## ADR 08: Server-Side Privilege Hardcoding & Role Self-Assignment Prohibition
* **Status:** Approved (Applied: 2026-08-01)
* **Context:** The registration validator (`authValidator.js`) permitted `role: 'admin'` in POST payloads, and `authService.js` persisted user-supplied `role` fields directly to MongoDB. A malicious client could register with `role: 'admin'` and bypass the student verification queue.
* **Decision:** 
  1. Remove `role` from input validation schemas during registration.
  2. Hardcode `role: 'student'` inside `authService.registerUser()`.
  3. Establish a permanent architecture rule: client-supplied `role` inputs are never trusted, and user roles may only be mutated via explicit, dedicated admin endpoints guarded by `authorizeRoles('admin')`.
* **Vulnerability Closed:** Self-assigned admin privilege escalation / IDOR at registration.
* **Rationale:** Completely eliminates self-privilege elevation vectors by enforcing server-side authority over user roles.

## ADR 09: Custom Multi-Layer SSRF Defense Engine with Per-Hop Redirect Validation
* **Status:** Approved (Applied: 2026-08-01)
* **Context:** The Open Graph link scraper (`POST /api/v1/blogs/scrape`) accepted user-supplied URLs and fetched them without host validation, exposing internal infrastructure, cloud metadata endpoints (`169.254.169.254`), and loopback services to Server-Side Request Forgery.
* **Decision:** Implement `server/src/utils/ssrfProtect.js` using Node stdlib (`dns.promises`, `net`). Require protocol validation (`http:`, `https:`), DNS pre-flight checking against 11 private/reserved IPv4 CIDR blocks and IPv6 ranges (including loopback, link-local, unique-local, and IPv4-mapped IPv6), and manual per-hop redirect validation (`maxRedirects: 0`, max 5 hops, 5000ms timeout). Acknowledge TOCTOU DNS rebinding as an accepted residual limitation.
* **Vulnerability Closed:** Server-Side Request Forgery (SSRF) and cloud metadata exfiltration.
* **Rationale:** Prevents unauthorized internal network scanning and cloud metadata access without introducing third-party socket-interception dependencies.