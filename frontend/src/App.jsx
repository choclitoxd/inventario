import React, { useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Coins, 
  TrendingDown, 
  Layers,
  LogOut,
  Database,
  Store
} from 'lucide-react';

// Import views
import DashboardView from './views/DashboardView';
import InventarioView from './views/InventarioView';
import VentaCheckoutView from './views/VentaCheckoutView';
import LotesDeudasView from './views/LotesDeudasView';
import GastosHormigaView from './views/GastosHormigaView';
import LoginView from './views/LoginView';
import NegocioSelectView from './views/NegocioSelectView';
import AdminDBView from './views/AdminDBView';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const session = localStorage.getItem('panini_session');
      return session ? JSON.parse(session) : null;
    } catch (_) {
      return null;
    }
  });

  const [currentNegocio, setCurrentNegocio] = useState(() => {
    try {
      const activeId = localStorage.getItem('active_negocio_id');
      const activeNombre = localStorage.getItem('active_negocio_nombre');
      return activeId ? { id: parseInt(activeId), nombre: activeNombre } : null;
    } catch (_) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState(() => {
    // If user is ADMIN and has no business, default to 'admin-db'
    if (currentUser && currentUser.rol === 'ADMIN' && !localStorage.getItem('active_negocio_id')) {
      return 'admin-db';
    }
    // Vendedors don't have dashboard, so default to 'inventario'
    if (currentUser && currentUser.rol === 'VENDEDOR') {
      return 'inventario';
    }
    return 'dashboard';
  });

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('panini_session', JSON.stringify(user));
    if (user.rol === 'ADMIN' && !currentNegocio) {
      setActiveTab('admin-db');
    } else if (user.rol === 'VENDEDOR') {
      setActiveTab('inventario');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentNegocio(null);
    localStorage.removeItem('panini_session');
    localStorage.removeItem('active_negocio_id');
    localStorage.removeItem('active_negocio_nombre');
  };

  const handleSelectNegocio = (negocio) => {
    setCurrentNegocio(negocio);
    if (currentUser.rol === 'VENDEDOR') {
      setActiveTab('inventario');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleBypassAdminDB = () => {
    setCurrentNegocio(null);
    localStorage.removeItem('active_negocio_id');
    localStorage.removeItem('active_negocio_nombre');
    setActiveTab('admin-db');
  };

  // 1. If not logged in, show LoginView
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. If logged in but no business selected, AND they are not accessing the Admin DB console, force select business
  const isBypassing = currentUser.rol === 'ADMIN' && activeTab === 'admin-db';
  if (!currentNegocio && !isBypassing) {
    return (
      <NegocioSelectView 
        currentUser={currentUser} 
        onSelectNegocio={handleSelectNegocio} 
        onBypassAdminDB={handleBypassAdminDB}
        onLogout={handleLogout} 
      />
    );
  }

  // 3. Render layout. Compute nav items based on roles and selection
  const getNavItems = () => {
    const items = [];
    
    // Dashboard only for JEFE/ADMIN and when business is selected
    if (currentNegocio && (currentUser.rol === 'JEFE' || currentUser.rol === 'ADMIN')) {
      items.push({ id: 'dashboard', label: 'Dashboard', icon: TrendingUp, activeColor: 'text-neonGreen', borderSideColor: 'border-neonGreen' });
    }
    
    // Inventario and Nueva Venta for all, but requires business selected
    if (currentNegocio) {
      items.push({ id: 'inventario', label: 'Inventario', icon: Package, activeColor: 'text-neonGreen', borderSideColor: 'border-neonGreen' });
      items.push({ id: 'ventas', label: 'Nueva Venta', icon: ShoppingCart, activeColor: 'text-neonGreen', borderSideColor: 'border-neonGreen' });
    }
    
    // Lotes and Gastos only for JEFE/ADMIN and when business is selected
    if (currentNegocio && (currentUser.rol === 'JEFE' || currentUser.rol === 'ADMIN')) {
      items.push({ id: 'lotes', label: 'Lotes/Deudas', icon: Coins, activeColor: 'text-neonCyan', borderSideColor: 'border-neonCyan' });
      items.push({ id: 'gastos', label: 'Gastos', icon: TrendingDown, activeColor: 'text-red-500', borderSideColor: 'border-red-500' });
    }
    
    // Database only for ADMIN (always accessible)
    if (currentUser.rol === 'ADMIN') {
      items.push({ id: 'admin-db', label: 'Base de Datos', icon: Database, activeColor: 'text-neonCyan', borderSideColor: 'border-neonCyan' });
    }
    
    return items;
  };

  const navItems = getNavItems();

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
      case 'admin-db':
        return <AdminDBView />;
      default:
        return currentNegocio ? <DashboardView /> : <AdminDBView />;
    }
  };

  return (
    <div className="min-h-screen bg-carbon-950 flex flex-col md:flex-row text-zinc-100 font-body">
      
      {/* Desktop Sidebar (visible en md y superior) */}
      <aside className="hidden md:flex flex-col w-64 bg-carbon-900 border-r border-carbon-800 p-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-6 px-2">
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

        {/* Info de Negocio Seleccionado */}
        {currentNegocio ? (
          <div className="bg-carbon-950/60 border border-carbon-800 p-3 rounded-xl mb-4 flex flex-col gap-1 animate-fadeIn">
            <span className="text-[9px] font-bold text-carbon-500 tracking-wider">NEGOCIO ACTIVO</span>
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs font-sports font-bold text-neonCyan truncate">{currentNegocio.nombre}</p>
                <span className="text-[8px] text-carbon-500 font-semibold tracking-wider">ID: {currentNegocio.id}</span>
              </div>
              <button 
                onClick={() => {
                  setCurrentNegocio(null);
                  localStorage.removeItem('active_negocio_id');
                  localStorage.removeItem('active_negocio_nombre');
                }}
                className="text-[9px] text-neonCyan hover:underline font-bold transition-all"
              >
                Cambiar
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-carbon-950/60 border border-carbon-800 p-3 rounded-xl mb-4 flex flex-col gap-1 animate-fadeIn">
            <span className="text-[9px] font-bold text-carbon-500 tracking-wider">NEGOCIO ACTIVO</span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-500">Sin seleccionar</span>
              <button 
                onClick={() => {
                  setActiveTab('admin-db');
                }}
                className="text-[9px] text-neonCyan hover:underline font-bold transition-all"
              >
                Elegir
              </button>
            </div>
          </div>
        )}
 
        {/* Info de Usuario Activo en Sidebar */}
        <div className="bg-carbon-950/60 border border-carbon-800 p-3 rounded-xl mb-6 flex flex-col gap-1 animate-fadeIn">
          <span className="text-[9px] font-bold text-carbon-500 tracking-wider">USUARIO ACTIVO</span>
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-sports font-bold text-white leading-none truncate">{currentUser.nombre}</p>
              <span className="text-[9px] text-neonGreen font-semibold tracking-wider mt-0.5 inline-block">{currentUser.rol}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-carbon-500 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-all flex-shrink-0"
              title="Cerrar Sesión"
            >
              <LogOut size={16} />
            </button>
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
                    ? `bg-carbon-800 border-l-4 ${item.borderSideColor} ${item.activeColor} shadow-md`
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
        <header className="flex md:hidden flex-col bg-carbon-900 border-b border-carbon-800 p-4 -mx-4 -mt-4 mb-6 shadow-md gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-neonGreen p-1.5 rounded-lg text-black">
                <Layers size={18} />
              </div>
              <h1 className="text-lg font-sports font-bold tracking-wider text-white">
                PANINI <span className="text-neonGreen font-extrabold">INV</span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[11px] font-sports font-bold text-white leading-none">{currentUser.nombre}</p>
                <span className="text-[9px] text-neonGreen font-semibold tracking-wider mt-0.5 inline-block">{currentUser.rol}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-carbon-500 hover:text-red-500 p-1.5 rounded-lg bg-carbon-800 border border-carbon-700 transition-all"
                title="Cerrar Sesión"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>

          {/* Sede selection on mobile header */}
          <div className="flex items-center justify-between text-xs border-t border-carbon-800/60 pt-2">
            <span className="text-[10px] text-carbon-500 font-bold uppercase tracking-wider">Sede:</span>
            {currentNegocio ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-neonCyan">{currentNegocio.nombre}</span>
                <button 
                  onClick={() => {
                    setCurrentNegocio(null);
                    localStorage.removeItem('active_negocio_id');
                    localStorage.removeItem('active_negocio_nombre');
                  }}
                  className="text-[9px] text-neonCyan underline font-semibold ml-1"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-500">Sin Seleccionar</span>
                <button 
                  onClick={() => {
                    setActiveTab('admin-db');
                  }}
                  className="text-[9px] text-neonCyan underline font-semibold ml-1"
                >
                  Elegir
                </button>
              </div>
            )}
          </div>
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
                <span className={`absolute top-0 w-8 h-0.5 rounded-full ${item.id === 'lotes' || item.id === 'admin-db' ? 'bg-neonCyan' : item.id === 'gastos' ? 'bg-red-500' : 'bg-neonGreen'}`} />
              )}
            </button>
          );
          
        })}
      </nav>
    </div>
  );
}

export default App;
