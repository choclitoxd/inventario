import React from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  NavLink, 
  Outlet, 
  useNavigate 
} from 'react-router-dom';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Coins, 
  TrendingDown, 
  Layers,
  LogOut,
  Database,
  Building2,
  Users,
  Activity,
  Boxes,
  UserCheck
} from 'lucide-react';

// Import views
import DashboardPage from './pages/DashboardPage';
import InventarioPage from './pages/InventarioPage';
import VentaCheckoutPage from './pages/VentaCheckoutPage';
import LotesDeudasPage from './pages/LotesDeudasPage';
import ProveedoresPage from './pages/ProveedoresPage';
import GastosPage from './pages/GastosPage';
import LoginPage from './pages/LoginPage';
import NegocioSelectPage from './pages/NegocioSelectPage';
import ProtectedRoute from './components/ProtectedRoute';

// Import Global Admin Pages
import DbConsolePage from './pages/global/DbConsolePage';
import SedesPage from './pages/global/SedesPage';
import UsuariosPage from './pages/global/UsuariosPage';
import AuditoriaPage from './pages/global/AuditoriaPage';
import InventarioGlobalPage from './pages/global/InventarioGlobalPage';

// Import Context
import { AuthProvider, useAuth } from './context/AuthContext';

// ─────────────────────────────────────────────────────────────
// Utilidad: ruta base por defecto según rol
// ─────────────────────────────────────────────────────────────
export function getDefaultRoute(rol) {
  if (rol === 'ADMIN') return '/admin/global/database';
  if (rol === 'ORGANIZADOR') return '/panel/inventario';
  return '/panel/dashboard'; // DUENO
}

// ─────────────────────────────────────────────────────────────
// 1. Wrapper de Login: redirige si ya está autenticado
// ─────────────────────────────────────────────────────────────
function LoginRouteWrapper() {
  const { currentUser, currentNegocio } = useAuth();

  if (currentUser) {
    if (currentUser.rol === 'ADMIN') {
      return <Navigate to="/admin/global/database" replace />;
    }
    if (!currentNegocio) {
      return <Navigate to="/seleccion-negocio" replace />;
    }
    return <Navigate to={getDefaultRoute(currentUser.rol)} replace />;
  }
  return <LoginPage />;
}

