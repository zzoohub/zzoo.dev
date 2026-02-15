# Product Requirements Document — Personal Branding Website

**Solopreneur & Freelancer Platform — Optimized for the AI Era**

---

| Field | Detail |
|-------|--------|
| Document Title | Personal Branding Website PRD |
| Version | 3.0 (Next.js 16, No Backend, Email-Only Contact) |
| Date | February 16, 2026 |
| Author | Solo Developer / Solopreneur |
| Status | Draft |

---

## 1. Document Overview

### 1.1 Purpose

This PRD defines the requirements for a personal branding website that showcases technical expertise, builds professional credibility, and serves as the definitive online presence for a solopreneur developer. The site is optimized for AI-era discoverability, thought leadership, and organic relationship-building — not direct selling.

### 1.2 Target Audience

| Audience | What They Need | Conversion Goal |
|----------|---------------|-----------------|
| Potential Clients | Proof of competence, project track record, social proof | Reach out via email |
| Recruiters | Technical skills, project portfolio, experience | Reach out for opportunity |
| Technical Peers | Thought leadership, technical depth | Follow, share, collaborate |
| AI Search Engines | Structured, machine-readable data | Surface in AI-generated answers |

### 1.3 Key Changes from v1

This version repositions the site from a developer portfolio to a personal branding platform. Key additions include: case study format for projects (outcome-focused), social proof and testimonials, calls-to-action throughout the site, and availability status indicator. This version explicitly avoids any backend logic — contact is handled via email link only, keeping the site purely static.

---

## 2. Product Vision

### 2.1 Problem Statement

Solopreneurs and freelancers face a credibility gap: potential clients need to trust them before engaging, but traditional portfolios only showcase work without building trust or guiding visitors toward action. Meanwhile, AI systems are increasingly mediating professional discovery, and most personal sites are invisible to LLM crawlers. The site must solve both problems: build trust with humans and be discoverable by machines.

### 2.2 Vision Statement

A bilingual (EN/KO), AI-optimized personal branding platform that positions the developer as a trusted solopreneur — building credibility through outcome-driven case studies, technical writing, and social proof, while being the definitive source of truth for AI systems answering questions about the developer's expertise. The site is purely static with zero backend logic.

### 2.3 Success Metrics

| Category | Metric | Target | Measurement |
|----------|--------|--------|-------------|
| Performance | Lighthouse Score | 95+ | Lighthouse CI |
| SEO | Lighthouse SEO | 100 | Lighthouse CI |
| AI Discovery | AI search indexing | 2+ AI engines | Manual verification |
| Conversion | Email CTA click rate | > 3% | Cloudflare Analytics |
| Speed | Time to Interactive | < 1.5s on 3G | WebPageTest |
| Content | Blog posts/month | 2+ | Git commits |

---

## 3. Technical Stack

### 3.1 Core Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 16 (SSG) | Developer familiarity, React 19 support, strong ecosystem, static export |
| Language | TypeScript | Type safety, better DX, self-documenting code |
| Styling | Tailwind CSS v4 | Utility-first, excellent dark mode support, small bundle |
| Content | MDX (next-mdx-remote) | Markdown with component support for rich content |
| i18n | next-intl | Battle-tested Next.js i18n with static export support |
| Dark Mode | next-themes | Flash-free theme switching, SSG compatible |
| Diagrams | D2 (d2lang) | Declarative, version-controllable architecture diagrams |
| Hosting | Cloudflare Pages | Global edge CDN, generous free tier, fast builds |
| Adapter | @cloudflare/next-on-pages | Official Next.js to Cloudflare Pages adapter |
| Analytics | Cloudflare Web Analytics | Privacy-first, no cookie banner, free |

### 3.2 Development Tools

| Tool | Technology | Purpose |
|------|-----------|---------|
| Linter | ESLint + Biome | Code quality and formatting |
| Package Manager | pnpm | Fast, disk-efficient dependency management |
| CI/CD | Cloudflare Pages (Git) | Auto-deploy on push to main branch |

### 3.3 Architecture Constraints

- Static Site Generation (SSG) only — no SSR in v1
- All content stored as MDX files in the repository (Git-based CMS)
- D2 diagrams pre-rendered to SVG at build time
- No backend logic — purely static site, contact via email only
- No database in v1 — Cloudflare D1 reserved for future features
- Bundle size budget: < 100KB initial JS (gzipped)

---

## 4. Information Architecture

### 4.1 Site Map

