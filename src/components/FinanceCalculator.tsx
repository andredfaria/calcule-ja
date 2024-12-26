import React, { useState } from 'react';

export const FinanceCalculator: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [months, setMonths] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [calculationType, setCalculationType] = useState('simple');

  const calculateInstallment = () => {
    if (!amount || !months || !interestRate) return null;

    const principal = Number(amount);
    const period = Number(months);
    const rate = Number(interestRate) / 100;

    if (calculationType === 'simple') {
      const totalInterest = principal * rate * period;
      const total = principal + totalInterest;
      return {
        installment: total / period,
        total,
        totalInterest
      };
    } else {
      const monthlyRate = rate / 12;
      const installment = principal * (monthlyRate * Math.pow(1 + monthlyRate, period)) / (Math.pow(1 + monthlyRate, period) - 1);
      const total = installment * period;
      return {
        installment,
        total,
        totalInterest: total - principal
      };
    }
  };

  const result = calculateInstallment();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Calculadora de Parcelamento</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Valor Total (R$)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Número de Parcelas</label>
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Taxa de Juros (% ao ano)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Juros</label>
            <select
              value={calculationType}
              onChange={(e) => setCalculationType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="simple">Juros Simples</option>
              <option value="compound">Juros Compostos</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Resultado</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Valor da Parcela:</p>
              <p className="text-2xl font-bold">
                {result ? `R$ ${result.installment.toFixed(2)}` : '-'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Total a Pagar:</p>
              <p className="text-2xl font-bold">
                {result ? `R$ ${result.total.toFixed(2)}` : '-'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Total de Juros:</p>
              <p className="text-2xl font-bold">
                {result ? `R$ ${result.totalInterest.toFixed(2)}` : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};