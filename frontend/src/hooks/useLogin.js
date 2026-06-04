import { useState } from 'react';
import { api } from '../services/api';

function useLogin(onLoginSuccess) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectQuickUser = (user) => {
    setUsername(user.username);
    setPassword('123456'); // Contraseña sembrada por defecto
    setError(null);
  };

  const handleLogin = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (!username.trim() || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userSession = await api.login(username.trim(), password);
      if (userSession) {
        onLoginSuccess(userSession);
      } else {
        setError('Error al iniciar sesión. Verifica las credenciales.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Credenciales inválidas o error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    setError,
    handleSelectQuickUser,
    handleLogin
  };
}

export default useLogin;
