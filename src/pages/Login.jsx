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
import { FaEnvelope, FaLock, FaUserGraduate, FaUserTie, FaPhone, FaKey, FaArrowLeft } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/UserContext';

const YOUR_ADMIN_PHONE = "+91850026639"; // Admin's phone number

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [userType, setUserType] = useState('student');
  const [step, setStep] = useState('credentials'); // 'credentials', 'verify'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    code: ''
  });
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [tempToken, setTempToken] = useState(null);

  // If already logged in, stay on home page
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isAuthenticated) {
      console.log("User already logged in:", user?.name);
    }
  }, [isAuthenticated, user]);

  // Resend timer countdown
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendVerificationCode = async (phone, type) => {
    try {
      const response = await api.post('/auth/send-verification-code', {
        phone: phone,
        user_type: type
      });
      
      if (response.data.success) {
        toast.success(`Verification code sent to ${phone}`);
        setResendTimer(60);
        setTempToken(response.data.temp_token);
        return true;
      } else {
        toast.error(response.data.error || 'Failed to send code');
        return false;
      }
    } catch (error) {
      console.error('Send code error:', error);
      toast.error(error.response?.data?.error || 'Failed to send verification code');
      return false;
    }
  };

  const verifyCode = async (phone, code, tempToken) => {
    try {
      const response = await api.post('/auth/verify-code', {
        phone: phone,
        code: code,
        temp_token: tempToken
      });
      
      return response.data.success;
    } catch (error) {
      console.error('Verify code error:', error);
      toast.error(error.response?.data?.error || 'Invalid verification code');
      return false;
    }
  };

  const handleStudentLogin = async () => {
    try {
      // First, authenticate with email and password
      const response = await api.post('/auth/student/login', {
        email: formData.email,
        password: formData.password
      });
      
      if (response.data.access_token) {
        // Get student's phone number from the response
        const studentPhone = response.data.student?.phone;
        
        if (!studentPhone) {
          toast.error('No phone number registered. Please contact support.');
          return false;
        }
        
        // Store temp data
        setTempToken(response.data.access_token);
        setFormData(prev => ({ ...prev, phone: studentPhone }));
        
        // Send verification code
        const codeSent = await sendVerificationCode(studentPhone, 'student');
        
        if (codeSent) {
          toast.success(`Verification code sent to ${studentPhone}`);
          setStep('verify');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Student login error:', error);
      if (error.response?.status === 401) {
        toast.error('Invalid email or password');
      } else {
        toast.error('Login failed. Please try again.');
      }
      return false;
    }
  };

  const handleAdminLogin = async () => {
    try {
      // Admin login - just verify with phone and code
      const adminPhone = formData.phone;
      
      if (!adminPhone) {
        toast.error('Please enter phone number');
        return false;
      }
      
      // Send verification code
      const codeSent = await sendVerificationCode(adminPhone, 'admin');
      
      if (codeSent) {
        setStep('verify');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Failed to send verification code');
      return false;
    }
  };

  const handleVerifyAndLogin = async () => {
    if (!formData.code || formData.code.length !== 6) {
      toast.error('Please enter 6-digit verification code');
      return;
    }

    setLoading(true);
    
    try {
      const isVerified = await verifyCode(formData.phone, formData.code, tempToken);
      
      if (isVerified) {
        if (userType === 'student') {
          // Complete student login
          const response = await api.post('/auth/student/login', {
            email: formData.email,
            password: formData.password
          });
          
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
        } else {
          // Complete admin login
          const adminData = {
            id: 1,
            name: 'Admin',
            email: 'admin@sjsacademy.com',
            phone: formData.phone,
            userType: 'admin',
            role: 'admin'
          };
          
          const tempAdminToken = jwt.encode(
            { id: 1, role: 'admin', email: 'admin@sjsacademy.com', phone: formData.phone },
            'sjs-academy-secret-key',
            { expiresIn: '30d' }
          );
          
          login(tempAdminToken, adminData, 'admin');
          toast.success('Welcome Admin!');
          navigate('/admin');
        }
      } else {
        toast.error('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
    await sendVerificationCode(formData.phone, userType);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 'verify') {
      await handleVerifyAndLogin();
      return;
    }
    
    if (userType === 'student') {
      if (!formData.email || !formData.password) {
        toast.error('Please enter email and password');
        return;
      }
    } else {
      if (!formData.phone) {
        toast.error('Please enter phone number');
        return;
      }
    }
    
    setLoading(true);
    
    if (userType === 'student') {
      await handleStudentLogin();
    } else {
      await handleAdminLogin();
    }
    
    setLoading(false);
  };

  const handleBackToCredentials = () => {
    setStep('credentials');
    setFormData(prev => ({ ...prev, code: '' }));
    setTempToken(null);
  };

  const fillDemoCredentials = () => {
    if (userType === 'student') {
      setFormData({
        email: 'student@example.com',
        password: 'student123',
        phone: '',
        code: ''
      });
    } else {
      setFormData({
        email: '',
        password: '',
        phone: '+91850026639',
        code: ''
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
              <p className="text-primary-100 mt-2">
                {step === 'credentials' 
                  ? 'Login to your account' 
                  : 'Enter verification code'}
              </p>
            </div>

            {/* User Type Toggle (only show on credentials step) */}
            {step === 'credentials' && (
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
            )}

            {/* Back Button for verification step */}
            {step === 'verify' && (
              <button
                onClick={handleBackToCredentials}
                className="flex items-center gap-2 text-primary-600 px-4 pt-4 hover:text-primary-700 transition"
              >
                <FaArrowLeft /> Back
              </button>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {step === 'credentials' && (
                <>
                  {userType === 'student' ? (
                    <>
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
                    </>
                  ) : (
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        <FaPhone className="inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                        placeholder="Enter your phone number"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        We'll send a verification code to this number
                      </p>
                    </div>
                  )}
                </>
              )}

              {step === 'verify' && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <FaKey className="inline mr-2" />
                    Verification Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    maxLength={6}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-center text-2xl tracking-widest"
                    placeholder="Enter 6-digit code"
                  />
                  <div className="mt-3 text-center">
                    {resendTimer > 0 ? (
                      <span className="text-sm text-gray-500">
                        Resend code in {resendTimer} seconds
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendCode}
                        className="text-sm text-primary-600 hover:text-primary-700 transition"
                      >
                        Resend verification code
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Verification code sent to {formData.phone}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                {step === 'credentials' && (
                  <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                    Forgot Password?
                  </Link>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? (
                  'Processing...'
                ) : step === 'credentials' ? (
                  userType === 'student' ? 'Login →' : 'Send Verification Code →'
                ) : (
                  'Verify & Login →'
                )}
              </button>

              <button
                type="button"
                onClick={fillDemoCredentials}
                className="w-full text-sm text-gray-500 hover:text-primary-600 transition"
              >
                Use Demo Credentials
              </button>
            </form>

            {step === 'credentials' && userType === 'student' && (
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