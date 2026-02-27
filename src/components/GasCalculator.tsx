import React, { useState } from "react";

export const GasCalculator: React.FC = () => {
  const [distance, setDistance] = useState(""); // Distância percorrida em km
  const [fuelConsumption, setFuelConsumption] = useState(""); // Consumo médio em km/L
  const [fuelPrice, setFuelPrice] = useState(""); // Preço do combustível em R$/L

  const calculateGasCosts = () => {
    if (!distance || !fuelConsumption || !fuelPrice) return null;

    const dist = Number(distance);
    const consumption = Number(fuelConsumption);
    const price = Number(fuelPrice);

    const fuelNeeded = dist / consumption; // Combustível necessário
    const totalCost = fuelNeeded * price; // Custo total da viagem

    return {
      fuelNeeded,
      totalCost,
    };
  };

  const result = calculateGasCosts();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Calculadora de Combustível</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/** Campo de Distância */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Distância Percorrida (km)
            </label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/** Campo Consumo Médio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Consumo Médio (km/L)
            </label>
            <input
              type="number"
              value={fuelConsumption}
              onChange={(e) => setFuelConsumption(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/** Campo Preço do Combustível */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preço do Combustível (R$/L)
            </label>
            <input
              type="number"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="result-card">
          <h3 className="text-lg font-medium mb-4">Resultado</h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">
                Combustível Necessário (L):
              </p>
              <p className="text-2xl font-bold">
                {result ? `${result.fuelNeeded.toFixed(2)} L` : "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Custo Total (R$):</p>
              <p className="text-2xl font-bold">
                {result ? `R$ ${result.totalCost.toFixed(2)}` : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
