# User Flow Sequences

## 1. Student Post Submission Sequence (With Custom Tags & Overrides)

```text
[Student] -> Clicks "+ Submit Blog Link"
   │
   ├─> Opens Submit Modal
   ├─> Enters URL: "https://my-blog.vercel.app/agri-ai"
   ├─> Enters Custom Title: "AI Applications in Agriculture"
   ├─> Types Tags: "Artificial Intelligence", "Agriculture" (Receives Autocomplete Suggestions)
   └─> Clicks "Publish Link"
        │
        ▼
   [Express API] -> Receives POST Request
        │
        ├─> Validates JWT Token
        ├─> Normalizes tag array: ["artificial intelligence", "agriculture"]
        ├─> Checks if Title/Thumbnail provided:
        │    ├── Custom provided: Uses student provided title/image
        │    └── Missing: Runs Open Graph Scraper fallback (Max 4s)
        │
        ├─> Saves record to MongoDB
        └─> Returns JSON response
             │
             ▼
   [React App] -> Receives success, closes modal, appends card to Feed with active tag pills
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