import React, { useState } from "react";

export const PercentageCalculator: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const [percentage, setPercentage] = useState<string>("");
  const [isIncrease, setIsIncrease] = useState(true);
  const [result, setResult] = useState<number | null>(null);

  const calculateResult = () => {
    if (!value || !percentage) {
      setResult(null);
      return;
    }

    const baseValue = parseFloat(value);
    const percentValue = parseFloat(percentage);

    if (isNaN(baseValue) || isNaN(percentValue)) {
      setResult(null);
      return;
    }

    const calculatedResult = isIncrease
      ? baseValue * (percentValue / 100)
      : baseValue * (percentValue / 100) * -1;

    setResult(Number(calculatedResult.toFixed(2)));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Valor Total
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o valor total"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Percentual (%)
          </label>
          <input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Digite a porcentagem"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Operação
          </label>
          <select
            value={isIncrease ? "increase" : "decrease"}
            onChange={(e) => setIsIncrease(e.target.value === "increase")}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="increase">Acréscimo</option>
            <option value="decrease">Decréscimo</option>
          </select>
        </div>

        <button
          onClick={calculateResult}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition font-medium"
        >
          Calcular
        </button>
      </div>

      <div className="result-card space-y-3">
        <h3 className="text-lg font-medium text-gray-800">Resultado</h3>
        {result !== null ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor Percentual:</span>
              <span className="text-2xl font-bold text-blue-600">
                {Math.abs(result).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor Final:</span>
              <span className="text-2xl font-bold text-gray-900">
                {(parseFloat(value) + result).toFixed(2)}
              </span>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center">
            Preencha os valores e clique em calcular.
          </p>
        )}
      </div>
    </div>
  );
};
