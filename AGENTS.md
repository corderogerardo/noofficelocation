<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# No Office Location — marketing site

Landing page for **No Office Location**, a fully-remote game studio (games-first;
also web, backend, mobile). Implemented from a Claude Design handoff. Dark cosmic
AAA-studio aesthetic, sunset-sun-meets-ocean palette, Three.js hero.

## Tech stack

- **Next.js 16** (App Router, `src/`, RSC) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first `@theme`) + **shadcn/ui** (Base UI primitives, `base-nova`)
- **Three.js** (raw, typed) for the hero scene
- **next-themes** (dark/light via `data-theme`)
- **TanStack Query v5** (contact submission)
- **react-hook-form + zod** (forms + validation)
- **lucide-react** (icons)
- **Vitest + Testing Library** (unit) · **Playwright** (e2e) · **ESLint + Prettier**

## Commands

> Package manager: **pnpm** (via Corepack). Node is managed by nvm — in a fresh
> shell run `source "$HOME/.nvm/nvm.sh" && nvm use default && corepack enable pnpm`.

| Command                        | Purpose                                |
| ------------------------------ | -------------------------------------- |
| `pnpm dev`                     | Dev server (Turbopack)                 |
| `pnpm build`                   | Production build                       |
| `pnpm start`                   | Serve the production build             |
| `pnpm lint` / `lint:fix`       | ESLint                                 |
| `pnpm typecheck`               | `tsc --noEmit`                         |
| `pnpm format` / `format:check` | Prettier (with Tailwind class sorting) |
| `pnpm test` / `test:watch`     | Vitest unit tests                      |
| `pnpm test:e2e`                | Playwright end-to-end tests            |

## Project structure

```
src/
  app/
    layout.tsx           # fonts (next/font), providers, metadata, skip link, no-JS reveal fallback
    page.tsx             # composes header + sections + footer
    globals.css          # design tokens (data-theme), shadcn→brand token mapping, base, keyframes
    api/contact/route.ts # POST contact endpoint (server-side zod validation)
  components/
    layout/              # Brand, SiteHeader, MobileMenu, ThemeToggle, SiteFooter
    sections/            # Section, Hero, About, Mission, Services, Showcase, GameCard, Process, Team, Contact, ContactForm
    three/               # HeroCanvas (mounts the scene, lazy-loads three.js)
    ui/                  # shadcn (button/input/textarea/select/label) + custom primitives
    icons/               # inline brand SVGs (lucide dropped brand icons)
    providers/           # AppProviders → ThemeProvider + QueryProvider
  hooks/                 # use-scrolled, use-mounted, use-contact-mutation
  lib/
    data/                # site, navigation, studio, games, team (typed content)
    three/hero-scene.ts  # HeroScene class (sun + ocean + stars + parallax)
    validation/contact.ts# shared zod schema (client + server)
    utils.ts             # cn()
  types/content.ts       # content model types
```

## Conventions

- **Server Components by default.** Add `"use client"` only for interactivity
  (theme toggle, mobile menu, scroll reveal, forms, the Three.js canvas).
- **Styling = Tailwind utilities + design tokens.** Don't hardcode hex values in
  components; use the token utilities below. Reserve raw CSS for the few layered
  gradients/keyframes that can't be expressed inline.
- **Theme** is driven by the `data-theme` attribute (next-themes), default `dark`.
  shadcn/Base UI tokens (`--background`, `--primary`, `--border`, `--ring`, …) are
  mapped onto the brand palette in `globals.css`, so primitives are on-brand.
- **Brand token utilities:** `text-brand`/`bg-brand` (sunset accent),
  `bg-bg`/`bg-bg-2`/`bg-surface[-2/-3]`, `text-fg`/`text-fg-2`/`text-fg-3`,
  `border-border`/`border-edge`/`border-hairline`, `shadow-card`/`shadow-glow`.
- **Fonts:** `font-display` (Instrument Serif), `font-sans` (Hanken Grotesk),
  `font-mono` (JetBrains Mono).
- **Content is data-driven** — copy lives in `src/lib/data/*` typed by
  `src/types/content.ts`; sections map over it.
- **Forms:** react-hook-form + the shared zod schema (`lib/validation`), submitted
  through a TanStack mutation (`use-contact-mutation`) to the route handler. The
  schema validates on **both** client and server.
- **Animation:** wrap reveal-on-scroll content in `<Reveal>`; everything respects
  `prefers-reduced-motion`.
- **Quality gate (must stay green):** `typecheck`, `lint`, `build`, `test`.

## Agent harness

This repo ships a multi-agent harness under `.claude/agents/`. The **orchestrator**
plans and delegates; specialists implement and verify. Typical flow:

```
orchestrator → implementer → (unit-tester ∥ design-fidelity)
            → reviewer ∥ security ∥ accessibility ∥ performance
            → e2e-tester → orchestrator (integrate + final gate)
```

| Agent             | Role                                                                       |
| ----------------- | -------------------------------------------------------------------------- |
| `orchestrator`    | Breaks work into tasks, delegates, integrates, owns the final quality gate |
| `implementer`     | Builds features to spec using the conventions above                        |
| `reviewer`        | Correctness, reuse, and simplification review of the diff                  |
| `unit-tester`     | Vitest + Testing Library coverage of logic and components                  |
| `e2e-tester`      | Playwright user-flow coverage against a production build                   |
| `security`        | Input handling, headers/CSP, dependency and data-exposure review           |
| `accessibility`   | Landmarks, labels, focus, contrast, reduced-motion                         |
| `design-fidelity` | Verifies the build matches the design tokens and layout                    |
| `performance`     | Bundle size, Core Web Vitals, image/font/3D cost                           |

Invoke a specialist with the Task/Agent tool, e.g. _"Use the security agent to
review `src/app/api/contact/route.ts`."_

## Loop harness

The agents above are one-shot. `.claude/workflows/loop-until-clean.mjs` closes the
loop: it fans the read-only specialists out over the diff, **adversarially verifies**
each finding, delegates the real ones to the implementer, then **re-runs the quality
gate and repeats until it converges** (gate green + no new findings) or a stop guard
trips (max rounds, no-progress, low budget).

```
        ┌──────────────────────── loop ────────────────────────┐
gate ──▶ review (reviewer∥security∥a11y∥perf∥design) ──▶ verify ──▶ fix ──┐
  ▲                                                                       │
  └───────────────────── re-gate ◀───────────────────────────────────────┘
        stop when: gate green & 0 new findings · or maxRounds · or no progress
```

Run it via the Workflow tool:

- **Audit (read-only):** `loop-until-clean` with `{ "mode": "report" }` — runs the
  gate + review + verify and reports confirmed vs. dismissed findings. Edits nothing.
- **Auto-fix (convergence):** `{ "mode": "fix", "maxRounds": 3 }` — also applies fixes
  and loops. Run on a clean checkpoint so the diff under review is the work you intend.

Useful args: `gate` (commands, default `["typecheck","lint","test","build"]`),
`scope` (what to review), `minBudget` (token floor before stopping).
