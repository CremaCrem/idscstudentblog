# Micro-Interactions & Animation Patterns

## 1. Card Hover Effects
* **Image Zoom:** On hovering a blog card, the thumbnail image scales smoothly (`scale(1.03)` over `300ms ease-out`) while staying clipped within its rounded container (`overflow: hidden`).
* **Title Underline:** The blog title smoothly transitions an underline from `0%` to `100%` width.
* **Arrow Indicator:** The top-right external link icon (`↗`) translates `2px` up and `2px` right on hover to give a tactile cue of external navigation.

---

## 2. Tag Autocomplete Combobox Behavior
1. **Focus:** Clicking into the tag input displays popular default tags (*Artificial Intelligence*, *Information Technology*, *Agriculture*).
2. **Type-Ahead Suggestion:** Typing filters the dropdown dynamically with matching highlighted text.
3. **Selection:** Pressing `Enter` or clicking a dropdown item transforms the text into an animated removable pill badge inside the input field.
4. **Duplicate Prevention:** If a tag already exists in the post's tag list, the input highlights the existing pill with a subtle shake animation instead of adding a duplicate.

---

## 3. Admin Health Scanner Interaction
* **Scanning State:** Clicking `Run Health Scan` changes the button to a spinning indicator with a live counter (`Scanning 12/45 links...`).
* **Result Transition:** As broken links are detected, rows gently fade in a red status pill (`● Connection Refused / 404`) without re-rendering the whole table.

---

## 4. Confirmation Modal Standard

### 4.1 Rule: No Browser-Native Dialogs

The application **must not** use any browser-native dialog APIs:

- `window.confirm()` — **Prohibited**
- `window.prompt()` — **Prohibited**
- `window.alert()` — **Prohibited**

All confirmation and input-gathering for actions must be implemented using the reusable `<ConfirmationModal />` React component that follows the project design system.

This is a non-negotiable UX standard. Any code that uses native browser dialogs is a bug.

---

### 4.2 When a Confirmation Modal is Required

A `<ConfirmationModal />` must be shown **before** executing any of the following actions:

| Action | Trigger Location | Modal Type |
| :--- | :--- | :--- |
| **Approve student registration** | Admin Dashboard → Pending Approvals tab | Confirm (no input) |
| **Reject student registration** | Admin Dashboard → Pending Approvals tab | Confirm + optional text input (rejection reason) |
| **Delete a pending user account** | Admin Dashboard → Pending Approvals tab | Confirm (destructive) |
| **Delete a blog post (admin)** | Admin Dashboard → Blog Submissions tab | Confirm (destructive) |
| **Delete a blog post (student)** | Student Dashboard | Confirm (destructive) |
| **Unpublish a blog post** | Admin Dashboard → Blog Submissions tab | Confirm |

Any future action that is **irreversible** or **significantly alters state** must also use a confirmation modal. This includes but is not limited to: bulk operations, account deactivation, and data exports.

---

### 4.3 Modal Behavior

- The modal renders as an **overlay** centered on screen with a backdrop (`bg-zinc-900/50 backdrop-blur-sm`).
- The **backdrop is not clickable** for destructive actions. The user must explicitly click a button to proceed or cancel.
- For **non-destructive confirmations** (e.g., Approve), clicking the backdrop may cancel the modal.
- The modal **traps focus** inside (`Tab` cycles only within the modal) until dismissed.
- The `Escape` key always cancels and closes the modal.
- While the action is processing, the **confirm button shows a loading spinner** and all modal buttons are disabled.
- On completion (success or error), the modal closes and an appropriate feedback state is shown inline.

---

### 4.4 Modal Variants

#### Confirm (Non-Destructive)
Used for: Approving a student.
- Title: Descriptive action label (e.g., "Approve Registration").
- Body: Clear explanation of the consequence.
- Buttons:
  - **Confirm** — Primary emerald button (`bg-emerald-800`).
  - **Cancel** — Ghost or outline button.

#### Confirm (Destructive)
Used for: Deleting blog posts, deleting user accounts.
- Title: Clearly states what will be destroyed (e.g., "Delete Blog Post").
- Body: Warns that the action is **permanent and cannot be undone**.
- Buttons:
  - **Delete / Confirm** — Danger button (`bg-red-600`).
  - **Cancel** — Ghost or outline button. This is the **visually dominant** button to reduce accidental destructive actions.

