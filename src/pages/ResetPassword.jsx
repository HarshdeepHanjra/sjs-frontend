import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaArrowLeft, FaSpinner, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    if (!token) {
      setValidToken(false);
      setVerifying(false);
      return;
    }

    try {
      const response = await api.get(`/auth/verify-reset-token?token=${token}`);
      setValidToken(response.data.valid);
    } catch (error) {
      console.error('Token verification error:', error);
      setValidToken(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        new_password: password
      });
      
      if (response.data.success) {
        setSubmitted(true);
        toast.success('Password reset successfully!');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        toast.error(response.data.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="container mx-auto px-4 flex justify-center">
          <FaSpinner className="animate-spin text-4xl text-primary-600" />
        </div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white text-center">
                <h1 className="text-2xl font-bold">Invalid Link</h1>
              </div>
              <div className="p-8 text-center">
                <p className="text-gray-600 mb-6">
                  This password reset link is invalid or has expired.
                </p>
                <Link to="/forgot-password">
                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition">
                    Request New Reset Link
                  </button>
                </Link>
                <Link to="/login">
                  <button className="w-full mt-3 text-gray-600 hover:text-primary-600 transition">
                    Back to Login
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white text-center">
                <FaCheckCircle className="text-5xl mx-auto mb-3" />
                <h1 className="text-2xl font-bold">Password Reset!</h1>
              </div>
              <div className="p-8 text-center">
                <p className="text-gray-600 mb-6">
                  Your password has been reset successfully.
                </p>
                <Link to="/login">
                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition">
                    Login Now →
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white text-center">
              <h1 className="text-2xl font-bold">Reset Password</h1>
              <p className="text-primary-100 mt-2">Enter your new password</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaLock className="inline mr-2" />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaLock className="inline mr-2" />
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password →'
                )}
              </button>

              <Link to="/login">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-primary-600 transition"
                >
                  <FaArrowLeft /> Back to Login
                </button>
              </Link>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;