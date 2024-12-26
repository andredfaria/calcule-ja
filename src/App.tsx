import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { HealthCalculator } from './components/HealthCalculator';
import { FinanceCalculator } from './components/FinanceCalculator';
import { DateTimeConverter } from './components/DateTimeConverter';
import { BillSplitter } from './components/BillSplitter';

function App() {
  const [activeTab, setActiveTab] = useState('health');

  const renderContent = () => {
    switch (activeTab) {
      case 'health':
        return <HealthCalculator />;
      case 'finance':
        return <FinanceCalculator />;
      case 'datetime':
        return <DateTimeConverter />;
      case 'split':
        return <BillSplitter />;
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