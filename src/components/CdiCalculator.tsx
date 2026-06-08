import React, { useState } from "react";
import { calcularCdi } from "../lib/calculators/cdi";
import { Campo, Linha } from "./calculadora/campos";
import { moeda } from "./calculadora/formatters";

export const CdiCalculator: React.FC = () => {
  const [valorInicial, setValorInicial] = useState("");
  const [percentualCDI, setPercentualCDI] = useState("");
  const [taxaCDIAnual, setTaxaCDIAnual] = useState("");
  const [prazoDias, setPrazoDias] = useState("");

  const calcular = () => {
    const v = Number(valorInicial);
    const p = Number(percentualCDI);
    const t = Number(taxaCDIAnual);
    const d = Number(prazoDias);
    if (v <= 0 || p <= 0 || t <= 0 || d <= 0 || !Number.isInteger(d)) return null;
    return calcularCdi({ valorInicial: v, percentualCDI: p, taxaCDIAnual: t, prazoDias: d });
  };

  const result = calcular();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Calculadora de CDI</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Campo label="Valor investido (R$)" value={valorInicial} onChange={setValorInicial} />
          <Campo label="% do CDI (ex.: 110)" value={percentualCDI} onChange={setPercentualCDI} />
          <Campo label="CDI anual em % (ex.: 10.5)" value={taxaCDIAnual} onChange={setTaxaCDIAnual} />
          <Campo label="Prazo (dias)" value={prazoDias} onChange={setPrazoDias} />
        </div>
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-medium">Resultado</h3>
          <Linha rotulo="Montante bruto" valor={result ? moeda(result.montanteBruto) : "-"} />
          <Linha rotulo="Rendimento bruto" valor={result ? moeda(result.rendimentoBruto) : "-"} />
          <Linha
            rotulo="Imposto de Renda"
            valor={result ? `${(result.aliquotaIR * 100).toFixed(1)}% — ${moeda(result.valorIR)}` : "-"}
          />
          <Linha rotulo="IOF" valor={result ? moeda(result.valorIOF) : "-"} />
          <Linha rotulo="Rendimento líquido" valor={result ? moeda(result.rendimentoLiquido) : "-"} destaque />
          <Linha rotulo="Montante líquido" valor={result ? moeda(result.montanteLiquido) : "-"} destaque />
        </div>
      </div>
    </div>
  );
};
