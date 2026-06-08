import React, { useState } from "react";
import { calcularMotorista } from "../lib/calculators/motoristaApp";
import { Campo, Linha } from "./calculadora/campos";
import { moeda } from "./calculadora/formatters";
import { useUrlState } from "../lib/url/useUrlState";
import { ExportBar } from "./calculadora/ExportBar";
import { resumoMotorista } from "../lib/calculators/resumos";

export const MotoristaAppCalculator: React.FC = () => {
  const [ganhoBruto, setGanhoBruto] = useState("");
  const [kmRodados, setKmRodados] = useState("");
  const [consumo, setConsumo] = useState("");
  const [preco, setPreco] = useState("");
  const [outros, setOutros] = useState("");

  useUrlState(
    "motorista",
    { ganhoBruto, kmRodados, consumo, preco, outros },
    (i) => {
      if (i.ganhoBruto !== undefined) setGanhoBruto(i.ganhoBruto);
      if (i.kmRodados !== undefined) setKmRodados(i.kmRodados);
      if (i.consumo !== undefined) setConsumo(i.consumo);
      if (i.preco !== undefined) setPreco(i.preco);
      if (i.outros !== undefined) setOutros(i.outros);
    },
  );

  const calcular = () => {
    const g = Number(ganhoBruto);
    const km = Number(kmRodados);
    const c = Number(consumo);
    const p = Number(preco);
    const o = outros === "" ? 0 : Number(outros);
    if (g <= 0 || km <= 0 || c <= 0 || p <= 0 || o < 0) return null;
    return calcularMotorista({
      ganhoBruto: g,
      kmRodados: km,
      consumoKmPorLitro: c,
      precoCombustivel: p,
      outrosCustos: o,
    });
  };

  const result = calcular();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Calculadora do Motorista de App</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Campo label="Ganho bruto no período (R$)" value={ganhoBruto} onChange={setGanhoBruto} />
          <Campo label="Km rodados" value={kmRodados} onChange={setKmRodados} />
          <Campo label="Consumo (km/l)" value={consumo} onChange={setConsumo} />
          <Campo label="Preço do combustível (R$/l)" value={preco} onChange={setPreco} />
          <Campo label="Outros custos (R$, opcional)" value={outros} onChange={setOutros} />
        </div>
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-medium">Resultado</h3>
          <Linha rotulo="Litros consumidos" valor={result ? `${result.litrosConsumidos.toFixed(2)} L` : "-"} />
          <Linha rotulo="Custo de combustível" valor={result ? moeda(result.custoCombustivel) : "-"} />
          <Linha rotulo="Custo de combustível por km" valor={result ? moeda(result.custoPorKm) : "-"} />
          <Linha rotulo="Ganho líquido" valor={result ? moeda(result.ganhoLiquido) : "-"} destaque />
          <Linha rotulo="Ganho líquido por km" valor={result ? moeda(result.ganhoLiquidoPorKm) : "-"} destaque />
          <Linha rotulo="Margem líquida" valor={result ? `${result.margemLiquidaPercentual.toFixed(1)}%` : "-"} />
          <ExportBar
            enabled={result !== null}
            resumoTexto={() =>
              result
                ? resumoMotorista(
                    {
                      ganhoBruto: Number(ganhoBruto),
                      kmRodados: Number(kmRodados),
                      consumoKmPorLitro: Number(consumo),
                      precoCombustivel: Number(preco),
                      outrosCustos: outros === "" ? 0 : Number(outros),
                    },
                    result,
                  )
                : ""
            }
          />
        </div>
      </div>
    </div>
  );
};
