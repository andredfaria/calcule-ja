import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { HealthCalculator } from './components/HealthCalculator';
import { FinanceCalculator } from './components/FinanceCalculator';
import { DateTimeConverter } from './components/DateTimeConverter';
import { BillSplitter } from './components/BillSplitter';
import { GasCalculator } from './components/GasCalculator';
import { FuelCalculator } from './components/FuelCalculator';
import { CrossMultiplication } from './components/CrossMultiplication';
import { PercentageCalculator } from './components/PercentageCalculator';
import { MixtureRatioCalculator } from './components/MixtureRatioCalculator';
import { UnitConverter } from './components/UnitConverter';
import { CurrencyDepreciationCalculator } from './components/CurrencyDepreciationCalculator';
import { CDICalculator } from './components/CDICalculator';

function App() {
  const [activeTab, setActiveTab] = useState('cross-multiplication');

  const renderContent = () => {
    switch (activeTab) {
      case 'health':
        return <HealthCalculator />;
      case 'cross-multiplication':
        return <CrossMultiplication />;
      case 'percentage':
        return <PercentageCalculator />;
      case 'proporcao':
        return <MixtureRatioCalculator />;
      case 'finance':
        return <FinanceCalculator />;
      case 'datetime':
        return <DateTimeConverter />;
      case 'split':
        return <BillSplitter />;
      case 'gas':
        return <GasCalculator />;
      case 'fuel':
        return <FuelCalculator />;
      case 'units':
        return <UnitConverter />;
      case 'devaluation':
        return <CurrencyDepreciationCalculator />;
      case 'cdi':
        return <CDICalculator />;
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <section key={activeTab} className="calc-stage">
        {renderContent()}
      </section>
    </Layout>
  );
}

export default App;
