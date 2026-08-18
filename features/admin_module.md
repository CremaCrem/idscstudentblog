# Admin & Moderation Module (`admin`)

## 1. Purpose
The Admin & Moderation module provides administrators with a management dashboard to monitor system health, inspect metrics, toggle blog publication states, moderate platform content, and inspect student user profiles with their complete submission history.

## 2. Responsibilities
* Render admin system analytics metrics.
* Provide a comprehensive management table of all user submissions.
* Provide a dedicated Student Directory tab to inspect individual student profiles (Full Name, Student ID, User ID, Email, Account Creation Date, and posted blogs).
* Offer instant toggles for publishing/unpublishing content (`isPublished`).
* Support removal and moderation of flagged student links and account deletion.

## 3. User Stories
* **As an Admin**, I want to view platform statistics so that I can monitor overall directory growth.
* **As an Admin**, I want to unpublish broken or inappropriate links with one click so that the public feed stays clean.
* **As an Admin**, I want to view a student's profile details (Name, Student ID, User ID, Email, Account Creation Date) and all the blogs they posted to audit student activity.

## 4. React Components
* `AdminDashboardLayout`: Main administration page structure.
* `MetricsGrid`: 4-column analytics summary card layout.
* `ModerationTable`: Data grid listing student submissions, blog details, health statuses, and actions.
* `StudentDirectoryTable`: Data grid listing registered student profiles, account creation dates, and post counts.
* `StudentProfileModal`: Detailed modal/drawer presenting individual student profile metadata (Full Name, Student ID, User ID, Email, Creation Date) and a breakdown of all blogs they have posted.
* `PublishToggleSwitch`: Interactive switch button updating `isPublished` boolean state.

## 5. Backend APIs
* `GET /api/admin/metrics`: Aggregates directory totals (Blogs, Users, Healthy, Broken).
* `GET /api/admin/blogs`: Retrieves all submission records including hidden entries.
* `PATCH /api/admin/blogs/:id/publish`: Updates post publication state.
* `DELETE /api/admin/blogs/:id`: Deletes submission record from system.
* `GET /api/admin/users`: Retrieves all registered student accounts with post counts and creation dates.
* `GET /api/admin/users/:id`: Retrieves full student profile metadata along with all blog posts submitted by that user.
* `DELETE /api/admin/users/:id`: Deletes a student account and associated data.

## 6. Database Models
* `User` Entity (Read/Delete model).
* `BlogPost` Entity (Read/Write model).
* `HealthLog` Entity (Read model).

## 7. Business Rules
* Admin endpoints strictly enforce RBAC (`role === 'admin'`); non-admin tokens yield 403 Forbidden.
* Toggling `isPublished` to `false` instantly excludes post from public feed queries without destroying underlying database records.
* Admins can inspect complete submission histories for any student regardless of publication or health status.

## 8. Validation Rules
* `isPublished` payload must strictly contain a boolean `true` or `false`.

## 9. Error Handling
* `403 Forbidden`: Returned when non-admin credentials attempt access.
* `404 Not Found`: Returned if operating on non-existent blog record ID or user ID.

## 10. Loading States
* Metrics cards display skeleton shimmer blocks during initial data load.
* `StudentProfileModal` displays a loader while fetching individual student details and blog submissions.
* `PublishToggleSwitch` disables interactivity while update API call is in flight.

## 11. Empty States
* `ModerationTable` renders `"No blog submissions recorded yet"` when table query returns 0 rows.
* `StudentDirectoryTable` renders `"No registered students found"` when 0 students match query.
* `StudentProfileModal` renders `"No blogs posted yet"` in the submission section if the student has not submitted any links.

## 12. Permissions
* Public / Student: Strict No Access.
* Admin: Full system administrative control.

## 13. Accessibility Requirements
* `ModerationTable` and `StudentDirectoryTable` rows feature explicit keyboard focus outlines.
* `PublishToggleSwitch` relies on standard `aria-checked` attributes.
* `StudentProfileModal` follows accessible dialog guidelines (`aria-modal="true"`, focus trap, Escape dismissal).

## 14. Performance Considerations
* Moderation and Student Directory tables implement server-side pagination to handle large datasets effortlessly.

## 15. Future Expansion Points
* Automated audit log history recording admin actions.
* Bulk moderation actions (batch unpublish/delete).
* Export student roster and submission report to CSV.

## 16. Acceptance Criteria
* GIVEN an active post, WHEN admin toggles `PublishToggleSwitch` off, THEN post `isPublished` sets to `false` and disappears from public feed.
* GIVEN an admin on the Student Directory tab, WHEN clicking "View Profile" on a student row, THEN a modal displays their Full Name, Student ID, User ID, Email, Account Creation Date, and a list of all blogs they have posted.