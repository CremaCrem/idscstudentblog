# Architecture Decision Records (ADRs)

## ADR 01: Dynamic Tag Array with Lowercased Indexing
* **Status:** Approved
* **Context:** The platform requires genre-based categorization (e.g., Artificial Intelligence, Agriculture, IT) with real-time suggestions and filtering.
* **Decision:** Store tags as an array of lowercased strings (`tags: [String]`) inside each `BlogPost` document in MongoDB with multikey indexing.
* **Rationale:** Case-insensitive lowercased indexing ensures robust searching without duplicate tags like "Agriculture" and "agriculture", while keeping database schema ultra-lightweight.

## ADR 02: Hybrid Metadata Strategy (Custom Input + Open Graph Fallback)
* **Status:** Approved
* **Context:** Students requested the ability to directly set custom titles and images instead of strictly relying on auto-scraped metadata.
* **Decision:** Allow optional student input fields for `title` and `thumbnail`. Scrape Open Graph metadata only when these fields are left blank.
* **Rationale:** Gives students total creative control while retaining effortless auto-scraping as a fallback for simple submissions.

## ADR 03: Native Link Redirection over Direct Content Storage
* **Status:** Approved
* **Context:** The goal is to highlight student work without replicating full text, images, or assets locally.
* **Decision:** The platform acts strictly as a directory feed. All cards redirect users directly to the original hosted student URL via `target="_blank"`.
* **Rationale:** Keeps database requirements under ~10MB even for thousands of submissions, eliminates host liability for blog content, and ensures traffic flows directly to the students' own portfolios.