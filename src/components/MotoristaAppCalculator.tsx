import React, { useState } from "react";
import { calcularMotorista } from "../lib/calculators/motoristaApp";
import { Campo, Linha, moeda } from "./calculadora/campos";

export const MotoristaAppCalculator: React.FC = () => {
  const [ganhoBruto, setGanhoBruto] = useState("");
  const [kmRodados, setKmRodados] = useState("");
  const [consumo, setConsumo] = useState("");
  const [preco, setPreco] = useState("");
  const [outros, setOutros] = useState("");

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
          <Linha rotulo="Custo por km" valor={result ? moeda(result.custoPorKm) : "-"} />
          <Linha rotulo="Ganho líquido" valor={result ? moeda(result.ganhoLiquido) : "-"} destaque />
          <Linha rotulo="Ganho líquido por km" valor={result ? moeda(result.ganhoLiquidoPorKm) : "-"} destaque />
          <Linha rotulo="Margem líquida" valor={result ? `${result.margemLiquidaPercentual.toFixed(1)}%` : "-"} />
        </div>
      </div>
    </div>
  );
};
