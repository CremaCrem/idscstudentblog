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

## ADR 10: 2-Tier Cold Start Mitigation Strategy for Render Free Tier
* **Status:** Approved (Applied: 2026-08-02)
* **Context:** The Express backend is hosted on Render's free tier, which spins down container instances after 15 minutes of inactivity. When a dormant backend wakes up, initial HTTP request latency ranges from 30 to 60+ seconds. Without proactive warming and feedback controls, users experience long, uninformative loading delays or premature request timeouts.
* **Decision:** Adopt a 2-tier mitigation architecture:
  1. **Primary Defense (Infrastructure Warming):** Configure an external HTTP monitoring service (e.g., UptimeRobot or cron-job.org) to issue a `GET /health` request every 14 minutes. The `/health` endpoint requires no authentication, bypasses rate limiting middleware, and returns lightweight status JSON, keeping the Render container warm continuously within free instance-hour quotas (~720 hrs/mo).
  2. **Fallback UX Defense (Client-Side Progressive Feedback):**
     - **0–3s:** Show standard skeleton loader cards (`animate-pulse`) matching the layout aspect ratio.
     - **3s+:** Fade in an informative status banner indicating the backend is waking up and may take up to ~30–60 seconds.
     - **Centralized Timer Management:** Manage slow-request thresholds centrally at the page/hook level rather than per-component to prevent duplicate status banners during parallel API calls.
     - **Extended Timeout Threshold:** Increase Axios request timeouts for initial reads (45–60s) to accommodate container boot duration.
     - **Error State Cleanup:** Genuine network/server errors (500, 502, network offline) immediately cancel progressive timers and transition directly to standard error/retry UI states.
* **Rationale:** Eliminates ~99% of cold-start incidents via infrastructure pings while maintaining complete UI transparency and user confidence during rare container boot events.

## ADR 11: Rebrand to IDSC Pulse, Institutional Acronym Alignment, and About Page Overhaul
* **Status:** Approved (Applied: 2026-08-02)
* **Context:** The application branding previously used generic titles ("IDSC Student Hub", "Student Showcase Hub") and an incorrect expansion of the college acronym ("Institute of Data Science and Computing"). Additionally, the About page utilized templated inline emojis and generic copy that lacked institutional weight for an academic directory.
* **Decision:**
  1. **Application Name:** Standardize branding across all UI components, HTML titles (`index.html`), meta descriptions, and project documentation to **IDSC Pulse**.
  2. **Acronym Correction:** Correct the acronym expansion across all documentation to **Infotech Development Systems College (IDSC)**.
  3. **About Page Overhaul:** Rewrite `AboutPage.tsx` copy with an institutional tone suited for BSIT student engineering portfolios. Replace raw inline emojis (`🌐`, `🏷️`, `⚡`) with Lucide React SVG icons (`Globe`, `Compass`, `ShieldCheck`), maintaining design system alignment.
* **Rationale:** Establishes a distinct, professional identity for the platform while removing generic boilerplate artifacts and correcting institutional metadata.

## ADR 12: Mandatory Privacy Policy and Terms of Use Acceptance Flow
* **Status:** Approved
* **Context:** The registration flow previously collected user details without explicit acknowledgment or consent to the platform's Privacy Policy or Terms of Use. As a directory that indexes student work and processes identity data, explicit agreement is necessary to establish clear institutional boundaries and data handling transparency.
* **Decision:** Adopt a 2-tier enforcement strategy proportionate for a small-scale (~100 student) academic application:
  1. **Frontend Consent UX:** Require a checkbox on the registration form ("I have read and agree to the Terms of Use and Privacy Policy") with links (`/terms` and `/privacy`) that open in a new tab or overlay modal to protect entered form state. The submission trigger is disabled until the checkbox is checked, and `<FormReviewModal />` displays a legal acceptance confirmation line (`v1.0`).
  2. **Authoritative Backend Validation:** Require `termsAccepted: true` in `POST /api/v1/auth/register`. `authValidator.js` rejects requests with a `400 VALIDATION_ERROR` if `termsAccepted` is missing or false.
  3. **Audit Metadata:** Record `termsAcceptedAt` (Date) and `termsVersion` (String, e.g. `'1.0'`) in the `User` schema upon registration. Exclude these non-sensitive audit fields from public responses.
  4. **Public Legal Pages:** Add static public routes `/privacy` and `/terms` detailing data collection, processing purposes, third-party infrastructure (MongoDB Atlas, Render, Vercel, Cloudinary), zero tracking cookies, student content ownership, and directory moderation rights.
  5. **Legacy Scope:** Existing accounts created prior to this decision do not require forced retroactive re-acceptance.
* **Rationale:** Establishes clear legal consent and data processing transparency without introducing over-engineered forced-scroll modals or enterprise version ledger engines. See `docs/legal-compliance.md` for full specification.

## ADR 13: Mobile Responsiveness and Touch-First UX Optimization Strategy
* **Status:** Approved
* **Context:** The application previously relied on desktop-first layout assumptions. On small mobile viewports (< 768px), key navigation links were hidden without a mobile menu toggle, hero cards suffered text compression due to fixed heights, and admin data tables forced horizontal scrolling without a responsive card fallback.
* **Decision:** Implement a comprehensive mobile-first responsiveness strategy using Option A (standard Tailwind CSS utility classes and modular mobile sub-views):
  1. **Mobile Navigation Drawer:** Add a mobile menu toggle (Lucide `Menu` / `X`) in `Navbar.tsx` that opens a collapsible backdrop-blurred drawer for unauthenticated and authenticated navigation on `< md` screens.
  2. **Responsive Feed & Cards:** Adjust `HeroFeaturedCard.tsx` from fixed `h-[500px]` height to responsive steps (`h-[360px] sm:h-[450px] lg:h-[500px]`) and reduce mobile overlay padding. Ensure `TagFilterBar.tsx` supports smooth touch-swipe horizontal scrolling.
  3. **Responsive Administrative Table-to-Card Pattern:** In `AdminDashboard.tsx` and legal pages (`PrivacyPage.tsx`, `TermsPage.tsx`), render structured card stacks on mobile (`block md:hidden`) while reserving multi-column tables for desktop (`hidden md:table`).
  4. **Touch-First Accessibility Standard:** Enforce a minimum **44×44px** touch tap target size for all interactive buttons, links, inputs, and close triggers.
  5. **Modal Viewport Constraints:** Add `max-h-[90vh] overflow-y-auto` to all modal shells (`SubmitModal`, `FormReviewModal`, `ConfirmationModal`) to maintain scrollability when virtual soft keyboards open or in short landscape orientations.
* **Rationale:** Maximizes mobile usability and touch accessibility across all smartphone and tablet viewports without introducing third-party UI framework dependencies. See `design/interaction-patterns.md` Section 8 for technical guidelines.