# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Calcule Já** — a single-page web app bundling several everyday calculators (regra de 3, porcentagem, IMC/calorias, combustível etanol×gasolina, custo de viagem, divisão de contas, conversor de data/hora). UI text and most variable naming are in Portuguese (pt-BR).

## Commands

```bash
npm run dev        # Vite dev server
npm run build      # production build (vite build — note: no tsc type-check step)
npm run preview    # serve the production build
npm run lint       # eslint . over the whole repo
```

There is no test runner configured — `package.json` has no test script and no test files exist.

## Architecture

- **Stack**: React 18 + TypeScript + Vite, styled with Tailwind CSS. shadcn/ui conventions are set up (`components.json`, `cn()` helper in `src/lib/utils.ts`) but most components use hand-written Tailwind classes directly rather than shadcn primitives.
- **No router, no global state, no backend.** `src/App.tsx` holds a single `activeTab` string in `useState` and a `switch` that renders one calculator component. `src/components/Layout.tsx` renders the sidebar `NavItem` buttons that set `activeTab`. To add a calculator: create the component, add a `case` in `App.tsx`'s switch, and add a `<NavItem>` in `Layout.tsx`. The two lists must be kept in sync manually.
- **Calculators are self-contained.** Each `src/components/*Calculator*.tsx` keeps its own local `useState` for inputs and computes results inline (no shared logic, no lib/ math helpers). Follow the existing pattern: inputs as controlled `string` state, `Number(...)` coercion at calculation time.
- Some NavItems / calculators are wired in `App.tsx` but commented out of the sidebar in `Layout.tsx` (e.g. `proporcao`, `split`, `finance`) — they are intentionally hidden, not dead code to delete.

## Conventions & gotchas

- **`@/` import alias** is defined only in `vite.config.ts`, *not* in the tsconfig files. It resolves at build/runtime but the TypeScript language server will flag `@/...` imports as unresolved. Existing components mostly use relative imports (`./components/...`) — prefer those to stay consistent.
- `.env.example` ships a Supabase URL + anon key, but **nothing in `src/` reads `import.meta.env` or uses Supabase.** It is currently unused scaffolding.
- `todo` (plain text) and the README "Todo" section track planned calculators: CDI, conversor de unidades, desvalorização da moeda, melhorias na divisão de contas.
