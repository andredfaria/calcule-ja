# Spec — Export, Gráficos e Novas Calculadoras

**Data:** 2026-06-07
**Milestone:** segunda rodada — exportação, melhorias visuais e novas funcionalidades, com deploy contínuo na Netlify.
**Status do deploy:** Netlify já corrigido (Node 22 via `netlify.toml`); cada wave abaixo é entregável independente para produção.

---

## 1. Objetivo

Entregar quatro frentes pedidas, em **waves incrementais** (cada uma vai para produção sozinha):

1. **Export** — toda calculadora pode exportar seu resultado em 4 formatos: copiar texto, link compartilhável, PDF e imagem PNG.
2. **Gráficos** — visualizações nas calculadoras financeiras (CDI, Financiamento, Juros Compostos).
3. **Novas calculadoras** — Juros Compostos, Conversor de Unidades, Desvalorização da Moeda.
4. **Produção** — manter a Netlify verde a cada wave.

### Critérios de sucesso
- As 3 calculadoras existentes (CDI, Financiamento, Motorista) + as 3 novas têm uma `ExportBar` funcional com os 4 formatos.
- Abrir um link compartilhado restaura a calculadora certa e os inputs preenchidos, já calculado.
- As 3 calculadoras financeiras mostram um gráfico.
- Toda lógica pura nova tem testes (Vitest) passando; `npm test`, `npm run build` e `npm run lint` verdes.
- Dependências pesadas (recharts, html2canvas, jspdf) são **lazy-loaded** — não entram no bundle inicial.

### Fora de escopo (próximos ciclos)
- SEO/SSG (Next.js/Astro), AdSense, afiliados, login/histórico na nuvem, API/B2B.
- Migração do `FuelCalculator` e demais calculadoras legadas para os helpers compartilhados (follow-up).

---

## 2. Decisões técnicas (aprovadas)

| Frente | Escolha | Observação |
|---|---|---|
| Gráficos | `recharts` | Lazy-loaded via `React.lazy`/`Suspense` |
| PDF + PNG | `html2canvas` + `jspdf` | Importados via `import()` dinâmico só no clique |
| Link compartilhável | `URLSearchParams` + `history.replaceState` | Sem dependência; sem router |

---

## 3. Arquitetura

### 3.1 Export (backbone transversal) — Waves 1 e 2

Componente compartilhado `src/components/calculadora/ExportBar.tsx`, renderizado na área de resultado de cada calculadora. Recebe um **contrato de export** via props:

```ts
interface ExportContract {
  calcId: string;                 // ex.: "cdi" — usado no link e no nome do arquivo
  titulo: string;                 // ex.: "Calculadora de CDI"
  resultRef: React.RefObject<HTMLElement>; // nó DOM capturado para PDF/PNG
  resumoTexto: () => string;      // resumo textual para "copiar"
  enabled: boolean;               // false quando não há resultado válido (botões desabilitados)
}
```

Ações da `ExportBar`:
- **Copiar texto** — `navigator.clipboard.writeText(resumoTexto())`.
- **Compartilhar link** — monta a URL atual (já sincronizada com os inputs, ver 3.2), copia para a área de transferência e dá feedback ("Link copiado!").
- **PDF** — no clique: `const { default: html2canvas } = await import('html2canvas')` + `const { jsPDF } = await import('jspdf')`; captura `resultRef`, gera PDF e baixa `<calcId>-calcule-ja.pdf`.
- **PNG** — no clique: `import('html2canvas')`, captura `resultRef`, `canvas.toBlob`, baixa `<calcId>-calcule-ja.png`.

Estados: cada ação tem feedback ("Copiado!", "Gerando…") e trata erro (clipboard negado, captura falha) sem quebrar a UI.

### 3.2 Estado na URL (link compartilhável) — Wave 1

Hook `src/lib/url/useUrlState.ts` (lógica pura de serialização separada do hook React para ser testável):

- `serializeParams(calcId, inputs): string` — gera a query string (`calc=<id>&campo=valor…`).
- `parseParams(search): { calcId: string | null, inputs: Record<string,string> }` — lê a query string.
- Hook `useUrlState(calcId, inputs, setters)`:
  - Na montagem, hidrata os inputs a partir da URL (se `calc` bate com o `calcId` ativo).
  - Em mudança de input, atualiza a URL com `history.replaceState` (sem recarregar, sem poluir histórico).

`App.tsx` sincroniza `activeTab` ↔ parâmetro `calc`: ao abrir `/?calc=financiamento&...`, a aba certa é selecionada na montagem; ao trocar de aba, a URL reflete.

As funções `serializeParams`/`parseParams` são **puras e testadas** (round-trip: parse(serialize(x)) === x).

### 3.3 Resumo textual — Waves 1 e 3

Cada calculadora fornece `resumoTexto()`. Para manter testável, a formatação do resumo de cada calculadora vive como função pura ao lado da lógica (ex.: `resumoCdi(input, result): string`) e é coberta por teste. O componente apenas chama essa função.

### 3.4 Novas calculadoras (padrão já estabelecido) — Wave 3

Módulos puros em `src/lib/calculators/` + componentes finos reutilizando `Campo`/`Linha`/`moeda` e a `ExportBar`. Todos via TDD.

