# Project Index & AI Coding Instructions

> **NOTICE TO AI CODING ASSISTANTS & HUMAN DEVELOPERS**  
> Read this document in full before analyzing, modifying, or generating code for the IDSC Pulse repository.

---

## Project Overview

**IDSC Pulse** is a centralized platform designed to aggregate, showcase, and highlight technical articles and research published by students of Infotech Development Systems College. The platform stores metadata and canonical links, driving traffic back to the student creators' original web hosting platforms.

---

## Technology Stack Summary

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Tailwind CSS, Vite |
| **Backend** | Express.js, Node.js |
| **Database** | MongoDB Atlas using Mongoose ODM |
| **Authentication** | Custom JWT-based authentication with `bcrypt` password hashing |
| **Deployment** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |

---

## Single Source of Truth (SSOT) Hierarchy

All engineering activities, automated coding assistance, and architectural decisions must strictly conform to the specifications provided in the following baseline documents:

* `.ai/ai_constitution.md` — Core AI guidelines, constraints, and operational boundaries.
* `docs/` — Core system documentation, including:
  * `docs/glossary.md` — Canonical project terminology.
  * `docs/error-handling.md` — API response structures, error formats, and logging rules.
  * `docs/security.md` — Security requirements, auth schemes, and protection guidelines.
  * `docs/legal-compliance.md` — Privacy Policy, Terms of Use, & legal consent architecture.
  * `docs/deployment.md` — Infrastructure topology, environment parameters, and build steps.
  * `docs/testing-strategy.md` — Testing requirements and verification guidelines.
* `features/` — System component breakdown and module boundaries.
* `prompts/` — Task-specific guidelines for automated agents.

---

## Recommended Document Reading Order

When initializing a new development session or onboarding to a specific module, read documents in the following order:

```text
1. PROJECT_INDEX.md (This file - High-level context and rules)
   └── 2. .ai/ai_constitution.md (Governance and strict constraints)
        └── 3. docs/glossary.md (Domain terminology baseline)
             └── 4. docs/security.md & docs/error-handling.md (Backend & API design patterns)
                  └── 5. Target module docs in features/ & design/

Directory Structure & Folder Map
.
├── .ai/
│   └── ai_constitution.md     # Governance rules for AI operations
├── design/                     # UX specifications, layout guides, and design rules
├── docs/                       # Core system documentation (SSOT)
│   ├── deployment.md           # Production & dev deployment configuration
│   ├── error-handling.md       # API error response standards & logging rules
│   ├── glossary.md             # Standard project terminology definitions
│   ├── legal-compliance.md     # Privacy Policy, Terms of Use, & consent spec
│   ├── security.md             # Security controls, auth schemes, & practices
│   └── testing-strategy.md     # QA, unit, integration, and E2E requirements
├── features/                   # Component & module architectural definitions
├── prompts/                    # Pre-defined system prompts for development workflows
└── PROJECT_INDEX.md            # Primary entry point for human and AI developers

Mandatory Instructions for AI Agents
Before reading context or writing code, every AI agent must strictly follow these rules:

Do Not Add Unapproved Dependencies: Do NOT introduce external frameworks, databases, or libraries that are not explicitly defined in the stack (e.g., do not introduce Docker, Redis, OAuth, GraphQL, PostgreSQL, Tailwind UI components requiring extra third-party libraries, etc.).

Do Not Alter System Architecture: Implement functionality strictly within existing boundaries described in features/ and docs/.

Follow Standard Error Response Formats: Ensure all new or refactored API endpoints conform to the structured JSON format specified in docs/error-handling.md.

Maintain Security Standards: Never log raw credentials, bypass auth middleware, strip sanitization steps, or expose internal exception traces to client responses.

Enforce Role Boundaries: Ensure endpoints enforce role checks (Student vs. Admin) as specified in docs/security.md.