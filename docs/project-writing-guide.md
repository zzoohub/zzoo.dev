# Project Writing Guide

Each project lives in `content/projects/{slug}/` with up to 6 files across 3 tabs:

```
content/projects/{slug}/
├── en.mdx                # Overview (English)     — REQUIRED (Tab 1)
├── ko.mdx                # Overview (Korean)      — REQUIRED (Tab 1)
├── design.en.mdx         # Design (English)       — optional (Tab 2)
├── design.ko.mdx         # Design (Korean)        — optional (Tab 2)
├── engineering.en.mdx    # Engineering (English)  — optional (Tab 3)
└── engineering.ko.mdx    # Engineering (Korean)   — optional (Tab 3)
```

---

## Tab 1: Overview (`en.mdx` / `ko.mdx`)

The main file visitors see first. Focus on **what** and **why** — product overview with light marketing tone.

### Frontmatter (required)

```yaml
---
title: "Project Name — Tagline"
description: "One-sentence summary for cards and SEO."
status: "active"                        # active | completed | archived
techStack:
  - React Native
  - Rust
featured: true                          # show on home page?
launchDate: "2025-06-01"
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

## Tab 2: Design (`design.en.mdx` / `design.ko.mdx`)

Product design deep-dive. Focus on **design decisions, UX, and business strategy** — not implementation.

### Frontmatter (minimal)

```yaml
---
title: "Project Name — Design"
---
```

### Recommended sections

| # | Section | Required? | Description |
|---|---------|-----------|-------------|
| 1 | Core Insight / Design Philosophy | Required | The key idea that shaped the product |
| 2 | User Personas | Recommended | Vivid, named personas with specific pain points |
| 3 | User Journey / Core Loop | Recommended | How users interact with the product |
| 4 | Key Product Decisions | Required | Major design choices with rationale (the "why") |
| 5 | UX Principles | Recommended | Design principles guiding the experience |
| 6 | Competitive Positioning | Recommended | How this differs from alternatives |
| 7 | Business Model | Optional | Monetization strategy |
| 8 | Roadmap / Phase Strategy | Optional | Product evolution plan |

---

## Tab 3: Engineering (`engineering.en.mdx` / `engineering.ko.mdx`)

Technical deep-dive for engineers. Covers architecture, implementation, and infrastructure.

### Frontmatter (minimal)

```yaml
---
title: "Project Name — Engineering"
---
```

### Recommended sections

| # | Section | Required? | Description |
|---|---------|-----------|-------------|
| 1 | System Architecture | Required | Components, data flow, and how they connect |
| 2 | Architecture Decisions | Required | Key ADRs with rationale and trade-offs |
| 3 | Tech Stack Rationale | Recommended | Why each technology was chosen |
| 4 | Database Design | Recommended | Schema, normalization, indexing, query optimization |
| 5 | API Design | Recommended | Endpoints, contracts, and patterns |
| 6 | Infrastructure | Recommended | Deployment, CI/CD, and monitoring |
| 7 | Security | Recommended | Auth, data handling, and threat model |
| 8 | Performance | Optional | Benchmarks and optimization strategies |
| 9 | Observability | Optional | Logging, monitoring, error tracking |

D2 diagrams referenced by the `d2Diagram` frontmatter field will be rendered at the bottom of the Engineering tab automatically.

---

## Tips

- Write for three audiences: potential clients (Overview), product-minded readers (Design), and fellow engineers (Engineering).
- Keep the Overview scannable — use bullet points and short paragraphs.
- Design tab: focus on the "why" behind product choices, not the "how" of implementation.
- Engineering tab: can be longer and more detailed with technical specifics.
- Not every project needs all 3 tabs. Tabs only appear when their MDX files exist.
- Both locales (en + ko) must exist for bilingual support.
