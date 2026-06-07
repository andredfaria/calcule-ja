import React from "react";

export const moeda = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface CampoProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export const Campo: React.FC<CampoProps> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

interface LinhaProps {
  rotulo: string;
  valor: string;
  destaque?: boolean;
}

export const Linha: React.FC<LinhaProps> = ({ rotulo, valor, destaque }) => (
  <div>
    <p className="text-sm text-gray-600">{rotulo}</p>
    <p className={destaque ? "text-2xl font-bold" : "text-lg font-medium"}>{valor}</p>
  </div>
);
