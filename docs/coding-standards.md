# Development & Coding Standards

## 1. General Principles
* Keep modules small, deterministic, and single-purpose.
* Write clean, self-documenting code with concise JSDoc comments on complex business logic.
* Always handle asynchronous operations using `async/await` paired with structured `try/catch` blocks.

## 2. Express Backend Guidelines
* **Controller-Service Pattern:** Do not put database logic or HTTP fetch operations directly inside express route handlers. Delegate to separate controller and service modules.
* **Tag Input Normalization:** Always trim and convert tag strings to lowercase before database operations to avoid duplicate tags (e.g., `"Artificial Intelligence"` and `"artificial intelligence"`).
* **Global Error Middleware:** Use a central Express error handler to format API response errors uniformly:
  ```json
  {
    "success": false,
    "error": "Human readable error message"
  }
  ```

## 3. React Frontend Guidelines
* **Tag Autocomplete Component:** Use debounced inputs (e.g., 200ms debounce) for tag suggestion API calls to avoid hitting backend limits while typing.
* **Component Granularity:** Keep UI components focused. Break complex views down into layout wrappers, atomic presentation cards, and modular form controls.
* **Custom Hooks:** Separate API communication and state logic from visual components using custom React hooks (e.g., `useAuth`, `useBlogs`, `useTagSuggestions`).

## 4. Safety & Security Conventions
* Use `new URL(urlString)` checks before passing external strings into scraper processes or saving image URLs.
* Ensure all HTTP links in user-provided or scraped thumbnails are converted to `https://` if available, or replaced with a local static fallback SVG.