export const getToken = () => localStorage.getItem('veriflow_token');
export const setToken = (token) => localStorage.setItem('veriflow_token', token);
export const removeToken = () => localStorage.removeItem('veriflow_token');

export const apiFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch (e) {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }
  
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

export const authAPI = {
  signup: (email, password, name) => 
    apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    }),
  login: (email, password) => 
    apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  me: () => 
    apiFetch('/api/auth/me')
};

export const documentsAPI = {
  list: () => apiFetch('/api/documents'),
  create: () => apiFetch('/api/documents', { method: 'POST' }),
  get: (id) => apiFetch(`/api/documents/${id}`),
  update: (id, data) => 
    apiFetch(`/api/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  delete: (id) => 
    apiFetch(`/api/documents/${id}`, { method: 'DELETE' }),
  submit: (id) => 
    apiFetch(`/api/documents/${id}/submit`, { method: 'POST' })
};

export const submissionsAPI = {
  list: () => apiFetch('/api/submissions'),
  get: (id) => apiFetch(`/api/submissions/${id}`)
};
