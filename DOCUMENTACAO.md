# DOCUMENTAÇÃO — Calcule Já

## 1) Visão Geral do Produto
O **Calcule Já** é um hub web com calculadoras utilitárias para decisões rápidas do dia a dia (finanças, saúde, viagem, porcentagem e datas).

### Público-alvo
- Pessoas que precisam validar contas rápidas (pessoal ou trabalho).
- Usuários sem familiaridade com planilhas/fórmulas complexas.

### Problema que resolve
- Centraliza cálculos comuns em uma interface única.
- Reduz erro manual em contas recorrentes.

---

## 2) Arquitetura Atual

### Estrutura de pastas (resumo)
- `src/App.tsx`: roteamento por abas (estado `activeTab`).
- `src/components/Layout.tsx`: shell visual, navegação e composição da página.
- `src/components/*`: calculadoras independentes por domínio.
- `src/index.css`: tokens visuais, tipografia e componentes de estilo.

### Tecnologias
- React 18 + TypeScript.
- Vite.
- Tailwind CSS.
- Lucide React (ícones).

### Padrões identificados
- Cada calculadora é um componente com estado local (`useState`).
- Fórmulas executadas diretamente no componente.
- Exibição de resultado em cards.
- Navegação por chave textual (`activeTab`).

---

## 3) Funcionalidades Documentadas

## 3.1 Regra de 3 (`CrossMultiplication`)
**Propósito:** resolver proporções diretas no formato `a : b = c : x`.

**Fórmula:** `x = (b × c) / a`.

**Entradas:**
- Primeiro valor (`a`)
- Segundo valor (`b`)
- Terceiro valor (`c`)

**Saída:**
- Resultado `x` com 2 casas.

**Validações/regras:**
- Se algum campo estiver vazio: sem resultado.
- Se `a = 0`: bloqueia cálculo (evita divisão por zero).

**Exemplo:** `10 : 20 = 30 : x` → `x = 60`.

## 3.2 Porcentagem (`PercentageCalculator`)
**Propósito:** calcular acréscimo ou decréscimo percentual sobre um valor base.

**Fórmulas:**
- Valor percentual: `V% = base × (p/100)`.
- Resultado final: `final = base ± V%`.

**Entradas:**
- Valor base.
- Percentual.
- Operação (`Acréscimo` ou `Decréscimo`).

**Saídas:**
- Valor percentual.
- Valor final.

**Validações/regras:**
- Campos vazios/`NaN` invalidam o resultado.

**Exemplo:** base `200`, `10%` acréscimo → percentual `20`, final `220`.

## 3.3 Proporção de Mistura (`MixtureRatioCalculator`)
**Propósito:** dividir um volume total em duas partes proporcionais.

**Fórmulas:**
- `partesTotais = p1 + p2`
- `volume1 = total × p1 / partesTotais`
- `volume2 = total × p2 / partesTotais`

**Entradas:**
- Volume total.
- Parte 1.
- Parte 2.

**Saídas:**
- Volume da parte 1.
- Volume da parte 2.

**Validações/regras:**
- Campos inválidos ou `p1 + p2 = 0` anulam resultado.

**Exemplo:** total `2L`, proporção `1:3` → `0,5L` e `1,5L`.

## 3.4 IMC + Calorias (`HealthCalculator`)
**Propósito:** calcular IMC e estimativa de calorias diárias.

**Fórmulas:**
- `IMC = peso / altura²` (altura em metros).
- BMR (Harris-Benedict):
  - Masculino: `88.362 + 13.397×peso + 4.799×altura(cm) − 5.677×idade`
  - Feminino: `447.593 + 9.247×peso + 3.098×altura(cm) − 4.330×idade`
- Calorias diárias: `BMR × fator_atividade`.

**Entradas:**
- Peso, altura, idade, gênero, nível de atividade.

**Saídas:**
- IMC + classificação.
- Calorias estimadas (kcal/dia).

**Validações/regras:**
- Sem peso/altura: IMC = 0.
- Sem peso/altura/idade: calorias = 0.

**Exemplo:** pessoa de 70kg, 170cm, 30 anos, moderadamente ativa → IMC ~24,2 e TDEE conforme fator 1,55.

