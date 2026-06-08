import React, { useState } from "react";
import { calcularFinanciamento, SistemaResult } from "../lib/calculators/financiamento";
import { Campo, Linha } from "./calculadora/campos";
import { moeda } from "./calculadora/formatters";
import { useUrlState } from "../lib/url/useUrlState";
import { ExportBar } from "./calculadora/ExportBar";
import { resumoFinanciamento } from "../lib/calculators/resumos";

const ResumoSistema: React.FC<{ titulo: string; sistema: SistemaResult | null }> = ({ titulo, sistema }) => (
  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
    <h4 className="font-semibold">{titulo}</h4>
    <Linha rotulo="1ª parcela" valor={sistema ? moeda(sistema.primeiraParcela) : "-"} />
    <Linha rotulo="Última parcela" valor={sistema ? moeda(sistema.ultimaParcela) : "-"} />
    <Linha rotulo="Total pago" valor={sistema ? moeda(sistema.totalPago) : "-"} />
    <Linha rotulo="Total de juros" valor={sistema ? moeda(sistema.totalJuros) : "-"} destaque />
  </div>
);

export const FinanciamentoCalculator: React.FC = () => {
  const [valor, setValor] = useState("");
  const [taxa, setTaxa] = useState("");
  const [prazo, setPrazo] = useState("");

  useUrlState(
    "financiamento",
    { valor, taxa, prazo },
    (i) => {
      if (i.valor !== undefined) setValor(i.valor);
      if (i.taxa !== undefined) setTaxa(i.taxa);
      if (i.prazo !== undefined) setPrazo(i.prazo);
    },
  );

  const calcular = () => {
    const v = Number(valor);
    const t = Number(taxa);
    const p = Number(prazo);
    if (v <= 0 || t <= 0 || p <= 0 || !Number.isInteger(p)) return null;
    return calcularFinanciamento({ valorFinanciado: v, taxaJurosAnual: t, prazoMeses: p });
  };

  const result = calcular();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Financiamento — SAC vs Price</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Campo label="Valor financiado (R$)" value={valor} onChange={setValor} />
        <Campo label="Juros ao ano (%)" value={taxa} onChange={setTaxa} />
        <Campo label="Prazo (meses)" value={prazo} onChange={setPrazo} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResumoSistema titulo="Price (parcela fixa)" sistema={result ? result.price : null} />
        <ResumoSistema titulo="SAC (amortização constante)" sistema={result ? result.sac : null} />
      </div>

      {result && (
        <p className="text-sm text-gray-700">
          O SAC paga {moeda(result.diferencaTotalJuros)} a menos de juros que o Price.
        </p>
      )}

      {result && (
        <div className="overflow-auto max-h-80 border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left">Mês</th>
                <th className="px-3 py-2 text-right">Parcela (Price)</th>
                <th className="px-3 py-2 text-right">Parcela (SAC)</th>
                <th className="px-3 py-2 text-right">Saldo (SAC)</th>
              </tr>
            </thead>
            <tbody>
              {result.price.cronograma.map((linha, idx) => (
                <tr key={linha.mes} className="border-t">
                  <td className="px-3 py-2">{linha.mes}</td>
                  <td className="px-3 py-2 text-right">{moeda(linha.parcela)}</td>
                  <td className="px-3 py-2 text-right">{moeda(result.sac.cronograma[idx].parcela)}</td>
                  <td className="px-3 py-2 text-right">{moeda(result.sac.cronograma[idx].saldo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ExportBar
        enabled={result !== null}
        resumoTexto={() =>
          result
            ? resumoFinanciamento(
                {
                  valorFinanciado: Number(valor),
                  taxaJurosAnual: Number(taxa),
                  prazoMeses: Number(prazo),
                },
                result,
              )
            : ""
        }
      />
    </div>
  );
};
