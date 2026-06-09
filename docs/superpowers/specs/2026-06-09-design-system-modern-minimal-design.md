# Spec — Design System "Modern Minimal" (app inteiro)

**Data:** 2026-06-09
**Milestone:** reformulação visual completa do Calcule Já para um design system tokenizado (estilo Modern Minimal), aplicada a **todas** as telas, **antes** das Waves 2–4 do roadmap de export/gráficos.
**Fonte da verdade dos tokens:** `design-system/calcule-já/MASTER.md`.

---

## 1. Objetivo

Profissionalizar e unificar o visual de todo o app com um **design system baseado em tokens** (CSS variables + aliases no Tailwind), estilo **Modern Minimal/Flat**: fonte Inter, superfícies neutras, **um acento azul**, bastante espaço em branco, sombras sutis, **números tabulares**, e **paridade light/dark** (light é o padrão; o toggle existente é mantido).

### Critérios de sucesso
- Existe um conjunto único de **tokens semânticos** (light + dark) em `src/index.css`, consumidos via aliases do Tailwind. Nenhum componente usa hex cru nem utilitários `gray-*`/`blue-*` para cor.
- **Inter** carregada e aplicada globalmente; valores monetários/numéricos usam `tabular-nums`.
- **Todas** as ~12 calculadoras + shell (header/sidebar/footer) seguem o sistema de forma consistente.
- A navegação de calculadoras é um **picker bento** (cards), com estado ativo claro.
- Acessibilidade: contraste ≥ 4.5:1 (texto), foco visível (3px), `prefers-reduced-motion` respeitado, alvos ≥ 44px, sem scroll horizontal em 375px.
- `npm test`, `npm run build`, `npm run lint` verdes; os 27 testes existentes continuam passando (lógica não muda).

### Fora de escopo
- Mudanças de lógica/cálculo (puramente visual/estrutural de UI).
- Waves 2–4 (PDF/PNG, novas calculadoras, gráficos) — virão depois, já nascendo no novo visual. O `ExportBar` (Wave 1) entra na migração.

---

## 2. Arquitetura

O redesign já mesclado introduziu CSS variables + `data-theme` + classes semânticas (`app-shell`, `nav-item`, `calc-stage`) em `index.css`. Esta milestone **formaliza e estende** isso, em vez de brigar com ele.

**Camadas:**
1. **Tokens** — `src/index.css`: variáveis em `:root` (light) e `[data-theme="dark"]` (dark), conforme `MASTER.md`. Define também `.num` (tabular-nums) e ajustes base (Inter, foco).
2. **Tailwind aliases** — `tailwind.config.js`: `theme.extend.colors` mapeia `bg/surface/surface-muted/fg/muted/border/accent/accent-hover/accent-fg/accent-soft/positive/danger/ring` → `var(--token)`; `fontFamily.sans` → Inter; `borderRadius.card` → 20px; `boxShadow` sm/md. (Estende, não substitui — utilitários padrão continuam existindo durante a migração.)
3. **Inter** — `index.html`: `<link rel="preconnect">` + stylesheet do Google Fonts com `display=swap`.
4. **Componentes** — migram `bg-gray-50`/`text-gray-700`/`border-gray-300`/`bg-blue-100`/`focus:ring-blue-500` etc. para utilitários de token (`bg-surface`/`text-muted`/`border-border`/`bg-accent-soft`/`focus:ring-ring`), e aplicam `tabular-nums` nos números.

**Princípio:** primeiro a fundação (tokens + Tailwind + Inter), depois primitivos compartilhados (`Campo`, `Linha`, `ExportBar` + um novo `ResultCard`), depois o shell, depois cada calculadora. Assim cada migração é mecânica e isolada.

### Componentes a migrar (inventário)
- **Shell:** `Layout.tsx` (header, sidebar→bento nav, theme toggle), `Footer.tsx`, `App.tsx` (`calc-stage`).
- **Primitivos:** `calculadora/campos.tsx` (`Campo`, `Linha`), `calculadora/ExportBar.tsx`; **novo** `calculadora/ResultCard.tsx` (wrapper padrão do painel de resultado).
- **Calculadoras (12):** `CdiCalculator`, `FinanciamentoCalculator`, `MotoristaAppCalculator`, `CrossMultiplication`, `PercentageCalculator`, `MixtureRatioCalculator`, `HealthCalculator`, `FuelCalculator`, `GasCalculator`, `BillSplitter`, `DateTimeConverter`, `FinanceCalculator`.

