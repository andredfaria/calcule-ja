# Design System "Modern Minimal" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current maximalist theme with a clean, tokenized **Modern Minimal** design system (Inter, neutral surfaces, single blue accent, flat surfaces, tabular numbers, bento nav) applied to the whole app, with light/dark parity.

**Architecture:** Retune the existing CSS-variable tokens in `src/index.css` to the Modern Minimal palette and **flatten** the component CSS (remove gradients, blur, glow, display fonts, pulse). Add semantic **Tailwind color aliases** that map to those vars so components style with tokens instead of raw `gray-*`/`blue-*`. Load **Inter**. Migrate every component from raw utilities to tokens. Calculation logic is untouched — the 27 Vitest tests are the regression net.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind, CSS variables, lucide-react, Vitest.

---

## Token & class strategy

The existing `index.css` already drives styling through CSS variables (`--surface-*`, `--text-*`, `--border-*`, `--accent-*`) consumed by semantic classes (`.sidebar`, `.nav-item`, `.calc-stage input`, `.result-card`, …). We **keep those variable names** (so the semantic classes keep working) and only change their **values** + flatten effects. New **Tailwind aliases** let component JSX use tokens.

### Migration Recipe (raw utility → token) — used by component tasks

| Replace (raw) | With (token) |
|---|---|
| `bg-white`, `bg-gray-50` on a **card/panel** | `bg-surface` |
| `bg-gray-50`, `bg-gray-100` on an **input / sunken area** | `bg-surface-sunken` |
| `text-gray-900`, `text-gray-800` | `text-fg` |
| `text-gray-700`, `text-gray-600` | `text-fg-muted` |
| `text-gray-500`, `text-gray-400` | `text-fg-subtle` |
| `border-gray-300`, `border-gray-200` | `border-line` |
| `bg-blue-100` | `bg-brand-soft` |
| `text-blue-700`, `text-blue-600` | `text-brand` |
| `hover:bg-gray-100` | `hover:bg-surface-sunken` |
| `focus:ring-blue-500`, `focus:border-blue-500` | remove (global `:focus-visible` handles it) |
| any monetary/number output (`R$ …`, `%`, `.toFixed`, `moeda(...)`) | add `tabular-nums` to that element |
| the headline result figure (`text-2xl font-bold`) | add `text-brand` (use `text-positive` if it's a gain/rendimento) |

Negative/error emphasis must include a word or icon, not color alone.

---

## File Structure

- Modify: `index.html` — load Inter
- Modify: `tailwind.config.js` — add semantic token color aliases + `fontFamily.sans` Inter + `borderRadius.card`
- Modify: `src/index.css` — retune token values + flatten component CSS + bento nav (full replacement provided)
- Create: `src/components/calculadora/ResultCard.tsx` — standard result-panel wrapper
- Modify: `src/components/calculadora/campos.tsx`, `src/components/calculadora/ExportBar.tsx`
- Modify: 12 calculator components (CDI, Financiamento, Motorista, CrossMultiplication, Percentage, MixtureRatio, Health, Fuel, Gas, BillSplitter, DateTimeConverter, Finance)
- Modify (only if needed): `src/components/Layout.tsx`, `src/components/Footer.tsx` (mostly restyled via CSS; JSX largely unchanged)

---

## Task 1: Load Inter

**Files:** Modify `index.html`

- [ ] **Step 1: Add Inter preconnect + stylesheet**

In `index.html`, immediately after the `<meta name="viewport" ...>` line, add:

```html
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
```

- [ ] **Step 2: Verify build**

Run: `cd /home/andre/Documentos/projetos/calcule-ja && npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(ds): load Inter font"
```

---

## Task 2: Tailwind token aliases

**Files:** Modify `tailwind.config.js`

- [ ] **Step 1: Add semantic aliases**

In `tailwind.config.js`, inside `theme.extend`, add a `fontFamily`, extend `colors` with the new keys, and add a `borderRadius.card`. Merge these into the existing `extend` block (keep the existing shadcn `colors`, `borderRadius`, `keyframes`, `animation`):

```js
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // ...keep the existing shadcn color keys above...
        surface: 'var(--surface-raised)',
        'surface-sunken': 'var(--surface-sunken)',
        'surface-base': 'var(--surface-base)',
        fg: 'var(--text-primary)',
        'fg-muted': 'var(--text-secondary)',
        'fg-subtle': 'var(--text-tertiary)',
        line: 'var(--border-default)',
        'line-subtle': 'var(--border-subtle)',
        brand: 'var(--accent-primary)',
        'brand-soft': 'var(--accent-soft)',
        positive: 'var(--accent-success)',
        danger: 'var(--accent-error)',
      },
      borderRadius: {
        // ...keep existing lg/md/sm...
        card: '1.25rem',
      },
```

(Add the new `colors` keys alongside the existing ones inside the same `colors: { ... }` object; add `borderRadius.card` alongside the existing radius keys.)

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.js
git commit -m "feat(ds): add semantic token color aliases and Inter to Tailwind"
```

---

## Task 3: Retune `src/index.css` to Modern Minimal

**Files:** Modify `src/index.css` (full replacement)

- [ ] **Step 1: Replace the entire file contents**

Replace ALL of `src/index.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root,
:root[data-theme='light'] {
  --surface-base: #f5f5f7;
  --surface-raised: #ffffff;
  --surface-overlay: #ffffff;
  --surface-sunken: #f1f5f9;

  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #64748b;
  --text-disabled: #94a3b8;
  --text-inverse: #ffffff;

  --border-subtle: #e8ecf1;
  --border-default: #e2e8f0;
  --border-strong: #cbd5e1;
  --border-accent: #2563eb;

  --accent-primary: #2563eb;
  --accent-primary-dim: rgba(37, 99, 235, 0.10);
  --accent-soft: #eff4ff;
  --accent-success: #059669;
  --accent-error: #dc2626;
  --accent-warning: #b45309;

  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.05);
  --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.07);
  --ring: rgba(37, 99, 235, 0.35);

  --theme-toggle-track-start: #74c8ff;
  --theme-toggle-track-end: #9ca7ff;
  --theme-toggle-star: #ffffff;

  --z-base: 0;
  --z-raised: 10;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 300;
  --z-toast: 400;
  --z-tooltip: 500;
}

