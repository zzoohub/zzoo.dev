# UX Strategy Document: zzoo.dev Personal Branding Website

## First Principles Checklist

**The ONE user goal:** A visitor arrives and within seconds determines whether this developer can solve their problem, then takes the shortest path to making contact.

**Who are the users?** Potential clients evaluating a freelancer, recruiters scanning qualifications, technical peers assessing expertise, and AI crawlers extracting structured information.

**What is the minimum information needed at each step?** Only what advances the visitor from "Who is this?" to "I should reach out."

**What can be removed?** Anything that does not build credibility, demonstrate competence, or reduce friction to contact.

---

## 1. Design Principles

These five principles govern every design decision on the site. When in conflict, earlier principles take priority.

### P1: Credibility in Five Seconds

The visitor must understand who you are, what you do, and why they should care before they scroll. This means the hero section carries the entire weight of first impression. No decorative filler. No ambiguity. The value proposition, a single CTA, and one proof point (availability badge or outcome metric) must be visible above the fold on every viewport.

### P2: Outcomes Over Features

Every piece of content is framed around what the client gets, not what the developer knows. Case studies lead with results ("40% faster load times"), not tech stacks. Blog posts have clear takeaways. The tech stack is supporting evidence, never the headline.

### P3: Progressive Disclosure

Show only what is needed for the current decision. The home page is a curated summary. Each page goes one level deeper. Case study cards show the outcome metric; the detail page reveals the full narrative. Blog post titles signal the topic; the full post delivers the depth. Users who need depth can find it; users who do not are never overwhelmed.

### P4: Friction-Free Contact

Every page must have a clear, low-effort path to making contact. Since contact is email-only (no forms, no backend), the CTA pattern is: (1) a mailto link styled as a primary button, and (2) a copy-to-clipboard fallback for mobile users whose mail client is not configured. The booking link (Cal.com) is a secondary action. Never make the visitor hunt for how to reach you.

### P5: Performance as UX

A slow site signals carelessness. Every interaction decision is constrained by the performance budget: <100KB initial JS gzipped, FCP <1.0s, Lighthouse 95+. This rules out heavy animation libraries, client-side routing transitions, and large image carousels. Motion is CSS-only. Images are optimized at build time. The site should feel instantaneous.

---

## 2. Navigation & Information Architecture

### 2.1 Header Structure

```
+------------------------------------------------------------------+
|  [Logo/Name]    Home  Projects  Blog  About              [🌐][◐] |
+------------------------------------------------------------------+
```

**Specifications:**

- **Height:** 64px (desktop), 56px (mobile)
- **Position:** `sticky` at top, with a subtle `backdrop-blur-sm` and `border-b border-border` on scroll. Uses an `IntersectionObserver` on a sentinel element to toggle the border/blur — zero JS cost beyond initial setup.
- **Logo/Name:** Site name "zzoo.dev" in Geist Mono, weight 600, links to `/{locale}/`. Acts as the brand mark. No separate logo image needed.
- **Nav links:** Geist Sans, weight 400, 14px. Active page indicated by `font-weight: 500` and `text-foreground` (versus `text-muted-foreground` for inactive). No underlines — they clutter the minimal aesthetic. On hover: `text-foreground` transition 150ms.
- **Utility area (right side):** Language switcher and theme toggle, separated from nav links by a vertical divider (`border-l border-border h-5`).
- **Language switcher:** A text button showing the alternate locale ("KO" when on English, "EN" when on Korean). Not a dropdown — there are only two locales. Tap to switch. This is faster than a select menu and eliminates a click.
- **Theme toggle:** A single icon button. Sun icon in dark mode, moon icon in light mode (shows what you will switch TO, following the convention of showing the action, not the state). 36x36px touch target with 8px padding around a 20px icon.
- **Skip link:** Hidden until focused. First focusable element on every page. "Skip to main content" linking to `#main`. Visible style: solid background, high contrast, positioned at top-left.
- **Pages excluded from nav:** `/now` and `/contact` are accessible from footer and contextual CTAs but not in the primary nav. This keeps the nav to 4 items, reducing cognitive load.

### 2.2 Mobile Navigation

**Pattern:** Collapsible top navigation.

