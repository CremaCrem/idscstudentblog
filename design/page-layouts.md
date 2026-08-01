# Page Layouts & Wireframe Blueprint

## 1. Main Feed Layout (`/`)
* **Frame Container:** Outer canvas (`#F8F6F0`) holding a central white rounded container (`24px` radius, inner shadow).
* **Hero Header Section:**
  * Large clean typography: `"IDSC Pulse"`
  * Sub-headline: *"Discover articles, capstone write-ups, and IT research published by students of Infotech Development Systems College – Ligao City, Albay."*
* **Top Featured Section (Essos Grid style):**
  * Left: Large featured student article with glassmorphic title card.
  * Right: Compact list of 4 recent submissions ("Latest Posts").
* **Tag Filter Bar:** Sticky horizontal tab bar for switching between genres (*Artificial Intelligence*, *Information Technology*, *Agriculture*, etc.).
* **3-Column Content Grid:** Responsive card layout (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).

---

## 2. About Page Layout (`/about`)
* **Hero Banner:** Centered editorial header (`"The Technical Pulse of IDSC Student Engineering"`) detailing how IDSC Pulse indexes student-authored technical work.
* **Key Pillars Grid (3 Cards with Lucide React Icons):**
  1. **Decentralized Student Portfolios (`Globe` icon):** Explains that IDSC Pulse acts as an index/directory, driving 100% direct web traffic back to student-owned domains.
  2. **Discipline & Domain Indexing (`Compass` icon):** Details how BSIT students categorize technical write-ups (*AI*, *Cybersecurity*, *Cloud Development*) for peer, faculty, and industry discovery.
  3. **Automated Directory Verification (`ShieldCheck` icon):** Outlines the periodic automated link health verification engine that maintains directory integrity without dead endpoints.
* **Call To Action Box:** Warm neutral container prompting IDSC students to submit their portfolio or technical article link.

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
* **Header Bar:** Title `"IDSC Directory – Health & Moderation Panel"` + `[ Run Health Scan ]` action button with pulsing status badge.
* **Metrics Cards (4 Grid Columns):**
  1. `Total Active Blogs`
  2. `Total Registered Students`
  3. `Verified Healthy Links (Green)`
  4. `Flagged / Dead Links (Red)`
* **Data Management Table:**
  * Columns: `Student`, `Blog Title & URL`, `Genre Tags`, `Health Status`, `Published Status`, `Actions`.
  * Inline Actions: One-click toggle switch for `isPublished`, `Re-check Link` ping button, and `Delete` trash button.