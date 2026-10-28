# Authentication & Identity Module (`auth`)

## 1. Purpose
The Authentication & Identity module handles user access control, credentials verification, JWT token issuance, session persistence, and role management (Student vs. Admin) across the platform[cite: 21, 24].

## 2. Responsibilities
* Manage secure student registration and login flows[cite: 23, 24].
* Issue, store, and validate JWT access tokens for authorized API interactions[cite: 21].
* Enforce Role-Based Access Control (RBAC) to restrict admin routes[cite: 21].
* Provide client-side session context and smooth authentication state synchronization[cite: 21, 25].

## 3. User Stories
* **As a Student**, I want to register and log in so that I can submit and manage my blog post links[cite: 23, 24].
* **As an Admin**, I want to log in with elevated privileges so that I can access system health diagnostics and moderation tools[cite: 24].
* **As a Visitor**, I want clear feedback when attempting to access restricted pages without logging in[cite: 23].

## 4. React Components
* `LoginForm`: Split-panel form with styled inputs for credentials entry[cite: 24].
* `RegisterForm`: Account creation interface for new students[cite: 23].
* `AuthGuard`: Higher-Order Component / wrapper for route protection.
* `UserDropdown`: Navbar profile menu rendering active status and logout action[cite: 25].

## 5. Backend APIs
* `POST /api/auth/register`: Creates a new user account[cite: 21].
* `POST /api/auth/login`: Authenticates credentials and returns JWT token[cite: 21].
* `POST /api/auth/logout`: Clears authentication cookie/session token[cite: 21].
* `GET /api/auth/me`: Fetches active authenticated user profile details[cite: 21].
* `POST /api/v1/auth/reset-password`: Consumes a one-time reset token (`{ token, password }`) and sets a new password. Rate-limited with the other auth routes.
* `POST /api/v1/admin/users/:id/reset-link` (admin only): Issues a one-time reset token valid for 30 minutes; returns `{ token, expiresAt }`.

## 6. Database Models
* `User` Entity:
  * `_id`: ObjectId[cite: 21]
  * `username`: String (required, unique, trimmed)[cite: 21]
  * `email`: String (required, unique, trimmed, lowercase)[cite: 21]
  * `passwordHash`: String (required)[cite: 21]
  * `role`: String (enum: `['student', 'admin']`, default: `'student'`)[cite: 21]
  * `createdAt`: Date[cite: 21]

## 7. Business Rules
* Passwords must be hashed using a strong salted algorithm (e.g., bcrypt) prior to database persistence[cite: 21].
* User roles are strictly enforced; elevated endpoints require `role === 'admin'`[cite: 21].
* JWT tokens must be verified on all protected mutation/write routes[cite: 21].

### Admin-Assisted Password Reset
No email is sent (zero-cost deployment, no domain). Flow:
1. Student clicks **Forgot password?** on `/login` → `/forgot-password` tells them to message the admin (link from `VITE_ADMIN_CONTACT_URL`) with full name and student ID.
2. Admin confirms identity out-of-band, opens the student in the Student Directory, clicks **Generate reset link**. The link (`/reset-password/:token`) is copied to the clipboard and shared via Messenger.
3. Student sets a new password at `/reset-password/:token`.

Rules:
* Token is 32 random bytes (hex); only its SHA-256 hash is stored (`passwordResetTokenHash`, `passwordResetExpires`).
* Token expires after 30 minutes, is single-use (atomic find-and-clear), and generating a new link invalidates the previous one.
* A successful reset sets `passwordChangedAt`; `authGuard` rejects any JWT with `iat` earlier than it, signing the user out of all other sessions. `authGuard` also rejects tokens for deleted accounts.

## 8. Validation Rules
* Email must match a valid RFC 5322 pattern.
* Password must be a minimum of 8 characters containing at least 1 number and 1 letter.
* Username must be alphanumeric (3–20 characters).

## 9. Error Handling
* `401 Unauthorized`: Returned when login credentials fail or tokens expire[cite: 21].
* `403 Forbidden`: Returned when non-admin users attempt access to admin APIs[cite: 21].
* `409 Conflict`: Returned if registering an existing email or username.
* `400 INVALID_RESET_TOKEN`: Reset token is unknown, expired, or already used.

## 10. Loading States
* Primary action button displays an inline spinning indicator during authentication requests.
* Form fields remain disabled while submission is pending.

## 11. Empty States
* `UserDropdown` displays fallback default avatar when user profile image is absent[cite: 25].

## 12. Permissions
* Public: Access to `/login`, `/register`, and `/api/auth/login`.
* Authenticated Student: Access to `/dashboard` and submission creation[cite: 23].
* Authenticated Admin: Access to `/admin` and moderation endpoints[cite: 24].

## 13. Accessibility Requirements
* Inputs must feature associated `<label>` tags and aria attribute bindings (`aria-invalid`, `aria-describedby`).
* Form submission triggerable via `Enter` key keydown events.

## 14. Performance Considerations
* JWT tokens stored in HTTP-only secure cookies to reduce unnecessary database session lookups.
* Index unique fields (`email`, `username`) in MongoDB for fast authentication queries[cite: 21].

## 15. Future Expansion Points
* Integration with OAuth2 providers (GitHub, Google Single Sign-On).
* Self-service password reset by email once a sending domain is available (replace step 2 of the admin-assisted flow).

## 16. Acceptance Criteria
* GIVEN valid student credentials, WHEN submitted via `LoginForm`, THEN user is authenticated and redirected to the home feed or dashboard[cite: 23, 24].
* GIVEN a non-admin user, WHEN accessing `/admin`, THEN access is denied with a 403 Forbidden state[cite: 21, 24].