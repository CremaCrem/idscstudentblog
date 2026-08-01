# Document Vision & Project Scope: IDSC Pulse

## 1. Executive Summary
**IDSC Pulse** is a lightweight, high-performance web platform designed to aggregate, curate, and spotlight blog posts, capstone write-ups, and technical research published by students of **Infotech Development Systems College (IDSC) – Ligao City, Albay**. Rather than hosting full editorial content locally, the system functions as a **decentralized content directory and link aggregator** — students submit the URLs of their deployed personal blogs, hosted portfolios, or research write-ups. Students can set custom titles, cover images, and genre tags (e.g., *Artificial Intelligence*, *Information Technology*, *Agriculture*) to categorize their work. The backend enriches or falls back onto metadata via Open Graph protocols, storing minimal database records while giving IDSC students a centralized, beautifully designed space to share and discover each other's work.

## 2. Core Value Proposition
* **Zero Storage Overhead:** The platform stores metadata, tags, and link pointers rather than full media or rich text articles, minimizing database footprint and server costs.
* **Student Spotlight & Discovery:** IDSC students can quickly categorize posts with searchable genre tags, enabling peers, classmates, and instructors to discover capstone projects, IT research, and technical write-ups by topic.
* **Custom Overrides & Automated Enrichment:** Allows students to explicitly define titles, images, and tags while using Open Graph scraping as an automatic fallback.
* **Quality Assurance & Moderation:** Built-in admin controls and link health verification tools ensure dead or broken student hosting instances do not clutter the community feed.

## 3. Key Stakeholders & Target Audience
* **IDSC Students (Ligao City, Albay):** Primary content creators — sharing capstone projects, IT research, technical essays, and project documentation to spotlight their work within the IDSC community and beyond.
* **Instructor / Administrator:** Primary platform moderator responsible for verifying student identities against the IDSC roster, overseeing feed quality, managing user access, and monitoring dead links.
* **Peers & Visitors:** Secondary audience who browse the feed to discover student articles, filter by genre tag, and click through to read the full write-up on the author's own hosted site.

## 4. Success Metrics & Goals
* **Sub-second Feed Rendering & Tag Filtering:** Rapid presentation and instant filtering of student write-up cards by genre/tag using indexed MongoDB queries.
* **Robust Tag Discovery & Link Validation:** Smart tag autocomplete with >95% accuracy in Open Graph metadata extraction as a fallback.
* **Low Maintenance Admin Workflow:** Single-click health checks allowing IDSC admins to clear or flag dead student hosting links within seconds.
* **Student-Centered Identity:** Every published card prominently features the student author's name and navigates directly to their personal portfolio or blog, ensuring full credit and authentic traffic flows back to the creator.