- A hamburger icon (three lines, 44x44px touch target) replaces nav links at the `md` breakpoint (768px).
- Tapping opens a full-width dropdown below the header, pushing content down (not overlaying).
- The dropdown lists all nav links vertically, each as a 48px-tall row with 16px left padding.
- Language switcher and theme toggle appear at the bottom of the dropdown, in a row.
- The dropdown is a CSS `max-height` transition (from 0 to a set value), no JS animation library needed. `transition: max-height 200ms ease-out`.
- Tapping any link or tapping the hamburger again closes the menu.
- The menu closes automatically on route change.

### 2.3 Footer Structure

```
+------------------------------------------------------------------+
|                                                                    |
|  zzoo.dev                  Navigation        Connect               |
|  Solopreneur Developer     Home               GitHub →             |
|                            Projects            LinkedIn →           |
|  [Availability Badge]      Blog                Email →              |
|                            About               RSS →                |
|                            Now                                      |
|                            Contact                                  |
|                                                                    |
|  -----------------------------------------------------------      |
|  © 2026 zzoo.dev  ·  Built with Next.js  ·  EN | KO              |
+------------------------------------------------------------------+
```

**Specifications:**

- **Layout:** Three-column on desktop (brand / nav / connect), stacked on mobile.
- **Brand column:** Site name, one-line descriptor, availability badge (same component as home page).
- **Navigation column:** All site pages including `/now` and `/contact` (which are not in the header nav). This provides discoverability for secondary pages.
- **Connect column:** External links (GitHub, LinkedIn, email) with external-link icons. Each opens in a new tab with `rel="noopener noreferrer"`.
- **Bottom bar:** Copyright, a "Built with Next.js" credit (optional), and language switcher as redundant access point.
- **Spacing:** `py-16` top/bottom padding. `border-t border-border` separator from page content. `bg-muted/50` subtle background differentiation.

### 2.4 Breadcrumb Strategy

Breadcrumbs are shown only on detail pages (case study detail, blog post detail) where the user is two levels deep. They appear directly below the header, above the page title.

```
Projects / Project Name
Blog / Post Title
```

- Styled in `text-muted-foreground` at 14px, with the current page name in `text-foreground`.
- The parent link is clickable. The separator is `/` (forward slash), not a chevron.
- On mobile, breadcrumbs are still shown but truncated: `... / Post Title` if the full path exceeds the viewport width.

---

## 3. Page-by-Page UX Breakdown

### 3.1 Home Page (`/[locale]/`)

**Primary user goal:** Understand who this person is and what they offer in under 5 seconds, then navigate deeper or make contact.

**Visual hierarchy (top to bottom):**

```
+------------------------------------------------------------------+
|  [Header]                                                          |
+------------------------------------------------------------------+
|                                                                    |
|  HERO SECTION                                                      |
|                                                                    |
|  [Availability Badge: "Open to new projects"]                      |
|                                                                    |
|  I build software that                                             |
|  solves real problems.                         (h1, 48px/56px)     |
|                                                                    |
|  Full-stack developer and solopreneur          (p, 20px, muted)    |
|  helping startups and teams ship reliable                          |
|  software — from architecture to deployment.                       |
|                                                                    |
|  [ See My Work ]  [ Get in Touch ]            (primary + ghost)    |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  FEATURED CASE STUDIES                         (2-3 cards)         |
|  Selected Work                                 (h2, 32px)          |
|                                                                    |
|  +-------------------------------+                                 |
|  | Client Type  ·  Duration      |                                 |
|  | Project Title                 |  (h3, 24px)                     |
|  | "40% faster load times"       |  (outcome metric, bold)         |
|  | 1-line description            |                                 |
|  | View Case Study ->            |                                 |
|  +-------------------------------+                                 |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  SOCIAL PROOF STRIP                            (horizontal)        |
|                                                                    |
|  "Quote from client about the work."                               |
|  — Client Name, Role at Company                                    |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  BOTTOM CTA                                                        |
|  Ready to start a project?                     (h2, 32px)          |
|  Let's talk about what you need.               (p, muted)          |
|  [ Get in Touch ]                              (primary button)    |
|                                                                    |
+------------------------------------------------------------------+
|  [Footer]                                                          |
+------------------------------------------------------------------+
```

