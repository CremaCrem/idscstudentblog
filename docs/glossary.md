# Project Terminology & Glossary

This document serves as the standard terminology reference for **IDSC Pulse**. Maintaining consistent naming conventions and vocabulary across code, comments, documentation, and AI prompts ensures clarity and prevents architectural drift.

---

## Technical & Domain Terms

| Term | Category | Definition |
| :--- | :--- | :--- |
| **Blog Post / Article** | Domain | A metadata entry stored on the platform referencing external content authored and hosted by a student. |
| **External URL** | Domain / Security | The canonical link pointing directly to the student’s original self-hosted or third-party platform (e.g., Medium, Dev.to, personal site). |
| **Metadata Scraper** | Feature / Backend | An automated service component that parses target URLs to extract Open Graph metadata (`og:title`, `og:description`, `og:image`, canonical tags) during submission. |
| **Student** | RBAC / Domain | An authenticated user role authorized to submit, edit, and delete their own blog post links and manage their profile. |
| **Admin** | RBAC / Domain | An authenticated user role with elevated privileges to moderate post submissions, manage user accounts, and view platform metrics. |
| **JWT (JSON Web Token)** | Auth | A compact, URL-safe token containing user identity claims, signed using a secret key and used for stateless request authorization via the HTTP `Authorization: Bearer` header. |
| **Bcrypt** | Security | A key-derivation password-hashing function used to securely salt and hash user credentials prior to persistence. |
| **Express Middleware** | Architecture | Modular pipeline functions in Express.js responsible for handling authentication validation, input sanitization, error propagation, and logging. |
| **Mongoose Schema** | Database | Object Data Modeling (ODM) definitions defining document structures, default values, validators, and hooks in MongoDB Atlas. |
| **CORS (Cross-Origin Resource Sharing)** | Security | An HTTP-header-based mechanism that permits backend resources to be requested by an authorized frontend origin (e.g., Vercel deployment domain). |

---

## Architectural Abbreviations

* **IDSC:** Infotech Development Systems College
* **SSOT:** Single Source of Truth
* **RBAC:** Role-Based Access Control
* **OG:** Open Graph (Meta tags used for web link previews)
* **JWT:** JSON Web Token
* **DTO:** Data Transfer Object
* **ODM:** Object Data Model