import React, { useState } from "react";

export const FuelCalculator: React.FC = () => {
  const [gasPrice, setGasPrice] = useState("");
  const [etanolPrice, setEtanolPrice] = useState("");

  const calculateFuelAdvantage = () => {
    if (!gasPrice || !etanolPrice) return null;

    const gas = Number(gasPrice);
    const etanol = Number(etanolPrice);

    const ratio = etanol / gas;

    const betterFuel = ratio < 0.7 ? "Etanol" : "Gasolina";

    return {
      ratio: ratio * 100,
      betterFuel,
    };
  };

  const result = calculateFuelAdvantage();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Calculadora de Combustível</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Campo Preço da Gasolina */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preço por litro - Gasolina (R$)
            </label>
            <input
              type="number"
              value={gasPrice}
              onChange={(e) => setGasPrice(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Campo Preço do Etanol */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preço por litro - Etanol (R$)
            </label>
            <input
              type="number"
              value={etanolPrice}
              onChange={(e) => setEtanolPrice(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Resultado */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Resultado</h3>

          <div className="space-y-4">
            {/* Combustível mais vantajoso */}
            <div>
              <p className="text-sm text-gray-600">
                Combustível mais vantajoso:
              </p>
              <p className="text-2xl font-bold">
                {result ? result.betterFuel : "-"}
              </p>
            </div>

            {/* Relação etanol/gasolina */}
            <div>
              <p className="text-sm text-gray-600">Relação Etanol/Gasolina:</p>
              <p className="text-2xl font-bold">
                {result ? `${result.ratio.toFixed(2)}%` : "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-800">
                Se resultado menor que 70% Etanol
              </p>
              <p className="text-sm text-gray-800">
                Se resultado maior que 70% Gasolina
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