**Section specifications:**

**Hero section:**
- Full viewport width, `min-h-[60vh]` to ensure prominence without being a full-bleed hero.
- Content constrained to `max-w-2xl` (672px), left-aligned on desktop, centered on mobile.
- Availability badge: A small pill component at the top of the hero. Green dot + text "Open to new projects" or amber dot + "Limited availability" or red dot + "Booked until [date]". Styled as `inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm`. The dot is a `w-2 h-2 rounded-full bg-green-500` with a subtle CSS pulse animation (3s period).
- Headline (h1): Geist Sans, weight 700, 48px on desktop, 36px on mobile. Line height 1.1. `text-foreground`.
- Subheading: Geist Sans, weight 400, 20px on desktop, 18px on mobile. `text-muted-foreground`. Max 3 lines.
- CTA buttons: Primary ("See My Work") is `bg-primary text-primary-foreground` with `h-12 px-6 rounded-lg`. Secondary ("Get in Touch") is ghost style: `border border-border text-foreground` same dimensions. Gap between buttons: 12px. On mobile, buttons stack vertically at full width.

**Featured case studies:**
- Cards full-width with content only (no-thumbnail case).
- Each card: `border border-border rounded-xl p-8`. Top line: client type and duration. Title in h3 at 24px. Outcome metric in `text-lg font-semibold`. One-line description. "View Case Study" link.
- On desktop, if 2 projects: side by side (`grid-cols-2`). If 3: first one full-width, next two side by side.

**Social proof strip:**
- Single testimonial quote, centered. Large decorative quotation marks via CSS `::before`. Quote text at 20px italic. Attribution at 14px. If no testimonials at launch, section is hidden entirely.

**Bottom CTA:**
- Centered text block with heading and subheading. Single primary CTA button. `py-20` padding. Appears on every page with contextual copy.

### 3.2 Projects / Case Studies (`/[locale]/projects`)

**Primary user goal (list page):** Scan project outcomes quickly and select one to evaluate in detail.

- Cards full-width, stacked with `gap-6`. Outcome metric is `text-lg font-semibold` — the most prominent element.
- Tech stack tags: pills, max 5 shown, "+N more" overflow.

**Detail page (`/[locale]/projects/[slug]`):**

- Content width: `max-w-2xl` (672px) for text, centered.
- D2 diagram: breaks out to `max-w-4xl` (896px). Two versions loaded (light/dark), toggled via CSS class.
- Results metrics: row of 3 stat cards (`bg-muted rounded-lg p-6 text-center`). Number at `text-3xl font-bold`, label at `text-sm text-muted-foreground`.
- Sticky CTA: floating pill bottom-right on desktop after scrolling past hero. Full-width bottom bar on mobile with dismiss button.

### 3.3 Blog (`/[locale]/blog`)

**Primary user goal (list page):** Find a relevant article to read.

- Tag filter: horizontal scrollable row of pills. Client-side filtering (<1KB JS).
- Post list: separated by `border-b`, not cards. Date, reading time, title link, description, tags.
- No pagination for v1.

**Blog post detail (`/[locale]/blog/[slug]`):**

- Content width: `max-w-2xl` (672px). Body text 16px with `leading-7`.
- Code blocks: Geist Mono 14px, build-time syntax highlighting (Shiki), horizontal scroll on overflow.
- Previous/Next navigation at bottom.
- No table of contents in v1.

### 3.4 About Page (`/[locale]/about`)

- Professional bio in `max-w-2xl` prose styling.
- Career timeline: vertical line with dots, year ranges left, role details right.
- Resume download: secondary button linking to static PDF.

### 3.5 Now Page (`/[locale]/now`)

- "Last updated" date displayed prominently.
- Large availability badge: `bg-muted rounded-lg p-4` banner at top.
- Simple MDX-driven content: working on, learning, available for.

### 3.6 Contact Page (`/[locale]/contact`)

- Email address in `text-2xl font-mono` inside prominent card (`bg-muted border rounded-xl p-8`).
- Two buttons: "Send Email" (primary, mailto) and "Copy Address" (secondary, clipboard JS).
- Copy feedback: button text changes to "Copied!" for 2 seconds.
- External links as simple list with arrows.

