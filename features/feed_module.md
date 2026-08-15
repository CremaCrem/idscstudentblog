# Showcase Feed & Discovery Module (`feed`)

## 1. Purpose
The Showcase Feed & Discovery module delivers the visual editorial presentation of student blog submissions, featuring a hero showcase grid, category tag filtering, and external link navigation[cite: 23, 24, 25].

## 2. Responsibilities
* Render the responsive editorial content canvas and 3-column card grid[cite: 24].
* Display hero/featured post section paired with recent submission lists[cite: 24, 25].
* Power sticky category tag filtering tabs[cite: 23, 25].
* Execute clean external tab navigation to original student articles[cite: 23, 25].

## 3. User Stories
* **As a Visitor**, I want to browse student blog write-ups in an organized grid so that I can discover technical content[cite: 24, 27].
* **As a Visitor**, I want to click genre tags like *Information Technology* or *Agriculture* to filter the feed dynamically[cite: 23, 25].
* **As a Visitor**, I want clicking a post card to open the author's blog in a new tab[cite: 23, 25].

## 4. React Components
* `FeedLayout`: Main page framing container with neutral canvas background styling[cite: 24, 26].
* `HeroFeaturedCard`: Asymmetric grid displaying primary featured card and latest post vertical list[cite: 24, 25].
* `BlogGridCard`: Standard editorial card component with frosted glass metadata overlay[cite: 22, 25, 26].
* `TagFilterBar`: Sticky, horizontally scrollable row of pill-shaped filter buttons populated dynamically from popular tags[cite: 23, 25].
* `DateFilterBar`: Date range filter buttons for narrowing feed results by time period.
* `InfiniteScrollSentinel`: Invisible intersection observer target that triggers paginated fetching.
* `GlassmorphicOverlay`: Backdrop-blur surface overlay container[cite: 25, 26].

## 5. Backend APIs
* `GET /api/v1/blogs`: Queries published posts (supports `?tag=...&page=...&limit=...&dateFrom=...&dateTo=...`)[cite: 21, 23].
* `GET /api/v1/blogs/featured`: Fetches top curated posts for hero display[cite: 24, 25].

## 6. Database Models
* `BlogPost` Entity (Read Model)[cite: 21].
* `Tag` Entity (Read Model)[cite: 21].

## 7. Business Rules
* Only records where `isPublished === true` are returned to public feed queries[cite: 21, 24].
* External navigation links must append `target="_blank" rel="noopener noreferrer"` attributes[cite: 23].
* Filtering by tag updates route parameters without triggering full web page reloads[cite: 23].

## 8. Validation Rules
* `page` query parameter must be a positive integer (default: `1`).
* `limit` query parameter capped at maximum `50` records per request.

## 9. Error Handling
* `500 Internal Server Error`: Renders a friendly toast error message asking the user to refresh.
* Image Load Error: `BlogGridCard` media frames catch broken thumbnail paths and automatically render placeholder SVGs[cite: 21].

## 10. Loading States
* Initial page fetch displays animated skeleton cards matching grid geometry.
* Tag or Date filter switching resets the feed and displays a top line progress loading bar or skeletons if latency is high.
* Infinite scrolling displays an inline "Loading more..." spinner at the bottom of the feed while fetching `isFetchingMore`.

## 11. Empty States
* When no posts match a selected tag or date filter, display an empty feed state graphic with a "Clear Filter" button.
* Reaching the end of the infinite scroll list removes the sentinel and optionally shows an end-of-feed message.

## 12. Permissions
* Public: Full read access to feed layout and filtering actions.

## 13. Accessibility Requirements
* Grid cards fully focusable via Keyboard `Tab` navigation.
* External link buttons provide explicit screen-reader text: `aria-label="Read post on external blog (opens in new tab)"`.

## 14. Performance Considerations
* MongoDB queries utilize compound indexes (`isPublished`, `tags`) for low-latency query processing[cite: 21].
* Dynamic dynamic images utilize responsive resolution srcsets and native browser `loading="lazy"` attributes.
* Infinite scrolling uses paginated API batching triggered efficiently by `IntersectionObserver`.

## 15. Future Expansion Points
* Full-text search bar with highlighted search matches.
* Sorting options (Most Popular, Oldest, Recently Scraped).

## 16. Acceptance Criteria
* GIVEN published blog posts, WHEN home page loads, THEN posts display in grid with proper glassmorphic cards[cite: 24, 25, 26].
* GIVEN a tag filter selection, WHEN clicked, THEN grid updates to render matching tag entries only[cite: 23, 25].