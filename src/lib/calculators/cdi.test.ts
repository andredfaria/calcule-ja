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
});
