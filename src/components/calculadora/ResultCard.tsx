import React from "react";

interface ResultCardProps {
  titulo?: string;
  children: React.ReactNode;
}

/** Standard result panel: token surface, border, rounded-card. */
export const ResultCard: React.FC<ResultCardProps> = ({ titulo = "Resultado", children }) => (
  <div className="bg-surface-sunken border border-line rounded-card p-6 space-y-4">
    <h3 className="text-lg font-medium text-fg">{titulo}</h3>
    {children}
  </div>
);
