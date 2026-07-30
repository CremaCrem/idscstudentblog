# Admin & Moderation Module (`admin`)

## 1. Purpose
The Admin & Moderation module provides administrators with a management dashboard to monitor system health, inspect metrics, toggle blog publication states, and moderate platform content[cite: 21, 24, 25].

## 2. Responsibilities
* Render admin system analytics metrics[cite: 24].
* Provide a comprehensive management table of all user submissions[cite: 24].
* Offer instant toggles for publishing/unpublishing content (`isPublished`)[cite: 24, 25].
* Support removal and moderation of flagged student links[cite: 24].

## 3. User Stories
* **As an Admin**, I want to view platform statistics so that I can monitor overall directory growth[cite: 24].
* **As an Admin**, I want to unpublish broken or inappropriate links with one click so that the public feed stays clean[cite: 21, 24, 25].

## 4. React Components
* `AdminDashboardLayout`: Main administration page structure[cite: 24].
* `MetricsGrid`: 4-column analytics summary card layout[cite: 24].
* `ModerationTable`: Data grid listing student profiles, blog details, health statuses, and actions[cite: 24].
* `PublishToggleSwitch`: Interactive switch button updating `isPublished` boolean state[cite: 24, 25].

## 5. Backend APIs
* `GET /api/admin/metrics`: Aggregates directory totals (Blogs, Users, Healthy, Broken)[cite: 24].
* `GET /api/admin/blogs`: Retrieves all submission records including hidden entries[cite: 24].
* `PATCH /api/admin/blogs/:id/publish`: Updates post publication state[cite: 24].
* `DELETE /api/admin/blogs/:id`: Deletes submission record from system[cite: 24].

## 6. Database Models
* `User` Entity (Read model)[cite: 21].
* `BlogPost` Entity (Read/Write model)[cite: 21].
* `HealthLog` Entity (Read model).

## 7. Business Rules
* Admin endpoints strictly enforce RBAC (`role === 'admin'`); non-admin tokens yield 403 Forbidden[cite: 21].
* Toggling `isPublished` to `false` instantly excludes post from public feed queries without destroying underlying database records[cite: 21, 24].

## 8. Validation Rules
* `isPublished` payload must strictly contain a boolean `true` or `false`.

## 9. Error Handling
* `403 Forbidden`: Returned when non-admin credentials attempt access[cite: 21].
* `404 Not Found`: Returned if operating on non-existent blog record ID.

## 10. Loading States
* Metrics cards display skeleton shimmer blocks during initial data load[cite: 24].
* `PublishToggleSwitch` disables interactivity while update API call is in flight.

## 11. Empty States
* `ModerationTable` renders `"No blog submissions recorded yet"` when table query returns 0 rows.

## 12. Permissions
* Public / Student: Strict No Access[cite: 21].
* Admin: Full system administrative control[cite: 21, 24].

## 13. Accessibility Requirements
* `ModerationTable` rows feature explicit keyboard focus outlines.
* `PublishToggleSwitch` relies on standard `aria-checked` attributes.

## 14. Performance Considerations
* Moderation table implements server-side pagination to handle thousands of records effortlessly.

## 15. Future Expansion Points
* Automated audit log history recording admin actions.
* Bulk moderation actions (batch unpublish/delete).

## 16. Acceptance Criteria
* GIVEN an active post, WHEN admin toggles `PublishToggleSwitch` off, THEN post `isPublished` sets to `false` and disappears from public feed[cite: 21, 24, 25].