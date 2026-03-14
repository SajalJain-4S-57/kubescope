# KubeScope — Atomity Frontend Engineering Challenge

🔗 **Live Demo:** [kubescope.vercel.app](https://kubescope.vercel.app)  
📁 **Repository:** [github.com/SajalJain-4S-57/kubescope](https://github.com/SajalJain-4S-57/kubescope)

---

## Feature Choice — Option A (0:30–0:40)

I chose Option A — the drill-down cost explorer showing Cluster → Namespace → Pod hierarchy.

**Why:** This feature has the most interaction depth. A static display would be boring — but a drill-down with directional transitions, live data, and waste detection creates a genuinely useful product experience. It also gave me the most surface area to demonstrate animation craft, state management, and component architecture simultaneously.

---

## What I Built

An interactive Kubernetes cost explorer with three drill levels:

- **Cluster view** — top-level cost breakdown across all clusters
- **Namespace view** — drill into a cluster to see namespace costs
- **Pod view** — drill into a namespace to see individual pod costs

**Creative additions beyond the video:**
- Dark space theme with grid background and radial glow — completely different aesthetic from the reference
- Directional zoom transitions — drilling in scales up, going back scales down, with blur
- Animated headline on hero with cycling words (Clusters → Namespaces → Pods → Waste)
- 3D perspective scroll reveal — the explorer card tilts in from 12° as you scroll
- Terminal-style InsightPanel at pod level — `waste-analyzer` window with sequential diagnostic lines, most wasteful pod detection, and estimated monthly savings
- Shimmer sweep on bars — light streak slides across each bar on a loop
- Efficiency stripe at bar bottom — red/amber/green indicator per bar
- Level indicator dots — pill expands on active drill level
- Breadcrumb path builds itself with animated connector lines

---

## Animation Approach

All animations use **Framer Motion** (the preferred library per the brief).

| Animation | Technique |
|-----------|-----------|
| Hero headline word cycle | `AnimatePresence mode="wait"` with blur filter transition |
| 3D scroll reveal | `useScroll` + `useTransform` — `rotateX` 12°→0°, `scale` 0.88→1, `opacity` 0→1 |
| Hero fade on scroll | `useTransform` on `scrollYProgress` — opacity and Y position |
| Bar entrance | Spring physics `stiffness: 100, damping: 18` with stagger `delay: index * 0.08` |
| Shimmer sweep | Looping `x: ["-100%", "200%"]` with per-bar repeat delay |
| Drill transition | `AnimatePresence mode="wait"` — scale + blur in/out, direction-aware |
| Table row entrance | Staggered `opacity + x` with `ease: "easeOut"` |
| Breadcrumb path | `scaleX` from left with spring, sequential delay per crumb |
| InsightPanel | Slides in from right with spring, exits on drill-back |
| Terminal lines | Sequential opacity + x with `delay: index * 0.18` |
| Number counting | Custom `requestAnimationFrame` loop with ease-out cubic |
| Level indicator | Width morphs between `6px` and `24px` with spring |

`prefers-reduced-motion` is respected at two levels:
1. CSS — all transitions set to `0.01ms` via media query in `globals.css`
2. JS — `AnimatedNumber` checks `window.matchMedia("(prefers-reduced-motion: reduce)")` and skips RAF animation

---

## Token Architecture

Design tokens are defined in two places that work together:

**`src/app/globals.css`** — actual values as CSS variables:
```css
:root {
  --color-bg-primary: #080B14;
  --color-accent-success: #00FF88;
  /* etc. */
}

[data-theme="light"] {
  --color-bg-primary: #F0F2F5;
  /* etc. */
}
```

**`src/tokens/index.ts`** — TypeScript references to those variables:
```ts
export const tokens = {
  colors: {
    bgPrimary: "var(--color-bg-primary)",
    accentSuccess: "var(--color-accent-success)",
  },
  font: {
    sm: "clamp(0.75rem, 1.5vw, 0.875rem)",
  }
} as const;
```

Components import from `tokens` only — no raw hex values anywhere in component files. Dark/light mode switches by toggling `data-theme` attribute on `<html>` — token values update automatically.

---

## Data Fetching and Caching

**API:** [DummyJSON](https://dummyjson.com/products) — public REST API

Each drill level fetches a different offset:
- Cluster → `skip=0`
- Namespace → `skip=4`  
- Pod → `skip=8`

The returned product titles are used as **hash seeds only** — never displayed. Display names are always clean (`Cluster A`, `Namespace B`, `Pod C`).

**Caching via TanStack Query:**
```ts
useQuery({
  queryKey: ["costData", level, parentName],
  staleTime: 5 * 60 * 1000,  // 5 minutes
  gcTime: 10 * 60 * 1000,    // 10 minutes
})
```

Each drill path has a unique cache key (`level + parentName`). First visit fetches from network with skeleton loading. Revisiting the same level within 5 minutes serves instantly from cache — zero network requests. Verifiable in DevTools Network tab.

**Data generation:**

API titles feed into a `djb2` hash function multiplied by Knuth's constant `2654435761` for maximum spread. This produces deterministic, varied cost values per row. Efficiency is always in the range 5–74% with no multiplier applied.

---

## Libraries Used

| Library | Version | Why |
|---------|---------|-----|
| Next.js | 14 | App Router, SSR, file-based routing |
| TypeScript | 5 | Type safety, better DX, required by brief |
| Tailwind CSS | 4 | Base reset and utility foundation |
| Framer Motion | 11 | Preferred animation library per brief |
| TanStack Query | 5 | Caching, loading/error states, stale-while-revalidate |

**Deliberately excluded:** MUI, Chakra, shadcn, Ant Design — every UI element built from scratch as required.

---

## Modern CSS Features Used

| Feature | Where Used |
|---------|-----------|
| `clamp()` | All font sizes, section padding — fluid without breakpoints |
| CSS nesting | `.glass-card`, `.grid-bg` in globals.css |
| Container queries | `@container explorer` — table hides secondary columns on small containers |
| `color-mix()` | Bar gradients, glow shadows, error backgrounds throughout |
| Logical properties | `padding-block`, `padding-inline`, `margin-inline-start` throughout |
| CSS variables | Entire token system — 14 color tokens, light/dark switching |

---

## Component Structure
```
src/
  app/
    globals.css          # CSS variables, dark/light tokens, modern CSS
    layout.tsx           # Root layout with TanStack Query provider
    page.tsx             # Hero + scroll-triggered explorer section
    providers.tsx        # QueryClient provider wrapper
  tokens/
    index.ts             # TypeScript token references
  lib/
    types.ts             # All TypeScript interfaces and types
    dataMapper.ts        # Hash-based data generation from API titles
  hooks/
    useCostData.ts       # TanStack Query fetch + cache hook
  components/
    ui/
      Badge.tsx          # Reusable badge with variants
      AnimatedNumber.tsx # RAF counting animation with reduced motion
    CostExplorer/
      CostExplorer.tsx   # Main orchestrator — drill state management
      DrillHeader.tsx    # Breadcrumb navigation + level badge
      BarChart.tsx       # Animated bars with shimmer and efficiency stripe
      CostTable.tsx      # Staggered table with animated rows
      InsightPanel.tsx   # Terminal-style waste analyzer panel
```

---

## Responsive Behavior

| Breakpoint | Behavior |
|-----------|---------|
| 1280px+ | Full layout — chart + table + InsightPanel side by side |
| 768px | InsightPanel wraps below chart+table |
| 375px | Secondary table columns (Storage, Network, GPU) hidden via container query — no horizontal scroll |

Fluid typography via `clamp()` means no font size breakpoints needed.

---

## Tradeoffs and Decisions

**Real data vs generated data:** DummyJSON doesn't have Kubernetes cost data. I use API titles as hash seeds to generate deterministic cost values. This satisfies the "fetch from API, no hardcoded data" requirement while keeping the UI realistic. Tradeoff: data isn't "real" cloud costs, but the async flow (loading → error → success → cache) is genuine.

**Inline styles vs Tailwind classes:** I used inline styles with token references rather than Tailwind utility classes. This keeps all styling going through the token system which is what the brief evaluates. Tailwind provides the base reset. Tradeoff: more verbose JSX, but token architecture is cleaner and more demonstrable.

**Single page vs multi-page:** The brief asked for a single animated section. I added a hero section above to make the scroll-triggered entrance meaningful — without scroll distance, `useScroll` transforms have no effect. Tradeoff: slightly more than a "single section" but the hero is minimal and serves the animation requirement.

---

## What I Would Improve With More Time

- **Real WebSocket data** — connect to a mock WebSocket to show live cost updates ticking in real time
- **Cost breakdown tooltip** — hover a bar to see CPU/RAM/GPU split in a floating tooltip
- **Time range filter** — switching between Last 7 Days / 30 Days / 90 Days with animated transitions
- **Export to CSV** — download the current drill level as a spreadsheet
- **Keyboard navigation** — full arrow key navigation through bars and rows
- **Unit tests** — Jest tests for `dataMapper.ts` hash function and `useCostData` hook
- **E2E tests** — Playwright tests for the drill-down flow

---

## Commit History

Each commit represents one logical unit of work — no large dumps.
```
Initial commit from Create Next App
initialise Next.js project with TypeScript and Tailwind
Add design token architecture
feat: add global CSS setup
fix: tailwind imports
feat: drill-down state types
feat: add API data mapper 
feat: add TanStack Query hook for cost data
feat: add TanStack Query provider and update root layout
feat: build Badge UI component with token architecture and accessibility
feat: build AnimatedNumber component
feat: build animated BarChart
feat: build CostTable with animations and container query responsiveness
feat: build DrillHeader with animated navigation
feat: build InsightPanel
feat: assemble CostExplorer
feat: redesign token system and globals
feat: redesign page
feat: rewrite CostExplorer
feat: rewrite BarChart 
feat: rewrite DrillHeader 
feat: rewrite InsightPanel 
feat: update CostTable 
fix: use Knuth multiplicative hash for proper efficiency value distribution
docs: add README with approach, decisions and tradeoffs
```