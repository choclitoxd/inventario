import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDefaultRoute } from '../App';

function ProtectedRoute({ 
  allowedRoles, 
  isNegocioSelectionRoute = false,
  isDbAdminRoute = false
}) {
  const { currentUser, currentNegocio } = useAuth();

  // 1. Sin autenticación → login
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // 2. Rol no permitido en esta ruta → redirigir a su vista por defecto
  if (allowedRoles && !allowedRoles.includes(currentUser.rol)) {
    return <Navigate to={getDefaultRoute(currentUser.rol)} replace />;
  }

  // 3. Sin negocio seleccionado (y no es la pantalla de selección ni rutas ADMIN sin negocio)
  const isBypassing = currentUser.rol === 'ADMIN' && isDbAdminRoute;
  if (!currentNegocio && !isBypassing && !isNegocioSelectionRoute) {
    return <Navigate to="/seleccion-negocio" replace />;
  }

  // 4. Ya tiene negocio y quiere volver a la selección → redirigir a su dashboard
  if (currentNegocio && isNegocioSelectionRoute) {
    return <Navigate to={getDefaultRoute(currentUser.rol)} replace />;
  }

  // OK → renderizar rutas hijas
  return <Outlet />;
}

export default ProtectedRoute;
