# Novas Calculadoras (CDI, Financiamento, Motorista de App) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three test-driven calculators — CDI/Selic, Financiamento (SAC vs Price), and Motorista de App — to Calcule Já, introducing Vitest and a reusable "pure-function + thin-component" pattern.

**Architecture:** Calculation logic lives in pure, React-free functions under `src/lib/calculators/` (typed input → typed result), unit-tested with Vitest in `node` environment. Thin React components collect string inputs, parse, call the pure function, and render in the existing Tailwind style. New calculators are wired into the tab switch in `App.tsx` and the sidebar in `Layout.tsx`.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, Tailwind CSS, lucide-react.

---

## File Structure

- Create: `src/lib/calculators/cdi.ts` — pure CDI/IR/IOF math
- Create: `src/lib/calculators/cdi.test.ts`
- Create: `src/lib/calculators/financiamento.ts` — SAC & Price amortization
- Create: `src/lib/calculators/financiamento.test.ts`
- Create: `src/lib/calculators/motoristaApp.ts` — driver cost/earnings math
- Create: `src/lib/calculators/motoristaApp.test.ts`
- Create: `src/components/calculadora/campos.tsx` — shared `Campo`/`Linha` UI helpers (DRY across the 3 components)
- Create: `src/components/CdiCalculator.tsx`
- Create: `src/components/FinanciamentoCalculator.tsx`
- Create: `src/components/MotoristaAppCalculator.tsx`
- Modify: `vite.config.ts` — add Vitest `test` config
- Modify: `package.json` — add `test` / `test:watch` scripts + `vitest` devDep
- Modify: `src/App.tsx:1-39` — import + switch cases for the 3 calculators
- Modify: `src/components/Layout.tsx:1-8,46-104` — import icons + add 3 NavItems

---

## Task 1: Vitest setup + CDI calculator (TDD)

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/lib/calculators/cdi.ts`
- Test: `src/lib/calculators/cdi.test.ts`

- [ ] **Step 1: Install Vitest**

Run: `npm install -D vitest`
Expected: `vitest` appears under devDependencies; install succeeds.

- [ ] **Step 2: Add test scripts to `package.json`**

In the `"scripts"` block, add the two lines so it reads:

```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
```

- [ ] **Step 3: Enable Vitest in `vite.config.ts`**

Replace the whole file with:

```ts
/// <reference types="vitest/config" />
import path from "path"
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: 'node',
  },
});
```

- [ ] **Step 4: Write the failing CDI reference test**

Create `src/lib/calculators/cdi.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { calcularCdi } from "./cdi";

