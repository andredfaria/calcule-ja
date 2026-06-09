import React from "react";

interface CampoProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: React.HTMLInputTypeAttribute;
}

export const Campo: React.FC<CampoProps> = ({ label, value, onChange, type = "number" }) => {
  const id = label
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-fg-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-[10px] border border-line bg-surface-sunken px-4 py-2 text-fg shadow-sm transition focus:border-brand focus:ring-2 focus:ring-brand/30 outline-none"
      />
    </div>
  );
};

interface LinhaProps {
  rotulo: string;
  valor: string;
  destaque?: boolean;
}

export const Linha: React.FC<LinhaProps> = ({ rotulo, valor, destaque }) => (
  <div>
    <p className="text-sm text-fg-subtle">{rotulo}</p>
    <p className={`${destaque ? "text-2xl font-bold" : "text-lg font-medium"} text-fg tabular-nums`}>{valor}</p>
  </div>
);
