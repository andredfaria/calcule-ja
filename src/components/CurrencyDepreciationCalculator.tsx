import React, { useMemo, useState } from 'react';

export const CurrencyDepreciationCalculator: React.FC = () => {
  const [initialAmount, setInitialAmount] = useState('1000');
  const [annualRate, setAnnualRate] = useState('5');
  const [years, setYears] = useState('3');

  const result = useMemo(() => {
    const principal = Number(initialAmount);
    const rate = Number(annualRate) / 100;
    const period = Number(years);

    if ([principal, rate, period].some((value) => Number.isNaN(value)) || period < 0) {
      return null;
    }

    const finalValue = principal * (1 - rate) ** period;
    const lossValue = principal - finalValue;

    return { finalValue, lossValue };
  }, [initialAmount, annualRate, years]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Desvalorização da Moeda</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Valor atual (R$)</label>
            <input
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Taxa de desvalorização anual (%)</label>
            <input
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Período (anos)</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="result-card space-y-3">
          <h3 className="text-lg font-medium">Resultado</h3>
          <div>
            <p className="text-sm text-gray-600">Valor preservado:</p>
            <p className="text-2xl font-bold">{result ? `R$ ${result.finalValue.toFixed(2)}` : '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Perda estimada:</p>
            <p className="text-xl font-semibold">{result ? `R$ ${result.lossValue.toFixed(2)}` : '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
