import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaUserGraduate, FaUserTie } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/UserContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // If already logged in, stay on home page (don't redirect to dashboard)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isAuthenticated) {
      // Stay on current page, just show user is logged in
      console.log("User already logged in:", user?.name);
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStudentLogin = async () => {
  try {
    const response = await api.post('/api/auth/student/login', {
      email: formData.email,
      password: formData.password
    });
    
    if (response.data.access_token) {
      // Make sure student data includes userType
      const studentData = {
        ...response.data.student,
        userType: 'student',
        role: 'student'
      };
      
      login(response.data.access_token, studentData, 'student');
      toast.success(`Welcome back, ${response.data.student.name}!`);
      
      // Check for return URL
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl');
      if (returnUrl) {
        navigate(decodeURIComponent(returnUrl));
      } else {
        navigate('/dashboard');
      }
    }
  } catch (error) {
    console.error('Student login error:', error);
    if (error.response?.status === 401) {
      toast.error('Invalid email or password');
    } else {
      toast.error('Login failed. Please try again.');
    }
  }
};

  const handleLoginSuccess = (userType) => {
  const urlParams = new URLSearchParams(window.location.search);
  const returnUrl = urlParams.get('returnUrl');
  
  if (returnUrl) {
    navigate(decodeURIComponent(returnUrl));
  } else {
    if (userType === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  }
};

  const handleAdminLogin = async () => {
  try {
    const response = await api.post('/api/auth/admin/login', {
      email: formData.email,
      password: formData.password
    });
    
    if (response.data.access_token) {
      // Make sure admin data includes userType
      const adminData = {
        ...response.data.admin,
        userType: 'admin',
        role: 'admin'
      };
      
      login(response.data.access_token, adminData, 'admin');
      toast.success(`Welcome, ${response.data.admin.full_name || 'Admin'}!`);
      navigate('/admin');
    }
  } catch (error) {
    console.error('Admin login error:', error);
    if (error.response?.status === 401) {
      toast.error('Invalid credentials');
    } else {
      toast.error('Login failed. Please try again.');
    }
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please enter email and password');
      return;
    }
    
    setLoading(true);
    
    if (userType === 'student') {
      await handleStudentLogin();
    } else {
      await handleAdminLogin();
    }
    
    setLoading(false);
  };

  const fillDemoCredentials = () => {
    if (userType === 'student') {
      setFormData({
        email: 'student@example.com',
        password: 'student123'
      });
    } else {
      setFormData({
        email: 'admin@sjsacademy.com',
        password: 'Admin@123'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white text-center">
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-primary-100 mt-2">Login to your account</p>
            </div>

            {/* User Type Toggle */}
            <div className="flex border-b">
              <button
                type="button"
                onClick={() => setUserType('student')}
                className={`flex-1 py-4 text-center font-semibold transition-all duration-300 ${
                  userType === 'student'
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaUserGraduate className="inline mr-2" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setUserType('admin')}
                className={`flex-1 py-4 text-center font-semibold transition-all duration-300 ${
                  userType === 'admin'
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaUserTie className="inline mr-2" />
                Admin
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaLock className="inline mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login →'}
              </button>

              <button
                type="button"
                onClick={fillDemoCredentials}
                className="w-full text-sm text-gray-500 hover:text-primary-600 transition"
              >
                Use Demo Credentials
              </button>
            </form>

            {userType === 'student' && (
              <div className="p-6 text-center border-t">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary-600 font-semibold hover:underline">
                    Register Now
                  </Link>
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;














// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FaEnvelope, FaLock, FaUserGraduate, FaUserTie } from 'react-icons/fa';
// import api from '../services/api';
// import toast from 'react-hot-toast';
// import { useAuth } from '../context/UserContext';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login, isAuthenticated, user } = useAuth();
//   const [userType, setUserType] = useState('student');
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [loading, setLoading] = useState(false);

//   // REMOVED the auto-redirect that was causing issues
//   // Now logged-in users can still see the login page
//   // They will just be able to continue shopping

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleStudentLogin = async () => {
//     try {
//       const response = await api.post('/auth/student/login', {
//         email: formData.email,
//         password: formData.password
//       });
      
//       console.log("Student login response:", response.data);
      
//       if (response.data.success && response.data.access_token) {
//         // Prepare student data
//         const studentData = {
//           id: response.data.student.id,
//           student_id: response.data.student.student_id,
//           name: response.data.student.name,
//           email: response.data.student.email,
//           phone: response.data.student.phone || '',
//           userType: 'student',
//           role: 'student'
//         };
        
//         // Call login from context
//         login(response.data.access_token, studentData, 'student');
        
//         toast.success(`Welcome back, ${response.data.student.name}!`);
        
//         // Check for return URL (important for redirect after login)
//         const urlParams = new URLSearchParams(window.location.search);
//         const returnUrl = urlParams.get('returnUrl');
        
//         if (returnUrl) {
//           navigate(decodeURIComponent(returnUrl));
//         } else {
//           // Check if user was trying to buy a course
//           const pendingPurchase = localStorage.getItem('pendingPurchase');
//           if (pendingPurchase) {
//             localStorage.removeItem('pendingPurchase');
//             navigate('/cart');
//           } else {
//             navigate('/dashboard');
//           }
//         }
//       } else {
//         toast.error(response.data.error || 'Login failed');
//       }
//     } catch (error) {
//       console.error('Student login error:', error);
//       if (error.response?.status === 401) {
//         toast.error('Invalid email or password');
//       } else if (error.response?.data?.error) {
//         toast.error(error.response.data.error);
//       } else {
//         toast.error('Login failed. Please try again.');
//       }
//       throw error;
//     }
//   };

//   const handleAdminLogin = async () => {
//     try {
//       const response = await api.post('/auth/admin/login', {
//         email: formData.email,
//         password: formData.password
//       });
      
//       console.log("Admin login response:", response.data);
      
//       if (response.data.success && response.data.access_token) {
//         // Prepare admin data
//         const adminData = {
//           id: response.data.admin.id,
//           username: response.data.admin.username,
//           name: response.data.admin.full_name,
//           email: response.data.admin.email,
//           role: response.data.admin.role,
//           userType: 'admin'
//         };
        
//         // Call login from context
//         login(response.data.access_token, adminData, 'admin');
        
//         toast.success(`Welcome, ${response.data.admin.full_name || 'Admin'}!`);
//         navigate('/admin');
//       } else {
//         toast.error(response.data.error || 'Login failed');
//       }
//     } catch (error) {
//       console.error('Admin login error:', error);
//       if (error.response?.status === 401) {
//         toast.error('Invalid email or password');
//       } else if (error.response?.data?.error) {
//         toast.error(error.response.data.error);
//       } else {
//         toast.error('Login failed. Please try again.');
//       }
//       throw error;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.email || !formData.password) {
//       toast.error('Please enter email and password');
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       if (userType === 'student') {
//         await handleStudentLogin();
//       } else {
//         await handleAdminLogin();
//       }
//     } catch (error) {
//       console.log("Login error caught:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fillDemoCredentials = () => {
//     if (userType === 'student') {
//       setFormData({
//         email: 'student@example.com',
//         password: 'student123'
//       });
//     } else {
//       setFormData({
//         email: 'admin@sjsacademy.com',
//         password: 'Admin@123'
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-16">
//       <div className="container mx-auto px-4">
//         <div className="max-w-md mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="bg-white rounded-2xl shadow-2xl overflow-hidden"
//           >
//             <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white text-center">
//               <h1 className="text-2xl font-bold">Welcome Back</h1>
//               <p className="text-primary-100 mt-2">Login to your account</p>
//             </div>

//             {/* User Type Toggle */}
//             <div className="flex border-b">
//               <button
//                 type="button"
//                 onClick={() => setUserType('student')}
//                 className={`flex-1 py-4 text-center font-semibold transition-all duration-300 ${
//                   userType === 'student'
//                     ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 <FaUserGraduate className="inline mr-2" />
//                 Student
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setUserType('admin')}
//                 className={`flex-1 py-4 text-center font-semibold transition-all duration-300 ${
//                   userType === 'admin'
//                     ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 <FaUserTie className="inline mr-2" />
//                 Admin
//               </button>
//             </div>

//             {/* Show message if already logged in */}
//             {isAuthenticated && user && (
//               <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4">
//                 <div className="flex">
//                   <div className="flex-shrink-0">
//                     <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm text-yellow-700">
//                       You are already logged in as <strong>{user.name}</strong>. 
//                       <Link to="/courses" className="ml-2 font-semibold underline text-yellow-700 hover:text-yellow-600">
//                         Continue shopping →
//                       </Link>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Login Form */}
//             <form onSubmit={handleSubmit} className="p-8 space-y-6">
//               <div>
//                 <label className="block text-gray-700 font-semibold mb-2">
//                   <FaEnvelope className="inline mr-2" />
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
//                   placeholder="Enter your email"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-semibold mb-2">
//                   <FaLock className="inline mr-2" />
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
//                   placeholder="Enter your password"
//                 />
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="flex items-center">
//                   <input type="checkbox" className="mr-2" />
//                   <span className="text-sm text-gray-600">Remember me</span>
//                 </label>
//                 <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
//                   Forgot Password?
//                 </Link>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <div className="flex items-center justify-center">
//                     <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                     </svg>
//                     Logging in...
//                   </div>
//                 ) : (
//                   'Login →'
//                 )}
//               </button>

//               <button
//                 type="button"
//                 onClick={fillDemoCredentials}
//                 className="w-full text-sm text-gray-500 hover:text-primary-600 transition"
//               >
//                 Use Demo Credentials
//               </button>
//             </form>

//             {userType === 'student' && (
//               <div className="p-6 text-center border-t">
//                 <p className="text-gray-600">
//                   Don't have an account?{' '}
//                   <Link to="/register" className="text-primary-600 font-semibold hover:underline">
//                     Register Now
//                   </Link>
//                 </p>
//               </div>
//             )}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;