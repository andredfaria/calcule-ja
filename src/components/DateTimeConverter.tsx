import React, { useState, useEffect } from 'react';

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/Sao_Paulo', label: 'São Paulo' },
  { value: 'America/New_York', label: 'New York' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Australia/Sydney', label: 'Sydney' },
];

export const DateTimeConverter: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  const [conversions, setConversions] = useState<{ zone: string; time: string }[]>([]);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      const datetime = new Date(`${selectedDate}T${selectedTime}`);
      
      const newConversions = TIMEZONES.map(({ value, label }) => {
        const options = {
          timeZone: value,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        } as Intl.DateTimeFormatOptions;

        return {
          zone: label,
          time: new Intl.DateTimeFormat('pt-BR', options).format(datetime)
        };
      });

      setConversions(newConversions);
    }
  }, [selectedDate, selectedTime, selectedTimezone]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Conversor de Datas e Horários</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/** Campo de Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/** Campo de Hora */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hora
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/** Campo de Fuso Horigem */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fuso Horário de Origem
            </label>
            <select
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-md transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              {TIMEZONES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="result-card">
          <h3 className="text-lg font-medium mb-4">Conversões</h3>

          <div className="space-y-4">
            {conversions.map(({ zone, time }) => (
              <div key={zone} className="flex justify-between items-center">
                <span className="text-gray-600">{zone}</span>
                <span className="font-medium">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};