#### Confirm with Input (Rejection)
Used for: Rejecting a student.
- Title: "Reject Registration".
- Body: Explains the consequence and includes an **optional textarea** for a rejection reason.
- Buttons:
  - **Reject** — Danger button (`bg-red-600`).
  - **Cancel** — Ghost or outline button.

---

### 4.5 Design Requirements

The `<ConfirmationModal />` component must follow `design-system.md`:

- **Container:** `rounded-2xl bg-white shadow-xl border border-zinc-200`
- **Max width:** `max-w-md` (compact modal)
- **Backdrop:** `fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-50`
- **Title:** `text-xl font-semibold text-zinc-900`
- **Body:** `text-sm text-zinc-600 leading-relaxed`
- **Input (if needed):** Standard project input styles (see `design-system.md` Inputs section)
- **Buttons:** Follow the project button variants — do not invent new button styles
- **Icon (optional):** A contextual Lucide icon in the title area (e.g., `Trash2` for delete, `CheckCircle` for approve, `XCircle` for reject) sized `w-5 h-5`
- **Animation:** Enter with `animate-in zoom-in-95 duration-200`, exit gracefully

---

### 4.6 Accessibility Requirements

- The modal container must have `role="dialog"` and `aria-modal="true"`.
- The modal title must be referenced via `aria-labelledby`.
- The modal body must be referenced via `aria-describedby`.
- Focus must move to the modal's **first interactive element** (typically the Cancel button) when it opens.
- On close, focus must return to the **trigger element** that opened the modal.
- The Escape key must always dismiss the modal.

---

### 4.7 Component API Contract

The `<ConfirmationModal />` component must accept at minimum:

```tsx
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;       // Default: "Confirm"
  cancelLabel?: string;        // Default: "Cancel"
  variant?: 'default' | 'destructive'; // Controls confirm button color
  isLoading?: boolean;         // Shows spinner on confirm button
  inputLabel?: string;         // If set, renders a textarea for user input
  inputPlaceholder?: string;
  onInputChange?: (value: string) => void;
}
```

---

## 5. Future Development Guidelines

### 5.1 Checklist for New Features Requiring User Actions

Before implementing any new action button, ask:

1. **Is this action irreversible?** → Confirmation modal required (destructive variant).
2. **Does this significantly change another user's status or data?** → Confirmation modal required.
3. **Does this action require additional user input?** → Confirmation modal with input required.
4. **Is this a routine, low-risk action (e.g., changing a toggle)?** → No confirmation needed; provide inline undo if possible.

### 5.2 Prohibited Patterns

The following patterns are permanently banned in this codebase:

```js
// ❌ BANNED
window.confirm('Are you sure?');
window.prompt('Enter a reason:');
window.alert('Action completed.');
```

### 5.3 Required Pattern

```tsx
// ✅ REQUIRED
<ConfirmationModal
  isOpen={isConfirmOpen}
  onClose={() => setIsConfirmOpen(false)}
  onConfirm={handleDeleteBlog}
  title="Delete Blog Post"
  description="This action is permanent and cannot be undone."
  confirmLabel="Delete"
  variant="destructive"
  isLoading={isDeleting}
/>
```

---

## 6. Pre-Submission Form Review & Anti-Stacking Standards

### 6.1 Purpose & Separation of Concerns

To optimize user experience, reduce administrative rejections, and prevent accidental publishing, pre-submission review MUST be separated from action confirmation:

* **`<ConfirmationModal />` (Action Confirmation):** Used *after* a user triggers an administrative state change or destructive action (e.g., Approve, Reject, Delete).
* **`<FormReviewModal />` / In-Modal Step Review (Pre-Submission Verification):** Used *before* data is sent to the API during form submission to let users verify accuracy.

---

### 6.2 Pre-Submission Patterns by Form Context

To avoid UI anti-patterns such as nested/stacked modals (`z-index` collisions, multiple dark backdrops, focus trap deadlocks), the following two context-specific patterns must be followed:

#### Pattern A: Page-Level Standalone Forms (e.g., Student Registration Page)
* Use the reusable `<FormReviewModal />` component.
* Triggers when the user clicks the primary submission button on a standalone page.
* Displays a read-only 2-column key-value summary of entered fields (`Label` → `Value`).
* Automatically masks password fields (`••••••••`).
* Features an **"Edit Information"** button (closes modal, retains form state) and a **"Confirm & Submit"** button (dispatches API request).

