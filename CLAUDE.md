# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal branding website for a solopreneur developer. Bilingual (EN/KO), statically generated, deployed to Cloudflare Pages. See `docs/PRD.md` for full product requirements.

## Principles (MUST CONFORM TO)

1. All implementation must use skills:
   - **vercel-react-best-practices**
   - **vercel-composition-patterns**
2. Once the implementation is complete, run the two sub-agents below in parallel:
   - Run a **security-reviewer** sub-agent for security audit → fix
   - Run a **tester** sub-agent for testing only changed code → fix
3. Bilingual (EN/KO) based on user language preference
4. Mobile-first responsive design

## Commands

```bash
bun dev          # Start dev server (port 3000)
bun run build    # Production build (SSG)
bun run lint     # ESLint (Next.js + TypeScript presets)
bun test         # Run tests with vitest
bunx vitest run  # Run tests once (CI mode)
```

Use `bunx --bun shadcn@latest add <component>` to add shadcn/ui components.

## Tech Stack

- **Next.js 16** (App Router, SSG only — no SSR/API routes)
- **React 19**, **TypeScript** (strict mode)
- **Tailwind CSS v4** with PostCSS, CSS variables for theming
- **Bun** as package manager
- **Geist** font family (sans + mono) via `next/font`
- Deployment: **Cloudflare Pages** with `@cloudflare/next-on-pages`

## Architecture

- `app/` — Next.js App Router pages and layouts
- `docs/PRD.md` — Product requirements document (phases, sitemap, success metrics)
- Import alias: `@/*` resolves to project root
- Dark mode via `prefers-color-scheme` CSS media query and CSS variables
- Planned: MDX content (`next-mdx-remote`), i18n (`next-intl`), D2 diagrams (pre-rendered SVG)

### Planned Route Structure

```
/[locale]/                    # Home
/[locale]/projects/[slug]     # Case studies
/[locale]/blog/[slug]         # Blog posts
/[locale]/about               # About/Resume
/[locale]/now                 # Current status
/[locale]/contact             # Contact (email-only)
```

## Key Constraints

- **SSG only** — no server-side rendering, no backend, no API routes. All pages must be statically exportable.
- **Cloudflare Pages compatibility** — use `@cloudflare/next-on-pages`; test early for compatibility issues.
- **Performance targets** — Lighthouse 95+, initial JS < 100KB gzipped, FCP < 1.0s.
- **Accessibility** — WCAG 2.1 AA compliance.
- **AI discoverability** — include `llms.txt`, JSON-LD structured data, RSS feed, XML sitemap.
