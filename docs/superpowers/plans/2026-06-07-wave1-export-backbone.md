# Wave 1 — Export Backbone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the three existing calculators (CDI, Financiamento, Motorista) a shared `ExportBar` with "copy result text" and "share link", plus URL-state sync so a shared link reopens the right calculator pre-filled.

**Architecture:** Pure URL serialization helpers (`src/lib/url/params.ts`) and pure per-calculator text summaries (`src/lib/calculators/resumos.ts`) are unit-tested. A `useUrlState` hook hydrates each calculator's inputs from the URL on mount and reflects them back via `history.replaceState`. `App.tsx` syncs the active tab to a `calc` URL param. A presentational `ExportBar` does copy/share via the Clipboard API.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, Tailwind. No new dependencies in this wave.

---

## File Structure

- Create: `src/lib/url/params.ts` — pure `serializeParams` / `parseParams`
- Test: `src/lib/url/params.test.ts`
- Create: `src/lib/format.ts` — canonical `moeda` currency formatter (relocated from components)
- Modify: `src/components/calculadora/formatters.ts` — re-export `moeda` from `../../lib/format`
- Create: `src/lib/calculators/resumos.ts` — `resumoCdi` / `resumoFinanciamento` / `resumoMotorista`
- Test: `src/lib/calculators/resumos.test.ts`
- Create: `src/lib/url/useUrlState.ts` — React hook gluing params helpers to `history`
- Create: `src/components/calculadora/ExportBar.tsx` — copy + share buttons
- Modify: `src/App.tsx` — sync `activeTab` ↔ `calc` URL param
- Modify: `src/components/CdiCalculator.tsx` — wire `useUrlState` + `ExportBar`
- Modify: `src/components/FinanciamentoCalculator.tsx` — wire `useUrlState` + `ExportBar`
- Modify: `src/components/MotoristaAppCalculator.tsx` — wire `useUrlState` + `ExportBar`

---

## Task 1: URL param serialization (pure, TDD)

**Files:**
- Create: `src/lib/url/params.ts`
- Test: `src/lib/url/params.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/url/params.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { serializeParams, parseParams } from "./params";

describe("serializeParams / parseParams", () => {
  it("always includes the calc id", () => {
    expect(serializeParams("cdi", {})).toBe("calc=cdi");
  });

  it("includes non-empty fields and omits empty ones", () => {
    const q = serializeParams("cdi", { valorInicial: "10000", percentualCDI: "", prazoDias: "365" });
    const params = new URLSearchParams(q);
    expect(params.get("calc")).toBe("cdi");
    expect(params.get("valorInicial")).toBe("10000");
    expect(params.get("prazoDias")).toBe("365");
    expect(params.has("percentualCDI")).toBe(false);
  });

  it("round-trips a populated input set", () => {
    const inputs = { valorInicial: "10000", percentualCDI: "110", taxaCDIAnual: "10.5", prazoDias: "365" };
    const parsed = parseParams("?" + serializeParams("cdi", inputs));
    expect(parsed.calcId).toBe("cdi");
    expect(parsed.inputs).toEqual(inputs);
  });

  it("parses a search string with no calc param", () => {
    const parsed = parseParams("?foo=bar");
    expect(parsed.calcId).toBeNull();
    expect(parsed.inputs).toEqual({ foo: "bar" });
  });

  it("parses an empty search string", () => {
    const parsed = parseParams("");
    expect(parsed.calcId).toBeNull();
    expect(parsed.inputs).toEqual({});
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/url/params.test.ts`
Expected: FAIL — cannot resolve `./params`.

- [ ] **Step 3: Implement `src/lib/url/params.ts`**

```ts
/** Serialize a calculator id + its string inputs into a URL query string. Empty values are omitted. */
export function serializeParams(calcId: string, inputs: Record<string, string>): string {
  const params = new URLSearchParams();
  params.set("calc", calcId);
  for (const [key, value] of Object.entries(inputs)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  return params.toString();
}

/** Parse a location.search string into the calc id (or null) and the remaining inputs. */
export function parseParams(search: string): { calcId: string | null; inputs: Record<string, string> } {
  const params = new URLSearchParams(search);
  const calcId = params.get("calc");
  const inputs: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    if (key !== "calc") inputs[key] = value;
  }
  return { calcId, inputs };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/url/params.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/url/params.ts src/lib/url/params.test.ts
git commit -m "feat: add URL param serialization helpers (TDD)"
```

