// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// const api = axios.create({
//   baseURL: `${API_BASE_URL}/api`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 15000,
// });

// // Request interceptor - Add token to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       console.log(`✅ Token attached to ${config.method?.toUpperCase()} ${config.url}`);
//     } else {
//       console.log(`⚠️ No token for ${config.method?.toUpperCase()} ${config.url}`);
//     }
//     return config;
//   },
//   (error) => {
//     console.error('Request interceptor error:', error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor - Handle errors
// api.interceptors.response.use(
//   (response) => {
//     console.log(`✅ Response: ${response.status} ${response.config.url}`);
//     return response;
//   },
//   (error) => {
//     console.error('Response error:', error.response?.status, error.response?.data);
    
//     if (error.response?.status === 401) {
//       localStorage.clear();
//       window.location.href = '/login';
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default api;


// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// const api = axios.create({
//   baseURL: `${API_BASE_URL}/api`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 15000,
// });

// // Helper functions for sessionStorage
// const getSessionItem = (key) => {
//   return sessionStorage.getItem(key);
// };

// const setSessionItem = (key, value) => {
//   sessionStorage.setItem(key, value);
// };

// const removeSessionItem = (key) => {
//   sessionStorage.removeItem(key);
// };

// const clearSession = () => {
//   sessionStorage.clear();
// };

// // Request interceptor - Add token to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = getSessionItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     console.error('Request interceptor error:', error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor - Handle errors
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     const originalRequest = error.config;
//     const status = error.response?.status;
//     const path = originalRequest?.url;
    
//     // Public endpoints that don't require auth
//     const publicEndpoints = [
//       '/auth/student/login',
//       '/auth/admin/login', 
//       '/auth/student/register',
//       '/courses',
//       '/test',
//       '/'
//     ];
    
//     const isPublicEndpoint = publicEndpoints.some(endpoint => path?.includes(endpoint));
    
//     // Handle 401 errors - Token expired or invalid
//     if (status === 401 && !isPublicEndpoint && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       const token = getSessionItem('token');
      
//       if (token) {
//         console.warn('Token invalid/expired for this tab');
//         clearSession();
        
//         // Only redirect if not already on login page
//         if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
//           window.location.href = '/login';
//         }
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// Export sessionStorage helpers
// export const session = {
//   setToken: (token) => setSessionItem('token', token),
//   getToken: () => getSessionItem('token'),
//   setUser: (user) => setSessionItem('userData', JSON.stringify(user)),
//   getUser: () => {
//     const userData = getSessionItem('userData');
//     return userData ? JSON.parse(userData) : null;
//   },
//   setUserType: (type) => setSessionItem('userType', type),
//   getUserType: () => getSessionItem('userType'),
//   clear: () => clearSession(),
//   isAuthenticated: () => {
//     const token = getSessionItem('token');
//     const userType = getSessionItem('userType');
//     return !!token && !!userType;
//   }
// };

// export default api;














import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true  // Add this
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url} - Auth header set`);
    } else {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url} - No auth token`);
    }
    
    // Log for debugging
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Make sure backend is running on port 5000');
    }
    
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config.url?.includes('/auth/');
      
      if (!isAuthEndpoint && !error.config.url?.includes('/verify-token')) {
        console.log('401 Unauthorized - Clearing auth data');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Session management
export const session = {
  getToken: () => localStorage.getItem('token'),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  getUserType: () => localStorage.getItem('userType'),
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  setUserType: (userType) => localStorage.setItem('userType', userType),
  clear: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  },
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  }
};

export default api;