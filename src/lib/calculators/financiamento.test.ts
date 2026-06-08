import { describe, it, expect } from "vitest";
import { calcularFinanciamento } from "./financiamento";

describe("calcularFinanciamento", () => {
  const base = { valorFinanciado: 100000, taxaJurosAnual: 12, prazoMeses: 12 };

  it("Price: parcelas constantes e saldo zera no fim", () => {
    const { price } = calcularFinanciamento(base);
    expect(price.cronograma).toHaveLength(12);
    expect(price.primeiraParcela).toBeCloseTo(price.ultimaParcela, 4);
    expect(price.primeiraParcela).toBeCloseTo(8856.21, 0);
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

  it("totalPago = principal + totalJuros (ambos sistemas)", () => {
    const { price, sac } = calcularFinanciamento(base);
    expect(price.totalPago).toBeCloseTo(100000 + price.totalJuros, 4);
    expect(sac.totalPago).toBeCloseTo(100000 + sac.totalJuros, 4);
  });
});
