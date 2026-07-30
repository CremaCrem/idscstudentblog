# UI Component Specifications

## 1. Navigation & Headers

### 1.1 Top Navbar
* **Left:** Brand Logo (Bold clean typography e.g., `student.blogs ↗`).
* **Center Navigation Links:** `About`, `Explore Topics`, `Latest Posts`.
* **Right Actions:** Unauthenticated (`Log In` text link + `Submit Blog` pill CTA). Authenticated (`+ New Post` + Profile Avatar drop-down).

### 1.2 Category Tag Filter Bar (Inspired by *Untitled UI*)
* Horizontal scrollable row of pill tabs.
* **States:**
  * **Active:** Solid dark background (`#18181B`) with crisp white text (`#FFFFFF`) and active underline indicator.
  * **Inactive:** Transparent or soft cream pill (`#F4EFEA`) with muted text (`#52525B`). On hover: background deepens slightly.
* **Tags Included:** `View All`, `Artificial Intelligence`, `Information Technology`, `Agriculture`, `Design`, `Software Engineering`.

---

## 2. Card Components

### 2.1 Hero / Featured Card (As seen in *Essos*)
* **Layout:** Asymmetric grid with a large featured banner image on the left and a vertical "Latest Posts" list on the right.
* **Overlay Detail:** Semi-transparent glass box anchored at the bottom of the featured image displaying:
  * Category Pill (e.g., `[ Agriculture ]`)
  * Bold Headline (`24px - 30px`)
  * Author handle & estimated read time / publication date (`Aug 10 • 5 min read`).

### 2.2 Standard Blog Grid Card
* **Image Aspect Ratio:** `16:9` or `3:2` with rounded corners (`12px` border-radius).
* **Glassmorphic Author Tag:** Overlay at the bottom edge showing student author name and tag (e.g., *Information Technology*).
* **Card Text Area:**
  * Title with underline animation on hover.
  * 2-line truncated description (`-webkit-line-clamp: 2`).
  * Action link with external arrow icon (`Read post ↗`).

---

## 3. Modal & Form Controls

### 3.1 Submission & Overrides Modal (`SubmitModal.jsx`)
* Glassmorphic backdrop blur over the screen.
* Clean form fields with soft borders (`border: 1px solid #E4E4E7`):
  1. **Blog Target URL:** Input field with auto-paste support.
  2. **Custom Title (Optional):** Text input allowing student to override scraped title.
  3. **Thumbnail Image URL (Optional):** Input field with instant preview box.
  4. **Genre Tag Combobox:** Interactive input with real-time suggestion pills (*Artificial Intelligence*, *Agriculture*, etc.).

### 3.2 Health Status Badge (Admin Interface)
* **Healthy:** Small pill with green dot `● Healthy (200 OK)`.
* **Broken:** Small pill with red dot `● Broken Link (404/Timeout)`.
* **Toggle Switch:** Clean custom switch button to publish/unpublish posts instantly.