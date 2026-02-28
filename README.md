# zzoo.dev

Builder log for a solopreneur developer. Multilingual (6 locales), statically generated, deployed to Vercel.

## Tech Stack

- **Next.js 16** (App Router, SSG only)
- **React 19**, **TypeScript** (strict mode)
- **Tailwind CSS v4** with oklch theming
- **Bun** as package manager
- **next-intl** for i18n (EN, ES, PT-BR, ID, JA, KO)
- **next-mdx-remote** for MDX content
- **next-themes** for dark mode
- **shadcn/ui** components
- **D2** diagrams (compiled to SVG at build time)
- **Vitest** + Testing Library for tests
- **Vercel** for deployment

## Getting Started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server (port 3000) |
| `bun run build` | Production build (SSG, includes diagram compilation) |
| `bun run build:diagrams` | Compile `.d2` files to SVG (light + dark themes) |
| `bun run lint` | ESLint |
| `bun test` | Run tests (watch mode) |
| `bunx vitest run` | Run tests once (CI mode) |
| `bun run preview` | Local preview via `next start` |

## Project Structure

```
content/              # File-based MDX content
├── about/            # About page ({locale}.mdx)
├── blog/             # Blog posts by slug
├── projects/         # Case studies by slug
└── testimonials.json # Social proof data

messages/             # UI translation strings
├── en.json
├── es.json
├── pt-BR.json
├── id.json
├── ja.json
└── ko.json

app/[locale]/         # Locale-prefixed routes (Next.js App Router)
components/           # React components
lib/                  # Utilities, content loading, site config
public/diagrams/      # Pre-rendered D2 SVGs
```

## Content

Content is authored as MDX files in the `content/` directory with locale-specific variants (`en.mdx`, `ko.mdx`, etc.). Frontmatter is parsed with `gray-matter` and MDX is rendered server-side via `next-mdx-remote/rsc`.

### Adding a blog post

Create `content/blog/<slug>/en.mdx` (and optionally other locale files) with frontmatter:

```yaml
---
title: Post Title
description: Short description
date: 2026-01-01
tags: [tag1, tag2]
---
```

### Adding a project

Create `content/projects/<slug>/en.mdx` (and optionally other locale files) with frontmatter:

```yaml
---
title: Project Name
description: Short description
status: completed
techStack: [Next.js, TypeScript]
featured: true
launchDate: 2026-01-01
---
```

## License

All rights reserved.