## 3.5 Álcool x Gasolina (`FuelCalculator`)
**Propósito:** indicar combustível mais vantajoso por preço relativo.

**Fórmula:** `razão = etanol / gasolina`.

**Regra de decisão:**
- Se `razão < 0,7`: Etanol.
- Caso contrário: Gasolina.

**Entradas:**
- Preço da gasolina.
- Preço do etanol.

**Saídas:**
- Combustível recomendado.
- Razão em `%`.

## 3.6 Cálculo de Viagem (`GasCalculator`)
**Propósito:** estimar litros necessários e custo total da viagem.

**Fórmulas:**
- `litros = distância / consumo(km/L)`
- `custo = litros × preço_litro`

**Entradas:**
- Distância.
- Consumo médio.
- Preço do combustível.

**Saídas:**
- Litros necessários.
- Custo total.

## 3.7 Parcelamento (`FinanceCalculator`)
**Propósito:** simular parcelas e juros (simples ou compostos).

**Juros simples:**
- `J = C × i × t`
- `M = C + J`
- `parcela = M / t`

**Juros compostos (anuidade):**
- `parcela = C × [i_m(1+i_m)^n] / [(1+i_m)^n − 1]`
- com `i_m = i_anual / 12`
- `total = parcela × n`

**Entradas:**
- Valor total, número de parcelas, taxa anual, tipo de juros.

**Saídas:**
- Valor da parcela.
- Total a pagar.
- Total de juros.

## 3.8 Datas e Horários (`DateTimeConverter`)
**Propósito:** converter data/hora informada entre fusos horários pré-definidos.

**Lógica:**
- Constrói `Date` a partir de `data + hora`.
- Formata com `Intl.DateTimeFormat` para cada timezone.

**Entradas:**
- Data.
- Hora.
- Fuso de origem (seleção existente na UI).

**Saídas:**
- Lista de horários convertidos (UTC, São Paulo, New York, London, Paris, Tokyo, Sydney).

## 3.9 Divisão de Contas (`BillSplitter`)
**Propósito:** repartir consumos por pessoa e aplicar gorjeta.

**Fórmulas:**
- `subtotal = soma de todos os itens`
- `gorjeta = subtotal × (%gorjeta/100)`
- `total = subtotal + gorjeta`
- `totalPessoa = subtotalPessoa + subtotalPessoa×(%gorjeta/100)`

**Entradas:**
- Pessoas, itens (descrição + valor), gorjeta.

**Saídas:**
- Total por pessoa.
- Subtotal geral, gorjeta e total geral.

---

## 4) Decisões de Design (Redesign)

### Direção estética escolhida
**Retro-futurista dark com acentos neon.**

**Justificativa:** reforça identidade de produto digital premium, melhora contraste de leitura e foge da aparência “calculadora escolar”.

### Paleta (4 cores)
- `--color-bg: #0A0F1F`
- `--color-surface: #141B31`
- `--color-primary: #4CC9F0`
- `--color-accent: #FF9E00`

### Tipografia
- Display: **Bebas Neue** (títulos/branding).
- Corpo: **Space Grotesk**.

### Ícones
- Biblioteca: **Lucide React**.

### Interações aplicadas
- Transição suave ao trocar calculadora (`stageIn`).
- Hover com deslocamento nos itens de navegação.
- Pulsação visual nos cards de resultado (`pulseCard`).
- Feedback de foco em inputs/selects.

---

## 5) Guia de Instalação e Uso

## Rodar localmente
1. Instalar dependências:
   ```bash
   npm install
   ```
2. Ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Build de produção:
   ```bash
   npm run build
   ```

## Dependências externas
- Google Fonts (Bebas Neue e Space Grotesk).
- Endpoint de formulário em `formsubmit.co` (rodapé).

## Como adicionar nova calculadora
1. Criar componente em `src/components/NovaCalculadora.tsx`.
2. Importar no `src/App.tsx`.
3. Adicionar `case` no `renderContent` com id único.
4. Incluir item no array `navItems` em `src/components/Layout.tsx`.
5. Seguir padrão visual (`result-card`, `app-input`, `app-button`).
