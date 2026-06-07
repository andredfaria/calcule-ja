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
