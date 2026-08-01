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

### 2.1 Navigation Bar (`/src/components/layout/Navbar.tsx`)
* Display brand name/logo.
* Unauthenticated: Login / Register links.
* Student Login (Approved): "+ Share Your Write-Up", "My Dashboard", "Logout".
* Admin Login: Displays an "Admin Panel" badge alongside health check controls.
* **Pending/Rejected States:** No authenticated session is possible. Unauthenticated navbar state is always shown.

### 2.2 Tag Search Bar & Filter Strip (`/src/components/feed/TagFilterBar.tsx`)
* Search input for filtering feed by post title, author, or tag keyword.
* Horizontal scrollable bar displaying popular tag pills (e.g., `[ All ]`, `[ Artificial Intelligence ]`, `[ Information Technology ]`, `[ Agriculture ]`).
* Clicking a tag pill updates the active feed query filter.

### 2.3 Blog Card (`/src/components/feed/BlogGridCard.tsx`)
* **Header:** Tag pill list + student author handle.
* **Media Frame:** Fixed-aspect ratio image rendering user-selected or scraped `thumbnail`. Falls back gracefully to SVG placeholder if image fails to load (`onError`).
* **Content:** Custom or scraped Title opening `originalUrl` in `target="_blank"`, short 2-line truncated description.
* **Admin Overlay (Conditional):**
  * Toggle Switch for `isPublished` (toggling off to unpublish opens a `<ConfirmationModal />` before executing the status change; see `design/interaction-patterns.md` Section 4.2).
  * Red indicator banner if `isBroken === true`.

### 2.4 Tag Autocomplete Submission Modal (`/src/components/blog/SubmitModal.tsx`)
* **Inputs:**
  * `Blog URL` (Required).
  * `Custom Title` (Optional override).
  * `Thumbnail Image` (URL string or File Upload with toggle; file selection triggers `POST /api/v1/upload/thumbnail` and auto-populates returned Cloudinary URL).
  * `Genre Tags` (Interactive Combobox / Autocomplete Tag Input).
* **Form & Interaction Behavior:**
  * **HTML Form Wrapper:** Wrapped in a native `<form onSubmit={handleSubmit}>` element. Submitting via the <kbd>Enter</kbd> key triggers step transition or form submission automatically.
  * **State Lifecycle:** Internal state (`targetUrl`, `title`, `thumbnailUrl`, `tags`, `step`, `error`) automatically resets to clean defaults whenever `isOpen` transitions to `false` or after successful post creation.
  * **Client-Side File Validation:** Image uploads validate file size (≤5MB) and MIME type (`image/png`, `image/jpeg`, `image/webp`) before sending request to backend, presenting inline error feedback if invalid.
  * **Flicker-Free Drag-and-Drop:** Dropzone uses drag counters/pointer-event shielding to prevent child element hover flickering.
  * **Accessibility:** Accessible dialog container carrying `role="dialog"`, `aria-modal="true"`, `aria-labelledby="submit-modal-title"`, and keyboard <kbd>Escape</kbd> key dismissal listener.
* **Tag Input Behavior:** As the user types (e.g., "Agri"), a drop-down suggests matching existing tags (*Agriculture*, *AgriTech*). Pressing Enter or clicking a suggestion adds the tag pill to the post.
* **Internal 2-Step Review Wizard:**
  * **Step 1 (Input Form):** Student enters the URL of their article, research write-up, or capstone project, then optionally sets a custom title, cover image, and genre tags → Clicks "Review Submission". Uploading a file displays progress indication until Cloudinary returns the hosted CDN URL.
  * **Step 2 (Live Card Preview):** Modal transitions internally to render the exact `<Card />` preview showing how the entry will appear in the IDSC showcase feed → Student clicks "Edit Details" or "Confirm & Publish to IDSC Feed".
  * *Note:* Stacked modals are strictly prohibited. The preview MUST occur within the existing modal shell. See `design/interaction-patterns.md` Section 6.

### 2.5 Registration Form (`/src/components/auth/RegisterForm.tsx`)
* **Inputs (all required unless noted):**
  * `Full Name` — legal name as registered with IDSC.
  * `Student ID Number` — unique IDSC identifier.
  * `Username` — displayed publicly on the platform.
  * `Email` — for administrator contact purposes.
  * `Password` + `Confirm Password`.
* **Behavior:**
  * Client-side validation on all fields.
  * Clicking "Submit Registration" opens a `<FormReviewModal />` displaying a summary of Full Name, Student ID, Username, and Email (Password is masked as `••••••••`).
  * On student confirmation inside the modal, `POST /auth/register` (201) is dispatched.
  * Upon successful response, the form is replaced with a **Pending Approval** confirmation banner:
    > *"Registration received. Your Full Name and Student ID are being reviewed by an IDSC administrator against the official IDSC student roster. You will receive access to publish your write-ups once your account is approved."*
  * The registration page must **not** redirect to the dashboard or issue any session. The student remains unauthenticated.

