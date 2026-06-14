// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { FaClock, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

// const PaymentPending = () => {
//   const location = useLocation();
//   const { orderId, totalAmount, courses } = location.state || {};

//   return (
//     <div className="min-h-screen bg-gray-50 py-16">
//       <div className="container mx-auto px-4 max-w-md">
//         <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
//           <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
//             <FaClock className="text-4xl text-yellow-600" />
//           </div>
          
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Initiated!</h1>
//           <p className="text-gray-600 mb-4">
//             Your order has been received. Order ID: <strong>{orderId || 'Processing'}</strong>
//           </p>
          
//           {courses && courses.length > 0 && (
//             <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
//               <p className="font-semibold mb-2">Order Summary:</p>
//               {courses.map((course, idx) => (
//                 <div key={idx} className="flex justify-between text-sm mb-1">
//                   <span>{course.name}</span>
//                   <span>₹{course.price?.toLocaleString()}</span>
//                 </div>
//               ))}
//               <div className="border-t pt-2 mt-2 font-bold">
//                 <div className="flex justify-between">
//                   <span>Total:</span>
//                   <span>₹{totalAmount?.toLocaleString()}</span>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           <p className="text-gray-600 mb-6">
//             Our team will verify your payment and activate your courses within 24 hours.
//             You will receive an email confirmation once verified.
//           </p>
          
//           <div className="space-y-3">
//             {/* ✅ Fixed WhatsApp number */}
//             <a href="https://wa.me/918950026639" target="_blank" rel="noopener noreferrer">
//               <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition">
//                 <FaWhatsapp /> Contact Support on WhatsApp
//               </button>
//             </a>
//             {/* ✅ Fixed email address */}
//             <a href="mailto:sjsglobaltech@gmail.com">
//               <button className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg transition">
//                 <FaEnvelope /> Email Support
//               </button>
//             </a>
//             <Link to="/">
//               <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition">
//                 Back to Home
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPending;



import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaClock, FaWhatsapp, FaEnvelope, FaCheckCircle, FaSpinner, FaEye, FaSync } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../services/api';

