import React, { useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Coins, 
  TrendingDown, 
  Layers
} from 'lucide-react';

// Import views
import DashboardView from './views/DashboardView';
import InventarioView from './views/InventarioView';
import VentaCheckoutView from './views/VentaCheckoutView';
import LotesDeudasView from './views/LotesDeudasView';
import GastosHormigaView from './views/GastosHormigaView';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'inventario':
        return <InventarioView />;
      case 'ventas':
        return <VentaCheckoutView />;
      case 'lotes':
        return <LotesDeudasView />;
      case 'gastos':
        return <GastosHormigaView />;
      default:
        return <DashboardView />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, activeColor: 'text-neonGreen', glowColor: 'shadow-neon-green' },
    { id: 'inventario', label: 'Inventario', icon: Package, activeColor: 'text-neonGreen', glowColor: 'shadow-neon-green' },
    { id: 'ventas', label: 'Nueva Venta', icon: ShoppingCart, activeColor: 'text-neonGreen', glowColor: 'shadow-neon-green' },
    { id: 'lotes', label: 'Lotes/Deudas', icon: Coins, activeColor: 'text-neonCyan', glowColor: 'shadow-neon-cyan' },
    { id: 'gastos', label: 'Gastos', icon: TrendingDown, activeColor: 'text-red-500', glowColor: 'shadow-red-500/20' }
  ];

  return (
    <div className="min-h-screen bg-carbon-950 flex flex-col md:flex-row text-zinc-100 font-body">
      
      {/* Desktop Sidebar (visible en md y superior) */}
      <aside className="hidden md:flex flex-col w-64 bg-carbon-900 border-r border-carbon-800 p-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-neonGreen p-2 rounded-xl text-black">
            <Layers size={24} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-sports font-bold leading-tight tracking-wider text-white">
              PANINI <span className="text-neonGreen font-extrabold">INV</span>
            </h1>
            <span className="text-xs text-carbon-500 font-medium tracking-wider">CARBON EDITION</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-left font-sports ${
                  isActive 
                    ? `bg-carbon-800 border-l-4 ${item.id === 'lotes' ? 'border-neonCyan' : item.id === 'gastos' ? 'border-red-500' : 'border-neonGreen'} ${item.activeColor} shadow-md`
                    : 'text-carbon-500 hover:text-zinc-100 hover:bg-carbon-800/40'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-6 border-t border-carbon-800 text-center">
          <p className="text-xs text-carbon-500 font-medium">Control de Inventario & Deudas</p>
          <span className="text-[10px] text-neonGreen font-semibold tracking-widest mt-1 block">v1.0.0</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto pb-24 md:pb-8 p-4 md:p-8">
        
        {/* Mobile Header (visible en moviles) */}
        <header className="flex md:hidden items-center justify-between bg-carbon-900 border-b border-carbon-800 p-4 -mx-4 -mt-4 mb-6 shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-neonGreen p-1.5 rounded-lg text-black">
              <Layers size={18} />
            </div>
            <h1 className="text-lg font-sports font-bold tracking-wider text-white">
              PANINI <span className="text-neonGreen font-extrabold">INV</span>
            </h1>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-carbon-800 border border-carbon-700 text-carbon-500">
            {navItems.find(t => t.id === activeTab)?.label}
          </span>
        </header>

        {/* Dynamic View container */}
        <div className="max-w-7xl w-full mx-auto flex-1">
          {renderActiveView()}
        </div>
      </main>

      {/* Mobile Bottom Tab Navigation (fija abajo para moviles) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-carbon-900/90 backdrop-blur-lg border-t border-carbon-800 flex justify-around py-3 px-2 z-50 shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center gap-1 transition-all duration-300 relative px-3 py-1"
            >
              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110' : 'scale-100'}`}>
                <Icon size={22} className={isActive ? item.activeColor : 'text-carbon-500'} />
              </div>
              <span className={`text-[10px] font-sports font-semibold transition-colors duration-300 ${isActive ? item.activeColor : 'text-carbon-500'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className={`absolute top-0 w-8 h-0.5 rounded-full ${item.id === 'lotes' ? 'bg-neonCyan' : item.id === 'gastos' ? 'bg-red-500' : 'bg-neonGreen'}`} />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default App;
