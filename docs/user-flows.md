# User Flow Sequences

## 1. Student Post Submission Sequence (With Custom Tags & Image Upload)

```text
[Student] -> Clicks "+ Submit Blog Link"
   │
   ├─> Opens Submit Modal (Step 1: Input Form)
   ├─> Enters URL, Custom Title, and Types Tags
   ├─> Optionally selects custom image file (validated client-side: max 5MB, PNG/JPG/WEBP)
   │    │
   │    ├─ [Custom File Selected] → POST /api/v1/upload/thumbnail (multipart/form-data)
   │    │    │
   │    │    ▼
   │    │   [Express API] → Validates MIME/size → Sharp converts to WebP → Uploads to Cloudinary
   │    │                   Returns { url, publicId }
   │    │
   ├─> Clicks "Review Submission"
   │    │
   │    ▼
   ├─> Step 2 (Live Card Preview): Modal transitions to show live <Card /> preview
   └─> Student reviews card preview & clicks "Confirm & Publish"
        │
        ▼
   [Express API] -> POST /api/v1/blogs
        │
        ├─> Validates JWT Token
        ├─> Normalizes tag array: ["artificial intelligence", "agriculture"]
        ├─> Checks if Title/Thumbnail provided:
        │    ├── Custom provided: Uses student provided title/image URL & cloudinaryPublicId
        │    └── Missing: Runs Open Graph Scraper fallback (Max 5s)
        │
        ├─> Saves record to MongoDB
        └─> Returns JSON response
             │
             ▼
   [React App] -> Receives success, clears form state, closes modal, appends card to Feed
```

## 2. Tag Discovery, Date Filter & Infinite Search Sequence

```text
[Visitor / Student] -> Navigates to Explore Page (Feed)
   │
   ├─> [React App] -> Calls `GET /api/v1/tags/popular?limit=15` on mount
   │    │
   │    ▼
   │   [Express API] -> Returns tags ordered by usage count
   │    │
   │    ▼
   │   [React App] -> Populates <TagFilterBar /> dynamically
   │
   ├─> Selects a dynamic tag (e.g., "Agriculture") or a Date Filter (e.g., "This Week")
   │    │
   │    ▼
   │   [React App] -> Resets feed page counter to `page=1`
   │    │
   │    ▼
   │   [React App] -> Calls `GET /api/v1/blogs?tag=agriculture&dateFrom=...&dateTo=...&page=1`
   │    │
   │    ▼
   │   [Express API] -> Queries MongoDB and returns Page 1
   │    │
   │    ▼
   │   [React App] -> Re-renders feed showing matching blogs
   │
   └─> Scrolls to the bottom of the feed
        │
        ▼
       [IntersectionObserver] -> Detects <InfiniteScrollSentinel /> entering viewport
        │
        ▼
       [React App] -> Increments page (e.g., `page=2`) and fetches `GET /api/v1/blogs?...&page=2`
        │
        ▼
       [React App] -> Appends new cards to the existing list, allowing native `loading="lazy"` to fetch images as they scroll into view
```

## 3. Student Registration & Admin Verification Sequence

```text
[Student] -> Navigates to /register
   │
   ├-> Fills Registration Form:
   │    ├── Full Name: "Juan dela Cruz"
   │    ├── Student ID: "2021-00123"
   │    ├── Username: "student_dev"
   │    ├── Email: "student@example.com"
   │    ├── Password: "••••••••"
   │    └── Checkbox: [x] "I agree to Terms of Use (/terms) & Privacy Policy (/privacy)" (see docs/legal-compliance.md)
   ├-> Clicks "Review Details" (disabled until checkbox is checked)
   │    │
   │    ▼
   ├-> <FormReviewModal /> opens showing summary table + Legal Acceptance badge: "✔ Agreed to Privacy Policy & Terms of Use (v1.0)"
   └-> Student reviews data & clicks "Confirm & Submit"
        │
        ▼
   [Express API] -> POST /api/v1/auth/register
        │
        ├-> Validates fields (presence, uniqueness, termsAccepted === true)
        ├-> Hashes password with bcrypt
        ├-> Creates User document { verificationStatus: "pending", termsAcceptedAt: now, termsVersion: "1.0" }
        └-> Returns 201 { message: "Pending admin approval" } — NO JWT token issued
             │
             ▼
   [React App] -> Displays "Pending Approval" confirmation screen
        │
        ▼
   [Admin] -> Navigates to /admin -> "Pending Approvals" tab
        │
        ├-> Reviews submitted Full Name and Student ID against IDSC roster
        │
        ├─ [APPROVE] → Admin clicks Approve → <ConfirmationModal /> opens (variant: default)
        │    │   "Approve this student registration? This will grant the student full access."
        │    ├─ Admin clicks Confirm
        │    └─ PATCH /api/v1/admin/users/:id/approve
        │         │
        │         ▼
        │   [Express API] → Sets verificationStatus = "approved"
        │                     Records verifiedAt = now, verifiedBy = adminId
        │
        └─ [REJECT] → Admin clicks Reject → <ConfirmationModal /> opens (variant: destructive, with textarea input)
             │   "Reject this registration? You may optionally provide a reason."
             ├─ Admin optionally enters a rejection reason
             ├─ Admin clicks Reject
             └─ PATCH /api/v1/admin/users/:id/reject
                  │
                  ▼
                 [Express API] → Sets verificationStatus = "rejected"
                                   Optionally stores rejectionReason

[Student] -> Later attempts POST /api/v1/auth/login
   │
   ├── verificationStatus == "pending" -> 403 ACCOUNT_PENDING_APPROVAL
   ├── verificationStatus == "rejected" -> 403 ACCOUNT_REJECTED
   └── verificationStatus == "approved" -> 200 OK + JWT token issued
```

## 4. Admin Student Directory & Profile Inspection Sequence

```text
[Admin] -> Navigates to /admin -> Clicks "Student Directory" Tab
   │
   ├─> [React App] -> Calls `GET /api/v1/admin/users`
   │    │
   │    ▼
   │   [Express API] -> Returns array of all registered students with aggregate blog counts
   │    │
   │    ▼
   │   [React App] -> Renders <StudentDirectoryTable /> with student rows:
   │                  [Full Name, Student ID, Username, Email, Created Date, Post Count, Actions]
   │
   ├─> Admin searches/filters or clicks "View Profile" on a specific student
   │    │
   │    ▼
   │   [React App] -> Calls `GET /api/v1/admin/users/:id`
   │    │
   │    ▼
   │   [Express API] -> Queries User record + all associated BlogPost records by authorId
   │                    Returns { user: { _id, fullName, studentId, username, email, createdAt, verifiedAt }, blogs: [...] }
   │    │
   │    ▼
   │   [React App] -> Opens <StudentProfileModal /> displaying:
   │                  ├── Student Profile Card: Full Name, Student ID, User ID (_id), Email, @username, Account Created Date, Verification Timestamp
   │                  └── Posted Blogs Breakdown:
   │                       ├── Lists all submissions (Healthy, Broken, Warning, Pending)
   │                       ├── Blog Title, Target URL, Tags, Created Date
   │                       └── Quick-action toggles (Publish/Unpublish switch, Delete post)
   │
   └─> Admin closes modal or navigates back to Directory table
```