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

//   // If already logged in, stay on home page (don't redirect to dashboard)
//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (token && isAuthenticated) {
//       // Stay on current page, just show user is logged in
//       console.log("User already logged in:", user?.name);
//     }
//   }, [isAuthenticated, user]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleStudentLogin = async () => {
//   try {
//     const response = await api.post('/api/auth/student/login', {
//       email: formData.email,
//       password: formData.password
//     });
    
//     if (response.data.access_token) {
//       // Make sure student data includes userType
//       const studentData = {
//         ...response.data.student,
//         userType: 'student',
//         role: 'student'
//       };
      
//       login(response.data.access_token, studentData, 'student');
//       toast.success(`Welcome back, ${response.data.student.name}!`);
      
//       // Check for return URL
//       const urlParams = new URLSearchParams(window.location.search);
//       const returnUrl = urlParams.get('returnUrl');
//       if (returnUrl) {
//         navigate(decodeURIComponent(returnUrl));
//       } else {
//         navigate('/home');
//       }
//     }
//   } catch (error) {
//     console.error('Student login error:', error);
//     if (error.response?.status === 401) {
//       toast.error('Invalid email or password');
//     } else {
//       toast.error('Login failed. Please try again.');
//     }
//   }
// };

//   const handleLoginSuccess = (userType) => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const returnUrl = urlParams.get('returnUrl');
  
//   if (returnUrl) {
//     navigate(decodeURIComponent(returnUrl));
//   } else {
//     if (userType === 'admin') {
//       navigate('/admin');
//     } else {
//       navigate('/home');
//     }
//   }
// };

//   const handleAdminLogin = async () => {
//   try {
//     const response = await api.post('/api/auth/admin/login', {
//   email: formData.email,
//   password: formData.password
// });
    
//     if (response.data.access_token) {
//       // Make sure admin data includes userType
//       const adminData = {
//         ...response.data.admin,
//         userType: 'admin',
//         role: 'admin'
//       };
      