| Route | Page | Description |
|-------|------|-------------|
| `/[locale]` | Home | Hero + intro + CTA + social proof preview |
| `/[locale]/projects` | Case Studies | Outcome-focused project case studies |
| `/[locale]/projects/[slug]` | Case Study Detail | Problem → solution → result + architecture diagram |
| `/[locale]/blog` | Blog | Blog / TIL post list |
| `/[locale]/blog/[slug]` | Blog Post | Individual blog post (MDX) |
| `/[locale]/about` | About | Professional bio + career timeline + resume |
| `/[locale]/now` | Now | Current status, focus, availability |
| `/[locale]/contact` | Contact | Email link + external profile links + booking CTA |
| `/llms.txt` | LLM Context | AI-readable professional summary |
| `/rss.xml` | RSS Feed | Blog syndication |
| `/sitemap.xml` | Sitemap | Search engine sitemap |

### 4.2 Conversion Funnel

Every page is designed with a conversion path in mind. The site follows a trust-building funnel:

1. **Awareness:** Visitor arrives via search, AI answer, or referral.
2. **Interest:** Home page hero + intro establishes credibility in < 5 seconds.
3. **Evaluation:** Case studies prove outcomes; blog demonstrates expertise.
4. **Trust:** Testimonials, technical depth, and /about page build confidence.
5. **Action:** CTA buttons throughout lead to /contact email or external booking link.

---

## 5. Feature Requirements

### 5.1 MVP Features (v1)

#### F1: Bilingual Support (EN/KO)

Full internationalization with locale-prefixed routing. All UI strings and content available in both English and Korean. Language switcher in global navigation. Default locale detected from browser settings with manual override. hreflang tags on all pages for SEO.

- **Priority:** P0 — Must Have
- **Acceptance Criteria:** All pages render in both locales; switcher persists preference; hreflang tags present; SEO meta tags reflect locale

#### F2: Dark/Light Mode

System-preference-aware theme switching with manual override. Persists across sessions via localStorage. No flash of incorrect theme on load (next-themes blocking script). All components and D2 diagrams styled for both themes.

- **Priority:** P0 — Must Have

#### F3: Home Page (Conversion-Optimized)

The home page is the primary landing page and must establish credibility within 5 seconds. Structure:

- Hero section: Professional headline (not just name — a value proposition), short tagline, primary CTA button ("See My Work" or "Get in Touch")
- Short introduction: 2–3 sentences positioning expertise and background
- Featured case studies: 2–3 top projects with outcome metrics
- Social proof strip: Client testimonial quotes or logo bar
- External links: GitHub, LinkedIn, email, and other profiles as icon links
- Availability badge: "Currently accepting projects" or "Booked until [date]"

- **Priority:** P0 — Must Have

#### F4: Case Studies (Replaces Project Cards)

Projects are presented as case studies focused on client outcomes rather than tech specs. This is a critical distinction for solopreneur positioning — clients buy outcomes, not technology.

Each case study contains:

1. **Overview:** Client type, engagement duration, and one-line outcome summary.
2. **Problem:** What challenge the client faced.
3. **Solution:** Approach taken, key decisions, and methodology.
4. **Tech Stack:** Technologies used, categorized by layer.
5. **Architecture Diagram:** D2-rendered SVG showing system design.
6. **Results:** Measurable outcomes (performance improvements, cost savings, user growth, etc.).
7. **Learnings:** Key takeaways and what the developer would do differently.

- **Priority:** P0 — Must Have
- **Acceptance Criteria:** At least 2 case studies at launch; each includes all 7 sections; D2 diagrams render in both themes; outcome metrics visible on list page cards

#### F5: Blog / TIL Section

MDX-based blog with code syntax highlighting, images, and embedded components. Tag-based categorization. RSS feed auto-generated. Each post includes title, date, reading time, tags, and locale. Blog content serves dual purpose: thought leadership for brand building and SEO/AI content for discoverability.

- **Priority:** P0 — Must Have

#### F6: AI Discoverability Layer

Machine-readable metadata for AI search engines and LLM crawlers:

- **llms.txt:** Plain text summary at site root — identity, expertise, and key projects
- **JSON-LD:** Person schema (home/about), SoftwareApplication (case studies), Article (blog posts)
- **Open Graph + Twitter Card** meta tags on all pages
- **Canonical URLs and hreflang tags** for bilingual SEO
- **RSS feed** for content syndication
- **XML sitemap** for search engine indexing
- **robots.txt** with crawl directives

- **Priority:** P0 — Must Have

#### F7: Contact Page (Email-Only, No Backend)

A simple, clean contact page with no form or backend logic. Contact is handled entirely through email and external links. This keeps the site purely static and eliminates spam concerns.

- Prominent email address with a `mailto:` link and a copy-to-clipboard button
- External profile links: LinkedIn, GitHub, and other relevant platforms
- Optional: External calendar booking link (e.g., Cal.com) for scheduling calls directly
- Availability status badge matching the home page indicator
- Preferred contact method note (e.g., "Email is the best way to reach me")

- **Priority:** P0 — Must Have
- **Acceptance Criteria:** Email link works in both locales; copy button copies email to clipboard; external links open in new tab

#### F8: Testimonials / Social Proof

