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
