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

Technical showcase for a portfolio audience. Show **engineering thinking** — not exhaustive documentation.

### Frontmatter (minimal)

```yaml
---
title: "Project Name — Engineering"
---
```

### Writing principles

**This is a portfolio, not an internal design doc.** Target 100–150 lines per file. The reader is a fellow engineer or hiring manager scanning your projects — they want to see how you think about trade-offs, not read every implementation detail.

- **Focus on why, not what.** "We chose X over Y because Z" is interesting. "X is configured with these 8 settings" is not.
- **Lead with architecture.** A brief system overview that orients the reader — components, data flow, how they connect.
- **Highlight unique technical challenges.** What makes this project's engineering interesting? NLE positioning for timeline scenes, dual-layer browser blocking, HDBSCAN clustering instead of LLM-based grouping, presigned upload bypassing the API — these are the stories worth telling.
- **Keep decisions concise.** Each ADR should be 1–3 sentences: what was chosen, what was rejected, why. No need for full "Revisit when" sections.
- **Cut generic sections.** Auth/security, observability, CI/CD, performance metrics — unless your project does something unusual here, these don't add signal. Every project has "structured JSON logging" and "Sentry error tracking."

### What to keep vs. remove

| Keep | Remove |
|------|--------|
| Architecture overview (brief) | Crate/package listing tables |
| Interesting design decisions with trade-offs | Middleware/provider stack details |
| Unique technical challenges | CI/CD pipeline configurations |
| Data flow descriptions (brief) | Full DB schema tables (every column) |
| Key code snippets that show design (e.g., trait definitions) | Security checklist tables |
| | Performance metric/goal tables |
| | Observability bullet lists |
| | Config struct code blocks |
| | Index strategy details |

### Recommended sections

Sections are flexible — adapt to what's interesting about the project. Not every project needs every section.

| # | Section | Required? | Description |
|---|---------|-----------|-------------|
| 1 | Architecture | Required | System overview, component diagram, key boundaries |
| 2 | Key design details | Recommended | 2–4 interesting technical aspects (DB design, data flows, pipelines, etc.) |
| 3 | Key Decisions | Required | ADRs — what was chosen, over what, and why |

### MDX gotchas

- **Angle brackets in prose:** Bare `<` and `>` outside code blocks are parsed as JSX tags. Use `&lt;`/`&gt;` inside backtick inline code, or rewrite as plain English ("fewer than 100", "more than 10K").
- **HTML-like tags in inline code:** `` `<context>` `` works because remark processes backtick spans before MDX/JSX parsing, but it's safer to use `&lt;context&gt;` to avoid issues if backticks are accidentally removed.

D2 diagrams referenced by the `d2Diagram` frontmatter field will be rendered at the bottom of the Engineering tab automatically.

---

## Tips

- Write for three audiences: potential clients (Overview), product-minded readers (Design), and fellow engineers (Engineering).
- Keep the Overview scannable — use bullet points and short paragraphs.
- Design tab: focus on the "why" behind product choices, not the "how" of implementation.
- Engineering tab: show engineering thinking in 100–150 lines, not exhaustive documentation.
- Not every project needs all 3 tabs. Tabs only appear when their MDX files exist.
- Both locales (en + ko) must exist for bilingual support.
