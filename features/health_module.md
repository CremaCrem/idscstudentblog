# Health Check & Link Verification Module (`health`)

## 1. Purpose
The Health Check & Link Verification module verifies external link availability, pings submitted student blog URLs with strict timeouts, and flags dead or broken links for administrative review[cite: 21, 24, 25].

## 2. Responsibilities
* Execute asynchronous automated pings against submitted external target URLs[cite: 21, 24].
* Enforce strict HTTP response timeouts (max 3.0 seconds)[cite: 21].
* Maintain link health diagnostic logs[cite: 24, 25].
* Supply UI indicators reflecting link availability statuses[cite: 25].

## 3. User Stories
* **As an Admin**, I want to run a directory link scan so that I can discover broken or offline student blogs[cite: 24, 25].
* **As an Admin**, I want visual status indicators so that I can immediately tell if a post is returning 200 OK or 404 Not Found[cite: 24, 25].

## 4. React Components
* `HealthStatusBadge`: Status pill rendering green `● Healthy (200 OK)` or red `● Broken Link` states[cite: 25].
* `HealthScanTrigger`: Control button featuring pulsing scanning state feedback[cite: 22, 24].

## 5. Backend APIs
* `POST /api/admin/health-check`: Triggers bulk link verification background job[cite: 24].
* `POST /api/admin/health-check/:id`: Re-tests an individual blog post link[cite: 24].

## 6. Database Models
* `BlogPost` Entity (Health Fields update):
  * `lastHealthCheckStatus`: String (enum: `['healthy', 'broken', 'pending']`, default: `'pending'`)[cite: 25]
  * `lastCheckedAt`: Date[cite: 24]
  * `httpStatusCode`: Number[cite: 25]
* `HealthLog` Entity:
  * `_id`: ObjectId
  * `blogId`: ObjectId (Ref: BlogPost)
  * `status`: String
  * `responseTimeMs`: Number
  * `checkedAt`: Date

## 7. Business Rules
* Ping operations must time out strictly at 3.0 seconds to prevent resource exhaustion[cite: 21].
* HTTP Status `2xx` / `3xx` sets status to `'healthy'`; HTTP Status `4xx` / `5xx` or network failure sets status to `'broken'`[cite: 22, 25].

## 8. Validation Rules
* `blogId` parameter must be a valid MongoDB ObjectId.

## 9. Error Handling
* Network connection timeouts or DNS lookup failures log explicit error codes (`ERR_TIMEOUT`, `ENOTFOUND`) into the health audit log.

## 10. Loading States
* `HealthScanTrigger` renders a progress counter during active scans (`Scanning 14/50...`)[cite: 22].
* `HealthStatusBadge` shows a pulsing grey loading ring while re-validation pings execute.

## 11. Empty States
* `HealthLog` views display `"No diagnostic scans executed yet"` when history is blank.

## 12. Permissions
* Public / Student: No access to trigger scans.
* Admin: Exclusive authorization to execute health check APIs[cite: 21, 24].

## 13. Accessibility Requirements
* Health status badges must communicate state through text labels in addition to color indicators (`aria-label="Status: Healthy, HTTP 200"`).

## 14. Performance Considerations
* Health check jobs utilize parallel worker pools capped at 5 concurrent outbound pings to prevent rate-limiting.

## 15. Future Expansion Points
* Automated cron task execution (e.g., midnight automated health checks).
* Email alerts sent to students when their blog link goes broken.

## 16. Acceptance Criteria
* GIVEN a target blog returning 404, WHEN scanned by health checker, THEN status updates to `'broken'` with red visual badge[cite: 22, 25].