---

## Task 2: Relocate `moeda` to lib + text summaries (TDD)

**Files:**
- Create: `src/lib/format.ts`
- Modify: `src/components/calculadora/formatters.ts`
- Create: `src/lib/calculators/resumos.ts`
- Test: `src/lib/calculators/resumos.test.ts`

- [ ] **Step 1: Create `src/lib/format.ts`**

```ts
export const moeda = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
```

- [ ] **Step 2: Re-export `moeda` from the existing formatters module**

Replace the entire contents of `src/components/calculadora/formatters.ts` with:

```ts
export { moeda } from "../../lib/format";
```

(The three existing components import `moeda` from `./calculadora/formatters`, so this keeps them working unchanged.)

- [ ] **Step 3: Write the failing test**

Create `src/lib/calculators/resumos.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { resumoCdi, resumoFinanciamento, resumoMotorista } from "./resumos";
import { calcularCdi } from "./cdi";
import { calcularFinanciamento } from "./financiamento";
import { calcularMotorista } from "./motoristaApp";

describe("resumos", () => {
  it("resumoCdi inclui rendimento líquido e montante líquido", () => {
    const input = { valorInicial: 10000, percentualCDI: 110, taxaCDIAnual: 10.5, prazoDias: 365 };
    const texto = resumoCdi(input, calcularCdi(input));
    expect(texto).toContain("CDI");
    expect(texto).toContain("Rendimento líquido");
    expect(texto).toContain("Montante líquido");
    expect(texto.split("\n").length).toBeGreaterThan(3);
  });

  it("resumoFinanciamento inclui Price e SAC", () => {
    const input = { valorFinanciado: 100000, taxaJurosAnual: 12, prazoMeses: 12 };
    const texto = resumoFinanciamento(input, calcularFinanciamento(input));
    expect(texto).toContain("Price");
    expect(texto).toContain("SAC");
  });

  it("resumoMotorista inclui ganho líquido e margem", () => {
    const input = { ganhoBruto: 300, kmRodados: 200, consumoKmPorLitro: 10, precoCombustivel: 5.5 };
    const texto = resumoMotorista(input, calcularMotorista(input));
    expect(texto).toContain("Ganho líquido");
    expect(texto).toContain("Margem");
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npx vitest run src/lib/calculators/resumos.test.ts`
Expected: FAIL — cannot resolve `./resumos`.

- [ ] **Step 5: Implement `src/lib/calculators/resumos.ts`**

```ts
import { moeda } from "../format";
import type { CdiInput, CdiResult } from "./cdi";
import type { FinanciamentoInput, FinanciamentoResult } from "./financiamento";
import type { MotoristaInput, MotoristaResult } from "./motoristaApp";

export function resumoCdi(input: CdiInput, r: CdiResult): string {
  return [
    "CDI — Calcule Já",
    `Investimento: ${moeda(input.valorInicial)} a ${input.percentualCDI}% do CDI (${input.taxaCDIAnual}% a.a.) por ${input.prazoDias} dias`,
    `Rendimento bruto: ${moeda(r.rendimentoBruto)}`,
    `IR (${(r.aliquotaIR * 100).toFixed(1)}%): ${moeda(r.valorIR)}`,
    `Rendimento líquido: ${moeda(r.rendimentoLiquido)}`,
    `Montante líquido: ${moeda(r.montanteLiquido)}`,
  ].join("\n");
}

export function resumoFinanciamento(input: FinanciamentoInput, r: FinanciamentoResult): string {
  return [
    "Financiamento — Calcule Já",
    `Valor: ${moeda(input.valorFinanciado)} | Taxa: ${input.taxaJurosAnual}% a.a. | Prazo: ${input.prazoMeses} meses`,
    `Price — 1ª parcela ${moeda(r.price.primeiraParcela)}, total de juros ${moeda(r.price.totalJuros)}`,
    `SAC — 1ª parcela ${moeda(r.sac.primeiraParcela)}, total de juros ${moeda(r.sac.totalJuros)}`,
    `O SAC economiza ${moeda(r.diferencaTotalJuros)} em juros`,
  ].join("\n");
}

export function resumoMotorista(input: MotoristaInput, r: MotoristaResult): string {
  return [
    "Motorista de App — Calcule Já",
    `Ganho bruto ${moeda(input.ganhoBruto)} em ${input.kmRodados} km`,
    `Custo de combustível: ${moeda(r.custoCombustivel)} (${moeda(r.custoPorKm)}/km)`,
    `Ganho líquido: ${moeda(r.ganhoLiquido)} (${moeda(r.ganhoLiquidoPorKm)}/km)`,
    `Margem: ${r.margemLiquidaPercentual.toFixed(1)}%`,
  ].join("\n");
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run src/lib/calculators/resumos.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 7: Verify nothing broke and commit**

Run: `npx vitest run && npm run build`
Expected: all tests pass; build succeeds.

```bash
git add src/lib/format.ts src/components/calculadora/formatters.ts src/lib/calculators/resumos.ts src/lib/calculators/resumos.test.ts
git commit -m "feat: relocate moeda to lib and add per-calculator text summaries (TDD)"
```

---

## Task 3: `useUrlState` hook

**Files:**
- Create: `src/lib/url/useUrlState.ts`

- [ ] **Step 1: Implement `src/lib/url/useUrlState.ts`**

```ts
import { useEffect } from "react";
import { serializeParams, parseParams } from "./params";

