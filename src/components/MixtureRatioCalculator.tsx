import React, { useState } from "react";

export const MixtureRatioCalculator: React.FC = () => {
  const [totalVolume, setTotalVolume] = useState<string>("");
  const [part1, setPart1] = useState<string>("1");
  const [part2, setPart2] = useState<string>("3");
  const [result, setResult] = useState<{ part1: number; part2: number } | null>(
    null
  );

  const calculateProportions = () => {
    if (!totalVolume || !part1 || !part2) {
      setResult(null);
      return;
    }

    const volume = parseFloat(totalVolume);
    const part1Value = parseFloat(part1);
    const part2Value = parseFloat(part2);
    const totalParts = part1Value + part2Value;

    if (
      isNaN(volume) ||
      isNaN(part1Value) ||
      isNaN(part2Value) ||
      totalParts === 0
    ) {
      setResult(null);
      return;
    }

    const part1Volume = (volume * part1Value) / totalParts;
    const part2Volume = (volume * part2Value) / totalParts;

    setResult({
      part1: parseFloat(part1Volume.toFixed(2)),
      part2: parseFloat(part2Volume.toFixed(2)),
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Volume Total (L)
          </label>
          <input
            type="number"
            value={totalVolume}
            onChange={(e) => setTotalVolume(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o volume total (ex: 2)"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Parte 1 (ex: suco concentrado)
          </label>
          <input
            type="number"
            value={part1}
            onChange={(e) => setPart1(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Digite a quantidade da parte 1 (ex: 1)"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Parte 2 (ex: água)
          </label>
          <input
            type="number"
            value={part2}
            onChange={(e) => setPart2(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Digite a quantidade da parte 2 (ex: 3)"
          />
        </div>

        <button
          onClick={calculateProportions}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition font-medium"
        >
          Calcular
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 space-y-3">
        <h3 className="text-lg font-medium text-gray-800">Resultado</h3>
        {result ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Volume da Parte 1:</span>
              <span className="text-2xl font-bold text-blue-600">
                {result.part1} L
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Volume da Parte 2:</span>
              <span className="text-2xl font-bold text-blue-600">
                {result.part2} L
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
