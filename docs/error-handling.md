# Error Handling & Logging Strategy

This document defines standard error responses, HTTP status codes, error classifications, and logging conventions across the IDSC Pulse REST API.

---

## Standardized API Error Format

All error responses from the Express.js API must return a consistent JSON payload structure to allow predictable frontend handling and straightforward AI/human parsing.

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided.",
    "details": [
      {
        "field": "originalUrl",
        "issue": "Must be a valid, fully-qualified HTTP/HTTPS URL."
      }
    ],
    "timestamp": "2026-07-30T16:00:00.000Z"
  }
}

Code,Status,Usage Context
200,OK,"Successful GET, PUT, or DELETE request execution."
201,Created,"Successful creation of a resource (e.g., user registration, post submission)."
400,Bad Request,"Request validation failures, malformed JSON, or missing required fields."
401,Unauthorized,Missing or invalid/expired JWT token.
403,Forbidden,Authenticated user lacks required role or ownership over the requested resource.
404,Not Found,"Requested route, endpoint, or MongoDB document does not exist."
422,Unprocessable Entity,Metadata scraping failures or unreachable external post URLs.
429,Too Many Requests,Rate limit threshold exceeded.
500,Internal Server Error,Unexpected application runtime errors or uncaught database faults.

Category-Specific Handling Guidelines
1. Input & Schema Validation Errors (400 Bad Request)
Trigger: Express request validation or Mongoose schema validation failure.

Strategy: Intercept requests via validation middleware prior to controller execution. Map field errors to the standard details array. Never expose database query syntax.

2. Authentication & Authorization Errors (401 / 403)
Trigger: Missing Authorization header, invalid JWT signature, expired token, or unauthorized cross-user modifications.

Strategy: Reject requests before reaching controller logic. Return standard error codes UNAUTHORIZED or FORBIDDEN. Do not disclose credential details on login failures.

3. Metadata Scraper Failures (422 Unprocessable Entity)
Trigger: The provided external URL times out, returns HTTP 4xx/5xx status, or blocks HTTP scraping clients.

Strategy: Catch scraper execution errors. Allow fallback manual metadata overrides (title/description) while returning a structured error message indicating the scrape failure:

JSON
{
  "success": false,
  "error": {
    "code": "METADATA_SCRAPE_FAILED",
    "message": "Unable to automatically extract metadata from the target URL. Please verify the link or enter details manually.",
    "timestamp": "2026-07-30T16:00:00.000Z"
  }
}

4. Broken & Dead External Links
Trigger: Scheduled background jobs or post validation checks detecting dead user-submitted external links.

Strategy: Flag the post document state as unreachable in MongoDB rather than throwing hard runtime exceptions. Notify post owners gracefully.

5. Database Failures (500 Internal Server Error)
Trigger: MongoDB connection timeout, duplicate key constraint violation, or transaction failure.

Strategy: Catch database errors at the data access layer. Log full trace details on the server side. Sanitize the user-facing response to mask database paths, connection strings, or host details.

Centralized Express Error Middleware
An Express global error handling middleware catches uncaught sync/async errors across controllers:
// Middleware pattern for error containment
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  console.error(`[ERROR] [${new Date().toISOString()}] ${err.stack || err.message}`);

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: statusCode === 500 ? 'An unexpected server error occurred.' : err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      timestamp: new Date().toISOString()
    }
  });
});