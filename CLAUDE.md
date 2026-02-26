# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal branding website for a solopreneur developer. Multilingual (6 locales), statically generated, deployed to Cloudflare Workers. See `docs/PRD.md` for full product requirements.

## Principles (MUST CONFORM TO)

1. All implementation must use skills:
   - Use **vercel-react-best-practices** skill
   - Use **vercel-composition-patterns** skill
   - Use **z-search-visibility** skill
2. Once the implementation is complete, run the two sub-agents below in parallel:
   - Run a **z-security-reviewer** sub-agent for security audit → fix
   - Run a **z-verifier** sub-agent for verifying changes (run tests, E2E, browser verify)
3. Multilingual (en, es, pt-BR, id, ja, ko) based on user language preference
4. Mobile-first responsive design

## Commands

```bash
bun dev                          # Start dev server (port 3000)
bun run build                    # Production build (SSG, prebuild runs diagrams + RSS)
bun run build:diagrams           # Compile .d2 files to SVG (light + dark)
bun run build:rss                # Generate public/rss.xml from EN blog posts
bun run lint                     # ESLint (Next.js + TypeScript presets)
bun test                         # Run tests with vitest (watch mode)
bunx vitest run                  # Run tests once (CI mode)
bunx vitest run lib/content      # Run a single test file
bunx vitest run --coverage       # Run tests with v8 coverage
```

```bash
bun run build:worker             # Full Cloudflare Workers build (diagrams + opennextjs-cloudflare)
bun run preview                  # Local preview via opennextjs-cloudflare
bun run deploy                   # Deploy to Cloudflare Workers (needs CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID)
```

Use `bunx --bun shadcn@latest add <component>` to add shadcn/ui components.

## Tech Stack

- **Next.js 16** (App Router, SSG only — no SSR/API routes)
- **React 19**, **TypeScript** (strict mode)
- **Tailwind CSS v4** with PostCSS, CSS variables (oklch color space) for theming
- **Bun** as package manager
- **Geist** font family (sans + mono) via `next/font`
- **next-intl** for i18n routing and translations
- **next-mdx-remote/rsc** for server-side MDX compilation
- **next-themes** for dark mode (`.dark` class strategy)
- **shadcn/ui** (new-york style, lucide icons, RSC-compatible)
- **Giscus** for GitHub-backed comments on blog/project pages
- **Vitest** + Testing Library for unit/component tests
- Deployment: **Cloudflare Workers** with `@opennextjs/cloudflare` (config: `open-next.config.ts`, `wrangler.jsonc`)

## Architecture

### Content System (file-based MDX)

Content lives in `content/` with locale-specific MDX files:

```
content/
├── about/            # {locale}.mdx
├── blog/{slug}/      # {locale}.mdx
├── projects/{slug}/  # {locale}.mdx + optional design.{locale}.mdx, casestudy.{locale}.mdx + *.d2 files
└── testimonials.json # Array of { quote, authorName, authorRole, authorCompany, featured? }
```

`lib/content.ts` loads content via filesystem using `gray-matter` for frontmatter + `next-mdx-remote/rsc` for rendering. All content functions accept a `locale` parameter. Slugs are validated with `/^[a-zA-Z0-9_-]+$/`.

**Locale fallback**: If a locale-specific file (e.g. `ko.mdx`) doesn't exist, the system falls back to `en.mdx`. This means content only needs an English file at minimum.

**Reading time**: CJK locales (ko, ja) use `ceil(chars / 300)`, others use `ceil(words / 200)`.

**Blog frontmatter:** `title`, `description`, `date` (ISO), `tags` (string[]), `draft` (optional bool)

**Case study frontmatter:** `title`, `description`, `clientType`, `status` ("active"|"completed"|"archived"), `techStack` (string[]), `featured` (bool), `launchDate` (ISO), `d2Diagram` (optional), `links` (optional: `live`, `github`, `docs` URLs), `thumbnail`, `images` (string[]), `tagline`, `category` ("mobile-app"|"chrome-extension"|"web"|"cli"), `keywords` ({ primary?, longTail? }), `competitors` ([{ name, differentiator }]), `features` ([{ title, description, icon? }]), `cta` ({ primary?, secondary?: { label, url } }), `heroImage`, `video` (YouTube embed URL only)

Projects can have an optional design doc (`design.en.mdx`/`design.ko.mdx`) rendered as a second tab via `ProjectDetailTabs`.

### i18n (next-intl)

