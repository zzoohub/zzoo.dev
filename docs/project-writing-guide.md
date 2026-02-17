# Project Writing Guide

Each project lives in `content/projects/{slug}/` with up to 4 files:

```
content/projects/{slug}/
├── en.mdx            # Product Brief (English) — REQUIRED
├── ko.mdx            # Product Brief (Korean)  — REQUIRED
├── design.en.mdx     # Design Doc (English)    — optional
└── design.ko.mdx     # Design Doc (Korean)     — optional
```

---

## Product Brief (`en.mdx` / `ko.mdx`)

The main file visitors see first. Focus on **what** and **why** — not deep technical detail.

### Frontmatter (required)

```yaml
---
title: "Project Name — Tagline"
description: "One-sentence summary for cards and SEO."
clientType: "Personal Product"          # or "Client Work", "Open Source", etc.
status: "active"                        # active | completed | archived
techStack:
  - React Native
  - Rust
featured: true                          # show on home page?
duration: "Ongoing"                     # or "3 months", etc.
startDate: "2025-06-01"
endDate: "2025-09-01"                   # optional — omit if ongoing
d2Diagram: "diagram-name"              # optional — name of D2 diagram file (without extension)
links:                                  # optional
  live: "https://example.com"
  github: "https://github.com/..."
  docs: "https://docs.example.com"
---
```

### Recommended sections

| Section | Required? | Description |
|---------|-----------|-------------|
| (intro paragraph) | Yes | What is this project and why does it exist? |
| Problem | Recommended | What pain point does it solve? |
| Solution | Recommended | High-level approach and key design decisions |
| Key Features | Optional | Bullet list of notable features |
| Target Users | Optional | Who is this for? |
| Business Model | Optional | How will it make money? |
| Results | Optional | Metrics, outcomes, impact |
---

## Design Doc (`design.en.mdx` / `design.ko.mdx`)

Technical deep-dive for engineers. Only create if there's enough technical content to justify a separate tab.

### Frontmatter (minimal)

```yaml
---
title: "Project Name — Engineering Design Doc"
---
```

### Recommended sections


| # | Section | Required? | Description |
|---|---------|-----------|-------------|
| 1 | [Overview / Problem Statement](#1-overview--problem-statement) | Required | Why this system is needed and what problem it solves |
| 2 | [Goals & Non-Goals](#2-goals--non-goals) | Required | Scope of the document — Non-Goals are especially important |
| 3 | [Architecture](#3-architecture) | Required | System components and how they connect |
| 4 | [Tech Stack](#4-tech-stack) | Recommended | Technology choices and reasoning |
| 5 | [Database Design](#5-database-design) | Recommended | Schema design, normalization, indexing, and query optimization |
| 6 | [API Design](#6-api-design) | Recommended | Endpoints, contracts, and patterns |
| 7 | [Security](#7-security) | Recommended | Auth, data handling, and threat model |
| 8 | [Infrastructure](#8-infrastructure) | Optional | Deployment, CI/CD, and monitoring |
| 9 | [Performance](#9-performance) | Optional | Benchmarks and optimization strategies |
| 10 | [Trade-offs & Alternatives](#10-trade-offs--alternatives) | Optional | Why other approaches were not chosen |
| 11 | [Risks & Open Questions](#11-risks--open-questions) | Optional | Unresolved decisions and known risks |
| 12 | [Milestones / Rollout Plan](#12-milestones--rollout-plan) | Optional | Phased rollout plan and timeline |


D2 diagrams referenced by the `d2Diagram` frontmatter field will be rendered at the bottom of the Design Doc tab automatically.

---

## Tips

- Write for two audiences: potential clients (Product Brief) and fellow engineers (Design Doc).
- Keep the Product Brief scannable — use bullet points and short paragraphs.
- The Design Doc can be longer and more detailed.
- Not every project needs a Design Doc. Simple projects can have just the Product Brief.
- Both files must exist in both locales (en + ko) for bilingual support.
