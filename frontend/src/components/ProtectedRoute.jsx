import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ 
  currentUser, 
  currentNegocio, 
  allowedRoles, 
  isNegocioSelectionRoute = false,
  isDbAdminRoute = false
}) {
  // 1. Si no está autenticado, redirigir al login (/)
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // 2. Si está autenticado pero su rol no está permitido en esta ruta
  if (allowedRoles && !allowedRoles.includes(currentUser.rol)) {
    // Redirigir según el rol del usuario a su vista por defecto
    if (currentUser.rol === 'ORGANIZADOR') {
      return <Navigate to="/admin/inventario" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 3. Si no ha seleccionado negocio
  const isBypassing = currentUser.rol === 'ADMIN' && isDbAdminRoute;
  if (!currentNegocio && !isBypassing && !isNegocioSelectionRoute) {
    return <Navigate to="/admin/seleccion-negocio" replace />;
  }

  // 4. Si ya tiene negocio seleccionado y trata de ir a la selección de negocio (evitar loops)
  if (currentNegocio && isNegocioSelectionRoute) {
    if (currentUser.rol === 'ORGANIZADOR') {
      return <Navigate to="/admin/inventario" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Si todo es correcto, renderizar las rutas hijas
  return <Outlet />;
}

export default ProtectedRoute;
