# Spec — Novas Calculadoras (TDD)

**Data:** 2026-06-07
**Sub-projeto:** A — Novas Calculadoras (primeiro corte do roadmap de growth)
**Abordagem:** A1 — camada de cálculo pura + Vitest, componentes finos

---

## 1. Objetivo

Adicionar três novas calculadoras ao Calcule Já — **CDI/Selic**, **Financiamento (SAC vs Price)** e **Motorista de App** — desenvolvidas com **TDD**. Como efeito colateral de alto valor, esta spec introduz o **runner de testes** (hoje inexistente no repositório) e estabelece um **padrão reutilizável** de "lógica pura testável + componente fino" que toda calculadora futura vai seguir.

### Critérios de sucesso
- As três funções de cálculo existem como funções puras tipadas, com testes que passam.
- Os testes cobrem valores de referência conhecidos e os edge cases listados (fronteiras de IR, IOF <30d, financiamento de 1 mês, juros zero).
- As três calculadoras aparecem no menu lateral e funcionam ponta a ponta na UI.
- `npm test` roda a suíte via Vitest e passa.
- O padrão (pasta `src/lib/calculators/`, função pura → componente fino) está documentado pelo próprio código existente.

### Fora de escopo (ficam para ciclos futuros)
- Migração SEO/SSG (Next.js/Astro) — Sub-projeto B.
- AdSense, links de afiliado, compartilhamento por URL, widget embed — Sub-projeto C.
- Histórico, login, persistência — Sub-projeto D.
- Demais TODOs do README (conversor de unidades, desvalorização da moeda) — repetições baratas do padrão, depois.

---

## 2. Arquitetura

Hoje cada calculadora calcula **inline dentro do componente** (ex.: `FuelCalculator.tsx`). Isso impede testar a matemática realista de forma limpa. Esta spec separa **lógica de cálculo** (pura, sem React, testável) de **apresentação** (componente fino no padrão Tailwind existente).

```
src/lib/calculators/
  cdi.ts              cdi.test.ts
  financiamento.ts    financiamento.test.ts
  motoristaApp.ts     motoristaApp.test.ts
src/components/
  CdiCalculator.tsx
  FinanciamentoCalculator.tsx
  MotoristaAppCalculator.tsx
```

- **Funções puras**: recebem um objeto de entrada tipado e devolvem um objeto de resultado tipado. Sem React, sem I/O, determinísticas.
- **Componentes finos**: mantêm inputs como `string` em `useState` (padrão atual), fazem parse para `number`, chamam a função pura e renderizam. Mostram `"-"` enquanto inputs estão vazios/ inválidos, como `FuelCalculator` já faz.
- **Runner**: **Vitest** (zero-config em projeto Vite, reaproveita `vite.config.ts`, ESM nativo). Ambiente `node` (lógica pura não precisa de DOM). Testes colocados ao lado do código (`*.test.ts`).

### Tratamento de erros
- As funções puras **validam e lançam** (`RangeError`) em entradas inválidas: valores `≤ 0` onde um valor positivo é exigido, e qualquer divisão por zero (ex.: prazo 0, consumo 0, km 0).
- Os componentes **pré-validam**: se algum campo obrigatório estiver vazio ou não-positivo, exibem `"-"` e **não** chamam a função pura. Assim o usuário nunca vê uma exceção, e os testes da função pura podem afirmar o comportamento de erro honestamente.

---

## 3. Regras de negócio

> Convenções explícitas para que os testes sejam determinísticos. São modelos de calculadora ao consumidor (defensáveis), não simulação contábil oficial.

### 3.1 CDI / Selic — `src/lib/calculators/cdi.ts`

**Entrada**
```ts
interface CdiInput {
  valorInicial: number;     // R$, > 0
  percentualCDI: number;    // % do CDI, ex.: 110, > 0
  taxaCDIAnual: number;     // CDI anual em %, ex.: 10.5, > 0  (informado pelo usuário)
  prazoDias: number;        // dias corridos, inteiro > 0
}
```

**Cálculo**
1. `taxaEfetivaAnual = taxaCDIAnual * (percentualCDI / 100)` (em %).
2. `montanteBruto = valorInicial * (1 + taxaEfetivaAnual/100) ** (prazoDias / 365)`.
3. `rendimentoBruto = montanteBruto - valorInicial`.
4. **IOF** (só se `prazoDias < 30`): `valorIOF = rendimentoBruto * tabelaIOF[prazoDias]`, onde `tabelaIOF` é a tabela regressiva padrão (dia 1 = 0,96 … dia 29 = 0,03; dia ≥30 = 0). Embutir a tabela como constante.
5. **IR** sobre `(rendimentoBruto - valorIOF)`, alíquota regressiva por `prazoDias`:
   - `≤ 180` → 22,5%
   - `181..360` → 20%
   - `361..720` → 17,5%
   - `> 720` → 15%
6. `rendimentoLiquido = rendimentoBruto - valorIOF - valorIR`.
7. `montanteLiquido = valorInicial + rendimentoLiquido`.

**Saída**
```ts
interface CdiResult {
  montanteBruto: number;
  rendimentoBruto: number;
  aliquotaIR: number;          // fração, ex.: 0.175
  valorIR: number;
  aliquotaIOF: number;         // fração aplicada (0 se ≥30 dias)
  valorIOF: number;
  rendimentoLiquido: number;
  montanteLiquido: number;
  rentabilidadeLiquidaPercentual: number; // rendimentoLiquido / valorInicial * 100
}
```

