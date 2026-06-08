import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetLink, setResetLink] = useState('');

  // ✅ FIXED: Added /api/ prefix
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      
      if (response.data.success) {
        setSubmitted(true);
        setResetLink(response.data.reset_link);
        toast.success('Password reset link generated!');
        console.log('Reset link:', response.data.reset_link);
      } else {
        toast.error(response.data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.error || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden text-center p-8"
            >
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-4xl text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Link Generated</h2>
              <p className="text-gray-600 mb-4">
                Click the link below to reset your password:
              </p>
              <a 
                href={resetLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 break-all text-sm mb-4 block"
              >
                {resetLink}
              </a>
              <p className="text-sm text-gray-500 mb-6">
                This link will expire in 1 hour.
              </p>
              <Link to="/login">
                <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2 rounded-lg transition">
                  Back to Login
                </button>
              </Link>
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
              <h1 className="text-2xl font-bold">Forgot Password?</h1>
              <p className="text-primary-100 mt-2">We'll help you reset it</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Enter your registered email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Send Reset Link →'}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-primary-600 hover:text-primary-700 text-sm flex items-center justify-center gap-1">
                  <FaArrowLeft size={12} /> Back to Login
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;