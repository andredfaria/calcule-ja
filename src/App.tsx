import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { HealthCalculator } from './components/HealthCalculator';
import { FinanceCalculator } from './components/FinanceCalculator';
import { DateTimeConverter } from './components/DateTimeConverter';
import { BillSplitter } from './components/BillSplitter';
import { GasCalculator } from './components/GasCalculator';
import { FuelCalculator } from './components/FuelCalculator';

function App() {
  const [activeTab, setActiveTab] = useState('split');

  const renderContent = () => {
    switch (activeTab) {
      case "health":
        return <HealthCalculator />;
      case "finance":
        return <FinanceCalculator />;
      case "datetime":
        return <DateTimeConverter />;
      case "split":
        return <BillSplitter />;
      case "gas":
        return <GasCalculator />;
      case "fuel":
        return <FuelCalculator />;
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;