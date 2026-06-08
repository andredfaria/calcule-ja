import React, { useState, useEffect } from 'react';
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
import { CdiCalculator } from './components/CdiCalculator';
import { FinanciamentoCalculator } from './components/FinanciamentoCalculator';
import { MotoristaAppCalculator } from './components/MotoristaAppCalculator';
import { parseParams } from './lib/url/params';

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const { calcId } = parseParams(window.location.search);
    return calcId ?? 'cross-multiplication';
  });

  // When the user switches tabs, reflect it in the URL (replaceState — no history pollution).
  useEffect(() => {
    const { calcId } = parseParams(window.location.search);
    if (calcId !== activeTab) {
      window.history.replaceState(null, '', `${window.location.pathname}?calc=${activeTab}`);
    }
  }, [activeTab]);

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
      case 'cdi':
        return <CdiCalculator />;
      case 'financiamento':
        return <FinanciamentoCalculator />;
      case 'datetime':
        return <DateTimeConverter />;
      case 'split':
        return <BillSplitter />;
      case 'gas':
        return <GasCalculator />;
      case 'fuel':
        return <FuelCalculator />;
      case 'motorista':
        return <MotoristaAppCalculator />;
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
