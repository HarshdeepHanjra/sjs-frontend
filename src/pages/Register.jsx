// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FaUser, FaEnvelope, FaPhone, FaLock, FaCheckCircle } from 'react-icons/fa';
// import api from '../services/api';
// import toast from 'react-hot-toast';

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [passwordMatch, setPasswordMatch] = useState(true);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
    
//     if (name === 'password' || name === 'confirmPassword') {
//       setPasswordMatch(
//         name === 'password' 
//           ? value === formData.confirmPassword
//           : formData.password === value
//       );
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (formData.password !== formData.confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }
    
//     if (formData.password.length < 6) {
//       toast.error('Password must be at least 6 characters');
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       const response = await api.post('/auth/student/register', {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password
//       });
      
//       console.log('Registration response:', response.data);
      
//       if (response.data.success) {
//         toast.success('Registration successful! Please login.');
//         setTimeout(() => navigate('/login'), 2000);
//       } else {
//         toast.error(response.data.error || 'Registration failed');
//       }
//     } catch (error) {
//       console.error('Registration error:', error);
      
//       if (error.response?.status === 400) {
//         toast.error(error.response.data?.error || 'Invalid input');
//       } else if (error.response?.status === 409) {
//         toast.error('Email already registered. Please login instead.');
//       } else if (error.code === 'ERR_NETWORK') {
//         toast.error('Cannot connect to server. Please make sure backend is running.');
//       } else {
//         toast.error(error.response?.data?.error || 'Registration failed. Please try again.');
//       }
//     } finally {
//       setLoading(false);
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
//               <h1 className="text-2xl font-bold">Create Account</h1>
//               <p className="text-primary-100 mt-2">Join SJS Global Tech Academy</p>
//             </div>

//             <form onSubmit={handleSubmit} className="p-8 space-y-4">
//               <div>
//                 <label className="block text-gray-700 font-semibold mb-2">
//                   <FaUser className="inline mr-2" />
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   placeholder="Enter your full name"
//                 />
//               </div>

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
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   placeholder="Enter your email"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-semibold mb-2">
//                   <FaPhone className="inline mr-2" />
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   placeholder="Enter your phone number"
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
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   placeholder="Create a password (min 6 characters)"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-semibold mb-2">
//                   <FaLock className="inline mr-2" />
//                   Confirm Password
//                 </label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   required
//                   className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
//                     !passwordMatch && formData.confirmPassword ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="Confirm your password"
//                 />
//                 {!passwordMatch && formData.confirmPassword && (
//                   <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading || !passwordMatch}
//                 className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50"
//               >
//                 {loading ? 'Creating Account...' : 'Register Now →'}
//               </button>
//             </form>

//             <div className="p-4 text-center">
//               <p className="text-gray-600">
//                 Already have an account?{' '}
//                 <Link to="/login" className="text-primary-600 font-semibold hover:underline">
//                   Login here
//                 </Link>
//               </p>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;



import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCheckCircle } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordMatch(
        name === 'password' 
          ? value === formData.confirmPassword
          : formData.password === value
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/auth/student/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      if (response.data.success) {
        toast.success('Registration successful! Please login.');
        // Redirect to login page, not dashboard
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(response.data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
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
              <h1 className="text-2xl font-bold">Create Account</h1>
              <p className="text-primary-100 mt-2">Join SJS Global Tech Academy</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaUser className="inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your full name"
                />
              </div>

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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your email"
                />
              </div>

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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your phone number"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Create a password (min 6 characters)"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaLock className="inline mr-2" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    !passwordMatch && formData.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                {!passwordMatch && formData.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !passwordMatch}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Register Now →'}
              </button>
            </form>

            <div className="p-4 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;