---

## 4. Conversion UX Patterns

### 4.1 CTA Hierarchy

| Tier | Style | Usage | Example Copy |
|------|-------|-------|-------------|
| Primary | `bg-primary text-primary-foreground h-12 px-6 rounded-lg` | One per section, max 2-3 per page | "See My Work", "Get in Touch" |
| Secondary | `border border-border text-foreground h-12 px-6 rounded-lg` | Supporting alternatives | "See My Work", "Copy Address" |
| Inline | `text-primary font-medium` with arrow | Within content, cards, lists | "Learn more ->", "Read Case Study ->" |

### 4.2 Contextual CTA Copy

| Page | CTA Heading | CTA Button | mailto Subject |
|------|-------------|------------|----------------|
| Home | "Ready to start a project?" | "Get in Touch" | (none) |
| Projects (list) | "Like what you see?" | "Discuss Your Project" | "Project Discussion" |
| Project (detail) | "Facing a similar challenge?" | "Let's Talk" | "Re: [Project Name]" |
| Blog (post) | "Want to work together?" | "Get in Touch" | (none) |
| About | "Interested in working together?" | "Get in Touch" | (none) |
| Now | "Sounds like a fit?" | "Get in Touch" | (none) |

### 4.3 Floating CTA on Long Pages

**Desktop:** Fixed pill bottom-right after scrolling past hero. `bg-primary text-primary-foreground rounded-full px-4 py-2 shadow-lg text-sm`. Appears via `translateY` transition (300ms). Detected with `IntersectionObserver`.

**Mobile:** Fixed bottom bar with contextual text and small primary button. Includes dismiss X button.

### 4.4 Availability Badge

Three sizes used in three locations:

| Location | Size | Display |
|----------|------|---------|
| Home hero | Medium | Full text: "Currently open to new projects" |
| Contact page | Large | Full text + additional context |
| Footer | Small | Dot + abbreviated: "Available" or "Booked" |

Driven by a single config value in `site-config.ts`. CSS-only pulse animation at 3s period.

---

## 5. Bilingual UX

### 5.1 Language Switcher Behavior

- Text button showing alternate locale ("KO" or "EN"). Not a dropdown.
- Preserves current page path on switch.
- Falls back to home if translated content doesn't exist, with notification.
- URL strategy: explicit locale prefix on all routes (`/en/`, `/ko/`). Root `/` redirects to detected locale.
- Persistence via `NEXT_LOCALE` cookie.

### 5.2 Content Layout Considerations

- **Font:** Geist Sans lacks Korean glyphs. Use `Pretendard` as Korean fallback. Load conditionally per locale.
- **Line breaking:** Apply `word-break: keep-all` for Korean content.
- **Text lengths:** Korean is generally more compact. Button padding (`px-6`) accommodates both languages naturally.

### 5.3 SEO for Bilingual Pages

- `hreflang` alternate links on every page.
- `<html lang="">` per locale.
- JSON-LD `inLanguage` fields.
- XML sitemap with alternate URLs.
- `og:locale` and `og:locale:alternate` meta tags.

---

## 6. Dark/Light Mode UX

### 6.1 Theme Toggle Behavior

- Default follows system preference.
- Toggle switches between light and dark. Initial state follows system. Manual toggle overrides.
- `next-themes` with `attribute="class"` strategy. Blocking script prevents flash.
- Icon: Sun in dark mode, Moon in light mode (shows what you switch TO).
- Transition: `color` and `background-color` at 150ms on body and major containers. NOT applied to all elements.

### 6.2 D2 Diagram Theme Support

Both light and dark SVGs loaded; CSS class toggles visibility:

```tsx
<img src="/diagrams/arch-light.svg" alt="..." className="dark:hidden" />
<img src="/diagrams/arch-dark.svg" alt="..." className="hidden dark:block" />
```

### 6.3 Contrast Verification

- Text on background: ~18:1 both modes (passes AAA)
- Muted text: ~4.6-4.9:1 both modes (passes AA)
- Primary buttons: ~15:1 (passes)
- Dark mode border (`oklch(1 0 0 / 10%)`): verify perceptibility, consider `15%` if too subtle