:root[data-theme='dark'] {
  --surface-base: #0b1120;
  --surface-raised: #111827;
  --surface-overlay: #1e222b;
  --surface-sunken: #0f172a;

  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --text-disabled: #64748b;
  --text-inverse: #0b1120;

  --border-subtle: #1f2937;
  --border-default: #273244;
  --border-strong: #334155;
  --border-accent: #3b82f6;

  --accent-primary: #3b82f6;
  --accent-primary-dim: rgba(59, 130, 246, 0.18);
  --accent-soft: rgba(59, 130, 246, 0.12);
  --accent-success: #34d399;
  --accent-error: #f87171;
  --accent-warning: #fbbf24;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.30);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.40);
  --ring: rgba(96, 165, 250, 0.45);

  --theme-toggle-track-start: #39479f;
  --theme-toggle-track-end: #7f4fd4;
  --theme-toggle-star: #f8f8ff;
}

@layer base {
  *,
  *::before,
  *::after {
    border-color: var(--border-default);
    transition: background-color 200ms ease, border-color 200ms ease, color 150ms ease, box-shadow 200ms ease;
  }

  img,
  video,
  [data-no-transition] {
    transition: none;
  }

  *:focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }

  *::selection {
    background: var(--accent-primary-dim);
    color: var(--text-primary);
  }

  html,
  body {
    margin: 0;
    min-height: 100%;
    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
    color: var(--text-primary);
    background: var(--surface-base);
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: var(--border-strong);
    border: 2px solid var(--surface-base);
  }

  ::placeholder {
    color: var(--text-tertiary);
  }
}