// ─────────────────────────────────────────────────────────────
// 2. Layout compartido (Sidebar + Header + Outlet)
// ─────────────────────────────────────────────────────────────
function AppLayout() {
  const navigate = useNavigate();
  const { currentUser, currentNegocio, logout, bypassAdminDB } = useAuth();

  const getNavItems = () => {
    const items = [];
    
    if (currentUser.rol === 'ADMIN') {
      items.push({ 
        id: 'global-db', 
        label: 'Consola DB', 
        path: '/admin/global/database', 
        icon: Database, 
        activeColor: 'text-neonCyan', 
        borderSideColor: 'border-neonCyan' 
      });
      items.push({ 
        id: 'global-sedes', 
        label: 'Gestión de Sedes', 
        path: '/admin/global/sedes', 
        icon: Building2, 
        activeColor: 'text-neonCyan', 
        borderSideColor: 'border-neonCyan' 
      });
      items.push({ 
        id: 'global-usuarios', 
        label: 'Control de Usuarios', 
        path: '/admin/global/usuarios', 
        icon: Users, 
        activeColor: 'text-neonCyan', 
        borderSideColor: 'border-neonCyan' 
      });
      items.push({ 
        id: 'global-inventario', 
        label: 'Inventario Global', 
        path: '/admin/global/inventario', 
        icon: Boxes, 
        activeColor: 'text-neonCyan', 
        borderSideColor: 'border-neonCyan' 
      });
      items.push({ 
        id: 'global-auditoria', 
        label: 'Bitácora de Auditoría', 
        path: '/admin/global/auditoria', 
        icon: Activity, 
        activeColor: 'text-neonCyan', 
        borderSideColor: 'border-neonCyan' 
      });
    } else {
      // Vistas exclusivas de DUENO
      if (currentNegocio && currentUser.rol === 'DUENO') {
        items.push({ 
          id: 'dashboard', 
          label: 'Dashboard', 
          path: '/panel/dashboard', 
          icon: TrendingUp, 
          activeColor: 'text-neonGreen', 
          borderSideColor: 'border-neonGreen' 
        });
      }
      
      // Vistas comunes (DUENO + ORGANIZADOR)
      if (currentNegocio) {
        items.push({ 
          id: 'inventario', 
          label: 'Inventario', 
          path: '/panel/inventario', 
          icon: Package, 
          activeColor: 'text-neonGreen', 
          borderSideColor: 'border-neonGreen' 
        });
        items.push({ 
          id: 'ventas', 
          label: 'Nueva Venta', 
          path: '/panel/nueva-venta', 
          icon: ShoppingCart, 
          activeColor: 'text-neonGreen', 
          borderSideColor: 'border-neonGreen' 
        });
      }
      
      // Vistas financieras exclusivas de DUENO
      if (currentNegocio && currentUser.rol === 'DUENO') {
        items.push({ 
          id: 'lotes', 
          label: 'Deudas', 
          path: '/panel/deudas', 
          icon: Coins, 
          activeColor: 'text-neonCyan', 
          borderSideColor: 'border-neonCyan' 
        });
        items.push({ 
          id: 'proveedores', 
          label: 'Proveedores', 
          path: '/panel/proveedores', 
          icon: UserCheck, 
          activeColor: 'text-neonCyan', 
          borderSideColor: 'border-neonCyan' 
        });
        items.push({ 
          id: 'gastos', 
          label: 'Gastos', 
          path: '/panel/gastos', 
          icon: TrendingDown, 
          activeColor: 'text-red-500', 
          borderSideColor: 'border-red-500' 
        });
      }
    }
    
    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="h-screen w-screen overflow-hidden bg-carbon-950 flex flex-col md:flex-row text-zinc-100 font-body">
      
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

        {/* Info de Negocio Seleccionado (solo para roles operativos) */}
        {currentUser.rol !== 'ADMIN' && (
          currentNegocio ? (
            <div className="bg-carbon-950/60 border border-carbon-800 p-3 rounded-xl mb-4 flex flex-col gap-1 animate-fadeIn">
              <span className="text-[9px] font-bold text-carbon-500 tracking-wider">NEGOCIO ACTIVO</span>
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-sports font-bold text-neonCyan truncate">{currentNegocio.nombre}</p>
                  <span className="text-[8px] text-carbon-500 font-semibold tracking-wider">ID: {currentNegocio.id}</span>
                </div>
                <button 
                  onClick={() => {
                    bypassAdminDB();
                    navigate('/seleccion-negocio');
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
                  onClick={() => navigate('/seleccion-negocio')}
                  className="text-[9px] text-neonCyan hover:underline font-bold transition-all"
                >
                  Elegir
                </button>
              </div>
            </div>
          )
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
              onClick={logout}
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
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-left font-sports ${
                  isActive 
                    ? `bg-carbon-800 border-l-4 ${item.borderSideColor} ${item.activeColor} shadow-md`
                    : 'text-carbon-500 hover:text-zinc-100 hover:bg-carbon-800/40'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-semibold">{item.label}</span>
              </NavLink>
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
        
        {/* Mobile Header (visible en móviles) */}
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
                onClick={logout}
                className="text-carbon-500 hover:text-red-500 p-1.5 rounded-lg bg-carbon-800 border border-carbon-700 transition-all"
                title="Cerrar Sesión"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>

          {currentUser.rol !== 'ADMIN' && (
            <div className="flex items-center justify-between border-t border-carbon-800 pt-2 text-[10px]">
              <span className="font-bold text-carbon-500 uppercase">Sede:</span>
              {currentNegocio ? (
                <div className="flex items-center gap-2">
                  <span className="font-sports font-bold text-neonCyan">{currentNegocio.nombre}</span>
                  <button 
                    onClick={() => {
                      bypassAdminDB();
                      navigate('/seleccion-negocio');
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
                    onClick={() => navigate('/seleccion-negocio')}
                    className="text-[9px] text-neonCyan underline font-semibold ml-1"
                  >
                    Elegir
                  </button>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Dynamic View container */}
        <div className="max-w-7xl w-full mx-auto flex-1">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Tab Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-carbon-900/90 backdrop-blur-lg border-t border-carbon-800 flex justify-around py-3 px-2 z-50 shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className="flex flex-col items-center gap-1 transition-all duration-300 relative px-3 py-1"
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110' : 'scale-100'}`}>
                    <Icon size={22} className={isActive ? item.activeColor : 'text-carbon-500'} />
                  </div>
                  <span className={`text-[10px] font-sports font-semibold transition-colors duration-300 ${isActive ? item.activeColor : 'text-carbon-500'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className={`absolute top-0 w-8 h-0.5 rounded-full ${item.activeColor.includes('neonCyan') ? 'bg-neonCyan' : item.id === 'gastos' ? 'bg-red-500' : 'bg-neonGreen'}`} />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Árbol de Rutas de la Aplicación
// ─────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* 1. Ruta pública de Login */}
      <Route 
        path="/" 
        element={<LoginRouteWrapper />} 
      />

      {/* 2. Selección de Negocio (protegida, sin prefijo de rol) */}
      <Route 
        element={<ProtectedRoute isNegocioSelectionRoute={true} />}
      >
        <Route 
          path="/seleccion-negocio" 
          element={<NegocioSelectPage />} 
        />
      </Route>

      {/* 3. Rutas Globales: solo ADMIN — /admin/global/* */}
      <Route 
        element={
          <ProtectedRoute 
            allowedRoles={['ADMIN']} 
            isDbAdminRoute={true} 
          />
        }
      >
        <Route element={<AppLayout />}>
          <Route path="/admin/global/database"  element={<DbConsolePage />} />
          <Route path="/admin/global/sedes"     element={<SedesPage />} />
          <Route path="/admin/global/usuarios"  element={<UsuariosPage />} />
          <Route path="/admin/global/inventario" element={<InventarioGlobalPage />} />
          <Route path="/admin/global/auditoria" element={<AuditoriaPage />} />
        </Route>
      </Route>

      {/* 4. Rutas del Panel de Negocio — /panel/* (DUENO + ORGANIZADOR) */}
      <Route element={<ProtectedRoute allowedRoles={['DUENO', 'ORGANIZADOR']} />}>
        <Route element={<AppLayout />}>

          {/* Vistas exclusivas DUENO */}
          <Route element={<ProtectedRoute allowedRoles={['DUENO']} />}>
            <Route path="/panel/dashboard"   element={<DashboardPage />} />
            <Route path="/panel/deudas"      element={<LotesDeudasPage />} />
            <Route path="/panel/proveedores" element={<ProveedoresPage />} />
            <Route path="/panel/gastos"      element={<GastosPage />} />
          </Route>

          {/* Vistas accesibles por DUENO y ORGANIZADOR */}
          <Route path="/panel/inventario"   element={<InventarioPage />} />
          <Route path="/panel/nueva-venta"  element={<VentaCheckoutPage />} />
        </Route>
      </Route>

      {/* 5. Fallback: redirigir al login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Punto de entrada con BrowserRouter
// ─────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