//       login(response.data.access_token, adminData, 'admin');
//       toast.success(`Welcome, ${response.data.admin.full_name || 'Admin'}!`);
//       navigate('/admin');
//     }
//   } catch (error) {
//     console.error('Admin login error:', error);
//     if (error.response?.status === 401) {
//       toast.error('Invalid credentials');
//     } else {
//       toast.error('Login failed. Please try again.');
//     }
//   }
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.email || !formData.password) {
//       toast.error('Please enter email and password');
//       return;
//     }
    
//     setLoading(true);
    
//     if (userType === 'student') {
//       await handleStudentLogin();
//     } else {
//       await handleAdminLogin();
//     }
    
//     setLoading(false);
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
//                 className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50"
//               >
//                 {loading ? 'Logging in...' : 'Login →'}
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





import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaUserGraduate, FaUserTie, FaTimes, FaClock } from 'react-icons/fa';
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
  
  // OTP Modal States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [timer, setTimer] = useState(0);
  const [otpSending, setOtpSending] = useState(false);

  // Timer effect for OTP resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // If already logged in, stay on home page (don't redirect to dashboard)
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token && isAuthenticated) {
      // Stay on current page, just show user is logged in
      console.log("User already logged in:", user?.name);
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  // Update handleStudentLogin function in Login.jsx

// Update handleStudentLogin function

// const handleStudentLogin = async () => {
//   try {
//     setLoading(true);
//     const response = await api.post('/api/auth/student/login', {
//       email: formData.email,
//       password: formData.password
//     });
    
//     console.log('Student login response:', response.data);
    
//     if (response.data.access_token) {
//       const studentData = {
//         ...response.data.student,
//         userType: 'student',
//         role: 'student'
//       };
      
//       // Login the user
//       login(response.data.access_token, studentData, 'student');
//       toast.success(`Welcome back, ${response.data.student.name}!`);
      
//       // ✅ Redirect to DASHBOARD (not home page)
//       navigate('/dashboard');
//     }
//   } catch (error) {
//     console.error('Student login error:', error);
//     toast.error(
//       error.response?.data?.error ||
//       error.response?.data?.message ||
//       'Login failed'
//     );
//   } finally {
//     setLoading(false);
//   }

  // Login.jsx - handleStudentLogin me CORS handling

const handleStudentLogin = async () => {
  try {
    setLoading(true);
    
    console.log('📤 Sending login request to:', `${api.defaults.baseURL}/api/auth/student/login`);
    
    const response = await api.post('/api/auth/student/login', {
      email: formData.email,
      password: formData.password
    });
    
    console.log('📥 Login response:', response.data);
    
    if (response.data.access_token) {
      const studentData = {
        ...response.data.student,
        userType: 'student',
        role: 'student'
      };
      
      login(response.data.access_token, studentData, 'student');
      toast.success(`Welcome back, ${response.data.student.name}!`);
      navigate('/dashboard');
    }
  } catch (error) {
    console.error('❌ Student login error:', error);
    console.error('❌ Error config:', error.config);
    console.error('❌ Error response:', error.response);
    
    // ✅ CORS specific error
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      toast.error('Connection issue. Please check if backend is running.');
      // ✅ Try direct URL as fallback
      try {
        console.log('🔄 Retrying with direct URL...');
        const directResponse = await axios.post(
          'https://sjs-backend-new.onrender.com/api/auth/student/login',
          {
            email: formData.email,
            password: formData.password
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        console.log('📥 Direct response:', directResponse.data);
        // Handle response...
      } catch (retryError) {
        console.error('❌ Retry failed:', retryError);
        toast.error('Server not responding. Please try again later.');
      }
    } else if (error.response?.status === 401) {
      toast.error(error.response?.data?.error || 'Invalid credentials');
    } else {
      toast.error(error.response?.data?.error || 'Login failed. Please try again.');
    }
  } finally {
    setLoading(false);
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
    console.log("🔄 Admin login attempt with:", { 
      email: formData.email,
      password: formData.password 
    });
    
    const response = await api.post('/api/auth/admin/login', {
      email: formData.email,
      password: formData.password
    });
    
    console.log("📥 Admin login response:", response.data);
    console.log("📥 requires_otp:", response.data?.requires_otp);
    console.log("📥 session_id:", response.data?.session_id);
    
    if (response.data && response.data.requires_otp === true) {
      console.log("✅ OTP Required - Opening Modal");
      setSessionId(response.data.session_id);
      setShowOtpModal(true);
      setTimer(60);
      toast.success(response.data.message || 'OTP sent to your email');
      return;
    }
    
    if (response.data && response.data.access_token) {
      console.log("✅ Admin login successful");
      const adminData = {
        ...response.data.admin,
        userType: 'admin',
        role: 'admin'
      };
      
      login(response.data.access_token, adminData, 'admin');
      toast.success(`Welcome, ${response.data.admin?.full_name || 'Admin'}!`);
      navigate('/admin');
    } else {
      console.log("⚠️ Unexpected response format:", response.data);
      toast.error('Unexpected response from server');
    }
  } catch (error) {
    console.error('❌ Admin login error:', error);
    console.error('❌ Error response:', error.response);
    console.error('❌ Error status:', error.response?.status);
    console.error('❌ Error data:', error.response?.data);
    
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      toast.error('Request timeout. Please try again.');
    } else if (error.response?.status === 401) {
      toast.error(error.response?.data?.error || 'Invalid credentials');
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error('Login failed. Please try again.');
    }
  }
};

// New function for OTP verification
const handleVerifyOtp = async () => {
  if (!otp || otp.length !== 6) {
    toast.error('Please enter 6-digit OTP');
    return;
  }

  setOtpSending(true);
  try {
    const endpoint = userType === 'student' ? '/api/auth/student/login' : '/api/auth/admin/login';
    
    console.log('🔍 Verifying OTP with:', {
      email: formData.email,
      session_id: sessionId,
      otp_length: otp.length
    });
    
    const response = await api.post(endpoint, {
      email: formData.email,
      password: formData.password,
      otp: otp,
      session_id: sessionId
    });

    console.log('📥 OTP verification response:', response.data);

    if (response.data && response.data.access_token) {
      toast.success('Login successful!');
      setShowOtpModal(false);
      setOtp('');
      
      if (userType === 'student') {
        const studentData = {
          ...response.data.student,
          userType: 'student',
          role: 'student'
        };
        login(response.data.access_token, studentData, 'student');
        
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('returnUrl');
        if (returnUrl) {
          navigate(decodeURIComponent(returnUrl));
        } else {
          navigate('/home');
        }
      } else {
        const adminData = {
          ...response.data.admin,
          userType: 'admin',
          role: 'admin'
        };
        login(response.data.access_token, adminData, 'admin');
        navigate('/admin');
      }
    } else {
      toast.error(response.data?.error || 'Verification failed');
    }
  } catch (error) {
    console.error('❌ OTP verification error - Full details:', error);
    console.error('❌ Error response:', error.response);
    console.error('❌ Error status:', error.response?.status);
    console.error('❌ Error data:', error.response?.data);
    
    // Better error messages
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      toast.error('Request timeout. Please try again.');
    } else if (error.response?.status === 401) {
      toast.error(error.response?.data?.error || 'Invalid or expired OTP');
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again.');
      console.error('Server error details:', error.response?.data);
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Network error. Check your connection.');
    } else {
      toast.error(error.response?.data?.error || 'Verification failed. Please try again.');
    }
  } finally {
    setOtpSending(false);
  }
};

  // New function for resending OTP
  const handleResendOtp = async () => {
    if (timer > 0) {
      toast.error(`Please wait ${timer} seconds before resending`);
      return;
    }
    
    setTimer(60);
    try {
      const response = await api.post('/api/auth/resend-otp', {
        session_id: sessionId,
        user_type: userType
      });
      if (response.data.success) {
        toast.success('OTP resent successfully!');
      }
    } catch (error) {
      toast.error('Failed to resend OTP');
      setTimer(0);
    }
  };

  // Close modal function
  const handleCloseModal = () => {
    setShowOtpModal(false);
    setOtp('');
    setSessionId(null);
    setTimer(0);
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

  return (
    <>
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

      {/* OTP Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white relative">
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition"
                >
                  <FaTimes size={20} />
                </button>
                <h2 className="text-2xl font-bold text-center">Email Verification</h2>
                <p className="text-primary-100 text-center mt-2">
                  Enter the OTP sent to your email
                </p>
              </div>

              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
                    <FaEnvelope className="text-primary-600 text-3xl" />
                  </div>
                  <p className="text-gray-600">
                    We've sent a 6-digit verification code to<br />
                    <strong className="text-gray-900">
                      {userType === 'student' ? formData.email : 'harshdeephanjra22@gmail.com'}
                    </strong>
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2 text-center">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    maxLength="6"
                    className="w-full text-center text-2xl font-mono tracking-wider px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="000000"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-gray-600">
                    <FaClock className="mr-2" />
                    <span>
                      {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                    </span>
                  </div>
                  <button
                    onClick={handleResendOtp}
                    disabled={timer > 0}
                    className={`text-sm font-semibold transition ${
                      timer > 0 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-primary-600 hover:text-primary-700'
                    }`}
                  >
                    Resend OTP
                  </button>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={otpSending || !otp || otp.length !== 6}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition duration-300 disabled:opacity-50"
                >
                  {otpSending ? 'Verifying...' : 'Verify & Login'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Login;