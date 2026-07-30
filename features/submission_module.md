# Blog Submission & Scraper Module (`submission`)

## 1. Purpose
The Blog Submission & Scraper module enables students to submit external blog post URLs, automatically scrapes Open Graph metadata (title, thumbnail), allows custom metadata overrides, and processes normalized genre tagging[cite: 21, 25].

## 2. Responsibilities
* Parse and validate external student blog post URLs[cite: 21, 25].
* Execute server-side metadata extraction (Open Graph scraping with strict timeouts)[cite: 21].
* Provide client-side form controls for title, thumbnail image URL, and interactive tag input[cite: 21, 25].
* Attach normalized genre tags to submitted posts[cite: 21].

## 3. User Stories
* **As a Student**, I want to submit my blog URL so that my technical write-ups are featured in the directory[cite: 24, 25].
* **As a Student**, I want to override auto-scraped titles or thumbnails if the scraper fetches incorrect data[cite: 21, 25].
* **As a Student**, I want real-time tag suggestions while typing so that I can categorize my post efficiently[cite: 21, 25].

## 4. React Components
* `SubmitModal`: Glassmorphic overlay containing submission form fields[cite: 25].
* `UrlInputField`: Input supporting auto-paste and link format validation[cite: 25].
* `ThumbnailPreview`: Media preview box rendering image URLs or fallback SVGs[cite: 21, 25].
* `TagCombobox`: Interactive type-ahead input with suggestion dropdown pills[cite: 21, 25].

## 5. Backend APIs
* `POST /api/blogs/scrape`: Internal utility to extract Open Graph title/image from target URL[cite: 21].
* `POST /api/blogs`: Persists new blog post link record[cite: 21].
* `PUT /api/blogs/:id`: Updates custom fields on an existing submission.

## 6. Database Models
* `BlogPost` Entity:
  * `_id`: ObjectId[cite: 21]
  * `authorId`: ObjectId (Ref: User)[cite: 21]
  * `targetUrl`: String (required, trimmed)[cite: 21]
  * `title`: String (required, trimmed)[cite: 21]
  * `thumbnailUrl`: String (optional, trimmed)[cite: 21]
  * `tags`: Array of Strings (lowercased, trimmed, indexed)[cite: 21]
  * `isScrapedFallback`: Boolean (default: false)[cite: 21]
  * `isPublished`: Boolean (default: true)[cite: 21, 24]
  * `createdAt`: Date[cite: 21]

## 7. Business Rules
* If `title` or `thumbnailUrl` are omitted, execute server-side Open Graph scraping with max 4.0-second timeout[cite: 21].
* All tags must be trimmed, lowercased, and sanitized against stored XSS[cite: 21, 22].
* Submissions require a valid authenticated user JWT[cite: 21].

## 8. Validation Rules
* `targetUrl` must be a valid HTTP/HTTPS URL format.
* `title` length must be between 3 and 150 characters.
* `tags` array must contain between 1 and 5 unique items[cite: 22].

## 9. Error Handling
* `400 Bad Request`: Returned on malformed URL syntax or empty required fields[cite: 21].
* `408 Request Timeout`: Scraper fallback triggered if target server fails to respond within 4.0 seconds[cite: 21].
* Scraper failures substitute a structured default SVG placeholder and title fallback[cite: 21].

## 10. Loading States
* URL entry triggers a subtle loading spinner inside the URL input while metadata scraping executes.
* Submit button displays "Publishing..." state during persistence.

## 11. Empty States
* `ThumbnailPreview` displays an abstract architectural SVG vector when no thumbnail is returned or entered[cite: 21].

## 12. Permissions
* Public: No access.
* Authenticated Student/Admin: Full permission to submit and edit owned entries[cite: 21, 24].

## 13. Accessibility Requirements
* `SubmitModal` must catch focus traps (`Tab` cycling stays inside modal).
* Escape key (`Escape`) closes the modal gracefully.

## 14. Performance Considerations
* Server-side web scraping runs asynchronously with strict timeout limits to prevent thread-blocking[cite: 21].
* Image previews utilize standard lazy-loading attributes (`loading="lazy"`).

## 15. Future Expansion Points
* RSS / Atom feed auto-sync for student blogs.
* Automated duplicate URL submission detection.

## 16. Acceptance Criteria
* GIVEN a valid URL input, WHEN submitted, THEN server extracts metadata or falls back within 4.0 seconds[cite: 21].
* GIVEN a custom tag input `" Artificial Intelligence "`, WHEN saved, THEN it is stored as normalized `"artificial intelligence"`[cite: 21, 22].