---

## 3. Diretrizes visuais (resumo; detalhes em MASTER.md)

- **Cor:** neutro + acento `--accent`. `--positive` (verde) só para ganho/rendimento, `--danger` (vermelho) só para erro — sempre acompanhados de ícone/texto, nunca cor isolada.
- **Tipografia:** Inter; escala 12–32; corpo 16px/1.5; títulos 600. `tabular-nums` em todo número/moeda.
- **Layout:** sidebar (desktop) e nav mobile renderizam o mesmo `navItems` como **cards bento** (ícone lucide + label); ativo = `accent-soft` + texto `accent` + anel fino. `main-panel` em `surface`. Largura máxima consistente, gutters adaptáveis.
- **Card de resultado:** `ResultCard` padrão (surface, border, rounded-card); figura principal grande, `tabular-nums`, cor `accent` (ou `positive` para ganhos).
- **Inputs:** `Campo` em `surface-muted`, borda `border`, foco 3px `ring`, label sempre visível (já acessível desde a Wave anterior).
- **Movimento:** transições 150–250ms; hover sem deslocar layout; `prefers-reduced-motion` desliga/reduz.

---

## 4. Acessibilidade (gate)

- Contraste verificado nos **dois** temas (não inferir do light): texto ≥ 4.5:1, glyphs/bordas ≥ 3:1.
- Foco visível em todos os interativos (anel 3px com `--ring`).
- `prefers-reduced-motion`: remover translate/scale e encurtar/!desligar transições.
- Alvos de toque ≥ 44px; sem scroll horizontal em 375px; testar 375/768/1024/1440 e dark.
- Cor nunca é o único indicador (ex.: resultado negativo leva sinal/ícone além da cor).

---

## 5. Estratégia de testes

- **Lógica intocada** → os 27 testes Vitest existentes devem continuar verdes (rede de segurança contra regressões acidentais em componentes).
- **Sem novos testes unitários de estilo** (CSS/visual não é unit-testável aqui). Verificação por `npm run build` + `npm run lint` (incl. checklist do design system) + **smoke manual** nos dois temas e nos breakpoints.
- Pré-entrega: rodar o checklist do `MASTER.md`/skill (emojis, cursor, hover, contraste, foco, reduced-motion, responsivo).

---

## 6. Fases (para o plano de implementação)

1. **Fundação:** tokens em `index.css` (light+dark) + `tailwind.config.js` (aliases, Inter, radius/shadow) + Inter no `index.html` + `.num`. Build verde.
2. **Primitivos:** `Campo`, `Linha`, `ExportBar` → tokens; criar `ResultCard`.
3. **Shell:** `Layout` (bento nav + header + toggle) e `Footer` → tokens.
4. **Financeiras:** `Cdi`, `Financiamento`, `Motorista` → tokens + `ResultCard` + `tabular-nums`.
5. **Demais calculadoras:** as outras 9 → tokens (+ `ResultCard` onde aplicável).
6. **Passada de a11y/responsivo + polish:** foco, contraste nos 2 temas, reduced-motion, 375/768/1024/1440.
7. **Verificação final + ship:** testes/build/lint verdes, smoke, merge → produção (Netlify).

---

## 7. Riscos / notas

- **Override de cores do Tailwind:** estendemos (não substituímos) — utilitários `gray-*`/`blue-*` continuam válidos durante a migração; o objetivo é eliminá-los dos componentes ao final.
- **Paridade de tema:** o maior risco é texto/borda sumir no dark; conferir contraste por token nos dois temas.
- **`@/` alias** continua só no Vite — imports relativos.
- **Sem regressão de lógica:** nenhuma mudança em `src/lib/**`; se um teste quebrar, foi alteração acidental de comportamento — reverter.
- **Inter via Google Fonts** exige rede no build? Não — o `<link>` é runtime no browser; o build não baixa a fonte. `display=swap` evita FOIT.
