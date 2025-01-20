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
      <h2 className="text-xl font-semibold text-gray-800">Regra de 3</h2>
      <p className="text-gray-600 text-sm">
        O primeiro valor está para o segundo assim como o terceiro está para{" "}
        <span className="font-bold">X</span>.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Primeiro valor:
          </label>
          <input
            type="number"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Segundo valor:
          </label>
          <input
            type="number"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Terceiro valor:
          </label>
          <input
            type="number"
            value={value3}
            onChange={(e) => setValue3(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 30"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={calculateResult}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Calcular
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Resultado</h3>
        <p className="text-2xl font-bold text-gray-900">
          {result !== null ? result : "-"}
        </p>
      </div>
    </div>
  );
};
