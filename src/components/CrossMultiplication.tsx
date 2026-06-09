import React, { useState } from "react";

export const CrossMultiplication: React.FC = () => {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [value3, setValue3] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculateResult = () => {
    if (!value1 || !value2 || !value3) {
      setResult(null);
      return;
    }

    const val1 = Number(value1);
    const val2 = Number(value2);
    const val3 = Number(value3);

    if (val1 === 0) {
      setResult(null);
      return;
    }

    const calculatedResult = (val2 * val3) / val1;
    setResult(Number(calculatedResult.toFixed(2)));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-fg">Regra de 3</h2>
      <p className="text-fg-muted text-sm">
        O primeiro valor está para o segundo assim como o terceiro está para{" "}
        <span className="font-bold">X</span>.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-fg-muted">
            Primeiro valor:
          </label>
          <input
            type="number"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-line bg-surface-sunken px-4 py-2 shadow-md transition"
            placeholder="Ex: 10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-fg-muted">
            Segundo valor:
          </label>
          <input
            type="number"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-line bg-surface-sunken px-4 py-2 shadow-md transition"
            placeholder="Ex: 20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-fg-muted">
            Terceiro valor:
          </label>
          <input
            type="number"
            value={value3}
            onChange={(e) => setValue3(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-line bg-surface-sunken px-4 py-2 shadow-md transition"
            placeholder="Ex: 30"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={calculateResult}
            className="w-full py-2 px-4 rounded-lg shadow-md transition"
          >
            Calcular
          </button>
        </div>
      </div>

      <div className="result-card">
        <h3 className="text-lg font-medium text-fg mb-2">Resultado</h3>
        <p className="text-2xl font-bold text-brand tabular-nums">
          {result !== null ? result : "-"}
        </p>
      </div>
    </div>
  );
};
