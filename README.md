# IDSC Pulse 🎓✨

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Sharp_WebP-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)

A modern, high-performance web platform designed to aggregate, feature, and highlight technical write-ups, articles, and research published by university students at **Infotech Development Systems College (IDSC)**. 

Rather than duplicating full-text articles locally, IDSC Pulse acts as a canonical directory feed—driving real web traffic directly back to student creators' personal portfolios and hosted blogs.

---

## 🌟 Key Features

### 👨‍🎓 For Students
- **IDSC Verification Queue:** Student registration requires Full Name and Student ID verification. Accounts are held in a pending state until verified by an IDSC administrator.
- **Pre-Submission Registration Review:** Interactive review modal (`<FormReviewModal />`) confirms registration details with password masking prior to account creation.
- **2-Step Submission Wizard:** Submit external blog URLs with an internal step-by-step wizard:
  - **Step 1:** Paste URL, override Title/Thumbnail, and tag with real-time autocompleting genre pills.
  - **Step 2:** Live `<BlogGridCard />` preview inside the modal shell before publishing.
- **Server-Mediated Cloudinary Uploads:** Drag-and-drop cover image file upload with client-side 5MB validation, automatic backend **Sharp WebP** optimization, and Cloudinary CDN hosting.
- **Personal Dashboard:** Manage personal write-ups, edit metadata, and track publication status.

### 🛡️ For Administrators
- **Student Verification Queue:** Inspect submitted student IDs against official IDSC rosters with one-click Approve, Reject (with custom reasons), or Account Deletion actions.
- **Content Moderation Dashboard:** Instant toggle switch for post visibility (`isPublished`) and destructive post management.
- **Automated Link Health Check:** Batch HTTP diagnostic scanner with 3.0s timeouts that pings all directory links to detect 404/500 errors, updating live visual status badges (`● Healthy (200 OK)` vs `● Broken Link`).
- **Directory Metrics:** Real-time summary analytics grid tracking total posts, registered users, healthy links, and broken submissions.

---

## 🏗️ Technology Stack

| Layer | Technology | Key Libraries / Services |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite | React Router v7, Axios, Lucide React, Tailwind CSS |
| **Backend** | Node.js, Express.js | JWT (`jsonwebtoken`), `bcrypt`, `multer` |
| **Image Pipeline**| Sharp, Cloudinary | Synchronous WebP conversion, signed stream upload |
| **Database** | MongoDB Atlas | Mongoose ODM, lowercased multikey tag indexes |
| **Styling** | Vanilla Tailwind CSS | Pure utility classes, custom design token system |

---

## 📁 Repository Structure

```text
IDSCStudentBlog/
├── client/                     # Frontend Vite + React application
│   ├── src/
│   │   ├── components/         # UI component design system
│   │   │   ├── auth/           # Route guards and authentication components
│   │   │   ├── blog/           # SubmitModal wizard and post controls
│   │   │   ├── feed/           # Blog grid cards, hero section, tag filter bar
│   │   │   ├── layout/         # AppLayout, Navbar, Footer, UserDropdown
│   │   │   └── ui/             # Standardized atomic UI elements & modals
│   │   ├── contexts/           # React AuthContext state provider
│   │   ├── pages/              # Application views (Home, About, Login, Admin, etc.)
│   │   ├── services/           # Axios API client modules (auth, blog, tags, upload)
│   │   └── types/              # TypeScript interfaces and type definitions
│   ├── index.html              # HTML5 entry point
│   ├── vite.config.ts          # Vite build configuration
│   └── tsconfig.json           # TypeScript configuration
├── server/                     # Backend Express.js REST API
│   ├── src/
│   │   ├── config/             # Database connection & environment setup
│   │   ├── controllers/        # Request handlers (auth, blog, admin, upload, user)
│   │   ├── middleware/         # Auth guard & RBAC role authorization factory
│   │   ├── models/             # Mongoose schemas (User, BlogPost, Tag)
│   │   ├── routes/             # REST route registrations
│   │   ├── services/           # Core business logic (image processing, scraper, tags)
│   │   └── app.js              # Express app setup, CORS & global error handling
│   └── package.json            # Node.js server dependencies
├── design/                     # UX specifications, layout guides, and design tokens
├── docs/                       # Single Source of Truth (SSOT) system documentation
│   ├── api-contract.md         # Full REST API interface specifications
│   ├── architecture.md        # System architecture & component topology
│   ├── database.md            # MongoDB Mongoose schemas & indexes
│   ├── decisions.md           # Architecture Decision Records (ADRs 01–06)
│   ├── requirements.md        # System specifications & functional rules
│   └── user-flows.md          # User interaction sequence diagrams
├── features/                   # Module requirement definitions
└── PROJECT_INDEX.md            # Primary index and development workflow rules
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** `>= 18.x`
* **npm** `>= 9.x`
* **MongoDB Atlas** cluster URI (or local MongoDB instance)
* **Cloudinary Account** (Cloud Name, API Key, API Secret)

---

### Local Environment Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/IDSCStudentBlog.git
cd IDSCStudentBlog
```