**a) Juros Compostos — `jurosCompostos.ts`**
```ts
interface JurosCompostosInput {
  aporteInicial: number;   // R$, >= 0
  aporteMensal: number;    // R$, >= 0
  taxaAnual: number;       // % a.a., > 0
  prazoMeses: number;      // inteiro > 0
}
interface PontoSerie { mes: number; investido: number; montante: number; juros: number; }
interface JurosCompostosResult {
  montanteFinal: number;
  totalInvestido: number;  // aporteInicial + aporteMensal * prazoMeses
  totalJuros: number;      // montanteFinal - totalInvestido
  serie: PontoSerie[];     // ponto a ponto, para o gráfico
}
```
Convenção: taxa mensal equivalente `i = (1 + taxaAnual/100)^(1/12) - 1`. A cada mês: `montante = montante*(1+i) + aporteMensal`. `aporteInicial` entra no mês 0. Validação `RangeError`: `taxaAnual<=0`, `prazoMeses<=0` ou não-inteiro, aportes negativos. Exige `aporteInicial + aporteMensal > 0`.

**b) Conversor de Unidades — `conversorUnidades.ts`**
Estrutura por categoria. Categorias na primeira entrega: **Comprimento, Massa, Volume, Temperatura**.
```ts
type Categoria = 'comprimento' | 'massa' | 'volume' | 'temperatura';
function converter(valor: number, de: string, para: string, categoria: Categoria): number;
function unidadesDe(categoria: Categoria): string[]; // para popular os selects
```
- Comprimento/Massa/Volume: fatores lineares para uma unidade-base (metro, grama, litro). `resultado = valor * fator[de] / fator[para]`.
- Temperatura: conversão não-linear via funções dedicadas (C↔F↔K). `converter` despacha para a fórmula correta.
- Erro: `RangeError` se unidade desconhecida na categoria. Valores negativos são permitidos (temperatura, deltas).

**c) Desvalorização da Moeda — `desvalorizacao.ts`**
```ts
interface DesvalorizacaoInput {
  valor: number;        // R$, > 0
  inflacaoAnual: number; // % a.a., > 0
  prazoAnos: number;    // > 0 (aceita fração, ex.: 1.5)
}
interface DesvalorizacaoResult {
  poderDeCompraFuturo: number;     // valor / (1+infl)^t — quanto valerá, em poder de compra de hoje
  perda: number;                   // valor - poderDeCompraFuturo
  perdaPercentual: number;         // perda / valor * 100
  valorNominalEquivalente: number; // valor * (1+infl)^t — quanto custará algo que hoje custa "valor"
}
```
Validação `RangeError` para entradas `<= 0`.

### 3.5 Gráficos (recharts, lazy) — Wave 4

Wrappers finos em `src/components/calculadora/charts/`, cada um carregado com `React.lazy` + `<Suspense fallback={…}>`:
- **CdiChart** — evolução do montante ao longo do prazo. Requer série: adicionar `gerarSerieCdi(input, pontos = 12): {dia, montante}[]` a `cdi.ts` (puro, testado).
- **FinanciamentoChart** — saldo devedor Price × SAC ao longo dos meses (usa os `cronograma` já existentes).
- **JurosCompostosChart** — `investido` vs `montante` ao longo dos meses (usa `serie`).

Charts são apresentacionais; sem teste unitário (cobertura por build + smoke manual).

---

## 4. Estratégia de testes (TDD onde há lógica)

- **TDD pura:** `jurosCompostos`, `conversorUnidades`, `desvalorizacao`, `gerarSerieCdi`, e os helpers `serializeParams`/`parseParams` (round-trip) e os `resumoTexto` de cada calculadora.
- **Sem teste unitário:** `ExportBar` (DOM/clipboard/lazy libs), os charts. Cobertos por `npm run build` + smoke manual.
- Casos de borda obrigatórios: juros com `aporteMensal=0`; juros com `aporteInicial=0`; conversor temperatura (0°C=32°F=273.15K, ida e volta); conversor unidade desconhecida lança; desvalorização com `prazoAnos` fracionário; round-trip de URL com todos os campos vazios e preenchidos.

---

## 5. Dependências a adicionar

- `recharts` (gráficos) — só importado dentro dos wrappers lazy.
- `html2canvas` + `jspdf` (PDF/PNG) — só via `import()` dinâmico no clique.

Nenhuma entra no chunk inicial. Confirmar no `npm run build` que viram chunks separados.

---

## 6. Waves (cada uma é um deploy independente)

1. **Wave 1 — Export backbone:** `ExportBar` (copiar texto + compartilhar link), `useUrlState` + serialização testada, `resumoTexto` das 3 calculadoras existentes, sincronização `activeTab`↔URL. Sem novas deps.
2. **Wave 2 — Export de arquivo:** botões PDF e PNG na `ExportBar` (html2canvas + jspdf lazy).
3. **Wave 3 — Novas calculadoras:** Juros Compostos, Conversor de Unidades, Desvalorização (TDD), cada uma já com `ExportBar` e wiring no nav/switch.
4. **Wave 4 — Gráficos:** recharts + CdiChart, FinanciamentoChart, JurosCompostosChart (lazy), incluindo `gerarSerieCdi`.

---

## 7. Riscos / notas

- **Bundle:** recharts/html2canvas/jspdf são grandes; o lazy-load é obrigatório (não importar no topo de nenhum módulo que entre no caminho inicial). Verificar chunks no build.
- **`html2canvas` + Tailwind/tema escuro:** a captura precisa respeitar o tema atual; capturar o nó de resultado com fundo explícito para não sair transparente. Testar nos dois temas no smoke.
- **Clipboard API** exige contexto seguro (HTTPS) — funciona na Netlify; em dev `localhost` também é permitido. Tratar rejeição com fallback (mostrar o texto/seleção).
- **Sincronização URL:** usar `replaceState` (não `pushState`) para não encher o histórico do navegador a cada tecla.
- **`@/` alias** continua só no Vite, não no tsconfig — usar imports relativos.