Client testimonials displayed as quotes with attribution (name, company, role). Shown on the home page as a preview strip. Content managed via MDX or a JSON data file for easy updates.

- **Priority:** P1 — Should Have

#### F9: /now Page with Availability

Living document showing current professional status: what the developer is working on, learning, and available for. Includes a clear availability indicator ("Open to new projects" / "Limited availability" / "Fully booked until [date]"). Updated manually via MDX. Follows the nownownow.com convention.

- **Priority:** P1 — Should Have

#### F10: About / Resume Page

Detailed professional biography with career timeline. Clean, parseable text optimized for both human reading and AI extraction. Optionally includes downloadable PDF resume. Emphasis on the solopreneur narrative: why the developer works independently, what they bring to clients.

- **Priority:** P1 — Should Have

#### F11: Global CTA Components

Reusable call-to-action components embedded throughout the site. A sticky or floating CTA on long pages (blog posts, case studies) that remains accessible as visitors scroll. CTAs adapt based on context: "Hire Me" on case studies, "Subscribe" on blog posts, "Get in Touch" on about/now pages.

- **Priority:** P1 — Should Have

### 5.2 Future Features (v2+)

| Feature | Description | Priority |
|---------|-------------|----------|
| Decision Logs | Per-project technical decision records ("why X over Y") | P2 |
| Newsletter | Email subscription for updates (e.g., Buttondown or Resend) | P2 |
| Contact Form | Form with Cloudflare Workers backend for lead capture (if email-only proves insufficient) | P2 |
| Client Portal | Authenticated dashboard for active clients to track project progress | P3 |
| AI Chat Widget | RAG-powered chatbot trained on site content for visitor Q&A | P3 |
| Guestbook | Visitor messages (would require Cloudflare Workers + D1) | P3 |
| Product Pages | Dedicated pages for SaaS products or digital goods if pivoting to product-led | P3 |
| Booking Integration | Embedded Cal.com or Calendly widget for direct scheduling | P3 |
| Reading List | Curated list of books, articles, and tools | P3 |

---

## 6. Content Structure

### 6.1 MDX Frontmatter Schemas

#### Blog Post

```yaml
---
title: string          # required
description: string    # required
date: string           # ISO date, required
tags: string[]
locale: "en" | "ko"
draft: boolean         # default: false
readingTime: number    # auto-calculated at build time
---
```

#### Case Study (Project)

```yaml
---
title: string          # required
description: string    # required
clientType: string     # e.g., "Startup", "Enterprise", "Agency"
status: "active" | "completed" | "archived"
techStack: string[]
thumbnail: string      # image path
d2Diagram: string      # path to .d2 source file
featured: boolean
duration: string       # e.g., "3 months"
outcomeMetric: string  # e.g., "40% faster load times"
startDate: string      # ISO date
endDate: string        # ISO date
links:
  live: string         # optional
  github: string       # optional
  docs: string         # optional
---
```

#### Testimonial (JSON)

```json
{
  "quote": "string",
  "authorName": "string",
  "authorRole": "string",
  "authorCompany": "string",
  "featured": true
}
```

### 6.2 Directory Structure

```
/
├── content/
│   ├── blog/
│   │   ├── en/*.mdx            # English blog posts
│   │   └── ko/*.mdx            # Korean blog posts
│   ├── projects/
│   │   ├── en/*.mdx            # English case studies
│   │   └── ko/*.mdx            # Korean case studies
│   ├── diagrams/*.d2           # D2 architecture diagram sources
│   └── testimonials.json       # Client testimonials data
├── messages/
│   ├── en.json                 # English UI translations
│   └── ko.json                 # Korean UI translations
├── public/
│   └── diagrams/*.svg          # Pre-rendered D2 SVG outputs
└── ...
```

---

## 7. D2 Diagram Integration

### 7.1 Workflow

D2 diagrams follow a build-time rendering pipeline:

1. **Author:** Write `.d2` source files in `/content/diagrams/` using D2's declarative syntax.
2. **Build:** A build script compiles `.d2` files into `.svg` outputs in `/public/diagrams/`.
3. **Reference:** Case study MDX files reference the SVG via the `d2Diagram` frontmatter field.
4. **Render:** The case study detail component loads the SVG inline, supporting both themes.

### 7.2 Theme Support

Each D2 diagram is compiled twice at build time: once with a light theme and once with a dark theme. The component conditionally renders the appropriate SVG based on the current theme. Output naming convention: `[name]-light.svg` and `[name]-dark.svg`.

### 7.3 Build Script

A Node.js build script (`scripts/build-diagrams.js`) handles D2 compilation. It scans `/content/diagrams/` for `.d2` files, invokes the D2 CLI for each with both light and dark theme flags, and outputs SVGs to `/public/diagrams/`. This script runs as a pre-build step in the CI/CD pipeline.