**Erros:** lança `RangeError` se qualquer entrada `≤ 0` ou `prazoDias` não-inteiro.

### 3.2 Financiamento SAC vs Price — `src/lib/calculators/financiamento.ts`

**Entrada**
```ts
interface FinanciamentoInput {
  valorFinanciado: number;  // R$, > 0
  taxaJurosAnual: number;   // % a.a., > 0
  prazoMeses: number;       // inteiro > 0
}
```

**Conversão de taxa:** `i = (1 + taxaJurosAnual/100) ** (1/12) - 1` (taxa mensal equivalente).

**Price (parcela fixa):**
- `parcela = PV * i / (1 - (1 + i) ** -n)` (se `i = 0`, `parcela = PV / n`).
- Cronograma mês a mês: `juros = saldo * i`; `amortizacao = parcela - juros`; `saldo -= amortizacao`.

**SAC (amortização constante):**
- `amortizacao = PV / n` (constante).
- `juros_k = saldo * i`; `parcela_k = amortizacao + juros_k` (decrescente).

**Saída**
```ts
interface LinhaCronograma {
  mes: number; parcela: number; juros: number; amortizacao: number; saldo: number;
}
interface SistemaResult {
  primeiraParcela: number;
  ultimaParcela: number;
  totalPago: number;
  totalJuros: number;
  cronograma: LinhaCronograma[];
}
interface FinanciamentoResult {
  price: SistemaResult;
  sac: SistemaResult;
  diferencaTotalJuros: number; // price.totalJuros - sac.totalJuros
}
```

**Erros:** lança `RangeError` se entradas `≤ 0` ou `prazoMeses` não-inteiro. Saldo final deve fechar em ~0 (tolerância de arredondamento) — afirmado em teste.

### 3.3 Motorista de App — `src/lib/calculators/motoristaApp.ts`

**Entrada**
```ts
interface MotoristaInput {
  ganhoBruto: number;          // R$, > 0
  kmRodados: number;           // > 0
  consumoKmPorLitro: number;   // km/l, > 0
  precoCombustivel: number;    // R$/l, > 0
  outrosCustos?: number;       // R$, ≥ 0, default 0
}
```

**Cálculo**
- `litrosConsumidos = kmRodados / consumoKmPorLitro`
- `custoCombustivel = litrosConsumidos * precoCombustivel`
- `custoPorKm = custoCombustivel / kmRodados`
- `ganhoLiquido = ganhoBruto - custoCombustivel - (outrosCustos ?? 0)`
- `ganhoLiquidoPorKm = ganhoLiquido / kmRodados`
- `margemLiquidaPercentual = ganhoLiquido / ganhoBruto * 100`

**Saída**
```ts
interface MotoristaResult {
  litrosConsumidos: number;
  custoCombustivel: number;
  custoPorKm: number;
  ganhoLiquido: number;
  ganhoLiquidoPorKm: number;
  margemLiquidaPercentual: number;
}
```

**Erros:** lança `RangeError` se algum campo obrigatório `≤ 0` ou `outrosCustos < 0`.

---

## 4. Estratégia de testes (TDD)

Para cada função: **escrever os testes primeiro** (vermelho), depois implementar até o verde. Casos table-driven.

- **CDI:** valor de referência calculado à mão (ex.: R$10.000, 110% CDI, 10,5% a.a., 365 dias → conferir bruto/líquido); fronteiras de IR exatamente em 180, 360, 720 dias; IOF no dia 29 (aplica) vs dia 30 (zero); erro em entradas ≤0.
- **Financiamento:** Price com valores de referência conhecidos (ex.: PV 100.000, 12% a.a., 12 meses); SAC com primeira/última parcela; `totalJuros` SAC < `totalJuros` Price; saldo final ≈ 0; caso `n = 1`; caso juros zero; erro em entradas ≤0.
- **Motorista:** caso simples conferível à mão; `outrosCustos` omitido = 0; ganho líquido negativo permitido (margem negativa); erro em km/consumo = 0.

### Config
- Adicionar `vitest` (e tipos) às devDependencies.
- Configurar bloco `test` em `vite.config.ts` com `environment: 'node'`.
- Scripts em `package.json`: `"test": "vitest run"`, `"test:watch": "vitest"`.

---

## 5. Integração na UI

- `src/components/CdiCalculator.tsx`, `FinanciamentoCalculator.tsx`, `MotoristaAppCalculator.tsx` — seguem o visual de `FuelCalculator.tsx` (inputs controlados, bloco de resultado em `bg-gray-50`). Financiamento exibe resumo + tabela de cronograma (rolável).
- `src/App.tsx`: novos `case` no switch — `"cdi"`, `"financiamento"`, `"motorista"`.
- `src/components/Layout.tsx`: novos `NavItem` com ícones lucide `TrendingUp` (CDI), `Landmark` (Financiamento), `Car` (Motorista).

---

## 6. Riscos / notas

- O alias `@/` só existe no `vite.config.ts` (não no tsconfig). Usar **imports relativos** nos novos arquivos, como o resto do código.
- `vite build` não roda type-check; os testes do Vitest passam a ser a principal rede de segurança — manter a suíte verde antes de commitar.
- Modelos de cálculo são ao consumidor; documentar as convenções (365 dias corridos no CDI, taxa mensal equivalente no financiamento) no JSDoc das funções para evitar divergência futura.
