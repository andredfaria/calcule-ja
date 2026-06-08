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
    expect(() => calcularMotorista({ ganhoBruto: 0, kmRodados: 200, consumoKmPorLitro: 10, precoCombustivel: 5.5 })).toThrow(RangeError);
    expect(() => calcularMotorista({ ganhoBruto: 300, kmRodados: 200, consumoKmPorLitro: 10, precoCombustivel: 0 })).toThrow(RangeError);
  });
});
