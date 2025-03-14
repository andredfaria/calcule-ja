import {
  Calculator,
  Calendar,
  Gauge,
  Fuel,
  TrafficCone,
  Percent,
} from "lucide-react";
import React from 'react';
import Footer from './Footer';

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
      active ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
    }`}
  >
    {icon}
    <span>{text}</span>
  </button>
);

interface LayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Calcule ja</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[250px,1fr] gap-6">
          <nav className="space-y-2 bg-white p-4 rounded-lg shadow-sm">
            <NavItem
              icon={<Calculator className="w-5 h-5" />}
              text="Regra de 3"
              active={activeTab === "cross-multiplication"}
              onClick={() => setActiveTab("cross-multiplication")}
            />
            <NavItem
              icon={<Percent className="w-5 h-5" />}
              text="Porcentagem"
              active={activeTab === "percentage"}
              onClick={() => setActiveTab("percentage")}
            />
            {/*
            <NavItem
              icon={<Percent className="w-5 h-5" />}
              text="Proporção"
              active={activeTab === "proporcao"}
              onClick={() => setActiveTab("proporcao")}
            />
            <NavItem
              icon={<SplitSquareHorizontal className="w-5 h-5" />}
              text="Divisão de Contas"
              active={activeTab === "split"}
              onClick={() => setActiveTab("split")}
            />
            <NavItem
              icon={<Calculator className="w-5 h-5" />}
              text="Parcelamento"
              active={activeTab === "finance"}
              onClick={() => setActiveTab("finance")}
            /> */}
            <NavItem
              icon={<Gauge className="w-5 h-5" />}
              text="IMC"
              active={activeTab === "health"}
              onClick={() => setActiveTab("health")}
            />
            <NavItem
              icon={<Fuel className="w-5 h-5" />}
              text="Combustível"
              active={activeTab === "fuel"}
              onClick={() => setActiveTab("fuel")}
            />
            <NavItem
              icon={<TrafficCone className="w-5 h-5" />}
              text="Calculo de Viagem"
              active={activeTab === "gas"}
              onClick={() => setActiveTab("gas")}
            />
            <NavItem
              icon={<Calendar className="w-5 h-5" />}
              text="Datas e Horários"
              active={activeTab === "datetime"}
              onClick={() => setActiveTab("datetime")}
            />
          </nav>
          <main className="bg-white p-6 rounded-lg shadow-sm">{children}</main>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}