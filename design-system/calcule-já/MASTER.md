# Calcule Já — Design System (Modern Minimal)

> Source of truth for the visual system. Style: **Modern Minimal / Flat** — Inter, neutral surfaces, a single blue accent, generous whitespace, subtle (not heavy) shadows. Light is the default; dark is a supported toggle (never default).

## Design tokens (CSS variables)

Defined in `src/index.css` on `:root` (light) and `[data-theme="dark"]` (dark). Components consume them through Tailwind color aliases (see `tailwind.config.js`), never raw hex.

### Light (`:root`)
| Token | Value | Role |
|---|---|---|
| `--bg` | `#F5F5F7` | App background |
| `--surface` | `#FFFFFF` | Cards, panels |
| `--surface-muted` | `#F1F5F9` | Inputs, subtle fills |
| `--fg` | `#0F172A` | Primary text |
| `--muted` | `#64748B` | Secondary text |
| `--border` | `#E2E8F0` | Borders, dividers |
| `--accent` | `#2563EB` | Interactive / active / emphasis |
| `--accent-hover` | `#1D4ED8` | Accent hover |
| `--accent-fg` | `#FFFFFF` | Text on accent |
| `--accent-soft` | `#EFF4FF` | Active nav bg, soft highlight |
| `--positive` | `#059669` | Gains / positive result (with icon/text) |
| `--danger` | `#DC2626` | Errors / negative (with icon/text) |
| `--ring` | `#2563EB` | Focus ring (rendered 3px @ 35% alpha) |

### Dark (`[data-theme="dark"]`)
| Token | Value |
|---|---|
| `--bg` | `#0B1120` |
| `--surface` | `#111827` |
| `--surface-muted` | `#0F172A` |
| `--fg` | `#F8FAFC` |
| `--muted` | `#94A3B8` |
| `--border` | `#1F2937` |
| `--accent` | `#3B82F6` |
| `--accent-hover` | `#60A5FA` |
| `--accent-fg` | `#0B1120` |
| `--accent-soft` | `rgba(59,130,246,0.12)` |
| `--positive` | `#34D399` |
| `--danger` | `#F87171` |
| `--ring` | `#60A5FA` |

## Typography
- **Family:** Inter (loaded in `index.html` with `display=swap`), fallback `ui-sans-serif, system-ui, sans-serif`.
- **Weights:** 400 body, 500 labels, 600 headings.
- **Scale (rem):** 0.75 / 0.875 / 1 / 1.125 / 1.25 / 1.5 / 2 (12/14/16/18/20/24/32 px). Body min 16px.
- **Line-height:** 1.5 body, 1.2 headings.
- **Numbers:** all monetary/numeric outputs use `tabular-nums` (`.num` utility) so columns align.

## Spacing & radius
- Spacing: 4 / 8 / 16 / 24 / 32 / 48 (Tailwind 1/2/4/6/8/12).
- Radius: card/bento `20px` (`rounded-card`), panel `12px`, input `10px`, pill `999px`.

## Elevation (subtle / flat)
- `--shadow-sm`: `0 1px 2px rgba(15,23,42,0.04)`
- `--shadow-md`: `0 4px 12px rgba(15,23,42,0.06)`
- Dark mode leans on borders over shadows.

## Motion
- 150–250ms `ease`; hover = color/opacity/border shift (no layout-shifting transforms; card hover may use `box-shadow` + `translateY(-1px)` only). Respect `prefers-reduced-motion`.

## Tailwind aliases (in `tailwind.config.js`)
`colors`: `bg, surface, surface-muted, fg, muted, border, accent, accent-hover, accent-fg, accent-soft, positive, danger, ring` → each `var(--token)`. `fontFamily.sans` → `['Inter', …]`. `borderRadius.card` → `20px`.

## Component conventions
- **Bento nav:** the calculator picker is a grid of rounded cards (icon + label), active = `accent-soft` bg + `accent` text + thin accent ring.
- **Result card:** `surface` bg, `border`, `rounded-card`; the headline figure is `text-2xl`/`3xl`, `tabular-nums`, accent-colored; gains use `positive`.
- **Inputs (`Campo`):** `surface-muted` bg, `border`, `rounded-[10px]`, label always visible, focus = 3px `ring`.
- **Buttons:** primary = `accent` bg / `accent-fg`; secondary = `border` + `fg`. 150–250ms transition, `cursor-pointer`.

## Anti-patterns
- ❌ Raw hex / `gray-*` / `blue-*` utilities in components (use tokens).
- ❌ Emojis as icons (use lucide).
- ❌ Dark mode by default; ❌ heavy gradients/shadows; ❌ color-only meaning; ❌ invisible focus; ❌ layout-shifting hover.
