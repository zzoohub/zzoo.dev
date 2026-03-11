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

Not every project needs all 3 tabs. Tabs only appear when their MDX files exist. Both locales (en + ko) must exist for bilingual support.

---

## Tab 1: Overview (`en.mdx` / `ko.mdx`)

The first thing visitors see. This is the **product pitch** — tell the story from problem to solution in a conversational, scannable tone.

### Writing principles

**Target 40–80 lines.** The reader is a potential user, client, or curious developer. They want to understand what this is and why it matters in under 60 seconds.

- **Lead with a relatable problem.** Open with a question or scenario the reader can identify with: "식사 기록, 해보신 적 있나요?", "Reddit에서 제품 아이디어 찾느라 몇 시간씩 스크롤한 적 있나요?"
- **Conversational tone.** Direct address, short paragraphs, no corporate-speak. This is a builder log, not a press release.
- **Show the differentiator clearly.** "Why this, not that" — what makes this project's approach different from alternatives.
- **End with a CTA.** Free trial, live demo, GitHub link — give the reader a next step.
- **Use numbered steps for "how it works."** Break the core flow into 3–5 concrete steps.

### Frontmatter

```yaml
---
title: "Project Name — Tagline"
description: "One-sentence summary for cards and SEO."
status: "active"                        # active | completed | archived
tags:                                   # category labels
  - "Healthcare"
  - "Mobile App"
techStack:
  - React Native
  - Rust
featured: true                          # show on home page?
launchDate: "2025-06-01"
tagline: "One-line Korean/English pitch"
category: "mobile-app"                  # mobile-app | chrome-extension | web | cli
thumbnail: "thumbnail.png"             # relative image path
heroImage: "hero.png"                  # optional hero image
images:                                 # optional screenshot gallery
  - "screenshot-1.png"
  - "screenshot-2.png"
d2Diagram: "diagram-name"              # optional — D2 file name (without extension)
video: "https://youtube.com/embed/..." # optional — YouTube embed URL only
links:                                  # optional
  live: "https://example.com"
  github: "https://github.com/..."
  docs: "https://docs.example.com"
keywords:                               # optional — SEO
  primary: ["keyword1", "keyword2"]
  longTail: ["long tail keyword"]
competitors:                            # optional — positioning
  - name: "Competitor A"
    differentiator: "Why we're different"
cta:                                    # optional — call to action buttons
  primary: { label: "Try Free", url: "https://..." }
  secondary: { label: "View Source", url: "https://..." }
features:                               # optional — feature cards
  - title: "Feature Name"
    description: "What it does"
    icon: "Camera"                      # optional lucide icon name
---
```

Image paths: relative paths must match `/^[a-zA-Z0-9._-]+\.(png|jpg|jpeg|gif|webp|svg|avif)$/i`. Absolute paths must start with `/images/` and cannot contain `..`.

### Recommended sections

| Section | Required? | Description |
|---------|-----------|-------------|
| Pain point intro | Yes | Open with a relatable problem or question |
| Solution / value prop | Yes | What this does and why it's different |
| How it works | Recommended | 3–5 numbered steps showing the core flow |
| Key differentiator | Recommended | The "radical" design choice that sets it apart |
| CTA | Recommended | Free trial, live link, or GitHub — give a next step |

---

## Tab 2: Design (`design.en.mdx` / `design.ko.mdx`)

Product design deep-dive for **product-minded readers**. Focus on the thinking behind UX, strategy, and business decisions — not implementation.

### Writing principles

**Target 100–140 lines.** The reader is a product manager, designer, or founder. They want to see how you think about users, trade-offs, and market positioning.

- **Start with the core insight.** What's the one observation that shaped everything? "The bottleneck is scene-level development, not sentence-level writing."
- **Name your users.** Vivid personas with specific pain points, not abstract "users."
- **Show the core loop.** How do users interact with the product? What's the habit cycle?
- **Explain product decisions as trade-offs.** "We chose X over Y because Z" — not just what you built, but what you deliberately didn't build and why.
- **Position against alternatives.** What exists today? Why is it insufficient? How is your approach different?

