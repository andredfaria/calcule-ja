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