#### Pattern B: Modal-Based Forms (e.g., Blog Submission Modal)
* **Prohibition:** Launching a `<FormReviewModal />` over an existing form modal (e.g. `SubmitModal`) is **permanently prohibited**.
* **Required Pattern:** Use an **Internal 2-Step Wizard** within the existing modal shell:
  * **Step 1 (Input Form):** User fills out fields (Target URL, Title, Tags, Description) → Clicks **"Review Submission"**.
  * **Step 2 (Live Card Preview):** Modal body transitions to display the exact live `<Card />` component preview → User clicks **"Edit Details"** (returns to Step 1) or **"Confirm & Publish"** (dispatches API request).

---

### 6.3 Anti-Stacking Rule

Modals must **never** stack on top of other modals. If a user is interacting inside an existing modal shell, any review or verification step must occur via internal step transitions within that same container.

---

### 6.4 Modal Form Accessibility & State Lifecycle Standards

All modal-based forms (e.g. `SubmitModal`) must adhere to the following standards:

1. **State Cleanliness:** Internal component state must reset completely to default values whenever the modal closes (`isOpen === false`) or upon successful submit. Stale inputs from prior sessions must never persist across modal openings.
2. **Form Element & Keyboard Navigation:** The modal body and footer must be enclosed within a native `<form onSubmit={handleSubmit}>`. Primary action buttons must use `type="submit"`, enabling native <kbd>Enter</kbd> key submission. Secondary/cancel buttons must explicitly specify `type="button"`.
3. **Accessibility:**
   - Container must carry `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
   - Pressing <kbd>Escape</kbd> must dismiss the modal immediately.
4. **Drag-and-Drop Dropzone Interaction:** File dropzones must use pointer-event shielding or drag counters to prevent hover state flickering when dragging over child elements.
5. **Upload Progress Feedback:** Image file uploads must display an inline loading indicator while the server processes WebP conversion and Cloudinary upload. Buttons must be disabled during active uploads.

---

## 7. Progressive Cold-Start Loading Pattern

### 7.1 Purpose & Latency Behavior
To account for Render free-tier container sleep latency (30–60+ seconds during cold starts), the application MUST handle initial data fetching delays gracefully without leaving the user with an unresponsive UI or uninformative blank screen.

### 7.2 Progressive Loading Stages
When initial read requests (e.g. `GET /api/v1/blogs`) take longer than normal threshold:

1. **Phase 1: Initial Skeleton Phase (0–3 seconds):**
   - Render standard layout skeleton loader cards (`animate-pulse`) matching the exact layout aspect ratio of `<BlogCard />`.
   - Maintain standard visual hierarchy without intrusive banners.

2. **Phase 2: Progressive Cold-Start Phase (3+ seconds):**
   - If initial requests remain unresolved after 3,000ms, smoothly fade in (`animate-in fade-in duration-300`) an inline informative status banner directly above the loading skeleton grid.
   - **Status Banner Microcopy:** `"Connecting to server instance... Waking up free-tier backend (this may take up to 45s)."`
   - **Visual Tokens:** `rounded-xl bg-zinc-900 border border-black p-4 shadow-lg text-white flex items-center gap-4` with an SVG spinner indicator (`w-5 h-5 text-zinc-400 animate-spin`).

3. **Phase 3: Completion or Error Transition:**
   - **On Success:** Fade out the status banner and skeletons simultaneously, smoothly rendering live feed content.
   - **On Genuine Error (HTTP 500/502, network offline):** Immediately clear the progressive cold-start timer and status banner, rendering the standard retry error container (`"Failed to connect to server. Check network connection."`). Never leave the cold-start message active when a request has failed.

### 7.3 Centralized Timer Rule
Slow-request detection timers MUST be managed centrally at the page or custom hook level (e.g., `useSlowRequestTimer`). Components executing parallel requests on mount (e.g., `getFeaturedBlogs` and `getAllBlogs` on `HomePage`) MUST share a single centralized timer state to prevent duplicate status banners from rendering.

### 7.4 Request Timeout Configuration
Axios requests for initial page loads must configure an extended timeout threshold of **45,000ms to 60,000ms** in `apiClient.ts` to accommodate the physical boot duration of Render free-tier containers without prematurely triggering client-side request cancellation errors.