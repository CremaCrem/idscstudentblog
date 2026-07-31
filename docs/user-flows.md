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
        │    └── Missing: Runs Open Graph Scraper fallback (Max 4s)
        │
        ├─> Saves record to MongoDB
        └─> Returns JSON response
             │
             ▼
   [React App] -> Receives success, clears form state, closes modal, appends card to Feed
```

## 2. Tag Filter & Search Sequence

```text
[Visitor / Student] -> Types "Agriculture" in Search/Filter Bar
   │
   ▼
[React App] -> Calls `GET /api/v1/blogs?tag=agriculture`
   │
   ▼
[Express API] -> Queries MongoDB using indexed `{ isPublished: true, tags: "agriculture" }`
   │
   ▼
[React App] -> Re-renders feed showing only blogs tagged with "Agriculture"
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
   │    └── Password: "••••••••"
   ├-> Clicks "Review Details"
   │    │
   │    ▼
   ├-> <FormReviewModal /> opens showing summary table (Name, Student ID, Username, Email, Masked Password)
   └-> Student reviews data & clicks "Confirm & Submit"
        │
        ▼
   [Express API] -> POST /api/v1/auth/register
        │
        ├-> Validates all fields (presence, uniqueness of username / email / studentId)
        ├-> Hashes password with bcrypt
        ├-> Creates User document { verificationStatus: "pending" }
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