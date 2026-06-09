import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDefaultRoute } from '../App';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

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

  const loginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('panini_session', JSON.stringify(user));
    if (user.rol === 'ADMIN') {
      navigate('/admin/global/database');
    } else {
      navigate('/seleccion-negocio');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentNegocio(null);
    localStorage.removeItem('panini_session');
    localStorage.removeItem('active_negocio_id');
    localStorage.removeItem('active_negocio_nombre');
    navigate('/');
  };

  const selectNegocio = (negocio) => {
    setCurrentNegocio(negocio);
    localStorage.setItem('active_negocio_id', negocio.id.toString());
    localStorage.setItem('active_negocio_nombre', negocio.nombre);
    navigate(getDefaultRoute(currentUser?.rol));
  };

  const bypassAdminDB = () => {
    setCurrentNegocio(null);
    localStorage.removeItem('active_negocio_id');
    localStorage.removeItem('active_negocio_nombre');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentNegocio,
        loginSuccess,
        logout,
        selectNegocio,
        bypassAdminDB
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