---

## 7. Component Patterns

### 7.1 Card Component

| Variant | Style |
|---------|-------|
| Standard | `bg-card border border-border rounded-xl p-6 hover:border-primary/20 hover:shadow-sm transition-all duration-150` |
| Feature | Same but `p-8` |
| Stat | `bg-muted rounded-lg p-6 text-center` |

### 7.2 Section Layout

```tsx
<section className="py-16 md:py-20">
  <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
    <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
    <h2 className="mt-2 text-3xl font-bold tracking-tight">{heading}</h2>
    <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{subheading}</p>
    <div className="mt-10">{children}</div>
  </div>
</section>
```

Container widths: `max-w-5xl` (sections), `max-w-2xl` (prose), `max-w-4xl` (wide elements in prose).

### 7.3 Testimonial Display

Single quote, centered, `text-xl italic`. No carousel. If multiple, stack vertically.

### 7.4 Tag System

- **Content tag:** `bg-muted px-2 py-0.5 text-xs rounded-md`
- **Interactive tag (inactive):** `border border-border px-3 py-1 text-sm rounded-full`
- **Interactive tag (active):** `bg-primary text-primary-foreground px-3 py-1 text-sm rounded-full`

### 7.5 Reading Time

`text-sm text-muted-foreground` with clock icon. Calculated at build time (200 WPM English, 300 chars/min Korean).

### 7.6 Code Blocks

Geist Mono 14px, build-time Shiki highlighting, `bg-muted border rounded-lg p-4`. Language label top-right. Horizontal scroll on overflow.

### 7.7 Timeline Component

Vertical `border-l-2` with positioned dots. Year range in mono font, role title bold, description muted. Entries spaced `gap-8`.

### 7.8 Availability Badge

Three statuses: `available` (green), `limited` (amber), `booked` (red). CSS-only pulse at 3s. Three size variants (sm/md/lg).

---

## 8. Motion & Microinteractions

### 8.1 Constraint

All motion is CSS-only. No animation libraries. Zero JS cost.

### 8.2 Transitions

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| Button hover | `background-color`, `border-color` | 150ms | ease |
| Card hover | `border-color`, `box-shadow` | 150ms | ease |
| Link hover | `color` | 150ms | ease |
| Nav dropdown (mobile) | `max-height`, `opacity` | 200ms | ease-out |
| Floating CTA appear/hide | `transform`, `opacity` | 300ms | ease-out |
| Theme switch | `color`, `background-color` | 150ms | ease |
| FAQ accordion | `max-height` | 200ms | ease-out |
| Availability dot pulse | — | 3000ms | ease-in-out, infinite |

### 8.3 Scroll-Triggered Entrances (Optional)

Fade in from `opacity: 0, translateY(8px)` to `opacity: 1, translateY(0)`. 400ms ease-out. Section-level only, not individual items. `IntersectionObserver` with `threshold: 0.1`.

### 8.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 8.5 Deliberately Excluded

- Page transitions (SSG = full page loads)
- Parallax scrolling
- Loading spinners / skeleton screens (not needed for SSG)
- Mouse-follow effects

---

## 9. Responsive Strategy

### 9.1 Breakpoints

| Breakpoint | Tailwind | Target |
|------------|----------|--------|
| Mobile | default (0px+) | Phones portrait |
| Tablet | `md:` (768px+) | Tablets, small laptops |
| Desktop | `lg:` (1024px+) | Standard laptops+ |

Content container maxes at `max-w-5xl` (1024px). Wider viewports show more margin.

### 9.2 Mobile-First Reflow

| Component | Mobile | md+ |
|-----------|--------|-----|
| Nav | Hamburger + dropdown | Horizontal links |
| Hero | Centered, stacked buttons, 36px h1 | Left-aligned, inline buttons, 48px h1 |
| Case study cards | Single column | Two-column grid |
| Footer | Single column | Three-column grid |

### 9.3 Touch Targets

