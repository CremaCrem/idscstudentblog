# UI Component Design System & Layout Guidelines

## 1. Core Visual Hierarchy
* **Theme:** Modern, clean educational showcase layout.
* **Color Palette:**
  * Primary Accent: Deep Slate Blue (`#2563EB`)
  * Tag Badges: Soft Cyan/Indigo Pill Badges (`#E0E7FF` text `#3730A3`)
  * Surface Neutral: Light Grey (`#F8FAFC`)
  * Border Accent: Subtle Slate (`#E2E8F0`)
  * Admin Badges: Crimson (`#EF4444`) for dead links / unpublishing, Emerald (`#10B981`) for health checks.

## 2. Key UI Components

### 2.1 Navigation Bar (`/src/components/Navbar.jsx`)
* Display brand name/logo.
* Unauthenticated: Login / Register links.
* Student Login: "+ Submit Blog Link", "My Account", "Logout".
* Admin Login: Displays an "Admin Dashboard" badge alongside health check controls.

### 2.2 Tag Search Bar & Filter Strip (`/src/components/TagFilter.jsx`)
* Search input for filtering feed by post title, author, or tag keyword.
* Horizontal scrollable bar displaying popular tag pills (e.g., `[ All ]`, `[ Artificial Intelligence ]`, `[ Information Technology ]`, `[ Agriculture ]`).
* Clicking a tag pill updates the active feed query filter.

### 2.3 Blog Card (`/src/components/BlogCard.jsx`)
* **Header:** Tag pill list + student author handle.
* **Media Frame:** Fixed-aspect ratio image rendering user-selected or scraped `thumbnail`. Falls back gracefully to SVG placeholder if image fails to load (`onError`).
* **Content:** Custom or scraped Title opening `originalUrl` in `target="_blank"`, short 2-line truncated description.
* **Admin Overlay (Conditional):**
  * Toggle Switch for `isPublished`.
  * Red indicator banner if `isBroken === true`.

### 2.4 Tag Autocomplete Submission Modal (`/src/components/SubmitModal.jsx`)
* **Inputs:**
  * `Blog URL` (Required).
  * `Custom Title` (Optional override).
  * `Image URL` (Optional custom cover picture).
  * `Genre Tags` (Interactive Combobox / Autocomplete Tag Input).
* **Tag Input Behavior:** As the user types (e.g., "Agri"), a drop-down suggests matching existing tags (*Agriculture*, *AgriTech*). Pressing Enter or clicking a suggestion adds the tag pill to the post.
* **Action:** Submit button with loading spinner during backend saving/scraping.