### 2.6 Admin Pending Approvals Queue (`/src/pages/AdminDashboard.tsx`)
* A dedicated **"Pending Approvals"** tab or section within the Admin Dashboard.
* Displays a table of all pending registrations with columns: **Full Name**, **Student ID**, **Username**, **Email**, **Registered At**.
* Each row includes action buttons:
  * **Approve** — Opens a `<ConfirmationModal />` (non-destructive variant) asking the admin to confirm the approval, then triggers `PATCH /api/v1/admin/users/:id/approve`.
  * **Reject** — Opens a `<ConfirmationModal />` with an optional **Rejection Reason** textarea, then triggers `PATCH /api/v1/admin/users/:id/reject`.
  * **Delete** — Opens a `<ConfirmationModal />` (destructive variant) warning that the action is permanent, then triggers `DELETE /api/v1/admin/users/:id`.
* A red badge counter on the tab shows the number of pending registrations awaiting review.
* `window.confirm()`, `window.prompt()`, and `window.alert()` are **prohibited** for all actions. See `design/interaction-patterns.md` Section 4.

### 2.7 Confirmation Modal (`/src/components/ui/ConfirmationModal.tsx`)

A reusable, project-wide modal component for confirming or reversing actions before they are executed.

#### Required for
* Approving student registrations
* Rejecting student registrations (includes optional reason input)
* Deleting user accounts
* Deleting blog posts (admin and student)
* Unpublishing blog posts
* Any future irreversible or state-altering action

#### Variants
* `default` — Confirm button is emerald (`bg-emerald-800`). Used for non-destructive confirmations.
* `destructive` — Confirm button is red (`bg-red-600`). Used for deletions and rejections.

#### Props
```tsx
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;       // Default: "Confirm"
  cancelLabel?: string;        // Default: "Cancel"
  variant?: 'default' | 'destructive';
  isLoading?: boolean;
  inputLabel?: string;         // If provided, renders a textarea
  inputPlaceholder?: string;
  onInputChange?: (value: string) => void;
}
```

#### Behavior
* Renders as a centered overlay with `bg-zinc-900/50 backdrop-blur-sm` backdrop.
* The `Escape` key and (for non-destructive variants) the backdrop click will cancel the modal.
* For destructive actions, the backdrop is not dismissible — the user must click Cancel explicitly.
* Focus is trapped inside the modal until dismissed.
* The Cancel button is visually prominent for destructive variants to discourage accidental confirmation.
* See `design/interaction-patterns.md` Section 4 for the complete specification.

### 2.8 Form Review Modal (`/src/components/ui/FormReviewModal.tsx`)

A reusable pre-submission review modal component for standalone page forms (e.g., Registration).

#### Required for
* Standalone page-level form verification before API dispatch (e.g., Student Registration).
* *Prohibited for:* Forms that already render inside an existing modal shell. Use an internal 2-step wizard instead.

#### Props
```tsx
interface FormReviewField {
  label: string;
  value: string;
  isSensitive?: boolean; // If true, masks value as ••••••••
}

interface FormReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  fields: FormReviewField[];
  confirmLabel?: string; // Default: "Confirm & Submit"
  cancelLabel?: string;  // Default: "Edit Information"
  isLoading?: boolean;
}
```

#### Behavior
* Displays fields as a 2-column key-value summary table.
* Sensitive fields (`isSensitive: true`) render masked bullets (`••••••••`).
* The Cancel button ("Edit Information") closes the review modal and returns the user to the editable form without wiping state.
* The Confirm button ("Confirm & Submit") triggers the API request while rendering a loading spinner.
* See `design/interaction-patterns.md` Section 6 for full specification.

### 2.9 Progressive Cold-Start Status Banner (`/src/components/ui/ServerStatusBanner.tsx`)

An inline feedback banner rendered above layout loading skeletons when initial API requests exceed a 3-second latency threshold due to backend container cold starts.

#### Visual Tokens & Styling
* Container: `rounded-xl bg-zinc-900 border border-black p-4 shadow-lg text-white flex items-center gap-4`
* Icon: SVG spinner indicator (`w-5 h-5 text-zinc-400 animate-spin`)
* Animation: Enters via `animate-in fade-in slide-in-from-top-2 duration-500`

#### Behavior & Rules
* Renders automatically after a 3,000ms delay during active initial API loads (e.g. `GET /api/v1/blogs`).
* Centralized state managed via custom hook or page controller to prevent duplicate banners during parallel queries.
* Automatically unmounts when API requests resolve successfully or fail with explicit HTTP error status.
* See `design/interaction-patterns.md` Section 7 for full interaction specification.