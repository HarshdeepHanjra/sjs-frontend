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
//     const token = localStorage.getItem('token');
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
//         navigate('/dashboard');
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
//       navigate('/dashboard');
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
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaUserGraduate, FaUserTie, FaPhone, FaKey } from 'react-icons/fa';
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
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [pendingLoginData, setPendingLoginData] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isAuthenticated) {
      console.log("User already logged in:", user?.name);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStudentLogin = async () => {
    try {
      const response = await api.post('/auth/student/login', {
        email: formData.email,
        password: formData.password
      });
      
      console.log("Student login response:", response.data);
      
      if (response.data.requires_otp) {
        setStudentId(response.data.student_id);
        setShowOtpModal(true);
        setTimer(60);
        toast.success(response.data.message);
        return;
      }
      
      if (response.data.access_token) {
        const studentData = {
          ...response.data.student,
          userType: 'student',
          role: 'student'
        };
        
        login(response.data.access_token, studentData, 'student');
        toast.success(`Welcome back, ${response.data.student.name}!`);
        
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

  const handleAdminLogin = async () => {
    try {
      const response = await api.post('/auth/admin/login', {
        email: formData.email,
        password: formData.password
      });
      
      console.log("Admin login response:", response.data);
      
      if (response.data.requires_otp) {
        setAdminId(response.data.admin_id);
        setShowOtpModal(true);
        setTimer(60);
        toast.success(response.data.message);
        return;
      }
      
      if (response.data.access_token) {
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

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter 6-digit OTP');
      return;
    }

    setOtpSending(true);
    try {
      let response;
      if (userType === 'student') {
        response = await api.post('/auth/verify-otp', {
          student_id: studentId,
          otp: otp
        });
      } else {
        response = await api.post('/auth/verify-otp', {
          admin_id: adminId,
          otp: otp
        });
      }

      if (response.data.verified) {
        toast.success('OTP verified successfully!');
        setShowOtpModal(false);
        setOtp('');
        
        // Complete login after OTP verification
        if (userType === 'student') {
          const loginResponse = await api.post('/auth/student/login', {
            email: formData.email,
            password: formData.password,
            is_otp_verified: true,
            otp: otp
          });
          
          if (loginResponse.data.access_token) {
            const studentData = {
              ...loginResponse.data.student,
              userType: 'student',
              role: 'student'
            };
            login(loginResponse.data.access_token, studentData, 'student');
            toast.success(`Welcome back, ${loginResponse.data.student.name}!`);
            navigate('/dashboard');
          }
        } else {
          const loginResponse = await api.post('/auth/admin/login', {
            email: formData.email,
            password: formData.password,
            is_otp_verified: true,
            otp: otp
          });
          
          if (loginResponse.data.access_token) {
            const adminData = {
              ...loginResponse.data.admin,
              userType: 'admin',
              role: 'admin'
            };
            login(loginResponse.data.access_token, adminData, 'admin');
            toast.success(`Welcome, ${loginResponse.data.admin.full_name || 'Admin'}!`);
            navigate('/admin');
          }
        }
      } else {
        toast.error(response.data.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Failed to verify OTP');
    } finally {
      setOtpSending(false);
    }
  };

  const handleResendOtp = async () => {
    setTimer(60);
    if (userType === 'student') {
      await api.post('/auth/student/login', {
        email: formData.email,
        password: formData.password
      });
    } else {
      await api.post('/auth/admin/login', {
        email: formData.email,
        password: formData.password
      });
    }
    toast.success('OTP resent successfully!');
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

                {/* <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="w-full text-sm text-gray-500 hover:text-primary-600 transition"
                >
                  Use Demo Credentials
                </button> */}
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
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPhone className="text-2xl text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Enter OTP</h3>
                <p className="text-gray-500 text-sm mt-2">
                  Please enter the 6-digit OTP sent to your registered mobile number
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <FaKey className="inline mr-2" />
                  OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="000000"
                />
              </div>

              <div className="flex justify-between items-center mt-4 mb-6">
                <button
                  onClick={handleResendOtp}
                  disabled={timer > 0}
                  className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
                >
                  {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                </button>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={otpSending}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
              >
                {otpSending ? 'Verifying...' : 'Verify & Login →'}
              </button>

              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp('');
                }}
                className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;