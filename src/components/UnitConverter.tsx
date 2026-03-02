import React, { useMemo, useState } from 'react';

type Category = 'length' | 'mass' | 'volume' | 'temperature';

interface UnitOption {
  label: string;
  value: string;
  toBase: (input: number) => number;
  fromBase: (input: number) => number;
}

const unitMap: Record<Category, UnitOption[]> = {
  length: [
    { label: 'Milímetro (mm)', value: 'mm', toBase: (n) => n / 1000, fromBase: (n) => n * 1000 },
    { label: 'Centímetro (cm)', value: 'cm', toBase: (n) => n / 100, fromBase: (n) => n * 100 },
    { label: 'Metro (m)', value: 'm', toBase: (n) => n, fromBase: (n) => n },
    { label: 'Quilômetro (km)', value: 'km', toBase: (n) => n * 1000, fromBase: (n) => n / 1000 },
  ],
  mass: [
    { label: 'Grama (g)', value: 'g', toBase: (n) => n / 1000, fromBase: (n) => n * 1000 },
    { label: 'Quilograma (kg)', value: 'kg', toBase: (n) => n, fromBase: (n) => n },
    { label: 'Tonelada (t)', value: 't', toBase: (n) => n * 1000, fromBase: (n) => n / 1000 },
  ],
  volume: [
    { label: 'Mililitro (ml)', value: 'ml', toBase: (n) => n / 1000, fromBase: (n) => n * 1000 },
    { label: 'Litro (l)', value: 'l', toBase: (n) => n, fromBase: (n) => n },
    { label: 'Metro cúbico (m³)', value: 'm3', toBase: (n) => n * 1000, fromBase: (n) => n / 1000 },
  ],
  temperature: [
    { label: 'Celsius (°C)', value: 'c', toBase: (n) => n, fromBase: (n) => n },
    { label: 'Fahrenheit (°F)', value: 'f', toBase: (n) => (n - 32) / 1.8, fromBase: (n) => (n * 9) / 5 + 32 },
    { label: 'Kelvin (K)', value: 'k', toBase: (n) => n - 273.15, fromBase: (n) => n + 273.15 },
  ],
};

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [amount, setAmount] = useState('1');

  const units = useMemo(() => unitMap[category], [category]);

  React.useEffect(() => {
    setFromUnit(units[0].value);
    setToUnit(units[1]?.value ?? units[0].value);
  }, [units]);

  const convertedValue = useMemo(() => {
    const numericAmount = Number(amount);
    if (!amount || Number.isNaN(numericAmount)) return null;

    const from = units.find((item) => item.value === fromUnit);
    const to = units.find((item) => item.value === toUnit);
    if (!from || !to) return null;

    const baseValue = from.toBase(numericAmount);
    return to.fromBase(baseValue);
  }, [amount, fromUnit, toUnit, units]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Conversor de Unidades</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="length">Comprimento</option>
              <option value="mass">Massa</option>
              <option value="volume">Volume</option>
              <option value="temperature">Temperatura</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Valor</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">De</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Para</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="result-card">
          <h3 className="text-lg font-medium mb-4">Resultado</h3>
          <p className="text-sm text-gray-600">Valor convertido:</p>
          <p className="text-2xl font-bold">
            {convertedValue !== null ? convertedValue.toFixed(4) : '-'}
          </p>
        </div>
      </div>
    </div>
  );
};
