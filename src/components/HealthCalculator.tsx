import React, { useState } from 'react';

export const HealthCalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('sedentary');

  const calculateBMI = () => {
    if (!weight || !height) return 0;
    const heightInMeters = Number(height) / 100;
    return Number((Number(weight) / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const calculateCalories = () => {
    if (!weight || !height || !age) return 0;
    
    // Harris-Benedict Formula
    const heightInCm = Number(height);
    const weightInKg = Number(weight);
    const ageInYears = Number(age);
    
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * ageInYears);
    } else {
      bmr = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * ageInYears);
    }
    
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };
    
    return Math.round(bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Abaixo do peso', color: 'text-yellow-600' };
    if (bmi < 25) return { text: 'Peso normal', color: 'text-green-600' };
    if (bmi < 30) return { text: 'Sobrepeso', color: 'text-yellow-600' };
    return { text: 'Obesidade', color: 'text-red-600' };
  };

  const bmi = calculateBMI();
  const calories = calculateCalories();
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Calculadora de IMC e Calorias</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Altura (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Idade</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gênero</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nível de Atividade</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="sedentary">Sedentário</option>
              <option value="light">Levemente ativo</option>
              <option value="moderate">Moderadamente ativo</option>
              <option value="active">Muito ativo</option>
              <option value="veryActive">Extremamente ativo</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Resultados</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Seu IMC é:</p>
                <p className="text-2xl font-bold">{bmi || '-'}</p>
                <p className={`text-sm ${bmiCategory.color}`}>{bmi ? bmiCategory.text : '-'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Calorias diárias necessárias:</p>
                <p className="text-2xl font-bold">{calories || '-'}</p>
                <p className="text-sm text-gray-500">kcal/dia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};