#### 2. Backend Setup (`server`)
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:
```env
PORT=5050
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/blogdb
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
ALLOWED_ORIGIN=http://localhost:5173

# Cloudinary Integration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the Express development server:
```bash
npm run dev
```
*Server runs at `http://localhost:5050`*

#### 3. Frontend Setup (`client`)
In a new terminal window:
```bash
cd client
npm install
```

Create a `.env` file inside the `client/` directory (if needed):
```env
VITE_API_BASE_URL=http://localhost:5050/api/v1
```

Start the Vite development server:
```bash
npm run dev
```
*Client application runs at `http://localhost:5173`*

---

## 📡 API Contract Summary

Base Route: `/api/v1`

| Endpoint | Method | Access | Description |
| :--- | :---: | :---: | :--- |
| `/auth/register` | `POST` | Public | Register new student account (`verificationStatus: "pending"`) |
| `/auth/login` | `POST` | Public | Authenticate user & return JWT token |
| `/auth/me` | `GET` | Authenticated | Fetch current user session details |
| `/blogs` | `GET` | Public | Get published blog posts (supports `tag`, `search`, `page`) |
| `/blogs/featured` | `GET` | Public | Fetch top 3 recent published posts for Hero showcase |
| `/blogs` | `POST` | Student/Admin | Submit a new blog post |
| `/upload/thumbnail`| `POST` | Student/Admin | Upload image binary (`multipart/form-data`) → WebP Cloudinary URL |
| `/tags/suggestions`| `GET` | Public | Real-time tag autocomplete suggestions |
| `/admin/users/pending`| `GET` | Admin Only | List student accounts awaiting IDSC verification |
| `/admin/users/:id/approve`| `PATCH` | Admin Only | Approve student registration |
| `/admin/users/:id/reject` | `PATCH` | Admin Only | Reject student registration with optional reason |
| `/admin/health-check` | `POST` | Admin Only | Trigger batch HTTP link health diagnostic scan |
| `/admin/blogs/:id/toggle-publish` | `PATCH` | Admin Only | Toggle post visibility on public feed |

*For complete API payload definitions and error codes, refer to [`docs/api-contract.md`](docs/api-contract.md).*

---

## 🏛️ Architecture Decision Records (ADRs)

* **ADR 01: Dynamic Tag Array with Lowercased Indexing** — Case-insensitive lowercased tag storage in MongoDB for fast multikey indexing.
* **ADR 02: Hybrid Metadata Strategy** — Student custom title/thumbnail overrides with automatic Open Graph scraper fallbacks.
* **ADR 03: Native Link Redirection** — External tab navigation (`target="_blank"`) avoiding local content replication.
* **ADR 04: Project-Wide React Confirmation Modal** — Native browser popups (`alert/confirm`) are prohibited in favor of reusable `<ConfirmationModal />`.
* **ADR 05: Modal Separation & Anti-Stacking Rule** — Pre-submission verification uses internal 2-step modal wizards or standalone `<FormReviewModal />`. Modal stacking is permanently prohibited.
* **ADR 06: Server-Mediated Cloudinary Image Storage** — Signed upload stream via Sharp WebP conversion with automatic Mongoose post-delete asset cleanup hooks.

*See full rationale in [`docs/decisions.md`](docs/decisions.md).*

---

## 🔒 Security & Code Standards

- **Password Hashing:** Passwords hashed with `bcrypt` (10 salt rounds).
- **Authentication:** Signed JWT tokens with HTTP-only cookie & Authorization header support.
- **RBAC Enforcement:** Route-level middleware using `authGuard` and `authorizeRoles(...)` factories.
- **Strict Styling Policy:** Zero CSS Modules or inline styling. Utility-first Tailwind CSS enforced across all components.
- **Input Sanitization:** User input string trimming and low-latency Open Graph timeout protection (4.0s max).

---

## 📜 License

Distributed under the **ISC License**. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for the <strong>Infotech Development Systems College (IDSC)</strong> student community.
</p>
