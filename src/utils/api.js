// API Helper centralizado
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Token y usuario
export const getToken = () => localStorage.getItem('token');
export const getUser = () => {
  try { 
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  } catch { 
    return null; 
  }
};

// Gestión de autenticación
export const setAuth = (result) => {
  // Tu backend retorna accessToken, no jwt
  if (result.accessToken) localStorage.setItem('token', result.accessToken);
  localStorage.setItem('user', JSON.stringify(result));
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Headers para fetch
export const authHeaders = () => ({
  'Authorization': `Bearer ${getToken()}`
});

export const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  ...authHeaders()
});

// Fetch con token automático
export const authFetch = async (path, options = {}) => {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const isFormData = options?.body instanceof FormData;
  
  // Si es FormData, no incluir Content-Type (el navegador lo configura con boundary)
  const headers = isFormData 
    ? { ...authHeaders(), ...options.headers }
    : { ...jsonHeaders(), ...options.headers };
    
  return fetch(url, { ...options, headers });
};