All interactive elements meet 44x44px minimum:
- Buttons: `h-12` (48px), full-width on mobile
- Mobile nav rows: `h-12` (48px)
- Icon buttons: `h-9 w-9` (36px) with padding reaching 44px
- Tag filter pills: `h-8` minimum with `gap-2` between

### 9.4 Content Reflow

- Images: `w-full` with `aspect-ratio`, `loading="lazy"` below fold
- Code blocks: horizontal scroll, no wrapping
- D2 diagrams: scale to column width, "View full diagram" link if unreadable at small sizes
- Tables: wrapped in `overflow-x-auto` container

---

## 10. Accessibility Strategy

### 10.1 Document Structure

- One `<h1>` per page, strict heading hierarchy
- `<main id="main">` wraps page content
- `<header>`, `<nav>`, `<main>`, `<footer>` landmarks on every page
- Distinct `aria-label` on each `<nav>`

### 10.2 Skip Link

```tsx
<a
  href="#main"
  className="fixed left-4 top-4 z-50 -translate-y-full rounded-md bg-primary px-4 py-2 text-primary-foreground transition-transform focus:translate-y-0"
>
  Skip to main content
</a>
```

### 10.3 Focus Management

- `:focus-visible` rings (not `:focus`): `outline: 2px solid var(--ring); outline-offset: 2px`
- Tab order follows DOM/visual order
- Mobile nav: focus trap when open, `Escape` closes and returns focus to hamburger

### 10.4 ARIA Patterns

| Component | ARIA |
|-----------|------|
| Mobile nav toggle | `aria-expanded`, `aria-controls` |
| Theme toggle | `aria-label` updates with state |
| Language switcher | `aria-label` describes target language |
| Availability badge | `role="status"`, `aria-live="polite"` |
| Copy button | `aria-live="polite"` announcement on copy |
| External links | Indicate new tab behavior |
| Blog tag filter | `role="tablist"` / `role="tab"` / `aria-selected` |
| Breadcrumb | `<nav aria-label="Breadcrumb">` with `<ol>` |

### 10.5 Keyboard Navigation Flow

1. Skip link → 2. Logo → 3. Nav links → 4. Language switcher → 5. Theme toggle → 6. Main content → 7. Footer links

### 10.6 Screen Reader Considerations

- Availability dot is decorative; only text label is read
- Icon-only buttons have `aria-label`; icons in labeled buttons are `aria-hidden`
- D2 diagrams have meaningful `alt` text describing architecture
- Reading time: `<span aria-label="8 minute read">8 min read</span>`

### 10.7 Color Independence

No information conveyed through color alone. All color indicators supplemented by text, weight, or fill changes.

---

## Appendix: Key Measurements

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| Section padding | `py-16 md:py-20` | Between major sections |
| Content gap to heading | `mt-10` | Heading to section content |
| Card padding | `p-6` / `p-8` featured | Internal card spacing |
| Card gap | `gap-6` / `gap-8` stacked | Between cards |
| Container padding | `px-4 sm:px-6 lg:px-8` | Horizontal page padding |

### Typography Scale

| Element | Size (mobile/desktop) | Weight | Line-height |
|---------|----------------------|--------|-------------|
| h1 (hero) | 36px / 48px | 700 | 1.1 |
| h1 (page) | 36px / 40px | 700 | 1.2 |
| h2 (section) | 28px / 32px | 700 | 1.2 |
| h3 (card title) | 20px / 24px | 600 | 1.3 |
| Body (prose) | 16px | 400 | 1.75 |
| Body (UI) | 14px | 400 | 1.5 |
| Small/meta | 12-14px | 400/500 | 1.4 |
| Code | 14px (Geist Mono) | 400 | 1.6 |

### Container Widths

| Context | Max Width | Class |
|---------|-----------|-------|
| Page section | 1024px | `max-w-5xl` |
| Prose content | 672px | `max-w-2xl` |
| Wide in prose | 896px | `max-w-4xl` |
| Header | 1280px | `max-w-7xl` |

### Interaction Timing

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Hover state | 150ms | ease |
| Mobile nav | 200ms | ease-out |
| Floating CTA | 300ms | ease-out |
| Scroll entrance | 400ms | ease-out |
| Theme transition | 150ms | ease |
| Availability pulse | 3000ms | ease-in-out |