describe("calcularCdi", () => {
  it("calcula bruto e líquido para R$10.000, 110% CDI, 10,5% a.a., 365 dias", () => {
    const r = calcularCdi({
      valorInicial: 10000,
      percentualCDI: 110,
      taxaCDIAnual: 10.5,
      prazoDias: 365,
    });
    // taxa efetiva = 10,5 * 1,10 = 11,55% a.a.
    expect(r.montanteBruto).toBeCloseTo(11155, 2);
    expect(r.rendimentoBruto).toBeCloseTo(1155, 2);
    // 365 dias > 360 e <= 720 => IR 17,5%
    expect(r.aliquotaIR).toBe(0.175);
    expect(r.valorIR).toBeCloseTo(202.125, 2);
    expect(r.valorIOF).toBe(0); // >= 30 dias
    expect(r.rendimentoLiquido).toBeCloseTo(952.875, 2);
    expect(r.montanteLiquido).toBeCloseTo(10952.875, 2);
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `npx vitest run src/lib/calculators/cdi.test.ts`
Expected: FAIL — cannot resolve `./cdi` (module/function not found).

- [ ] **Step 6: Implement `src/lib/calculators/cdi.ts`**

```ts
export interface CdiInput {
  valorInicial: number;   // R$, > 0
  percentualCDI: number;  // % do CDI, ex.: 110
  taxaCDIAnual: number;   // CDI anual em %, ex.: 10.5
  prazoDias: number;      // dias corridos, inteiro > 0
}

export interface CdiResult {
  montanteBruto: number;
  rendimentoBruto: number;
  aliquotaIR: number;   // fração, ex.: 0.175
  valorIR: number;
  aliquotaIOF: number;  // fração aplicada (0 se >= 30 dias)
  valorIOF: number;
  rendimentoLiquido: number;
  montanteLiquido: number;
  rentabilidadeLiquidaPercentual: number;
}

// Tabela regressiva de IOF sobre o rendimento. Índice = dias (1..29). >= 30 => 0.
const TABELA_IOF = [
  0,
  0.96, 0.93, 0.90, 0.86, 0.83, 0.80, 0.76, 0.73, 0.70, 0.66,
  0.63, 0.60, 0.56, 0.53, 0.50, 0.46, 0.43, 0.40, 0.36, 0.33,
  0.30, 0.26, 0.23, 0.20, 0.16, 0.13, 0.10, 0.06, 0.03,
];

function fatorIOF(prazoDias: number): number {
  if (prazoDias >= 30) return 0;
  return TABELA_IOF[prazoDias] ?? 0;
}

function fatorIR(prazoDias: number): number {
  if (prazoDias <= 180) return 0.225;
  if (prazoDias <= 360) return 0.20;
  if (prazoDias <= 720) return 0.175;
  return 0.15;
}

/**
 * Modelo ao consumidor: taxa efetiva = CDI anual * (%CDI), composta por dias/365
 * (dias corridos). IOF regressivo só para prazo < 30 dias. IR regressivo por faixa.
 */
export function calcularCdi(input: CdiInput): CdiResult {
  const { valorInicial, percentualCDI, taxaCDIAnual, prazoDias } = input;
  if (valorInicial <= 0 || percentualCDI <= 0 || taxaCDIAnual <= 0 || prazoDias <= 0) {
    throw new RangeError("Todos os valores devem ser positivos.");
  }
  if (!Number.isInteger(prazoDias)) {
    throw new RangeError("prazoDias deve ser inteiro.");
  }

  const taxaEfetivaAnual = taxaCDIAnual * (percentualCDI / 100); // em %
  const montanteBruto =
    valorInicial * (1 + taxaEfetivaAnual / 100) ** (prazoDias / 365);
  const rendimentoBruto = montanteBruto - valorInicial;

  const aliquotaIOF = fatorIOF(prazoDias);
  const valorIOF = rendimentoBruto * aliquotaIOF;

  const aliquotaIR = fatorIR(prazoDias);
  const valorIR = (rendimentoBruto - valorIOF) * aliquotaIR;

  const rendimentoLiquido = rendimentoBruto - valorIOF - valorIR;
  const montanteLiquido = valorInicial + rendimentoLiquido;

  return {
    montanteBruto,
    rendimentoBruto,
    aliquotaIR,
    valorIR,
    aliquotaIOF,
    valorIOF,
    rendimentoLiquido,
    montanteLiquido,
    rentabilidadeLiquidaPercentual: (rendimentoLiquido / valorInicial) * 100,
  };
}
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npx vitest run src/lib/calculators/cdi.test.ts`
Expected: PASS (1 test).

- [ ] **Step 8: Add edge-case tests (IR boundaries, IOF, errors)**

Append to `src/lib/calculators/cdi.test.ts` inside the `describe`:

```ts
  it.each([
    [180, 0.225],
    [181, 0.20],
    [360, 0.20],
    [361, 0.175],
    [720, 0.175],
    [721, 0.15],
  ])("aplica a faixa de IR correta em %i dias", (prazoDias, esperado) => {
    const r = calcularCdi({ valorInicial: 1000, percentualCDI: 100, taxaCDIAnual: 10, prazoDias });
    expect(r.aliquotaIR).toBe(esperado);
  });

  it("aplica IOF no dia 29 e zera no dia 30", () => {
    const dia29 = calcularCdi({ valorInicial: 10000, percentualCDI: 100, taxaCDIAnual: 10.5, prazoDias: 29 });
    const dia30 = calcularCdi({ valorInicial: 10000, percentualCDI: 100, taxaCDIAnual: 10.5, prazoDias: 30 });
    expect(dia29.aliquotaIOF).toBe(0.03);
    expect(dia29.valorIOF).toBeGreaterThan(0);
    expect(dia30.aliquotaIOF).toBe(0);
    expect(dia30.valorIOF).toBe(0);
  });

  it("lança RangeError para entradas inválidas", () => {
    expect(() => calcularCdi({ valorInicial: 0, percentualCDI: 100, taxaCDIAnual: 10, prazoDias: 30 })).toThrow(RangeError);
    expect(() => calcularCdi({ valorInicial: 1000, percentualCDI: 100, taxaCDIAnual: 10, prazoDias: 30.5 })).toThrow(RangeError);
  });
```

- [ ] **Step 9: Run the full CDI suite**

Run: `npx vitest run src/lib/calculators/cdi.test.ts`
Expected: PASS (all tests green).

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json vite.config.ts src/lib/calculators/cdi.ts src/lib/calculators/cdi.test.ts
git commit -m "feat: add CDI calculator with Vitest setup (TDD)"
```

---

## Task 2: CDI component + shared fields + wiring

**Files:**
- Create: `src/components/calculadora/campos.tsx`
- Create: `src/components/CdiCalculator.tsx`
- Modify: `src/App.tsx:1-39`
- Modify: `src/components/Layout.tsx:1-8,46-104`

- [ ] **Step 1: Create shared field helpers**

Create `src/components/calculadora/campos.tsx`:

```tsx
import React from "react";

export const moeda = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface CampoProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export const Campo: React.FC<CampoProps> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

interface LinhaProps {
  rotulo: string;
  valor: string;
  destaque?: boolean;
}

export const Linha: React.FC<LinhaProps> = ({ rotulo, valor, destaque }) => (
  <div>
    <p className="text-sm text-gray-600">{rotulo}</p>
    <p className={destaque ? "text-2xl font-bold" : "text-lg font-medium"}>{valor}</p>
  </div>
);
```

- [ ] **Step 2: Create `src/components/CdiCalculator.tsx`**

```tsx
import React, { useState } from "react";
import { calcularCdi } from "../lib/calculators/cdi";
import { Campo, Linha, moeda } from "./calculadora/campos";

export const CdiCalculator: React.FC = () => {
  const [valorInicial, setValorInicial] = useState("");
  const [percentualCDI, setPercentualCDI] = useState("");
  const [taxaCDIAnual, setTaxaCDIAnual] = useState("");
  const [prazoDias, setPrazoDias] = useState("");

  const calcular = () => {
    const v = Number(valorInicial);
    const p = Number(percentualCDI);
    const t = Number(taxaCDIAnual);
    const d = Number(prazoDias);
    if (v <= 0 || p <= 0 || t <= 0 || d <= 0 || !Number.isInteger(d)) return null;
    return calcularCdi({ valorInicial: v, percentualCDI: p, taxaCDIAnual: t, prazoDias: d });
  };

  const result = calcular();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Calculadora de CDI</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Campo label="Valor investido (R$)" value={valorInicial} onChange={setValorInicial} />
          <Campo label="% do CDI (ex.: 110)" value={percentualCDI} onChange={setPercentualCDI} />
          <Campo label="CDI anual em % (ex.: 10.5)" value={taxaCDIAnual} onChange={setTaxaCDIAnual} />
          <Campo label="Prazo (dias)" value={prazoDias} onChange={setPrazoDias} />
        </div>
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-medium">Resultado</h3>
          <Linha rotulo="Montante bruto" valor={result ? moeda(result.montanteBruto) : "-"} />
          <Linha rotulo="Rendimento bruto" valor={result ? moeda(result.rendimentoBruto) : "-"} />
          <Linha
            rotulo="Imposto de Renda"
            valor={result ? `${(result.aliquotaIR * 100).toFixed(1)}% — ${moeda(result.valorIR)}` : "-"}
          />
          <Linha rotulo="IOF" valor={result ? moeda(result.valorIOF) : "-"} />
          <Linha rotulo="Rendimento líquido" valor={result ? moeda(result.rendimentoLiquido) : "-"} destaque />
          <Linha rotulo="Montante líquido" valor={result ? moeda(result.montanteLiquido) : "-"} destaque />
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Wire into `src/App.tsx`**

Add the import after line 11 (`import { MixtureRatioCalculator } ...`):

```tsx
import { CdiCalculator } from './components/CdiCalculator';
```

Add this case inside the `switch (activeTab)` block (e.g., right after the `"percentage"` case):

```tsx
      case "cdi":
        return <CdiCalculator />;
```

- [ ] **Step 4: Wire into `src/components/Layout.tsx`**

Change the lucide import (lines 1-8) to include `TrendingUp`:

```tsx
import {
  Calculator,
  Calendar,
  Gauge,
  Fuel,
  TrafficCone,
  Percent,
  TrendingUp,
} from "lucide-react";
```

Add this `NavItem` right after the "Porcentagem" NavItem (around line 60):

```tsx
            <NavItem
              icon={<TrendingUp className="w-5 h-5" />}
              text="CDI"
              active={activeTab === "cdi"}
              onClick={() => setActiveTab("cdi")}
            />
```

- [ ] **Step 5: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds, no lint errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/calculadora/campos.tsx src/components/CdiCalculator.tsx src/App.tsx src/components/Layout.tsx
git commit -m "feat: add CDI calculator UI and wire into nav"
```

---

## Task 3: Financiamento calculator (TDD)

**Files:**
- Create: `src/lib/calculators/financiamento.ts`
- Test: `src/lib/calculators/financiamento.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/calculators/financiamento.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { calcularFinanciamento } from "./financiamento";

describe("calcularFinanciamento", () => {
  const base = { valorFinanciado: 100000, taxaJurosAnual: 12, prazoMeses: 12 };

  it("Price: parcelas constantes e saldo zera no fim", () => {
    const { price } = calcularFinanciamento(base);
    expect(price.cronograma).toHaveLength(12);
    expect(price.primeiraParcela).toBeCloseTo(price.ultimaParcela, 4);
    expect(price.primeiraParcela).toBeCloseTo(8855.55, 0);
    expect(price.cronograma[11].saldo).toBeCloseTo(0, 2);
  });

  it("SAC: amortização constante, parcela decrescente, saldo zera", () => {
    const { sac } = calcularFinanciamento(base);
    expect(sac.cronograma).toHaveLength(12);
    expect(sac.cronograma[0].amortizacao).toBeCloseTo(8333.33, 2);
    expect(sac.primeiraParcela).toBeCloseTo(9282.21, 0);
    expect(sac.ultimaParcela).toBeLessThan(sac.primeiraParcela);
    expect(sac.cronograma[11].saldo).toBeCloseTo(0, 2);
  });

  it("SAC paga menos juros totais que Price", () => {
    const { price, sac, diferencaTotalJuros } = calcularFinanciamento(base);
    expect(sac.totalJuros).toBeLessThan(price.totalJuros);
    expect(diferencaTotalJuros).toBeCloseTo(price.totalJuros - sac.totalJuros, 6);
  });

  it("prazo de 1 mês: Price e SAC coincidem", () => {
    const r = calcularFinanciamento({ valorFinanciado: 1000, taxaJurosAnual: 12, prazoMeses: 1 });
    expect(r.price.primeiraParcela).toBeCloseTo(r.sac.primeiraParcela, 6);
  });

  it("lança RangeError para entradas inválidas", () => {
    expect(() => calcularFinanciamento({ valorFinanciado: 0, taxaJurosAnual: 12, prazoMeses: 12 })).toThrow(RangeError);
    expect(() => calcularFinanciamento({ valorFinanciado: 1000, taxaJurosAnual: 12, prazoMeses: 12.5 })).toThrow(RangeError);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/calculators/financiamento.test.ts`
Expected: FAIL — cannot resolve `./financiamento`.

- [ ] **Step 3: Implement `src/lib/calculators/financiamento.ts`**

```ts
export interface FinanciamentoInput {
  valorFinanciado: number; // R$, > 0
  taxaJurosAnual: number;  // % a.a., > 0
  prazoMeses: number;      // inteiro > 0
}

export interface LinhaCronograma {
  mes: number;
  parcela: number;
  juros: number;
  amortizacao: number;
  saldo: number;
}

export interface SistemaResult {
  primeiraParcela: number;
  ultimaParcela: number;
  totalPago: number;
  totalJuros: number;
  cronograma: LinhaCronograma[];
}

export interface FinanciamentoResult {
  price: SistemaResult;
  sac: SistemaResult;
  diferencaTotalJuros: number; // price.totalJuros - sac.totalJuros
}

// Taxa mensal equivalente à anual informada.
function taxaMensal(taxaJurosAnual: number): number {
  return (1 + taxaJurosAnual / 100) ** (1 / 12) - 1;
}

function resumir(cronograma: LinhaCronograma[]): SistemaResult {
  const totalPago = cronograma.reduce((s, l) => s + l.parcela, 0);
  const totalJuros = cronograma.reduce((s, l) => s + l.juros, 0);
  return {
    primeiraParcela: cronograma[0].parcela,
    ultimaParcela: cronograma[cronograma.length - 1].parcela,
    totalPago,
    totalJuros,
    cronograma,
  };
}

function calcularPrice(pv: number, i: number, n: number): SistemaResult {
  const parcela = i === 0 ? pv / n : (pv * i) / (1 - (1 + i) ** -n);
  const cronograma: LinhaCronograma[] = [];
  let saldo = pv;
  for (let mes = 1; mes <= n; mes++) {
    const juros = saldo * i;
    const amortizacao = parcela - juros;
    saldo -= amortizacao;
    cronograma.push({ mes, parcela, juros, amortizacao, saldo: Math.max(saldo, 0) });
  }
  return resumir(cronograma);
}

function calcularSac(pv: number, i: number, n: number): SistemaResult {
  const amortizacao = pv / n;
  const cronograma: LinhaCronograma[] = [];
  let saldo = pv;
  for (let mes = 1; mes <= n; mes++) {
    const juros = saldo * i;
    const parcela = amortizacao + juros;
    saldo -= amortizacao;
    cronograma.push({ mes, parcela, juros, amortizacao, saldo: Math.max(saldo, 0) });
  }
  return resumir(cronograma);
}

export function calcularFinanciamento(input: FinanciamentoInput): FinanciamentoResult {
  const { valorFinanciado, taxaJurosAnual, prazoMeses } = input;
  if (valorFinanciado <= 0 || taxaJurosAnual <= 0 || prazoMeses <= 0) {
    throw new RangeError("Todos os valores devem ser positivos.");
  }
  if (!Number.isInteger(prazoMeses)) {
    throw new RangeError("prazoMeses deve ser inteiro.");
  }
  const i = taxaMensal(taxaJurosAnual);
  const price = calcularPrice(valorFinanciado, i, prazoMeses);
  const sac = calcularSac(valorFinanciado, i, prazoMeses);
  return { price, sac, diferencaTotalJuros: price.totalJuros - sac.totalJuros };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/calculators/financiamento.test.ts`
Expected: PASS (all tests green).

- [ ] **Step 5: Commit**

```bash
git add src/lib/calculators/financiamento.ts src/lib/calculators/financiamento.test.ts
git commit -m "feat: add financiamento SAC vs Price calculator (TDD)"
```

---

## Task 4: Financiamento component + wiring

**Files:**
- Create: `src/components/FinanciamentoCalculator.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/Layout.tsx`

- [ ] **Step 1: Create `src/components/FinanciamentoCalculator.tsx`**

```tsx
import React, { useState } from "react";
import { calcularFinanciamento, SistemaResult } from "../lib/calculators/financiamento";
import { Campo, Linha, moeda } from "./calculadora/campos";

const ResumoSistema: React.FC<{ titulo: string; sistema: SistemaResult | null }> = ({ titulo, sistema }) => (
  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
    <h4 className="font-semibold">{titulo}</h4>
    <Linha rotulo="1ª parcela" valor={sistema ? moeda(sistema.primeiraParcela) : "-"} />
    <Linha rotulo="Última parcela" valor={sistema ? moeda(sistema.ultimaParcela) : "-"} />
    <Linha rotulo="Total pago" valor={sistema ? moeda(sistema.totalPago) : "-"} />
    <Linha rotulo="Total de juros" valor={sistema ? moeda(sistema.totalJuros) : "-"} destaque />
  </div>
);

export const FinanciamentoCalculator: React.FC = () => {
  const [valor, setValor] = useState("");
  const [taxa, setTaxa] = useState("");
  const [prazo, setPrazo] = useState("");

  const calcular = () => {
    const v = Number(valor);
    const t = Number(taxa);
    const p = Number(prazo);
    if (v <= 0 || t <= 0 || p <= 0 || !Number.isInteger(p)) return null;
    return calcularFinanciamento({ valorFinanciado: v, taxaJurosAnual: t, prazoMeses: p });
  };

  const result = calcular();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Financiamento — SAC vs Price</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Campo label="Valor financiado (R$)" value={valor} onChange={setValor} />
        <Campo label="Juros ao ano (%)" value={taxa} onChange={setTaxa} />
        <Campo label="Prazo (meses)" value={prazo} onChange={setPrazo} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResumoSistema titulo="Price (parcela fixa)" sistema={result ? result.price : null} />
        <ResumoSistema titulo="SAC (amortização constante)" sistema={result ? result.sac : null} />
      </div>

      {result && (
        <p className="text-sm text-gray-700">
          O SAC paga {moeda(result.diferencaTotalJuros)} a menos de juros que o Price.
        </p>
      )}

      {result && (
        <div className="overflow-auto max-h-80 border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left">Mês</th>
                <th className="px-3 py-2 text-right">Parcela (Price)</th>
                <th className="px-3 py-2 text-right">Parcela (SAC)</th>
                <th className="px-3 py-2 text-right">Saldo (SAC)</th>
              </tr>
            </thead>
            <tbody>
              {result.price.cronograma.map((linha, idx) => (
                <tr key={linha.mes} className="border-t">
                  <td className="px-3 py-2">{linha.mes}</td>
                  <td className="px-3 py-2 text-right">{moeda(linha.parcela)}</td>
                  <td className="px-3 py-2 text-right">{moeda(result.sac.cronograma[idx].parcela)}</td>
                  <td className="px-3 py-2 text-right">{moeda(result.sac.cronograma[idx].saldo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Wire into `src/App.tsx`**

Add the import after the `CdiCalculator` import:

```tsx
import { FinanciamentoCalculator } from './components/FinanciamentoCalculator';
```

Add this case to the switch:

```tsx
      case "financiamento":
        return <FinanciamentoCalculator />;
```

- [ ] **Step 3: Wire into `src/components/Layout.tsx`**

Add `Landmark` to the lucide import:

```tsx
import {
  Calculator,
  Calendar,
  Gauge,
  Fuel,
  TrafficCone,
  Percent,
  TrendingUp,
  Landmark,
} from "lucide-react";
```

Add this `NavItem` right after the CDI NavItem:

```tsx
            <NavItem
              icon={<Landmark className="w-5 h-5" />}
              text="Financiamento"
              active={activeTab === "financiamento"}
              onClick={() => setActiveTab("financiamento")}
            />
```

- [ ] **Step 4: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds, no lint errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/FinanciamentoCalculator.tsx src/App.tsx src/components/Layout.tsx
git commit -m "feat: add financiamento calculator UI and wire into nav"
```

---

## Task 5: Motorista de App calculator (TDD)

**Files:**
- Create: `src/lib/calculators/motoristaApp.ts`
- Test: `src/lib/calculators/motoristaApp.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/calculators/motoristaApp.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { calcularMotorista } from "./motoristaApp";

describe("calcularMotorista", () => {
  it("calcula custo e ganho líquido por km", () => {
    const r = calcularMotorista({
      ganhoBruto: 300,
      kmRodados: 200,
      consumoKmPorLitro: 10,
      precoCombustivel: 5.5,
    });
    expect(r.litrosConsumidos).toBeCloseTo(20, 6);
    expect(r.custoCombustivel).toBeCloseTo(110, 6);
    expect(r.custoPorKm).toBeCloseTo(0.55, 6);
    expect(r.ganhoLiquido).toBeCloseTo(190, 6);
    expect(r.ganhoLiquidoPorKm).toBeCloseTo(0.95, 6);
    expect(r.margemLiquidaPercentual).toBeCloseTo(63.333, 2);
  });

  it("usa outrosCustos = 0 quando omitido e permite margem negativa", () => {
    const r = calcularMotorista({
      ganhoBruto: 100,
      kmRodados: 200,
      consumoKmPorLitro: 10,
      precoCombustivel: 5.5,
    });
    expect(r.ganhoLiquido).toBeCloseTo(-10, 6);
    expect(r.margemLiquidaPercentual).toBeCloseTo(-10, 6);
  });

  it("desconta outrosCustos quando informado", () => {
    const r = calcularMotorista({
      ganhoBruto: 300,
      kmRodados: 200,
      consumoKmPorLitro: 10,
      precoCombustivel: 5.5,
      outrosCustos: 40,
    });
    expect(r.ganhoLiquido).toBeCloseTo(150, 6);
  });

  it("lança RangeError para entradas inválidas", () => {
    expect(() => calcularMotorista({ ganhoBruto: 300, kmRodados: 0, consumoKmPorLitro: 10, precoCombustivel: 5.5 })).toThrow(RangeError);
    expect(() => calcularMotorista({ ganhoBruto: 300, kmRodados: 200, consumoKmPorLitro: 0, precoCombustivel: 5.5 })).toThrow(RangeError);
    expect(() => calcularMotorista({ ganhoBruto: 300, kmRodados: 200, consumoKmPorLitro: 10, precoCombustivel: 5.5, outrosCustos: -1 })).toThrow(RangeError);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/calculators/motoristaApp.test.ts`
Expected: FAIL — cannot resolve `./motoristaApp`.

- [ ] **Step 3: Implement `src/lib/calculators/motoristaApp.ts`**

```ts
export interface MotoristaInput {
  ganhoBruto: number;        // R$, > 0
  kmRodados: number;         // > 0
  consumoKmPorLitro: number; // km/l, > 0
  precoCombustivel: number;  // R$/l, > 0
  outrosCustos?: number;     // R$, >= 0, default 0
}

export interface MotoristaResult {
  litrosConsumidos: number;
  custoCombustivel: number;
  custoPorKm: number;
  ganhoLiquido: number;
  ganhoLiquidoPorKm: number;
  margemLiquidaPercentual: number;
}

export function calcularMotorista(input: MotoristaInput): MotoristaResult {
  const { ganhoBruto, kmRodados, consumoKmPorLitro, precoCombustivel, outrosCustos = 0 } = input;
  if (ganhoBruto <= 0 || kmRodados <= 0 || consumoKmPorLitro <= 0 || precoCombustivel <= 0) {
    throw new RangeError("Todos os valores obrigatórios devem ser positivos.");
  }
  if (outrosCustos < 0) {
    throw new RangeError("outrosCustos não pode ser negativo.");
  }

  const litrosConsumidos = kmRodados / consumoKmPorLitro;
  const custoCombustivel = litrosConsumidos * precoCombustivel;
  const custoPorKm = custoCombustivel / kmRodados;
  const ganhoLiquido = ganhoBruto - custoCombustivel - outrosCustos;
  const ganhoLiquidoPorKm = ganhoLiquido / kmRodados;
  const margemLiquidaPercentual = (ganhoLiquido / ganhoBruto) * 100;

  return {
    litrosConsumidos,
    custoCombustivel,
    custoPorKm,
    ganhoLiquido,
    ganhoLiquidoPorKm,
    margemLiquidaPercentual,
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/calculators/motoristaApp.test.ts`
Expected: PASS (all tests green).

- [ ] **Step 5: Commit**

```bash
git add src/lib/calculators/motoristaApp.ts src/lib/calculators/motoristaApp.test.ts
git commit -m "feat: add motorista de app calculator (TDD)"
```

---

## Task 6: Motorista component + wiring

**Files:**
- Create: `src/components/MotoristaAppCalculator.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/Layout.tsx`

- [ ] **Step 1: Create `src/components/MotoristaAppCalculator.tsx`**

```tsx
import React, { useState } from "react";
import { calcularMotorista } from "../lib/calculators/motoristaApp";
import { Campo, Linha, moeda } from "./calculadora/campos";

export const MotoristaAppCalculator: React.FC = () => {
  const [ganhoBruto, setGanhoBruto] = useState("");
  const [kmRodados, setKmRodados] = useState("");
  const [consumo, setConsumo] = useState("");
  const [preco, setPreco] = useState("");
  const [outros, setOutros] = useState("");

  const calcular = () => {
    const g = Number(ganhoBruto);
    const km = Number(kmRodados);
    const c = Number(consumo);
    const p = Number(preco);
    const o = outros === "" ? 0 : Number(outros);
    if (g <= 0 || km <= 0 || c <= 0 || p <= 0 || o < 0) return null;
    return calcularMotorista({
      ganhoBruto: g,
      kmRodados: km,
      consumoKmPorLitro: c,
      precoCombustivel: p,
      outrosCustos: o,
    });
  };

  const result = calcular();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Calculadora do Motorista de App</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Campo label="Ganho bruto no período (R$)" value={ganhoBruto} onChange={setGanhoBruto} />
          <Campo label="Km rodados" value={kmRodados} onChange={setKmRodados} />
          <Campo label="Consumo (km/l)" value={consumo} onChange={setConsumo} />
          <Campo label="Preço do combustível (R$/l)" value={preco} onChange={setPreco} />
          <Campo label="Outros custos (R$, opcional)" value={outros} onChange={setOutros} />
        </div>
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-medium">Resultado</h3>
          <Linha rotulo="Litros consumidos" valor={result ? `${result.litrosConsumidos.toFixed(2)} L` : "-"} />
          <Linha rotulo="Custo de combustível" valor={result ? moeda(result.custoCombustivel) : "-"} />
          <Linha rotulo="Custo por km" valor={result ? moeda(result.custoPorKm) : "-"} />
          <Linha rotulo="Ganho líquido" valor={result ? moeda(result.ganhoLiquido) : "-"} destaque />
          <Linha rotulo="Ganho líquido por km" valor={result ? moeda(result.ganhoLiquidoPorKm) : "-"} destaque />
          <Linha rotulo="Margem líquida" valor={result ? `${result.margemLiquidaPercentual.toFixed(1)}%` : "-"} />
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Wire into `src/App.tsx`**

Add the import after the `FinanciamentoCalculator` import:

```tsx
import { MotoristaAppCalculator } from './components/MotoristaAppCalculator';
```

Add this case to the switch:

```tsx
      case "motorista":
        return <MotoristaAppCalculator />;
```

- [ ] **Step 3: Wire into `src/components/Layout.tsx`**

Add `Car` to the lucide import:

```tsx
import {
  Calculator,
  Calendar,
  Gauge,
  Fuel,
  TrafficCone,
  Percent,
  TrendingUp,
  Landmark,
  Car,
} from "lucide-react";
```

Add this `NavItem` right after the "Calculo de Viagem" NavItem:

```tsx
            <NavItem
              icon={<Car className="w-5 h-5" />}
              text="Motorista de App"
              active={activeTab === "motorista"}
              onClick={() => setActiveTab("motorista")}
            />
```

- [ ] **Step 4: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds, no lint errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/MotoristaAppCalculator.tsx src/App.tsx src/components/Layout.tsx
git commit -m "feat: add motorista de app calculator UI and wire into nav"
```

---

## Task 7: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: All test files (`cdi`, `financiamento`, `motoristaApp`) PASS.

- [ ] **Step 2: Run build + lint together**

Run: `npm run build && npm run lint`
Expected: build succeeds, no lint errors.

- [ ] **Step 3: Manual smoke check**

Run: `npm run dev`, open the app, click each new nav item (CDI, Financiamento, Motorista de App), enter sample values, confirm results render and update.

- [ ] **Step 4: Commit any final fixes (if needed)**

```bash
git add -A
git commit -m "chore: final verification for new calculators"
```

---

## Self-Review Notes

- **Spec coverage:** Vitest setup (Task 1) ✓; CDI w/ realistic IR+IOF (Tasks 1-2) ✓; Financiamento SAC+Price w/ full cronograma (Tasks 3-4) ✓; Motorista de App (Tasks 5-6) ✓; nav wiring (Tasks 2,4,6) ✓; error handling via RangeError + component pre-validation ✓; edge cases (IR boundaries 180/360/720, IOF 29 vs 30, financiamento n=1, motorista margem negativa) ✓.
- **Deviation from spec:** spec §3.2 mentions a "juros zero" financiamento test case, but the public `calcularFinanciamento` validates `taxaJurosAnual > 0`, so zero-rate cannot be reached through the public API. The `i === 0` branch in `calcularPrice` is kept as a defensive guard; the public test covers `prazoMeses = 1` instead. This is intentional and consistent.
- **Type consistency:** `calcularCdi`/`CdiResult`, `calcularFinanciamento`/`FinanciamentoResult`/`SistemaResult`/`LinhaCronograma`, `calcularMotorista`/`MotoristaResult`, and shared `Campo`/`Linha`/`moeda` are named identically everywhere they appear.
- **Placeholders:** none — every step contains runnable code or exact commands.
