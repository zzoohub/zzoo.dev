---
name: z-project-writing
description: |
  Write project content for the zzoo.dev portfolio — Overview, Design, and Engineering tabs.
  Use this skill whenever writing or rewriting project pages in content/projects/{slug}/.
  Triggers on: "write project page", "write overview", "write design tab", "write engineering tab",
  "new project content", "rewrite project", or when creating/editing any MDX file under content/projects/.
  Do NOT use for blog posts (use z-dev-essay), marketing copy outside the portfolio, or documentation.
---

# Project Writing

A portfolio project page tells a story in three chapters — each for a different reader, each answering a different question. The three tabs share two principles: **show thinking, not just output** — and above all, **be easy to read and easy to understand.**

## First Principles

1. **Readability is the highest priority.** A brilliant insight buried in dense prose is a wasted insight. Every sentence should be immediately clear on first read. If the reader has to re-read a paragraph to get it, the writing failed — no matter how good the content is. Professional depth and simple language are not in conflict. The harder the idea, the simpler the sentence should be.

2. **A project page is a story, not documentation.** Documentation describes what exists. A story reveals why it exists and what you learned building it. Every section should have narrative tension — a problem that needed solving, a choice that had consequences.

2. **The reader decides in 10 seconds.** Every tab needs a hook in the first two sentences. If the opening doesn't create curiosity, nothing else matters.

3. **Trade-offs beat choices.** "We chose Rust" is a fact. "We chose Rust over Python because LLM calls are just HTTP — no Python-only libraries needed, and we get sub-ms latency at 10MB memory" is a story. Always name what was rejected and why.

4. **Specificity is credibility.** "Fast performance" means nothing. "Sub-ms responses, 10–30MB memory" is memorable and verifiable. Use real numbers, real names, real constraints.

5. **What you didn't build reveals judgment.** Deliberate omissions — no timer, no whitelist, no microservices — show you understood the problem deeply enough to resist adding things.

6. **Irreversibility is the product.** The most interesting design decision in Site Blocker isn't the blocking mechanism — it's the absence of an unblock button. Look for the equivalent in every project: the one constraint that IS the product.

7. **Each Overview must have its own structure.** Portfolio visitors read multiple projects. If every overview follows the same template (problem → criticism of alternatives → our solution → how it works → CTA), the formula becomes visible and personality disappears. Design and Engineering tabs are builder documents — consistent structure is fine. But Overview is the project's face; it must reflect the project's unique character. A manifesto-style opening for a radical product, a numbers-forward comparison for a speed-focused app, a scenario walkthrough for a creative tool. The structure should emerge from what makes the project interesting, not from a template.

## Process

### Step 1: Understand the Project

Before writing, read:
- The project's source code or design doc (if referenced by the user)
- Existing content in `content/projects/{slug}/` (if any)
- `docs/project-writing-guide.md` for the structural reference

Ask the user:
- Which tab(s) to write? (Overview / Design / Engineering / all three)
- What's the one thing that makes this project interesting?
- Who's the reader? (If unclear, default: Overview → potential users, Design → product thinkers, Engineering → fellow engineers)

### Step 2: Find the Story

Every project has a core tension. Find it before writing anything.

- **Site Blocker**: "What if the lack of an escape route IS the feature?"
- **Mealio**: "What if the camera replaced the calorie database?"
- **Narrex**: "What if the structure the author builds IS the AI prompt?"
- **Idea Fork**: "What if demand signals from complaints could be clustered into business opportunities automatically?"

This tension should echo through all three tabs — Overview introduces it as a user problem, Design explains the product thinking behind it, Engineering shows how it was built.

### Step 3: Write the Tab

Read `references/tab-guidelines.md` for detailed guidance on each tab. Key constraints:

| Tab | Length | Audience | Core Question |
|-----|--------|----------|---------------|
| Overview | 40–80 lines | Users, clients | "What is this and why should I care?" |
| Design | 100–140 lines | PMs, designers | "How did you think about users and trade-offs?" |
| Engineering | 60–100 lines | Engineers, hiring managers | "What engineering decisions did you make and why?" |

### Step 4: Rewrite Tight

After the first draft, apply these checks:

- **Hook test**: Do the first two sentences create curiosity? Would you keep reading?
- **So-what test**: For every paragraph, ask "so what?" If you can't answer, cut it.
- **Trade-off test**: Does every decision name what was rejected and why?
- **Specificity test**: Replace every vague claim with a number, name, or constraint.
- **Cut test**: Can any section be removed without losing the story? If yes, remove it.

### Step 5: Present and Iterate

Share the draft. Ask the user:
- "Does this capture the most interesting part of the project?"
- "Is there a decision or trade-off I missed?"
- Iterate based on feedback.

## Language

Detect language from user input. Default to English.

- **English**: Direct, concise. Short sentences. Active voice. But not robotic — vary sentence length, let personality show.
- **Korean**: 한다체. 딱딱함의 원인은 어미가 아니라 문장 구조다 — 아래를 지킬 것:
  - **번역투 금지**: "~를 통해", "~에 대해서", "~하는 것이 가능하다", "~함으로써" → 자연스러운 한국어로 바꾸기
  - **명사 덩어리 금지**: "메커니즘 활용을 통한 부하 감소" → "부하를 줄인다" — 동사로 풀기
  - **문장 짧게**: 한 문장에 절이 3개 이상 이어지면 끊기. 접속사("-고", "-며", "-면서")가 두 번 나오면 길다는 신호
  - **구어 리듬 허용**: "근데", "그냥", "딱" 같은 구어체 단어를 적절히 섞으면 글이 숨을 쉰다
  - 기술 용어(API, SSE, HDBSCAN)는 영어 그대로 쓰되 불필요한 코드스위칭은 피하기

Both languages share one principle: **write like you're explaining to a smart friend**. Expert content doesn't require expert-sounding prose. The harder the concept, the simpler the sentence should be. If a paragraph feels like a textbook, rewrite it as something you'd actually say out loud.

## File Format

All files are MDX with YAML frontmatter.

**Overview** (`en.mdx` / `ko.mdx`):
```yaml
---
title: "Project Name — Tagline"
description: "One-sentence summary."
status: "active"          # active | completed | archived
tags: ["tag1", "tag2"]
techStack: ["Tech1", "Tech2"]
featured: true
launchDate: "2025-06-01"
tagline: "One-line pitch"
category: "web"           # mobile-app | chrome-extension | web | cli
# See docs/project-writing-guide.md for all optional fields:
# thumbnail, heroImage, images, d2Diagram, video, links,
# keywords, competitors, cta, features
---
```

**Design / Engineering** (minimal frontmatter):
```yaml
---
title: "Project Name — Design"  # or "— Engineering"
---
```

## MDX Safety

- Bare `<` and `>` in prose are parsed as JSX. Use `&lt;`/`&gt;` in inline code, or plain English ("fewer than 100", "more than 10K").
- `-->` in bold/prose can break MDX. Use `--&gt;` or rewrite.
- Angle brackets inside fenced code blocks are safe.

## What NOT to Do

- Don't write documentation. Write stories about decisions.
- Don't list every feature. Highlight the 2–3 that reveal the project's core tension.
- Don't include generic sections (auth, CI/CD, observability) unless the project does something genuinely unusual there.
- Don't use corporate language (leverage, ecosystem, paradigm shift, synergy).
- Don't hedge with disclaimers. State what you chose and why.
- Don't pad with filler. If a tab is done at 50 lines, 50 lines is the right length.
