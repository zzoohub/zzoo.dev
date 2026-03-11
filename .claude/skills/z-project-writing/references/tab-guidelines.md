# Tab Guidelines

Detailed writing guidance for each project tab. Read the section relevant to the tab you're writing.

## Table of Contents

1. [Overview Tab](#overview-tab) — The product pitch
2. [Design Tab](#design-tab) — Product thinking showcase
3. [Engineering Tab](#engineering-tab) — Technical judgment showcase

---

## Overview Tab

**File**: `en.mdx` / `ko.mdx`
**Length**: 40–80 lines
**Audience**: Potential users, clients, curious developers
**Core question**: "What is this and why should I care?"

### Every Overview Needs Its Own Shape

An overview is a pitch that respects the reader's intelligence. But **it must not follow a fixed template**. Portfolio visitors read multiple projects — if every one opens with a problem-question hook, critiques alternatives, reveals the solution, lists steps, and ends with a CTA, the formula is visible and every project sounds the same.

Instead, find the structure that fits the project's character:

- **Manifesto** — Lead with a bold, provocative statement. Works for products with a radical core constraint. *"There is no unblock button. That's the entire product."*
- **Numbers-forward** — Lead with a concrete comparison. Works for speed/efficiency products. *"MyFitnessPal: 30 seconds. Lose It!: 15 seconds. Mealio: under 1 second."*
- **Scenario** — Lead with a specific user situation. Works for creative tools or niche products. *"A Korean web novelist knows their story. The protagonist who returns to the past, the system window that appears..."*
- **Output-first** — Lead with what the product delivers, then explain how. Works for data/pipeline products. *"Every morning, a pipeline scans 44 subreddits..."*
- **Question/experiment** — Lead with an insight or hypothesis. Works for meta or conceptual projects. *"Most developer portfolios have a quiet problem: humans can read them, but machines cannot."*

These are examples, not an exhaustive list. The point: let the project's most interesting quality dictate the opening and structure.

### Elements to Include (in any order)

Every overview should still cover these, but the sequence and emphasis should vary:

- **A hook** in the first 1–2 sentences that creates curiosity
- **What the product does** — concrete, not abstract
- **What makes it different** — name competitors or alternatives, name the gap
- **A next step** — CTA: try it, view source, download

### Voice

Conversational. Short paragraphs. No corporate-speak. This is a builder talking about something they made — honest, specific, slightly opinionated.

### Common Mistakes

- Using the same structure across multiple projects (the formula becomes visible)
- Opening with "Project X is a Y that does Z" (boring — lead with something specific)
- Listing every feature (pick the 2–3 that show the core tension)
- Forgetting the CTA (don't leave the reader with nothing to do)
- Being vague about what makes it different (name the competitors, name the gap)

---

## Design Tab

**File**: `design.en.mdx` / `design.ko.mdx`
**Length**: 100–140 lines
**Audience**: Product managers, designers, founders
**Core question**: "How did you think about users and trade-offs?"

### The Shape of a Good Design Tab

A design tab reveals the product thinking that's invisible in the final product. It follows the logic of decisions:

1. **Core insight** — The one observation that shaped everything. Not a description of the product, but the realization that preceded it. "Writers think in scenes and plot flow, not sentences." "The moment you want to unblock a site, you're making an impulsive decision, not a rational one."

2. **Who it's for** — Vivid, specific personas. Not "users who want to block sites" but "Minsu, a self-aware procrastinator who understands the problem but has burned through every blocker that offers an escape route." Give them a name, a specific pain point, a behavior pattern.

3. **Core loop** — How do users interact with the product? What's the habit cycle? Map the journey from first contact to repeated use. Show the moments of delight and the moments of friction you deliberately chose to keep.

4. **Product decisions as trade-offs** — This is the heart of the design tab. Each decision should name:
   - What you chose
   - What you rejected
   - Why — grounded in user insight, not technical convenience
   - What you're accepting as a consequence

   Example: "No timer, no whitelist, no scheduling — these are deliberate omissions. A timer means the extension becomes a countdown to distraction. A whitelist means you spend your willpower deciding what to unblock instead of working."

5. **Competitive positioning** — Not a market analysis. A sharp statement of what exists and why it's insufficient. "Every blocker has an escape route — that's the problem they all share."

6. **Business model** (optional) — If the monetization strategy reveals product thinking (e.g., free tier calibrated to let users experience the core loop before hitting limits), include it. If it's a standard SaaS pricing page, skip it.

### Voice

Think "smart colleague explaining their thinking over coffee," not "PM presenting to stakeholders." The content is strategic, but the delivery should feel like a conversation.

- Ground every claim in a specific user behavior or observation — not theory
- Skip design jargon unless it earns its place ("progressive disclosure" is fine if you show how it manifests; "design thinking" is never fine)
- Vary rhythm. A short punchy sentence after a longer explanation lands harder than three medium sentences in a row
- Ask rhetorical questions when they genuinely help: "So why not add a timer?" pulls readers in. But don't overdo it

**Stiff** ❌: "The decision to omit a timer was predicated on the observation that countdown mechanisms introduce anticipatory distraction, thereby undermining the core value proposition."

**Natural** ✅: "We considered adding a timer. But think about it — a countdown to when you can browse again? That's not focus. That's just waiting."

**한국어 — 딱딱함** ❌: "타이머를 제거한 것은 카운트다운 메커니즘이 기대감 기반의 산만함을 유발하여 핵심 가치 제안을 약화시킨다는 관찰에 기반한다."

**한국어 — 자연스러움** ✅: "타이머를 넣을까 고민했다. 근데 생각해보면, '10분 뒤에 유튜브 볼 수 있다'는 카운트다운이 집중일까? 그냥 기다리는 거다."

### Common Mistakes

- Describing features instead of decisions (the Engineering tab covers what was built; Design covers why)
- Generic personas ("busy professionals who want productivity") — be specific enough that the reader can picture the person
- Listing UX principles as platitudes ("simplicity", "consistency") without showing how they drove real decisions
- Treating the design tab as a second overview (don't repeat the pitch — go deeper into the thinking)
- Writing like a design doc instead of a story — if it reads like something you'd submit to a VP, rewrite it

---

## Engineering Tab

**File**: `engineering.en.mdx` / `engineering.ko.mdx`
**Length**: 60–100 lines
**Audience**: Fellow engineers, hiring managers, technical co-founders
**Core question**: "What engineering decisions did you make and why?"

### The Shape of a Good Engineering Tab

An engineering tab shows technical judgment, not technical inventory. It answers: "What's interesting about how this was built?"

1. **Architecture overview** — Orient the reader in 1–2 paragraphs. What are the major components? How do they connect? Include a brief code structure or ASCII diagram if it helps, but keep it minimal — the goal is orientation, not exhaustive documentation.

2. **2–4 interesting technical details** — These are the stories. Pick the aspects where:
   - You solved a problem in a non-obvious way (NLE positioning for timeline scenes, dual-layer browser blocking)
   - The data model reveals the domain (scenes as clips with extent, not list items)
   - The system design has an interesting constraint (presigned uploads that bypass the API server entirely)
   - A pipeline does something clever (HDBSCAN clustering instead of asking an LLM to group posts)

   Each detail should be self-contained: what the problem was, how you solved it, and why this approach over the obvious alternative.

3. **Key decisions** — Architecture Decision Records, compressed to their essence. Each one: what was chosen, over what, and why. 1–3 sentences max. No "Revisit when" — if the reader wants to know when you'd change your mind, the "why" should make it obvious.

### What to Include

- Architecture overview with component relationships
- Design decisions with trade-offs (the star content)
- Unique technical challenges and how they were solved
- Key code snippets that show design intent (e.g., a trait definition that enforces a boundary)
- Data flow descriptions when they reveal interesting constraints

### What to Exclude

- Crate/package listing tables (a Cargo.toml or package.json can show this)
- Middleware stack details (generic plumbing)
- CI/CD pipeline configurations (unless unusually interesting)
- Full database schema tables (pick the 2–3 interesting modeling decisions)
- Security checklists (unless the project has a unique security challenge)
- Performance metric tables (mention specific numbers inline if relevant)
- Observability setup (every project has logging and Sentry)
- Config struct code blocks (implementation detail)
- Index strategies (mention inline if the indexing approach is novel)

### Voice

Talk engineer-to-engineer. The reader knows what PostgreSQL is — skip the intro. But they don't know why YOU picked Neon over Supabase, or why you went with a monolith instead of microservices. That's what they came to read.

Keep it approachable:
- Assume the reader is competent but unfamiliar with your codebase
- Explain the "why" like you're pair programming — not writing a thesis
- Let yourself be surprised or amused by what you found. "Turns out HDBSCAN just... worked" is more honest than "HDBSCAN proved to be an effective clustering algorithm"
- Use code snippets to show intent, not implementation. A trait definition that enforces a boundary is interesting. A 40-line function body is not

**Stiff** ❌: "The system employs a presigned URL upload mechanism that bypasses the API server, thereby reducing server load and enabling direct client-to-storage transfers with enhanced throughput characteristics."

**Natural** ✅: "Uploads go straight to R2 via presigned URLs. The API server never touches the file — it just signs a permission slip and gets out of the way."

**한국어 — 딱딱함** ❌: "본 시스템은 프리사인드 URL 업로드 메커니즘을 활용하여 API 서버를 우회함으로써, 서버 부하를 감소시키고 클라이언트-스토리지 간 직접 전송을 가능하게 한다."

**한국어 — 자연스러움** ✅: "업로드는 presigned URL로 R2에 바로 올라간다. API 서버는 파일을 건드리지 않는다 — 서명만 해주고 비켜난다."

### Common Mistakes

- Copying the design doc into the engineering tab (a design doc is reference material; the engineering tab is a highlight reel)
- Including generic sections because "every project should have auth/security/observability" (only include what's genuinely interesting)
- Listing technologies without explaining why they were chosen (a tech stack table without trade-offs is a resume bullet point, not engineering writing)
- Being too detailed about infrastructure (Cloud Run config, Docker settings) — this is ops, not engineering storytelling
- Sounding like a paper. "The architecture leverages..." → "The app is split into..." — use the simplest verb that works
