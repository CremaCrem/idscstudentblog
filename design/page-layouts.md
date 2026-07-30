# Page Layouts & Wireframe Blueprint

## 1. Main Feed Layout (`/`)
* **Frame Container:** Outer canvas (`#F8F6F0`) holding a central white rounded container (`24px` radius, inner shadow).
* **Hero Header Section:**
  * Large clean typography: `"Student Blog Directory"`
  * Sub-headline: *"Discover technical logs, capstone research, and engineering write-ups from university students."*
* **Top Featured Section (Essos Grid style):**
  * Left: Large featured student blog with glassmorphic title card.
  * Right: Compact list of 4 recent submissions ("Latest Posts").
* **Tag Filter Bar:** Sticky horizontal tab bar for switching between genres (*Artificial Intelligence*, *Information Technology*, *Agriculture*, etc.).
* **3-Column Content Grid:** Responsive card layout (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).

---

## 2. About Page Layout (`/about`)
* **Hero Banner:** Centered editorial header explaining the decentralized design philosophy.
* **Key Pillars Grid (3 Cards):**
  1. **Zero Content Hosting:** Highlights that the hub stores only links and metadata, driving direct traffic to student portfolios.
  2. **Topic Tagging:** Explains how students tag their posts (*AI*, *AgriTech*, *IT*) to help peers and recruiters discover their work.
  3. **Automated Link Verification:** Describes the admin health check engine that keeps the directory clean and free of dead links.
* **Call To Action Box:** Warm terra cotta banner prompting students to submit their blog URL.

---

## 3. Student Login & Auth Page Layout (`/login`)
* **Split Screen Minimalist Layout:**
  * **Left Side (Visual Panel):** Earthy warm background with a curated collage of featured student blog cards and frosted glass badges.
  * **Right Side (Form Panel):** Clean, whitespace-rich login form:
    * Username & Password fields with clean rounded borders.
    * Primary CTA Button: Full-width solid black pill (`#18181B`).
    * Toggle to Registration screen.

---

## 4. Aesthetic Admin Dashboard Layout (`/admin`)
* **Header Bar:** Title `"Directory Health & Moderation Panel"` + `[ Run Health Scan ]` action button with pulsing status badge.
* **Metrics Cards (4 Grid Columns):**
  1. `Total Active Blogs`
  2. `Total Registered Students`
  3. `Verified Healthy Links (Green)`
  4. `Flagged / Dead Links (Red)`
* **Data Management Table:**
  * Columns: `Student`, `Blog Title & URL`, `Genre Tags`, `Health Status`, `Published Status`, `Actions`.
  * Inline Actions: One-click toggle switch for `isPublished`, `Re-check Link` ping button, and `Delete` trash button.