@layer components {
  .app-shell {
    @apply mx-auto max-w-6xl px-4 py-6 md:py-8;
  }

  .app-header {
    @apply mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between;
  }

  .header-actions {
    @apply flex items-center gap-4;
  }

  .app-kicker {
    letter-spacing: 0.18em;
    color: var(--text-tertiary);
    @apply text-xs font-medium uppercase;
  }

  .app-title {
    color: var(--text-primary);
    letter-spacing: -0.02em;
    @apply text-3xl font-semibold md:text-4xl;
  }

  .app-subtitle {
    color: var(--text-secondary);
    @apply max-w-sm text-sm;
  }

  .theme-toggle {
    width: 52px;
    height: 28px;
    border-radius: 999px;
    background: linear-gradient(130deg, var(--theme-toggle-track-start), var(--theme-toggle-track-end));
    border: 1px solid var(--border-subtle);
    padding: 2px;
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .theme-toggle-track {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }

  .theme-toggle-thumb {
    width: 24px;
    height: 24px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    position: absolute;
    top: 0;
    left: 0;
    background: var(--surface-raised);
    transform: translateX(0);
    transition: transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: var(--shadow-sm);
  }

  .theme-icon {
    position: absolute;
    transition: transform 200ms ease, opacity 160ms ease;
  }

  .moon-icon {
    opacity: 0;
    transform: scale(0.6) rotate(30deg);
  }

  :root[data-theme='dark'] .theme-toggle-thumb {
    transform: translateX(24px);
  }

  :root[data-theme='dark'] .sun-icon {
    opacity: 0;
    transform: scale(0.5) rotate(-15deg);
  }

  :root[data-theme='dark'] .moon-icon {
    opacity: 1;
    transform: scale(1) rotate(0);
  }

  .app-grid {
    @apply grid grid-cols-1 gap-5 md:grid-cols-[250px,1fr];
  }

  .sidebar,
  .main-panel,
  .footer-shell {
    background: var(--surface-raised);
    border: 1px solid var(--border-subtle);
    box-shadow: var(--shadow-sm);
    @apply rounded-2xl;
  }

  .sidebar {
    @apply p-4;
  }

  .sidebar-title {
    letter-spacing: 0.14em;
    color: var(--text-tertiary);
    @apply mb-3 text-xs font-medium uppercase;
  }

  /* Bento nav: 2-column grid of cards */
  .sidebar-nav {
    @apply grid grid-cols-2 gap-2;
  }

  .nav-item,
  .mobile-nav-item {
    color: var(--text-secondary);
    background: var(--surface-sunken);
    border: 1px solid var(--border-subtle);
    @apply flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm;
  }

  .nav-item:hover,
  .mobile-nav-item:hover {
    border-color: var(--border-strong);
    color: var(--text-primary);
  }

  .nav-item-active,
  .mobile-nav-item-active {
    border-color: var(--accent-primary);
    background: var(--accent-soft);
    color: var(--accent-primary);
    font-weight: 500;
  }

  .main-panel {
    @apply p-5 md:p-8;
  }

  .mobile-nav {
    z-index: var(--z-sticky);
    background: var(--surface-overlay);
    border: 1px solid var(--border-default);
    box-shadow: var(--shadow-md);
    @apply fixed bottom-2 left-1/2 flex w-[95%] -translate-x-1/2 gap-1 overflow-x-auto rounded-2xl p-2;
  }

  .mobile-nav-item {
    @apply min-w-[78px] flex-col px-2 py-1.5 text-[11px];
  }

  .calc-stage {
    animation: stageIn 240ms ease;
  }

  .calc-stage h2 {
    color: var(--text-primary);
    letter-spacing: -0.01em;
    @apply text-2xl font-semibold;
  }

  .calc-stage label,
  .calc-stage p,
  .calc-stage span,
  .calc-stage h3 {
    color: var(--text-secondary);
  }

  .calc-stage input,
  .calc-stage select,
  .app-input,
  .calc-stage textarea {
    background: var(--surface-sunken);
    border-color: var(--border-default);
    color: var(--text-primary);
    @apply w-full rounded-[10px] border px-4 py-2 outline-none;
  }

  .calc-stage input:focus,
  .calc-stage select:focus,
  .app-input:focus,
  .calc-stage textarea:focus {
    box-shadow: 0 0 0 3px var(--ring);
    border-color: var(--accent-primary);
  }

  .calc-stage button,
  .app-button {
    background: var(--accent-primary);
    color: var(--text-inverse);
    border: 1px solid var(--accent-primary);
    @apply rounded-[10px] px-4 py-2 font-medium;
  }

  .calc-stage button:hover,
  .app-button:hover {
    opacity: 0.92;
  }

  .result-card {
    border: 1px solid var(--border-default);
    background: var(--surface-sunken);
    @apply rounded-2xl p-5;
  }

  .footer-shell {
    @apply mt-8 p-6;
  }

  .footer-grid {
    @apply grid gap-6 md:grid-cols-3;
  }

  .footer-title {
    color: var(--text-primary);
    @apply mb-2 text-base font-semibold;
  }

  .footer-text {
    color: var(--text-secondary);
    @apply text-sm;
  }

  .footer-highlight {
    color: var(--accent-primary);
    @apply text-sm font-semibold;
  }

  .footer-link {
    color: var(--accent-primary);
    @apply underline;
  }
}

@keyframes stageIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Verify build + visual smoke**

Run: `npm run build`
Expected: build succeeds. Then `npm run dev` and confirm the shell renders clean (Inter, flat surfaces, bento 2-col nav, working light/dark toggle).

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat(ds): retune tokens and flatten components to Modern Minimal"
```

---

## Task 4: ResultCard + migrate shared primitives

**Files:** Create `src/components/calculadora/ResultCard.tsx`; modify `campos.tsx`, `ExportBar.tsx`

- [ ] **Step 1: Create `src/components/calculadora/ResultCard.tsx`**

```tsx
import React from "react";

interface ResultCardProps {
  titulo?: string;
  children: React.ReactNode;
}

/** Standard result panel: token surface, border, rounded-card. */
export const ResultCard: React.FC<ResultCardProps> = ({ titulo = "Resultado", children }) => (
  <div className="bg-surface-sunken border border-line rounded-card p-6 space-y-4">
    <h3 className="text-lg font-medium text-fg">{titulo}</h3>
    {children}
  </div>
);
```

- [ ] **Step 2: Migrate `campos.tsx` to tokens**

In `src/components/calculadora/campos.tsx`, update the `Campo` `<label>` and `<input>` classes and the `Linha` text classes to tokens:
- label `className`: `block text-sm font-medium text-fg-muted`
- input `className`: `mt-1 block w-full rounded-[10px] border border-line bg-surface-sunken px-4 py-2 text-fg shadow-sm transition focus:border-brand focus:ring-2 focus:ring-brand/30 outline-none`
- `Linha` rotulo `<p>`: `text-sm text-fg-subtle`
- `Linha` valor `<p>`: keep size logic but add tokens + tabular numbers → `${destaque ? "text-2xl font-bold" : "text-lg font-medium"} text-fg tabular-nums`

- [ ] **Step 3: Migrate `ExportBar.tsx` button styling to tokens**

In `src/components/calculadora/ExportBar.tsx`, change the `btn` constant to:

```tsx
  const btn =
    "text-sm px-3 py-1.5 rounded-[10px] border border-line text-fg-muted transition hover:bg-surface-sunken hover:text-fg disabled:opacity-50 disabled:cursor-not-allowed";
```

and the feedback span class to `text-sm text-positive`.

- [ ] **Step 4: Verify build + lint + tests**

Run: `npm run build && npm run lint && npx vitest run`
Expected: build + lint clean; 27 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/calculadora/ResultCard.tsx src/components/calculadora/campos.tsx src/components/calculadora/ExportBar.tsx
git commit -m "feat(ds): add ResultCard and migrate shared primitives to tokens"
```

---

## Task 5: Migrate CDI calculator

**Files:** Modify `src/components/CdiCalculator.tsx`

- [ ] **Step 1: Apply the Migration Recipe**

Apply the Migration Recipe class map to `CdiCalculator.tsx`. Specifically:
- Replace the result panel wrapper `<div className="bg-gray-50 p-6 rounded-lg space-y-4">` + its `<h3>` with the `ResultCard` component: import `import { ResultCard } from "./calculadora/ResultCard";`, wrap the `<Linha>` rows and the `<ExportBar>` in `<ResultCard> ... </ResultCard>` (drop the now-duplicated `<h3>Resultado</h3>`).
- Any remaining `text-gray-*`/`bg-gray-*`/`border-gray-*` → tokens per the recipe.
- The `Linha` rows already gain `tabular-nums` from Task 4, so no change needed there.

- [ ] **Step 2: Verify build + lint + tests**

Run: `npm run build && npm run lint && npx vitest run`
Expected: clean; 27 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/CdiCalculator.tsx
git commit -m "feat(ds): migrate CDI calculator to tokens + ResultCard"
```

---

## Task 6: Migrate Financiamento calculator

**Files:** Modify `src/components/FinanciamentoCalculator.tsx`

- [ ] **Step 1: Apply the Migration Recipe**

- Replace the two `ResumoSistema` cards' wrapper `<div className="bg-gray-50 p-4 rounded-lg space-y-3">` with `bg-surface-sunken border border-line rounded-card p-4 space-y-3`.
- The amortization `<table>`: header `bg-gray-100 sticky top-0` → `bg-surface-sunken sticky top-0`; container `border rounded-lg` → `border border-line rounded-card`; row borders `border-t` keep (token border via global). Add `tabular-nums` to the `<td>` cells that render `moeda(...)` values.
- The comparison `<p className="text-sm text-gray-700">` → `text-sm text-fg-muted`.
- All other `text-gray-*` → tokens per recipe.

- [ ] **Step 2: Verify build + lint + tests**

Run: `npm run build && npm run lint && npx vitest run`
Expected: clean; 27 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/FinanciamentoCalculator.tsx
git commit -m "feat(ds): migrate Financiamento calculator to tokens"
```

---

## Task 7: Migrate Motorista calculator

**Files:** Modify `src/components/MotoristaAppCalculator.tsx`

- [ ] **Step 1: Apply the Migration Recipe**

- Replace the result panel `<div className="bg-gray-50 p-6 rounded-lg space-y-4">` + its `<h3>` with the `ResultCard` component (import it), wrapping the `<Linha>` rows and `<ExportBar>`.
- Remaining `text-gray-*`/`bg-gray-*`/`border-gray-*` → tokens per recipe.

- [ ] **Step 2: Verify build + lint + tests**

Run: `npm run build && npm run lint && npx vitest run`
Expected: clean; 27 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/MotoristaAppCalculator.tsx
git commit -m "feat(ds): migrate Motorista calculator to tokens"
```

---

## Task 8: Migrate the remaining nine calculators

**Files:** Modify `CrossMultiplication.tsx`, `PercentageCalculator.tsx`, `MixtureRatioCalculator.tsx`, `HealthCalculator.tsx`, `FuelCalculator.tsx`, `GasCalculator.tsx`, `BillSplitter.tsx`, `DateTimeConverter.tsx`, `FinanceCalculator.tsx`

For EACH file below, apply the Migration Recipe class map (raw `gray-*`/`blue-*` utilities → tokens; add `tabular-nums` to numeric outputs; replace any `bg-gray-50` result panel with the `ResultCard` component where the component has a clearly delimited "Resultado" panel). Do them one at a time, building between each.

- [ ] **Step 1: `CrossMultiplication.tsx`** — apply recipe; commit `feat(ds): migrate Regra de 3 to tokens`
- [ ] **Step 2: `PercentageCalculator.tsx`** — apply recipe; commit `feat(ds): migrate Porcentagem to tokens`
- [ ] **Step 3: `MixtureRatioCalculator.tsx`** — apply recipe; commit `feat(ds): migrate Proporção to tokens`
- [ ] **Step 4: `HealthCalculator.tsx`** — apply recipe; commit `feat(ds): migrate IMC to tokens`
- [ ] **Step 5: `FuelCalculator.tsx`** — apply recipe (uses inline label/input markup, not `Campo`); commit `feat(ds): migrate Combustível to tokens`
- [ ] **Step 6: `GasCalculator.tsx`** — apply recipe; commit `feat(ds): migrate Viagem to tokens`
- [ ] **Step 7: `BillSplitter.tsx`** — apply recipe; commit `feat(ds): migrate Divisão de contas to tokens`
- [ ] **Step 8: `DateTimeConverter.tsx`** — apply recipe; commit `feat(ds): migrate Fuso horário to tokens`
- [ ] **Step 9: `FinanceCalculator.tsx`** — apply recipe; commit `feat(ds): migrate Parcelamento to tokens`

After each file: run `npm run build` (must succeed). After all nine: run `npm run lint && npx vitest run` (clean; 27 tests pass).

> Note for the implementer: open each file first and replace only color/surface/border utilities and add `tabular-nums` to numeric spans. Do NOT change any calculation, state, or event-handler code. If a file has no raw `gray-*`/`blue-*` utilities (already token-clean), commit nothing for it and note that.

---

## Task 9: Accessibility, responsive pass, and ship-readiness

**Files:** none expected (fixes only if issues found)

- [ ] **Step 1: Contrast audit (both themes)**

Open `npm run dev`. Toggle light and dark. Verify primary text ≥ 4.5:1 and borders/secondary text visible in BOTH themes for: header, bento nav (idle + active), inputs, result cards, ExportBar, footer. Fix any token value in `src/index.css` that fails (adjust `--text-secondary`/`--border-*`).

- [ ] **Step 2: Responsive check**

In devtools, check 375 / 768 / 1024 / 1440 px: no horizontal scroll at 375; bento nav wraps; mobile bottom nav doesn't cover content (the `pb-24` on the shell handles it); result tables scroll within their container.

- [ ] **Step 3: Reduced motion + focus**

Enable "reduce motion" — confirm the stage-in animation is suppressed. Tab through a calculator — confirm visible focus rings on inputs, nav, and ExportBar buttons.

- [ ] **Step 4: Final automated verification**

Run: `npm test && npm run build && npm run lint`
Expected: 27 tests pass; build succeeds; lint clean.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix(ds): accessibility and responsive adjustments"
```

---

## Self-Review Notes

- **Spec coverage:** tokens light+dark (Task 3) ✓; Tailwind aliases (Task 2) ✓; Inter (Task 1) ✓; tabular-nums (Task 4 primitives + recipe) ✓; bento nav (Task 3 CSS) ✓; ResultCard + primitives (Task 4) ✓; all 12 calculators (Tasks 5–8) ✓; shell/footer restyled via CSS (Task 3) ✓; a11y/responsive gate (Task 9) ✓. Logic untouched; 27 tests as regression net at every task.
- **Token-name reconciliation:** the plan keeps the existing CSS-variable names (`--surface-*`, `--text-*`, `--accent-*`) and exposes them as new Tailwind aliases (`surface`, `fg`, `brand`, …). `MASTER.md` uses friendly token role names; the implementation maps roles → existing vars as documented in Task 2/3. No contradiction — same roles, concrete var names.
- **No new heavy deps.** Inter via `<link>`. Recharts/PDF libs remain for later waves.
- **Placeholder check:** Task 8 uses a recipe rather than 9 full rewrites because the change is a mechanical, fully-enumerated class substitution (the recipe table is the complete spec) plus an explicit "don't touch logic" constraint. Foundation tasks (1–4) carry full code.
- **Risk note:** Layout.tsx/Footer.tsx JSX already emit the semantic classes (`.nav-item`, `.footer-*`) restyled in Task 3, so they need no JSX change; if Footer uses raw utilities, apply the recipe there too during Task 9.
