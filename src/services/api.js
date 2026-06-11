import axios from 'axios';

const API_URL = 'https://sjs-backend-new.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userType');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const session = {
  getToken: () => sessionStorage.getItem('token'),
  getUser: () => {
    const user = sessionStorage.getItem('user');
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
  getUserType: () => sessionStorage.getItem('userType'),
  setUser: (user) => sessionStorage.setItem('user', JSON.stringify(user)),
  setUserType: (userType) => sessionStorage.setItem('userType', userType),
  clear: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userType');
  },
  isAuthenticated: () => {
    const token = sessionStorage.getItem('token');
    return !!token;
  }
};

export default api;