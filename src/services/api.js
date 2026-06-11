// import axios from 'axios';

// const API_URL = 'https://sjs-backend-new.onrender.com';

// const api = axios.create({
//   baseURL: API_URL,
//   timeout: 60000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   }
// });

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       sessionStorage.removeItem('token');
//       sessionStorage.removeItem('user');
//       sessionStorage.removeItem('userType');
//       if (!window.location.pathname.includes('/login')) {
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export const session = {
//   getToken: () => sessionStorage.getItem('token'),
//   getUser: () => {
//     const user = sessionStorage.getItem('user');
//     try {
//       return user ? JSON.parse(user) : null;
//     } catch {
//       return null;
//     }
//   },
//   getUserType: () => sessionStorage.getItem('userType'),
//   setUser: (user) => sessionStorage.setItem('user', JSON.stringify(user)),
//   setUserType: (userType) => sessionStorage.setItem('userType', userType),
//   clear: () => {
//     sessionStorage.removeItem('token');
//     sessionStorage.removeItem('user');
//     sessionStorage.removeItem('userType');
//   },
//   isAuthenticated: () => {
//     const token = sessionStorage.getItem('token');
//     return !!token;
//   }
// };

// export default api;


import axios from 'axios';

const API_URL = 'https://sjs-backend-new.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Helper functions for persistent storage
const storage = {
  // Get item from localStorage (preferred) or sessionStorage
  get: (key) => {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  },
  // Set item in BOTH storages for persistence
  set: (key, value) => {
    localStorage.setItem(key, value);
    sessionStorage.setItem(key, value);
  },
  // Remove from both storages
  remove: (key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
  // Clear all auth data
  clear: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userType');
  }
};

// Request interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = storage.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`API Response ${response.status}: ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('Unauthorized! Clearing session...');
      storage.clear();
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Backend might be down');
    }
    
    return Promise.reject(error);
  }
);

// Session management object
export const session = {
  // Get token from storage
  getToken: () => storage.get('token'),
  
  // Get user from storage
  getUser: () => {
    const user = storage.get('user');
    if (!user) return null;
    try {
      return typeof user === 'string' ? JSON.parse(user) : user;
    } catch {
      return null;
    }
  },
  
  // Get user type from storage
  getUserType: () => storage.get('userType'),
  
  // Set user data (stores in both localStorage and sessionStorage)
  setUser: (user) => {
    const userStr = typeof user === 'string' ? user : JSON.stringify(user);
    storage.set('user', userStr);
  },
  
  // Set user type
  setUserType: (userType) => {
    storage.set('userType', userType);
  },
  
  // Set token
  setToken: (token) => {
    storage.set('token', token);
  },
  
  // Set all auth data at once
  setAuth: (token, user, userType) => {
    storage.set('token', token);
    storage.set('user', JSON.stringify(user));
    storage.set('userType', userType);
    
    // Also set axios header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  
  // Clear all auth data
  clear: () => {
    storage.clear();
    delete api.defaults.headers.common['Authorization'];
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = storage.get('token');
    return !!token;
  },
  
  // Check if user is student
  isStudent: () => {
    const userType = storage.get('userType');
    return userType === 'student';
  },
  
  // Check if user is admin
  isAdmin: () => {
    const userType = storage.get('userType');
    return userType === 'admin';
  }
};

// Initialize axios headers on app load
const token = storage.get('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;