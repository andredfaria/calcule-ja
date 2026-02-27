import {
  Calculator,
  Calendar,
  Gauge,
  Fuel,
  TrafficCone,
  Percent,
  Beaker,
  Receipt,
  Wallet,
} from 'lucide-react';
import React from 'react';
import Footer from './Footer';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'cross-multiplication', label: 'Regra de 3', icon: <Calculator className="w-4 h-4" /> },
  { id: 'percentage', label: 'Porcentagem', icon: <Percent className="w-4 h-4" /> },
  { id: 'proporcao', label: 'Proporção', icon: <Beaker className="w-4 h-4" /> },
  { id: 'health', label: 'IMC', icon: <Gauge className="w-4 h-4" /> },
  { id: 'fuel', label: 'Álcool x Gasolina', icon: <Fuel className="w-4 h-4" /> },
  { id: 'gas', label: 'Viagem', icon: <TrafficCone className="w-4 h-4" /> },
  { id: 'finance', label: 'Parcelamento', icon: <Wallet className="w-4 h-4" /> },
  { id: 'split', label: 'Divisão de contas', icon: <Receipt className="w-4 h-4" /> },
  { id: 'datetime', label: 'Fuso horário', icon: <Calendar className="w-4 h-4" /> },
];

interface LayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
  return (
    <div className="min-h-screen app-shell pb-24 md:pb-0">
      <header className="app-header">
        <div>
          <p className="app-kicker">Ferramentas de cálculo</p>
          <h1 className="app-title">Calcule Já</h1>
        </div>
        <p className="app-subtitle">Precisão rápida para decisões do dia a dia.</p>
      </header>

      <div className="app-grid">
        <aside className="sidebar hidden md:block">
          <p className="sidebar-title">Calculadoras</p>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item ${activeTab === item.id ? 'nav-item-active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="main-panel">{children}</main>
      </div>

      <nav className="mobile-nav md:hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`mobile-nav-item ${activeTab === item.id ? 'mobile-nav-item-active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <Footer />
    </div>
  );
};
