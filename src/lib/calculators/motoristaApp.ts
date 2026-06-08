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
