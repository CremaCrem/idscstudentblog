# Navigation & IA Structure

## 1. Site Map & Route Hierarchy

```text
/ (Home / Main Showcase Feed)
├── ?tag=artificial-intelligence (Filtered Feed)
├── ?tag=agriculture
└── ?tag=information-technology

/about (About IDSC Pulse)

/login (Student & Admin Login)
/register (Account Creation)

/dashboard (Student Personal Management)
└── Modal: /submit-blog (URL, Title, Image & Tag Combobox)

/admin (Moderation & Link Health Dashboard)
```

## 2. Navigation Behavior Rules
* **External Link Behavior:** Clicking any student blog card or title opens the original destination in a new browser tab (`target="_blank" rel="noopener noreferrer"`).
* **Tag Selection Flow:** Clicking a tag pill on a blog card automatically updates the global feed filter to that genre and scrolls smoothly back to the top of the feed grid.
* **Sticky Filter Bar:** As the user scrolls down the main content grid, the category tag bar remains sticky at the top of the frame for effortless genre switching.