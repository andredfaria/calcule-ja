import React, { useMemo, useState } from 'react';

export const CDICalculator: React.FC = () => {
  const [initialAmount, setInitialAmount] = useState('1000');
  const [monthlyDeposit, setMonthlyDeposit] = useState('200');
  const [cdiRate, setCdiRate] = useState('10.65');
  const [cdiPercent, setCdiPercent] = useState('100');
  const [months, setMonths] = useState('24');

  const result = useMemo(() => {
    const principal = Number(initialAmount);
    const deposit = Number(monthlyDeposit);
    const annualCDI = Number(cdiRate) / 100;
    const percentualCDI = Number(cdiPercent) / 100;
    const period = Number(months);

    if ([principal, deposit, annualCDI, percentualCDI, period].some((value) => Number.isNaN(value)) || period < 0) {
      return null;
    }

    const monthlyRate = ((1 + annualCDI) ** (1 / 12) - 1) * percentualCDI;

    if (monthlyRate === 0) {
      const totalInvested = principal + deposit * period;
      return {
        totalInvested,
        finalAmount: totalInvested,
        earnings: 0,
        monthlyRate,
      };
    }

    const futureValuePrincipal = principal * (1 + monthlyRate) ** period;
    const futureValueDeposits = deposit * (((1 + monthlyRate) ** period - 1) / monthlyRate);
    const finalAmount = futureValuePrincipal + futureValueDeposits;
    const totalInvested = principal + deposit * period;

    return {
      totalInvested,
      finalAmount,
      earnings: finalAmount - totalInvested,
      monthlyRate,
    };
  }, [initialAmount, monthlyDeposit, cdiRate, cdiPercent, months]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Calculadora de CDI</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Valor inicial (R$)</label>
            <input
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Aporte mensal (R$)</label>
            <input
              type="number"
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CDI anual (%)</label>
            <input
              type="number"
              value={cdiRate}
              onChange={(e) => setCdiRate(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Percentual do CDI (%)</label>
            <input
              type="number"
              value={cdiPercent}
              onChange={(e) => setCdiPercent(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Período (meses)</label>
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="result-card space-y-3">
          <h3 className="text-lg font-medium">Resultado</h3>
          <p className="text-sm text-gray-600">
            Taxa mensal equivalente: {result ? `${(result.monthlyRate * 100).toFixed(3)}%` : '-'}
          </p>
          <div className="flex justify-between">
            <span className="text-gray-600">Total investido:</span>
            <span>{result ? `R$ ${result.totalInvested.toFixed(2)}` : '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rendimentos:</span>
            <span>{result ? `R$ ${result.earnings.toFixed(2)}` : '-'}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Montante final:</span>
            <span>{result ? `R$ ${result.finalAmount.toFixed(2)}` : '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
