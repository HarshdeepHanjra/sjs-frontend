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



import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaClock, FaWhatsapp, FaEnvelope, FaCheckCircle, FaSpinner, FaEye } from 'react-icons/fa';
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
  const [checkCount, setCheckCount] = useState(0);
  const isInternship = !!internshipId;

  // Auto-check status every 30 seconds
  useEffect(() => {
    let interval;
    if (verificationId && verificationStatus === 'pending') {
      interval = setInterval(() => checkStatus(), 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [verificationId, verificationStatus]);

  const checkStatus = async () => {
    if (!verificationId) {
      // Try to get from localStorage
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
      return;
    }

    setCheckingStatus(true);
    setCheckCount(prev => prev + 1);
    
    try {
      const response = await api.get(`/api/payment/status/${verificationId}`);
      if (response.data.success) {
        const newStatus = response.data.status;
        if (newStatus !== verificationStatus) {
          setVerificationStatus(newStatus);
          setAdminNotes(response.data.admin_notes || '');
          
          if (newStatus === 'approved') {
            toast.success('Payment verified! Your account has been activated.');
            // Clear pending data
            localStorage.removeItem('pendingVerification');
            localStorage.removeItem('pendingOrder');
            // Redirect after 2 seconds
            setTimeout(() => {
              navigate(isInternship ? '/my-internships' : '/my-courses');
            }, 2000);
          } else if (newStatus === 'declined') {
            toast.error('Payment verification failed. Please contact support.');
          }
        }
      }
    } catch (error) {
      console.error('Status check error:', error);
      // Don't show error toast for every check, only after 3 attempts
      if (checkCount > 3) {
        console.log('Still waiting for verification...');
      }
    } finally {
      setCheckingStatus(false);
    }
  };

  // Manual status check
  const handleManualCheck = () => {
    if (!verificationId) {
      toast.error('No verification ID found. Please contact support.');
      return;
    }
    checkStatus();
    toast.success('Checking status...');
  };

  // Approved status view
  if (verificationStatus === 'approved') {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Verified!</h1>
            <p className="text-gray-600 mb-4">
              Your payment has been verified successfully.
            </p>
            <p className="text-gray-600 mb-6">
              {isInternship 
                ? "You have been successfully enrolled in the internship!"
                : "Your courses have been added to your account."}
            </p>
            {adminNotes && (
              <div className="bg-green-50 p-3 rounded-lg mb-6 text-sm text-left">
                <p className="text-green-700 font-semibold mb-1">Admin Note:</p>
                <p className="text-green-600">{adminNotes}</p>
              </div>
            )}
            <div className="space-y-3">
              <button 
                onClick={() => navigate(isInternship ? '/my-internships' : '/my-courses')}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg transition"
              >
                {isInternship ? "Go to My Internships" : "Go to My Courses"}
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
            <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <FaClock className="text-4xl text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Declined</h1>
            <p className="text-gray-600 mb-4">
              Your payment verification was declined.
            </p>
            {adminNotes && (
              <div className="bg-red-50 p-3 rounded-lg mb-6 text-sm text-left">
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
              <FaClock className="text-4xl text-white" />
            </div>
            <h1 className="text-2xl font-bold">Payment Initiated!</h1>
            <p className="text-white/90 mt-1">Awaiting Verification</p>
          </div>
          
          <div className="p-6">
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
            <div className="bg-yellow-50 rounded-xl p-4 mb-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FaSpinner className="text-yellow-600 animate-spin" />
                <span className="font-semibold text-yellow-800">Verification Pending</span>
              </div>
              <p className="text-sm text-gray-600">
                Our team is reviewing your payment proof. This usually takes 24-48 hours.
              </p>
              {verificationId && (
                <p className="text-xs text-gray-500 mt-2">
                  Verification ID: {verificationId}
                </p>
              )}
            </div>
            
            {/* What happens next */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">What happens next?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">1</span>
                  Admin verifies your payment screenshot
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">2</span>
                  You receive email confirmation
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">3</span>
                  {isInternship ? "Internship enrollment activated" : "Courses added to your account"}
                </li>
              </ul>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              {verificationId && (
                <button
                  onClick={handleManualCheck}
                  disabled={checkingStatus}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg transition disabled:opacity-50"
                >
                  {checkingStatus ? <FaSpinner className="animate-spin" /> : <FaEye />}
                  {checkingStatus ? 'Checking...' : 'Check Verification Status'}
                </button>
              )}
              
              <a href="https://wa.me/918950026639" target="_blank" rel="noopener noreferrer">
                <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition">
                  <FaWhatsapp /> Contact Support on WhatsApp
                </button>
              </a>
              
              <a href="mailto:sjsglobaltech@gmail.com">
                <button className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg transition">
                  <FaEnvelope /> Email Support
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
                💡 You can close this page and check status later. 
                We'll send you an email once verified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;