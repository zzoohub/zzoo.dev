# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Builder Log for a solopreneur developer. Multilingual (2 locales: en, ko), statically generated, deployed to Vercel. See `docs/PRD.md` for full product requirements.

## Principles (MUST FOLLOW)

1. Content writing MUST use designated skills:
   - Blog posts → use **z-dev-essay** skill
   - Project pages (overview, design, engineering tabs) → use **z-project-writing** skill
2. All implementation must use skills:
   - Use **vercel-react-best-practices** skill
   - Use **z-search-visibility** skill
3. Once the implementation is complete, run the two sub-agents below in parallel:
   - Run a **z-security-reviewer** sub-agent for security audit → fix
   - Run a **z-verifier** sub-agent for verifying changes (run tests, E2E, browser verify)
4. Multilingual (en, ko) based on user language preference
5. Mobile-first responsive design

## Commands

```bash
bun dev                          # Start dev server (port 3000)
bun run build                    # Production build (prebuild: images + diagrams + RSS)
bun run build:images             # Copy project images from content/ to public/images/
bun run build:diagrams           # Compile .d2 files to SVG (light + dark)
bun run build:rss                # Generate public/rss.xml from EN blog posts
bun run lint                     # ESLint (Next.js + TypeScript presets)
bun test                         # Run tests with vitest (watch mode)
bunx vitest run                  # Run tests once (CI mode)
bunx vitest run lib/content      # Run a single test file
bunx vitest run --coverage       # Run tests with v8 coverage
```

```bash
bun run preview                  # Local preview via next start (requires bun run build first)
```

Use `bunx --bun shadcn@latest add <component>` to add shadcn/ui components.

## Tech Stack

Next.js 16 (App Router, SSG only), React 19, TypeScript strict, Tailwind CSS v4 (oklch theming), Bun, Geist font via `next/font`, next-intl, next-mdx-remote/rsc, next-themes (`.dark` class), shadcn/ui (new-york style, lucide icons), Zod (frontmatter validation), Giscus comments, Vitest + Testing Library, Vercel (deployment).

## Architecture

### Content System (file-based MDX)

The content system is a module at `lib/content/` (import via `@/lib/content`):

```
lib/content/
├── index.ts         # Barrel re-exports
├── schemas.ts       # Zod validation schemas for all frontmatter
├── types.ts         # TypeScript types derived from Zod schemas
├── utils.ts         # resolveContentPath, calculateReadingTime, resolveProjectImage, etc.
├── blog.ts          # getAllBlogPosts, getBlogPost
├── projects.ts      # getAllProjects, getProject, hasDesignContent, getDesignContent, hasEngineeringDoc, getEngineeringDoc
├── about.ts         # getAboutContent
├── testimonials.ts  # getTestimonials
└── content.test.ts  # Tests
```

Content directory structure:

```
content/
├── about/               # {locale}.mdx — experience[] in frontmatter drives career timeline
├── blog/{slug}/         # {locale}.mdx
├── projects/{slug}/     # See project structure below
└── testimonials.json    # Array of { quote, authorName, authorRole, authorCompany, featured? }
```

Project content structure (three tabs: Overview · Design · Engineering):

```
content/projects/{slug}/
├── en.mdx                    # Overview (REQUIRED → "Overview" tab)
├── {locale}.mdx              # Translated overview
├── design.{locale}.mdx      # Product design (OPTIONAL → "Design" tab)
├── engineering.{locale}.mdx  # Engineering (OPTIONAL → "Engineering" tab)
├── images/                   # Source images → copied to public/images/projects/{slug}/
└── *.d2                      # D2 diagram sources
```

Key behaviors:
- **Locale fallback**: missing `{locale}.mdx` → falls back to `en.mdx`
- **Reading time**: CJK (ko) → `ceil(chars / 300)`, others → `ceil(words / 200)`
- **Zod validation**: all frontmatter parsed via schemas in `schemas.ts`. Invalid optional fields silently drop (`.catch(undefined)`) rather than throwing. Date fields coerce `Date` objects to `"YYYY-MM-DD"` strings.
- **Image path validation**: relative paths must match `/^[a-zA-Z0-9._-]+\.(png|jpg|jpeg|gif|webp|svg|avif)$/i`; absolute paths must start with `/images/` and cannot contain `..`
- **Slug validation**: `/^[a-zA-Z0-9_-]+$/`

Blog frontmatter: `title`, `description`, `date` (ISO), `tags` (string[]), `draft` (optional bool)