const PaymentPending = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, totalAmount, courses, internshipId, internshipTitle, verificationId: initialVerificationId } = location.state || {};
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [verificationId, setVerificationId] = useState(initialVerificationId);
  const [adminNotes, setAdminNotes] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const intervalRef = useRef(null);
  const timeIntervalRef = useRef(null);
  const isInternship = !!internshipId;

  // Load verification ID from localStorage if not in state
  useEffect(() => {
    if (!verificationId) {
      const savedData = localStorage.getItem('pendingVerification');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.verificationId) {
            setVerificationId(parsed.verificationId);
          }
        } catch (e) {
          console.error('Error parsing saved verification:', e);
        }
      }
    }
  }, [verificationId]);

  // Timer to show elapsed time
  useEffect(() => {
    timeIntervalRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => {
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    };
  }, []);

  // Auto-check status every 15 seconds (more frequent)
  useEffect(() => {
    if (verificationId && verificationStatus === 'pending') {
      // Initial check after 3 seconds
      const initialTimeout = setTimeout(() => {
        checkStatus();
      }, 3000);
      
      // Then every 15 seconds
      intervalRef.current = setInterval(() => {
        checkStatus();
      }, 15000);
      
      return () => {
        clearTimeout(initialTimeout);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [verificationId, verificationStatus]);

  const formatElapsedTime = () => {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const checkStatus = async () => {
    if (!verificationId) {
      console.log('No verification ID to check');
      return;
    }

    setCheckingStatus(true);
    
    try {
      console.log(`Checking status for verification ID: ${verificationId}`);
      const response = await api.get(`/api/payment/status/${verificationId}`);
      
      console.log('Status response:', response.data);
      
      if (response.data.success) {
        const newStatus = response.data.status;
        
        if (newStatus !== verificationStatus) {
          setVerificationStatus(newStatus);
          setAdminNotes(response.data.admin_notes || '');
          
          if (newStatus === 'approved') {
            toast.success('✅ Payment verified! Your account has been activated.', {
              duration: 5000,
              icon: '🎉'
            });
            
            // Clear pending data
            localStorage.removeItem('pendingVerification');
            localStorage.removeItem('pendingOrder');
            localStorage.removeItem('sjs_cart');
            
            // Clear intervals
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
            
            // Redirect after 2 seconds
            setTimeout(() => {
              navigate(isInternship ? '/my-internships' : '/my-courses');
            }, 2000);
          } else if (newStatus === 'declined') {
            toast.error('❌ Payment verification failed. Please contact support.', {
              duration: 5000
            });
            // Clear intervals
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
        } else {
          console.log('Status unchanged:', newStatus);
        }
      }
    } catch (error) {
      console.error('Status check error:', error);
      // Don't show error for network issues
      if (error.response?.status !== 404) {
        console.log('Network error, will retry...');
      }
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleManualCheck = () => {
    if (!verificationId) {
      toast.error('No verification ID found. Please contact support.');
      return;
    }
    toast.loading('Checking status...', { id: 'status-check' });
    checkStatus();
    setTimeout(() => {
      toast.dismiss('status-check');
    }, 2000);
  };

  // Approved status view
  if (verificationStatus === 'approved') {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fadeIn">
            <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-5xl text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Verified! ✅</h1>
            <p className="text-gray-600 mb-4">
              Your payment has been verified successfully.
            </p>
            <p className="text-gray-600 mb-6">
              {isInternship 
                ? "You have been successfully enrolled in the internship!"
                : "Your courses have been added to your account."}
            </p>
            {adminNotes && (
              <div className="bg-green-50 p-3 rounded-lg mb-6 text-sm text-left border border-green-200">
                <p className="text-green-700 font-semibold mb-1">📝 Admin Note:</p>
                <p className="text-green-600">{adminNotes}</p>
              </div>
            )}
            <div className="space-y-3">
              <button 
                onClick={() => navigate(isInternship ? '/my-internships' : '/my-courses')}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg transition font-semibold"
              >
                {isInternship ? "Go to My Internships →" : "Go to My Courses →"}
              </button>
              <Link to="/dashboard">
                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition">
                  Go to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Declined status view
  if (verificationStatus === 'declined') {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <FaClock className="text-5xl text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Declined ❌</h1>
            <p className="text-gray-600 mb-4">
              Your payment verification was declined.
            </p>
            {adminNotes && (
              <div className="bg-red-50 p-3 rounded-lg mb-6 text-sm text-left border border-red-200">
                <p className="text-red-700 font-semibold mb-1">Reason:</p>
                <p className="text-red-600">{adminNotes}</p>
              </div>
            )}
            <div className="space-y-3">
              <a href="https://wa.me/918950026639" target="_blank" rel="noopener noreferrer">
                <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition">
                  <FaWhatsapp /> Contact Support
                </button>
              </a>
              <Link to="/cart">
                <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg transition">
                  Try Again
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white text-center">
            <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <FaSpinner className="text-4xl text-white animate-spin" />
            </div>
            <h1 className="text-2xl font-bold">Payment Verification Pending</h1>
            <p className="text-white/90 mt-1">Please wait while we verify your payment</p>
          </div>
          
          <div className="p-6">
            {/* Timer and Status */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500">Waiting time</p>
              <p className="text-2xl font-mono font-bold text-primary-600">{formatElapsedTime()}</p>
              <p className="text-xs text-gray-400 mt-1">Auto-checking every 15 seconds</p>
            </div>

            <p className="text-gray-600 text-center mb-4">
              Order ID: <strong className="font-mono">{orderId || 'Processing'}</strong>
            </p>
            
            {/* Order Summary */}
            {(courses || internshipTitle) && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="font-semibold mb-3 flex items-center gap-2">
                  <span>📋 Order Summary</span>
                </p>
                {isInternship ? (
                  <div className="flex justify-between text-sm mb-2">
                    <span>{internshipTitle}</span>
                    <span className="font-semibold">₹{totalAmount?.toLocaleString()}</span>
                  </div>
                ) : (
                  courses?.map((course, idx) => (
                    <div key={idx} className="flex justify-between text-sm mb-2">
                      <span>{course.name}</span>
                      <span>₹{course.price?.toLocaleString()}</span>
                    </div>
                  ))
                )}
                <div className="border-t pt-2 mt-2 font-bold">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="text-primary-600">₹{totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Status Indicator */}
            <div className="bg-yellow-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="relative">
                  <FaSpinner className="text-yellow-600 animate-spin text-lg" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full animate-ping"></div>
                  </div>
                </div>
                <span className="font-semibold text-yellow-800">Verification in Progress</span>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Our team is reviewing your payment proof. This usually takes 24-48 hours.
              </p>
              {verificationId && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Reference ID: <span className="font-mono">{verificationId.substring(0, 20)}...</span>
                </p>
              )}
            </div>
            
            {/* Live Status Updates */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live Status Updates
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <FaCheckCircle className="text-xs" />
                  <span>Payment submitted for verification</span>
                  <span className="text-xs text-gray-400 ml-auto">✓ Complete</span>
                </div>
                <div className={`flex items-center gap-2 ${verificationStatus === 'approved' ? 'text-green-600' : 'text-gray-400'}`}>
                  {verificationStatus === 'approved' ? <FaCheckCircle className="text-xs" /> : <FaSpinner className="text-xs animate-spin" />}
                  <span>Admin review</span>
                  {verificationStatus === 'pending' && (
                    <span className="text-xs text-gray-400 ml-auto">In Progress...</span>
                  )}
                  {verificationStatus === 'approved' && (
                    <span className="text-xs text-green-600 ml-auto">✓ Complete</span>
                  )}
                </div>
                <div className={`flex items-center gap-2 ${verificationStatus === 'approved' ? 'text-green-600' : 'text-gray-400'}`}>
                  {verificationStatus === 'approved' ? <FaCheckCircle className="text-xs" /> : <div className="w-3 h-3" />}
                  <span>{isInternship ? "Internship enrollment activated" : "Courses added to account"}</span>
                  {verificationStatus === 'approved' && (
                    <span className="text-xs text-green-600 ml-auto">✓ Complete</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              {verificationId && (
                <button
                  onClick={handleManualCheck}
                  disabled={checkingStatus}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg transition disabled:opacity-50 font-medium"
                >
                  {checkingStatus ? <FaSpinner className="animate-spin" /> : <FaSync />}
                  {checkingStatus ? 'Checking Status...' : 'Check Status Now'}
                </button>
              )}
              
              <a href="https://wa.me/918950026639" target="_blank" rel="noopener noreferrer">
                <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition">
                  <FaWhatsapp /> WhatsApp Support (Quick Response)
                </button>
              </a>
              
              <Link to="/">
                <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition">
                  Back to Home
                </button>
              </Link>
            </div>
            
            {/* Note */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-xs text-blue-700">
                💡 You can close this page. We'll send you an email once verified.
                <br />
                Status auto-checks every 15 seconds while this page is open.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;