const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const activeNegocioId = localStorage.getItem('active_negocio_id');
  if (activeNegocioId) {
    headers['X-Negocio-Id'] = activeNegocioId;
  }

  const sessionStr = localStorage.getItem('panini_session');
  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr);
      if (session && session.username) {
        headers['X-User-Username'] = session.username;
      }
    } catch (_) {}
  }

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errBody = await response.json();
      if (errBody && errBody.message) errorMessage = errBody.message;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;
  
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