---

## 8. Non-Functional Requirements

### 8.1 Performance

- Lighthouse Performance score ≥ 95
- First Contentful Paint < 1.0s
- Total Blocking Time < 200ms
- Cumulative Layout Shift < 0.1
- Initial JS bundle < 100KB gzipped

### 8.2 Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation for all interactive elements
- Sufficient color contrast in both light and dark modes
- Semantic HTML with proper ARIA labels
- Alt text for all images; accessible SVG diagrams

### 8.3 SEO & AI Discoverability

- Unique title and meta description per page and locale
- Canonical URLs with hreflang alternates
- JSON-LD structured data (Person, SoftwareApplication, Article)
- XML sitemap, RSS feed, robots.txt, llms.txt
- Open Graph and Twitter Card meta tags

### 8.4 Security

- Content Security Policy (CSP) headers via Cloudflare
- HTTPS enforced (Cloudflare default)
- No backend logic, forms, or user authentication (minimal attack surface)
- Subresource integrity for external scripts

---

## 9. Deployment & Infrastructure

### 9.1 Deployment Pipeline

1. Developer pushes to `main` branch on GitHub.
2. Cloudflare Pages triggers build.
3. Build: `pnpm install` → D2 diagram compilation → `next build` → static export.
4. Cloudflare deploys static output to global edge network.
5. Preview deployments auto-generated for pull requests.

### 9.2 Environments

| Environment | Trigger | URL |
|-------------|---------|-----|
| Production | Push to main | yourname.dev |
| Preview | Pull request | [hash].pages.dev |
| Local | pnpm dev | localhost:3000 |

### 9.3 Custom Domain

Cloudflare Pages supports custom domains with automatic SSL. The site will be served from a custom domain (e.g., yourname.dev) with Cloudflare DNS for optimal performance. Cloudflare's global edge network ensures sub-50ms TTFB for both Korean and international visitors.

---

## 10. Development Milestones

| Phase | Duration | Deliverables |
|-------|----------|-------------|
| Phase 1 | Week 1–2 | Project scaffolding: Next.js + TypeScript + Tailwind + next-intl + next-themes. Home page with hero, intro, CTA, external links, availability badge. Global layout: nav, footer, locale switcher, theme toggle. |
| Phase 2 | Week 3–4 | Case studies section: list view + detail page (problem/solution/result + D2 diagram). D2 build pipeline (light/dark). Contact page with email link and external profiles. |
| Phase 3 | Week 5–6 | Blog section with MDX, syntax highlighting, tag filtering, RSS. AI discoverability: JSON-LD, llms.txt, OG tags, sitemap. /now and /about pages. Testimonials component. |
| Phase 4 | Week 6 | Cloudflare Pages deployment. Custom domain setup. Performance + SEO audit. Content population (at least 2 case studies, 2 blog posts). Final QA and launch. |

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Cloudflare + Next.js compat | Some Next.js features may not work on Cloudflare Pages | Strict SSG-only; test with @cloudflare/next-on-pages early in Phase 1 |
| D2 CLI in CI | D2 may not be in Cloudflare build image | Pre-render SVGs locally and commit; or custom build image |
| Bilingual content load | Doubles writing effort | English-first; add Korean incrementally; consider AI-assisted translation |
| Scope creep | Solo developer stretched thin | Strict MVP; defer v2 features; ship iteratively |
| No social proof at launch | Empty testimonials section looks worse than none | Hide testimonials until at least 2 are collected; use peer endorsements initially |
| llms.txt convention changes | Early-stage convention may evolve | Keep llms.txt simple; update as convention matures |

---

## 12. Appendix

### 12.1 Reference Links

- Next.js: https://nextjs.org/docs
- next-intl: https://next-intl-docs.vercel.app
- next-themes: https://github.com/pacocoursey/next-themes
- D2 Language: https://d2lang.com
- Cloudflare Pages: https://developers.cloudflare.com/pages
- @cloudflare/next-on-pages: https://github.com/cloudflare/next-on-pages
- llms.txt: https://llmstxt.org
- JSON-LD / Schema.org: https://schema.org
- /now page movement: https://nownownow.com/about
- Cal.com (open-source scheduling): https://cal.com

### 12.2 Glossary

| Term | Definition |
|------|-----------|
| SSG | Static Site Generation — pre-rendering pages at build time |
| MDX | Markdown with JSX — React components inside markdown |
| D2 | Modern declarative diagramming language (d2lang.com) |
| JSON-LD | JSON for Linking Data — structured data for search engines |
| llms.txt | Emerging convention for AI crawler context |
| CTA | Call to Action — button or link prompting user action |
| i18n | Internationalization — multi-language support |
| TTFB | Time to First Byte — server response latency |
| Solopreneur | Solo entrepreneur running a business independently |

---

*— End of Document —*