Project frontmatter: `title`, `description`, `status` (`active|completed|archived`), `tags`, `techStack`, `featured`, `launchDate`, `thumbnail`, `images`, `heroImage`, `d2Diagram`, `links` (`{live?, github?, docs?}`), `video` (YouTube embed URL only), `tagline`, `category` (`mobile-app|chrome-extension|web|cli`), `keywords` (`{primary?, longTail?}`), `competitors` (`[{name, differentiator}]`), `cta` (`{primary?, secondary?}`), `features` (`[{title, description, icon?}]`). See `lib/content/schemas.ts` for full validation spec.

### Static Params

`lib/static-params.ts` exports `generateContentStaticParams()` — centralizes `generateStaticParams` for slug-based routes. Used by blog and project pages to avoid duplication.

### i18n (next-intl)

- Config: `i18n/routing.ts` — locales: en, ko; default: en
- Translations: `messages/{locale}.json` — UI strings only (not content)
- Navigation: import `Link`, `redirect`, `usePathname` from `@/i18n/navigation` (locale-aware)
- `i18n/request.ts` uses static `MESSAGE_MAP` (explicit imports) — intentional for SSG compatibility
- **Server components must call `setRequestLocale(locale)` from `params`** — NOT `getLocale()` (breaks SSG)
- Async server components cannot call `useTranslations` — use async wrapper + sync inner component pattern

### Key Patterns

- **Server Components first** → client interactive wrappers (e.g., `BlogPage` → `BlogListClient`)
- **Static generation**: all pages use `generateStaticParams()` for all locales
- **D2 diagrams**: `.d2` → prebuild → `/public/diagrams/{name}-{theme}.svg` → `D2Diagram` component (uses `useSyncExternalStore` for SSR hydration — always renders light theme on server, switches on client mount). Rendered in the Engineering tab.
- **Project 3-tab system**: `ProjectDetailTabs` component renders Overview (always) + Design (if `design.{locale}.mdx` exists) + Engineering (if `engineering.{locale}.mdx` exists). Tab props: `overviewLabel/Content`, `designLabel/Content`, `engineeringLabel/Content`, `hasDesign`, `hasEngineering`.
- **SEO**: `lib/seo.ts` — `buildPageMeta()`, `buildCanonicalUrl()`, `buildAlternates()`, JSON-LD builders (`buildWebSiteJsonLd`, `buildPersonJsonLd`, `buildArticleJsonLd`, `buildProjectJsonLd`, `buildBreadcrumbJsonLd`, `buildFAQJsonLd`). Every page uses `generateMetadata()` (not static export).
- **JSON-LD sanitization**: `components/shared/json-ld.tsx` escapes `<`, `>`, `&` to prevent XSS
- **Styling**: `cn()` and `proseClassName` from `@/lib/utils` (import, don't duplicate); CSS vars in `app/globals.css`
- **Site config**: `lib/site-config.ts` — availability status, social links, email, `navItems` array
- **Project images**: relative frontmatter paths resolve to `/images/projects/{slug}/{path}` via `resolveProjectImage()`
- **Routes**: `/projects`, `/blog`, `/about` (primary nav); `/now`, `/contact` (footer only)

### Testing

- Vitest + Testing Library (jsdom). Test files alongside source: `foo.test.tsx`
- `vitest.setup.ts` mocks `next-intl` (returns key as-is, special case for `"booked"` key with values), `next-intl/routing` (`defineRouting`), and `next-themes` (returns `"light"`)
- Coverage: `lib/**/*.{ts,tsx}` and `components/**/*.{ts,tsx}`, excludes `**/types.ts`
- **Gotcha**: `vi.useFakeTimers({ shouldAdvanceTime: true })` causes CI flakes — use `vi.useFakeTimers()` without it
- For async + fake timers: `vi.advanceTimersByTimeAsync(0)` inside `act()` to flush promises

## Key Constraints

- **SSG only** — no SSR, no API routes. Verify `●` (SSG) in build output, not `ƒ` (Dynamic).
- **Vercel** — deployed via Vercel GitHub integration (auto build + deploy on push to main, PR preview deployments).
- **Performance** — Lighthouse 95+, JS < 100KB gzipped, FCP < 1.0s
- **Accessibility** — WCAG 2.1 AA
- **Security headers** — CSP, HSTS, X-Frame-Options etc. in `next.config.ts` `headers()`. frame-src: YouTube + Giscus only.
