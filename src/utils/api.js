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
  const t = result?.accessToken || result?.token || result?.jwt;
  if (t) localStorage.setItem('token', t);
  localStorage.setItem('user', JSON.stringify(result));
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Headers para fetch
export const authHeaders = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  ...authHeaders(),
});

// Fetch con token automático
export const authFetch = async (path, options = {}) => {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const isFormData = options?.body instanceof FormData;

  const headers = isFormData
    ? { ...authHeaders(), ...(options.headers || {}) }
    : { ...jsonHeaders(), ...(options.headers || {}) };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    clearAuth();
  }
  return res;
};