- Config: `i18n/routing.ts` (locales: en, es, pt-BR, id, ja, ko; default: en)
- Translations: `messages/{locale}.json` (6 files) — UI strings only (not content)
- Namespaces: `nav`, `hero`, `home`, `projects`, `project`, `blog`, `about`, `now`, `contact`, `footer`, `availability`, `common`
- Navigation: import `Link`, `redirect`, `usePathname` from `@/i18n/navigation` (locale-aware)
- Middleware: `middleware.ts` handles locale detection and routing
- Locale persistence: `NEXT_LOCALE` cookie (1-year expiry, lax sameSite, secure)
- Server components: every page/layout must call `setRequestLocale(locale)` with locale from `params` — NOT `getLocale()` which makes pages dynamic
- Async server components cannot call `useTranslations` — use async wrapper + sync inner component pattern
- Client components: use `useTranslations('Namespace')` hook

### Route Structure

```
/[locale]/                        # Home (featured projects, testimonials)
/[locale]/projects/               # Projects listing
/[locale]/projects/[slug]         # Case study detail (MDX)
/[locale]/blog/                   # Blog listing (client-side tag filtering)
/[locale]/blog/[slug]             # Blog post detail (MDX)
/[locale]/about                   # About/Resume with timeline
/[locale]/now                     # Current status
/[locale]/contact                 # Contact (email-only)
```

### Key Patterns

- **Server Components first**: pages fetch data, pass to client components as props
- **Composition split**: server page → client interactive wrapper (e.g., `BlogPage` → `BlogListClient`)
- **Static generation**: all pages use `generateStaticParams()` for all locales
- **D2 diagrams**: `.d2` files in content dirs → prebuild compiles to `/public/diagrams/{name}-{theme}.svg` → `D2Diagram` component renders theme-aware SVG
- **Site config**: `lib/site-config.ts` holds availability status, social links, email, cal link
- **Dark mode**: `next-themes` with `.dark` class; CSS variables in `app/globals.css`
- **Styling util**: use `cn()` from `@/lib/utils` (clsx + tailwind-merge)
- **Security headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy — all configured in `next.config.ts` `headers()`. frame-src allows YouTube + Giscus embeds only.
- **Project images**: relative paths in frontmatter resolve to `/images/projects/{slug}/{path}`

### SEO / Metadata

- `lib/seo.ts` — central module for all SEO utilities: `buildCanonicalUrl()`, `buildAlternates()`, `buildPageMeta()`, and JSON-LD schema builders (WebSite, Person, BlogPosting, SoftwareApplication, BreadcrumbList)
- Every page has a `generateMetadata()` function (not static `export const metadata`) that uses `buildPageMeta()` for OG, Twitter card, canonical, and hreflang alternates
- `components/json-ld.tsx` — `<JsonLd data={...} />` renders `<script type="application/ld+json">` (data is from trusted internal config, safe)
- `app/robots.ts` → `/robots.txt`, `app/sitemap.ts` → `/sitemap.xml` with hreflang alternates per locale
- `scripts/generate-rss.ts` → `public/rss.xml` (EN blog posts, runs at prebuild)
- `public/llms.txt` — static AI discoverability file
- `public/og-default.png` — 1200x630 default OG image (generated via `scripts/generate-og-image.ts` using sharp)

### Testing

- Vitest + Testing Library with jsdom environment
- `vitest.setup.ts` globally mocks `next-intl` (`useTranslations` returns the key as-is) and `next-themes` (`useTheme` returns `"light"`)
- Coverage includes `lib/**` and `components/**`, excludes test files and `types.ts`
- Test files live alongside source: `components/foo.test.tsx`, `lib/bar.test.ts`

### Vitest Gotchas

- `vi.useFakeTimers({ shouldAdvanceTime: true })` causes flaky tests on CI — real wall-clock time accumulates. Use `vi.useFakeTimers()` without it.
- For async handlers with fake timers (e.g. clipboard API), use `vi.advanceTimersByTimeAsync(0)` inside `act()` to flush promises.

## Key Constraints

- **SSG only** — no server-side rendering, no backend, no API routes. All pages must be statically exportable.
- **Cloudflare Workers compatibility** — use `@opennextjs/cloudflare`; verify all routes show `●` (SSG) in `next build` output, not `ƒ` (Dynamic).
- **Performance targets** — Lighthouse 95+, initial JS < 100KB gzipped, FCP < 1.0s.
- **Accessibility** — WCAG 2.1 AA compliance. Skip link, ARIA labels, semantic HTML.
- **AI discoverability** — include `llms.txt`, JSON-LD structured data, RSS feed, XML sitemap.