/**
 * Syncs a calculator's string inputs with the URL.
 * - On mount: if the URL's `calc` matches `calcId`, calls `hydrate` with the parsed inputs.
 * - On change: reflects `values` into the URL via history.replaceState (no history pollution).
 */
export function useUrlState(
  calcId: string,
  values: Record<string, string>,
  hydrate: (inputs: Record<string, string>) => void,
): void {
  // Hydrate once on mount, only if the link targets this calculator.
  useEffect(() => {
    const { calcId: urlCalc, inputs } = parseParams(window.location.search);
    if (urlCalc === calcId && Object.keys(inputs).length > 0) {
      hydrate(inputs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect current values into the URL whenever the serialized query changes.
  const query = serializeParams(calcId, values);
  useEffect(() => {
    window.history.replaceState(null, "", `${window.location.pathname}?${query}`);
  }, [query]);
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: build succeeds (no usages yet; just type-checks via bundling).

- [ ] **Step 3: Commit**

```bash
git add src/lib/url/useUrlState.ts
git commit -m "feat: add useUrlState hook for URL-synced calculator inputs"
```

---

## Task 4: `ExportBar` component (copy + share)

**Files:**
- Create: `src/components/calculadora/ExportBar.tsx`

- [ ] **Step 1: Implement `src/components/calculadora/ExportBar.tsx`**

```tsx
import React, { useState } from "react";

interface ExportBarProps {
  /** Returns the plain-text summary to copy. Called only when enabled. */
  resumoTexto: () => string;
  /** True when there is a valid result to export. */
  enabled: boolean;
}

export const ExportBar: React.FC<ExportBarProps> = ({ resumoTexto, enabled }) => {
  const [feedback, setFeedback] = useState("");

  const flash = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 2000);
  };

  const copiarTexto = async () => {
    try {
      await navigator.clipboard.writeText(resumoTexto());
      flash("Resultado copiado!");
    } catch {
      flash("Não foi possível copiar.");
    }
  };

  const compartilharLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      flash("Link copiado!");
    } catch {
      flash("Não foi possível copiar o link.");
    }
  };

  const btn =
    "text-sm px-3 py-1.5 rounded-lg border border-gray-300 transition hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      <button type="button" className={btn} onClick={copiarTexto} disabled={!enabled}>
        Copiar resultado
      </button>
      <button type="button" className={btn} onClick={compartilharLink} disabled={!enabled}>
        Compartilhar link
      </button>
      {feedback && (
        <span className="text-sm text-green-600" role="status">
          {feedback}
        </span>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/calculadora/ExportBar.tsx
git commit -m "feat: add ExportBar with copy-result and share-link actions"
```

---

## Task 5: Sync active tab with the URL in `App.tsx`

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add the import**

At the top of `src/App.tsx`, after the existing component imports, add:

```tsx
import { parseParams } from './lib/url/params';
```

Also change the React import line to include `useEffect`:

```tsx
import React, { useState, useEffect } from 'react';
```

- [ ] **Step 2: Add URL ↔ activeTab sync effects**

Immediately after the `const [activeTab, setActiveTab] = useState('cross-multiplication');` line, add:

```tsx
  // On first load, open the calculator named in the URL (?calc=...).
  useEffect(() => {
    const { calcId } = parseParams(window.location.search);
    if (calcId) setActiveTab(calcId);
  }, []);

  // When the user switches tabs, reset the URL to just the calc id.
  useEffect(() => {
    const { calcId } = parseParams(window.location.search);
    if (calcId !== activeTab) {
      window.history.replaceState(null, '', `${window.location.pathname}?calc=${activeTab}`);
    }
  }, [activeTab]);
```

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds; lint shows no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: sync active calculator tab with the URL"
```

---

## Task 6: Wire the CDI calculator

**Files:**
- Modify: `src/components/CdiCalculator.tsx`

- [ ] **Step 1: Add imports**

In `src/components/CdiCalculator.tsx`, add after the existing imports:

```tsx
import { useUrlState } from "../lib/url/useUrlState";
import { ExportBar } from "./calculadora/ExportBar";
import { resumoCdi } from "../lib/calculators/resumos";
```

- [ ] **Step 2: Wire `useUrlState` after the state declarations**

After the four `useState` lines (and before `const calcular = ...`), add:

```tsx
  useUrlState(
    "cdi",
    { valorInicial, percentualCDI, taxaCDIAnual, prazoDias },
    (i) => {
      if (i.valorInicial !== undefined) setValorInicial(i.valorInicial);
      if (i.percentualCDI !== undefined) setPercentualCDI(i.percentualCDI);
      if (i.taxaCDIAnual !== undefined) setTaxaCDIAnual(i.taxaCDIAnual);
      if (i.prazoDias !== undefined) setPrazoDias(i.prazoDias);
    },
  );
```

- [ ] **Step 3: Render the ExportBar inside the result panel**

In the result panel `div` (the one with `className="bg-gray-50 p-6 rounded-lg space-y-4"`), add as its last child, after the final `<Linha .../>`:

```tsx
          <ExportBar
            enabled={result !== null}
            resumoTexto={() =>
              result
                ? resumoCdi(
                    {
                      valorInicial: Number(valorInicial),
                      percentualCDI: Number(percentualCDI),
                      taxaCDIAnual: Number(taxaCDIAnual),
                      prazoDias: Number(prazoDias),
                    },
                    result,
                  )
                : ""
            }
          />
```

- [ ] **Step 4: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds; no new lint errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/CdiCalculator.tsx
git commit -m "feat: wire CDI calculator to URL state and ExportBar"
```

---

## Task 7: Wire the Financiamento and Motorista calculators

**Files:**
- Modify: `src/components/FinanciamentoCalculator.tsx`
- Modify: `src/components/MotoristaAppCalculator.tsx`

- [ ] **Step 1: Add imports to `FinanciamentoCalculator.tsx`**

After the existing imports:

```tsx
import { useUrlState } from "../lib/url/useUrlState";
import { ExportBar } from "./calculadora/ExportBar";
import { resumoFinanciamento } from "../lib/calculators/resumos";
```

- [ ] **Step 2: Wire `useUrlState` after the state declarations in `FinanciamentoCalculator.tsx`**

After the `valor`, `taxa`, `prazo` `useState` lines (before `const calcular = ...`):

```tsx
  useUrlState(
    "financiamento",
    { valor, taxa, prazo },
    (i) => {
      if (i.valor !== undefined) setValor(i.valor);
      if (i.taxa !== undefined) setTaxa(i.taxa);
      if (i.prazo !== undefined) setPrazo(i.prazo);
    },
  );
```

- [ ] **Step 3: Render ExportBar in `FinanciamentoCalculator.tsx`**

At the end of the outer `<div className="space-y-6">`, after the amortization table block (the `{result && ( ... table ... )}` block), add:

```tsx
      <ExportBar
        enabled={result !== null}
        resumoTexto={() =>
          result
            ? resumoFinanciamento(
                {
                  valorFinanciado: Number(valor),
                  taxaJurosAnual: Number(taxa),
                  prazoMeses: Number(prazo),
                },
                result,
              )
            : ""
        }
      />
```

- [ ] **Step 4: Add imports to `MotoristaAppCalculator.tsx`**

After the existing imports:

```tsx
import { useUrlState } from "../lib/url/useUrlState";
import { ExportBar } from "./calculadora/ExportBar";
import { resumoMotorista } from "../lib/calculators/resumos";
```

- [ ] **Step 5: Wire `useUrlState` after the state declarations in `MotoristaAppCalculator.tsx`**

After the five `useState` lines (`ganhoBruto`, `kmRodados`, `consumo`, `preco`, `outros`), before `const calcular = ...`:

```tsx
  useUrlState(
    "motorista",
    { ganhoBruto, kmRodados, consumo, preco, outros },
    (i) => {
      if (i.ganhoBruto !== undefined) setGanhoBruto(i.ganhoBruto);
      if (i.kmRodados !== undefined) setKmRodados(i.kmRodados);
      if (i.consumo !== undefined) setConsumo(i.consumo);
      if (i.preco !== undefined) setPreco(i.preco);
      if (i.outros !== undefined) setOutros(i.outros);
    },
  );
```

- [ ] **Step 6: Render ExportBar in `MotoristaAppCalculator.tsx`**

Inside the result panel `div` (`className="bg-gray-50 p-6 rounded-lg space-y-4"`), as the last child after the final `<Linha .../>`:

```tsx
          <ExportBar
            enabled={result !== null}
            resumoTexto={() =>
              result
                ? resumoMotorista(
                    {
                      ganhoBruto: Number(ganhoBruto),
                      kmRodados: Number(kmRodados),
                      consumoKmPorLitro: Number(consumo),
                      precoCombustivel: Number(preco),
                      outrosCustos: outros === "" ? 0 : Number(outros),
                    },
                    result,
                  )
                : ""
            }
          />
```

- [ ] **Step 7: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds; no new lint errors.

- [ ] **Step 8: Commit**

```bash
git add src/components/FinanciamentoCalculator.tsx src/components/MotoristaAppCalculator.tsx
git commit -m "feat: wire Financiamento and Motorista to URL state and ExportBar"
```

---

## Task 8: Wave 1 verification

**Files:** none (verification only)

- [ ] **Step 1: Full automated verification**

Run: `npm test && npm run build && npm run lint`
Expected: all tests pass (CDI, Financiamento, Motorista, params, resumos); build succeeds; lint shows only the pre-existing `DateTimeConverter.tsx` exhaustive-deps warning.

- [ ] **Step 2: Manual smoke — share link round-trip**

Run `npm run dev`, then:
1. Open the CDI calculator, fill in values, confirm a result renders.
2. Confirm the address bar updates to `?calc=cdi&valorInicial=...&...`.
3. Click "Copiar resultado" — confirm the "Resultado copiado!" feedback.
4. Click "Compartilhar link" — confirm "Link copiado!".
5. Paste the URL into a fresh tab — confirm the CDI calculator opens with the inputs pre-filled and the result already shown.
6. Repeat the round-trip check for Financiamento and Motorista.

- [ ] **Step 3: Commit any fixes (if needed)**

```bash
git add -A
git commit -m "chore: Wave 1 export backbone verification"
```

---

## Self-Review Notes

- **Spec coverage (Wave 1 scope):** ExportBar copy-text ✓ (Tasks 4, 6, 7) — share-link ✓ (Task 4 uses `window.location.href`, kept in sync by Tasks 5–7); `useUrlState` + pure serialization ✓ (Tasks 1, 3); `resumoTexto` per calculator, pure + tested ✓ (Task 2); `activeTab`↔URL sync ✓ (Task 5). PDF/PNG and charts are intentionally **out of Wave 1** (Waves 2 and 4).
- **No new dependencies** in this wave, per the spec's Wave 1 definition.
- **Type consistency:** `serializeParams`/`parseParams` signatures match across Tasks 1, 3, 5. `resumoCdi`/`resumoFinanciamento`/`resumoMotorista` signatures `(input, result)` match between Task 2 (definition) and Tasks 6–7 (callers). Input object shapes passed to the resumo functions match the `CdiInput`/`FinanciamentoInput`/`MotoristaInput` interfaces from the existing lib modules.
- **Known cosmetic note:** `ExportBar` uses Tailwind gray utilities (consistent with the calculators' current styling, which is not yet theme-aware). Full dark-theme harmonization of the calculators is a separate follow-up, not part of this wave.
