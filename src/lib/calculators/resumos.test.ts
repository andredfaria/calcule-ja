import { describe, it, expect } from "vitest";
import { resumoCdi, resumoFinanciamento, resumoMotorista } from "./resumos";
import { calcularCdi } from "./cdi";
import { calcularFinanciamento } from "./financiamento";
import { calcularMotorista } from "./motoristaApp";

describe("resumos", () => {
  it("resumoCdi inclui rendimento líquido e montante líquido", () => {
    const input = { valorInicial: 10000, percentualCDI: 110, taxaCDIAnual: 10.5, prazoDias: 365 };
    const texto = resumoCdi(input, calcularCdi(input));
    expect(texto).toContain("CDI");
    expect(texto).toContain("Rendimento líquido");
    expect(texto).toContain("Montante líquido");
    expect(texto.split("\n").length).toBeGreaterThan(3);
  });

  it("resumoFinanciamento inclui Price e SAC", () => {
    const input = { valorFinanciado: 100000, taxaJurosAnual: 12, prazoMeses: 12 };
    const texto = resumoFinanciamento(input, calcularFinanciamento(input));
    expect(texto).toContain("Price");
    expect(texto).toContain("SAC");
  });

  it("resumoMotorista inclui ganho líquido e margem", () => {
    const input = { ganhoBruto: 300, kmRodados: 200, consumoKmPorLitro: 10, precoCombustivel: 5.5 };
    const texto = resumoMotorista(input, calcularMotorista(input));
    expect(texto).toContain("Ganho líquido");
    expect(texto).toContain("Margem");
  });
});