### Frontmatter (minimal)

```yaml
---
title: "Project Name — Design"
---
```

### Recommended sections

Adapt to what's interesting about the project. Not every project needs every section.

| # | Section | Required? | Description |
|---|---------|-----------|-------------|
| 1 | Core Insight / Design Philosophy | Required | The key observation that shaped the product |
| 2 | Target Users / Personas | Recommended | Who this is for, with specific pain points |
| 3 | Core Loop / User Journey | Recommended | How users interact — the habit cycle |
| 4 | Key Product Decisions | Required | Major design choices with rationale and trade-offs |
| 5 | UX Principles | Optional | Design principles guiding the experience |
| 6 | Competitive Positioning | Recommended | How this differs from existing alternatives |
| 7 | Business Model | Optional | Monetization strategy |
| 8 | Phase Strategy / Roadmap | Optional | Product evolution plan |

### What to keep vs. remove

| Keep | Remove |
|------|--------|
| Design decisions with trade-offs | Implementation details (that belongs in Engineering) |
| User personas with specific pain points | Abstract "user" without context |
| Core loop / habit cycle | Feature lists without narrative |
| Competitive positioning | Generic market analysis |
| UX principles that drove real decisions | UX principles as abstract platitudes |

---

## Tab 3: Engineering (`engineering.en.mdx` / `engineering.ko.mdx`)

Technical showcase for a **portfolio audience**. Show engineering thinking — not exhaustive documentation.

### Writing principles

**Target 60–100 lines.** The reader is a fellow engineer or hiring manager scanning your projects — they want to see how you think about trade-offs, not read every implementation detail.

- **Focus on why, not what.** "We chose X over Y because Z" is interesting. "X is configured with these 8 settings" is not.
- **Lead with architecture.** A brief system overview that orients the reader — components, data flow, how they connect.
- **Highlight unique technical challenges.** What makes this project's engineering interesting? NLE positioning for timeline scenes, dual-layer browser blocking, HDBSCAN clustering instead of LLM-based grouping, presigned upload bypassing the API — these are the stories worth telling.
- **Keep decisions concise.** Each ADR should be 1–3 sentences: what was chosen, what was rejected, why.
- **Cut generic sections.** Auth/security, observability, CI/CD, performance metrics — unless your project does something unusual here, these don't add signal. Every project has "structured JSON logging" and "Sentry error tracking."

### Frontmatter (minimal)

```yaml
---
title: "Project Name — Engineering"
---
```

### Recommended sections

Sections are flexible — adapt to what's interesting about the project.

| # | Section | Required? | Description |
|---|---------|-----------|-------------|
| 1 | Architecture | Required | System overview, component diagram, key boundaries |
| 2 | Key design details | Recommended | 2–4 interesting technical aspects (DB design, data flows, pipelines, etc.) |
| 3 | Key Decisions | Required | ADRs — what was chosen, over what, and why |

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

---

## MDX Gotchas

These apply to all tabs:

- **Angle brackets in prose:** Bare `<` and `>` outside code blocks are parsed as JSX tags. Use `&lt;`/`&gt;` inside backtick inline code, or rewrite as plain English ("fewer than 100", "more than 10K").
- **HTML-like tags in inline code:** `` `<context>` `` works because remark processes backtick spans before MDX/JSX parsing, but it's safer to use `&lt;context&gt;` to avoid issues if backticks are accidentally removed.
- **D2 diagrams:** Referenced by the `d2Diagram` frontmatter field, rendered at the bottom of the Engineering tab automatically.

---

## Summary

| Tab | Audience | Tone | Target Length | Core Question |
|-----|----------|------|---------------|---------------|
| Overview | Users, clients, curious devs | Conversational, scannable | 40–80 lines | "What is this and why should I care?" |
| Design | PMs, designers, founders | Strategic, decision-driven | 100–140 lines | "How did you think about users and trade-offs?" |
| Engineering | Engineers, hiring managers | Technical, concise | 60–100 lines | "What engineering decisions did you make and why?" |
