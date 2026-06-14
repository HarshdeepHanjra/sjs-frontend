// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { FaUpload, FaCheckCircle, FaClock, FaTimesCircle, FaArrowLeft, FaWhatsapp, FaEnvelope, FaSpinner, FaEye, FaCopy, FaDownload, FaQrcode } from 'react-icons/fa';
// import toast from 'react-hot-toast';
// import api from '../services/api';
// import { useCart } from '../context/CartContext';

// const YOUR_UPI_ID = "sjsacademy@okhdfcbank";

// const PaymentVerification = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { clearCart } = useCart();
//   const [screenshot, setScreenshot] = useState(null);
//   const [screenshotPreview, setScreenshotPreview] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [transactionId, setTransactionId] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [verificationStatus, setVerificationStatus] = useState(null);
//   const [verificationId, setVerificationId] = useState(null);
//   const [adminNotes, setAdminNotes] = useState('');
//   const [copied, setCopied] = useState(false);
//   const [checkingStatus, setCheckingStatus] = useState(false);
//   const [orderData, setOrderData] = useState(null);
//   const [loadingOrder, setLoadingOrder] = useState(true);

//   // Check if user is logged in and load order data
//   useEffect(() => {
//     const loadOrderData = async () => {
//       const token = localStorage.getItem('token');
//       const userType = localStorage.getItem('userType');
      
//       console.log("PaymentVerification - Auth check:", { tokenExists: !!token, userType });
      
//       if (!token || userType !== 'student') {
//         toast.error('Please login to continue');
//         navigate('/login', { state: { returnUrl: '/payment-verification' } });
//         return;
//       }
      
//       const stateOrder = location.state;
//       const savedOrder = localStorage.getItem('pendingOrder');
//       const savedCart = localStorage.getItem('sjs_cart');
      
//       console.log("Order data sources:", { 
//         hasStateOrder: !!stateOrder, 
//         hasSavedOrder: !!savedOrder,
//         hasSavedCart: !!savedCart
//       });
      
//       if (stateOrder && stateOrder.orderId) {
//         setOrderData(stateOrder);
//         console.log("Using order data from navigation state:", stateOrder);
//       } else if (savedOrder) {
//         try {
//           const parsedOrder = JSON.parse(savedOrder);
//           setOrderData(parsedOrder);
//           console.log("Using order data from localStorage:", parsedOrder);
//           toast.success('Restored your pending order');
//         } catch (e) {
//           console.error("Error parsing saved order:", e);
//         }
//       } else if (savedCart) {
//         try {
//           const cartItems = JSON.parse(savedCart);
//           if (cartItems && cartItems.length > 0) {
//             const total = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
//             const tempOrder = {
//               orderId: `TEMP_${Date.now()}`,
//               totalAmount: total,
//               courses: cartItems,
//               isTemp: true
//             };
//             setOrderData(tempOrder);
//             console.log("Created temporary order from cart:", tempOrder);
//             toast.warning('Please create a new order from cart');
//           } else {
//             toast.error('No items in cart');
//             navigate('/cart');
//           }
//         } catch (e) {
//           console.error("Error parsing cart:", e);
//           toast.error('No order found. Please add courses to cart.');
//           navigate('/cart');
//         }
//       } else {
//         console.error("No order data found");
//         toast.error('No order found. Please add courses to cart.');
//         navigate('/cart');
//       }
      
//       setLoadingOrder(false);
//     };
    
//     loadOrderData();
//   }, [location.state, navigate]);

//   // Auto-check status every 30 seconds if pending
//   useEffect(() => {
//     let interval;
//     if (verificationId && verificationStatus === 'pending') {
//       interval = setInterval(() => checkStatus(), 30000);
//     }
//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [verificationId, verificationStatus]);

//   // ✅ FIXED: Added /api/ prefix
//   const checkStatus = async () => {
//     if (!verificationId) return;
    
//     setCheckingStatus(true);
//     try {
//       const response = await api.get(`/api/payment/status/${verificationId}`);
//       if (response.data.success) {
//         const newStatus = response.data.status;
//         if (newStatus !== verificationStatus) {
//           setVerificationStatus(newStatus);
//           setAdminNotes(response.data.admin_notes || '');
          
//           if (newStatus === 'approved') {
//             toast.success('Payment verified! Courses added to your account.');
//             // Clear cart after successful payment
//             clearCart();
//             localStorage.removeItem('sjs_cart');
//           } else if (newStatus === 'declined') {
//             toast.error('Payment verification failed. Please contact support.');
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Status check error:', error);
//       // Check if the error is about verified_at
//       if (error.response?.data?.error?.includes('verified_at')) {
//         console.log('Database field missing, but continuing...');
//       }
//     } finally {
//       setCheckingStatus(false);
//     }
//   };

//   // Handle file upload directly to backend
//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     if (!file.type.startsWith('image/')) {
//       toast.error('Please upload an image file (PNG, JPG, JPEG)');
//       return;
//     }
    
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error('File size must be less than 5MB');
//       return;
//     }
    
//     // Preview immediately
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setScreenshotPreview(reader.result);
//     };
//     reader.readAsDataURL(file);
    
//     setScreenshot(file);
//   };

//   // ✅ FIXED: Added /api/ prefix to both endpoints
//   const uploadAndSubmit = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast.error('Session expired. Please login again.');
//       navigate('/login', { state: { returnUrl: '/payment-verification' } });
//       return;
//     }

//     if (!orderData) {
//       toast.error('No order found. Please go back to cart.');
//       navigate('/cart');
//       return;
//     }

//     if (orderData.isTemp) {
//       toast.error('Please create a valid order from cart');
//       navigate('/cart');
//       return;
//     }

//     if (!transactionId) {
//       toast.error('Please enter transaction ID / UTR number');
//       return;
//     }
    
//     if (!screenshot) {
//       toast.error('Please upload payment screenshot');
//       return;
//     }

//     setSubmitting(true);
    
//     try {
//       // First upload the screenshot
//       const formData = new FormData();
//       formData.append('screenshot', screenshot);
//       formData.append('order_id', orderData.orderId);
      
//       console.log("Uploading screenshot for order:", orderData.orderId);
      
//       const uploadResponse = await api.post('/api/payment/upload-screenshot', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         timeout: 30000
//       });
      
//       if (!uploadResponse.data.success) {
//         throw new Error(uploadResponse.data.error || 'Upload failed');
//       }
      
//       const screenshotUrl = uploadResponse.data.screenshot_url;
//       console.log("Screenshot uploaded:", screenshotUrl);
      
//       // Then submit verification
//       const verifyResponse = await api.post('/api/payment/submit-verification', {
//         order_id: orderData.orderId,
//         transaction_id: transactionId,
//         screenshot_url: screenshotUrl
//       });
      
//       if (verifyResponse.data.success) {
//         setVerificationId(verifyResponse.data.verification_id);
//         setVerificationStatus('pending');
        
//         const pendingData = {
//           verificationId: verifyResponse.data.verification_id,
//           orderId: orderData.orderId,
//           transactionId: transactionId,
//           timestamp: new Date().toISOString()
//         };
//         localStorage.setItem('pendingVerification', JSON.stringify(pendingData));
        
//         toast.success('Verification submitted! Admin will review within 24 hours.');
//       } else {
//         toast.error(verifyResponse.data.error || 'Submission failed');
//       }
//     } catch (error) {
//       console.error('Submit error:', error);
//       if (error.response?.status === 401) {
//         toast.error('Session expired. Please login again.');
//         navigate('/login', { state: { returnUrl: '/payment-verification' } });
//       } else if (error.response?.data?.error) {
//         toast.error(error.response.data.error);
//       } else if (error.code === 'ECONNABORTED') {
//         toast.error('Request timeout. Please try again.');
//       } else {
//         toast.error('Failed to submit verification. Please try again.');
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleRetry = () => {
//     setVerificationStatus(null);
//     setVerificationId(null);
//     setTransactionId('');
//     setScreenshot(null);
//     setScreenshotPreview(null);
//     localStorage.removeItem('pendingVerification');
//   };

//   const handleCopyUPI = () => {
//     navigator.clipboard.writeText(YOUR_UPI_ID);
//     setCopied(true);
//     toast.success('UPI ID copied!');
//     setTimeout(() => setCopied(false), 3000);
//   };

//   const handleDownloadQR = () => {
//     const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(YOUR_UPI_ID)}`;
//     const link = document.createElement("a");
//     link.href = qrUrl;
//     link.download = "upi-qr-code.png";
//     link.click();
//     toast.success("QR Code downloaded!");
//   };

//   // Show loading while loading order data
//   if (loadingOrder) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-32">
//         <div className="container mx-auto px-4 text-center">
//           <FaSpinner className="text-5xl text-primary-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600">Loading order details...</p>
//         </div>
//       </div>
//     );
//   }

//   // Approved status view
//   if (verificationStatus === 'approved') {
//     return (
//       <div className="min-h-screen bg-gray-50 py-16">
//         <div className="container mx-auto px-4 max-w-md">
//           <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
//             <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Verified!</h2>
//             <p className="text-gray-600 mb-4">Your payment has been verified successfully.</p>
//             <p className="text-gray-600 mb-4">Your courses have been added to your account.</p>
//             {adminNotes && (
//               <div className="bg-green-50 p-3 rounded-lg mb-4 text-sm">
//                 <p className="text-green-700">{adminNotes}</p>
//               </div>
//             )}
//             <div className="space-y-3">
//               <button 
//                 onClick={() => navigate('/my-courses')} 
//                 className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
//               >
//                 Go to My Courses
//               </button>
//               <button 
//                 onClick={() => navigate('/dashboard')} 
//                 className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
//               >
//                 Go to Dashboard
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Declined status view
//   if (verificationStatus === 'declined') {
//     return (
//       <div className="min-h-screen bg-gray-50 py-16">
//         <div className="container mx-auto px-4 max-w-md">
//           <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
//             <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Declined</h2>
//             {adminNotes && (
//               <div className="bg-red-50 p-3 rounded-lg mb-4 text-sm">
//                 <p className="text-red-700">{adminNotes}</p>
//               </div>
//             )}
//             <p className="text-gray-600 mb-6">Your payment could not be verified. Please contact support.</p>
//             <div className="space-y-3">
//               <a href="https://wa.me/918950026639?text=Hello%20SJS%20Academy%2C%20I%20need%20help%20with%20my%20payment" target="_blank" rel="noopener noreferrer">
//                 <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg">
//                   <FaWhatsapp /> Contact WhatsApp Support
//                 </button>
//               </a>
//               <button onClick={handleRetry} className="w-full bg-primary-600 text-white py-3 rounded-lg">
//                 Try Again
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!orderData) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-32">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">No Order Found</h2>
//           <p className="text-gray-600 mb-6">Please add courses to your cart and try again.</p>
//           <button
//             onClick={() => navigate('/cart')}
//             className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
//           >
//             Go to Cart →
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-16">
//       <div className="container mx-auto px-4 max-w-2xl">
//         <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-primary-600 mb-6 hover:underline">
//           <FaArrowLeft /> Back to Cart
//         </button>

//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white text-center">
//             <h1 className="text-2xl font-bold">Payment Verification</h1>
//             <p className="text-primary-100 mt-2">Submit payment proof for manual verification</p>
//           </div>

//           <div className="p-6">
//             {/* Order Summary */}
//             <div className="bg-gray-50 rounded-xl p-4 mb-6">
//               <h3 className="font-semibold mb-2">Order Summary</h3>
//               <p className="text-sm text-gray-600 break-all">Order ID: {orderData.orderId}</p>
//               <p className="text-2xl font-bold text-primary-600 mt-2">Total: ₹{orderData.totalAmount?.toLocaleString()}</p>
//               {orderData.courses?.map((course, idx) => (
//                 <div key={idx} className="flex justify-between text-sm mt-2">
//                   <span>{course.name}</span>
//                   <span>₹{course.price?.toLocaleString()}</span>
//                 </div>
//               ))}
//             </div>

//             {/* QR Code Section */}
//             <div className="bg-white rounded-xl p-4 mb-6 text-center border-2 border-dashed border-primary-200">
//               <h3 className="font-semibold mb-3 text-gray-800">📱 Scan QR Code to Pay</h3>
//               <div className="flex justify-center mb-3">
//                 <div className="bg-white p-4 rounded-2xl shadow-lg inline-block">
//                   <img
//                     src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(YOUR_UPI_ID)}`}
//                     alt="UPI QR Code"
//                     className="w-48 h-48 object-contain"
//                   />
//                 </div>
//               </div>
//               <button
//                 onClick={handleDownloadQR}
//                 className="text-primary-600 text-sm flex items-center gap-1 mx-auto hover:text-primary-700 transition"
//               >
//                 <FaDownload /> Download QR Code
//               </button>
//             </div>

//             {/* Payment Instructions */}
//             <div className="bg-blue-50 rounded-xl p-4 mb-6">
//               <h3 className="font-semibold mb-2">📱 Payment Instructions</h3>
//               <p className="text-sm mb-2">Pay using UPI ID:</p>
//               <div className="bg-white p-3 rounded-lg text-center mb-3">
//                 <code className="font-mono text-primary-600 font-bold">{YOUR_UPI_ID}</code>
//                 <button 
//                   onClick={handleCopyUPI}
//                   className="ml-2 text-xs bg-primary-600 text-white px-2 py-1 rounded"
//                 >
//                   {copied ? 'Copied!' : 'Copy'}
//                 </button>
//               </div>
//               <p className="text-xs text-gray-500 mt-2 text-center">Use the exact UPI ID shown above. Include order ID in payment description.</p>
//             </div>

//             {/* Verification Form */}
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-700 font-semibold mb-2">
//                   Transaction ID / UTR Number <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={transactionId}
//                   onChange={(e) => setTransactionId(e.target.value)}
//                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   placeholder="Enter transaction ID from your payment app"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-semibold mb-2">
//                   Upload Payment Screenshot <span className="text-red-500">*</span>
//                 </label>
                
//                 {/* File Upload */}
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition">
//                   <FaUpload className="text-4xl text-gray-400 mx-auto mb-3" />
//                   <p className="text-gray-600 mb-2">Click to upload payment screenshot</p>
//                   <p className="text-sm text-gray-400 mb-3">PNG or JPG (Max 5MB)</p>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="hidden"
//                     id="screenshot-upload"
//                   />
//                   <label
//                     htmlFor="screenshot-upload"
//                     className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-700"
//                   >
//                     Choose File
//                   </label>
//                   {screenshot && (
//                     <div className="mt-3">
//                       <p className="text-sm text-green-600">✓ {screenshot.name}</p>
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Preview */}
//                 {screenshotPreview && (
//                   <div className="mt-3 p-3 bg-gray-50 rounded-lg">
//                     <p className="text-sm font-medium mb-2">Preview:</p>
//                     <img src={screenshotPreview} alt="Preview" className="max-h-48 mx-auto rounded border" />
//                   </div>
//                 )}
//               </div>

//               <button
//                 onClick={uploadAndSubmit}
//                 disabled={submitting || !transactionId || !screenshot}
//                 className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
//               >
//                 {submitting ? (
//                   <>
//                     <FaSpinner className="animate-spin" />
//                     Submitting...
//                   </>
//                 ) : (
//                   <>
//                     <FaCheckCircle />
//                     Submit for Verification →
//                   </>
//                 )}
//               </button>

//               {verificationStatus === 'pending' && (
//                 <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
//                   <div className="flex items-center gap-2 mb-2">
//                     <FaClock className="text-yellow-600" />
//                     <span className="font-semibold">Verification Pending</span>
//                   </div>
//                   <p className="text-sm text-gray-600">
//                     Your payment proof has been submitted. Our team will verify within 24 hours.
//                   </p>
//                   <button
//                     onClick={checkStatus}
//                     disabled={checkingStatus}
//                     className="mt-3 text-primary-600 text-sm hover:underline flex items-center gap-1"
//                   >
//                     {checkingStatus ? <FaSpinner className="animate-spin" /> : <FaEye />}
//                     {checkingStatus ? 'Checking...' : 'Check Status'}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentVerification;



import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaUpload, FaCheckCircle, FaClock, FaTimesCircle, FaArrowLeft, 
  FaWhatsapp, FaEnvelope, FaSpinner, FaEye, FaCopy, FaDownload, 
  FaQrcode, FaCreditCard, FaUniversity, FaMobileAlt, FaGooglePay,
  FaMoneyBillWave
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useCart } from '../context/CartContext';

// Payment Methods Configuration
const PAYMENT_METHODS = {
  UPI: {
    id: 'upi',
    name: 'UPI (Google Pay / PhonePe / Paytm)',
    icon: <FaGooglePay className="text-blue-600 text-2xl" />,
    description: 'Instant access after payment',
    requiresScreenshot: true,
    requiresTransactionId: true
  },
  RAZORPAY: {
    id: 'razorpay',
    name: 'Cards / NetBanking / UPI',
    icon: <FaCreditCard className="text-purple-600 text-2xl" />,
    description: 'Credit/Debit Card, NetBanking (Instant)',
    requiresScreenshot: false,
    requiresTransactionId: false,
    isOnline: true
  },
  BANK_TRANSFER: {
    id: 'bank_transfer',
    name: 'Bank Transfer / NEFT / RTGS',
    icon: <FaUniversity className="text-orange-600 text-2xl" />,
    description: 'Manual verification (24-48 hours)',
    requiresScreenshot: true,
    requiresTransactionId: true
  }
};

const YOUR_UPI_ID = "sjsacademy@okhdfcbank";
const YOUR_PHONE = "918950026639";

const PaymentVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  
  // State for payment method
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [verificationId, setVerificationId] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [bankDetails, setBankDetails] = useState(null);

  // Check if user is logged in and load order data
  useEffect(() => {
    const loadOrderData = async () => {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      
      console.log("PaymentVerification - Auth check:", { tokenExists: !!token, userType });
      
      if (!token || userType !== 'student') {
        toast.error('Please login to continue');
        navigate('/login', { state: { returnUrl: '/payment-verification' } });
        return;
      }
      
      const stateOrder = location.state;
      const savedOrder = localStorage.getItem('pendingOrder');
      const savedCart = localStorage.getItem('sjs_cart');
      
      console.log("Order data sources:", { 
        hasStateOrder: !!stateOrder, 
        hasSavedOrder: !!savedOrder,
        hasSavedCart: !!savedCart
      });
      
      if (stateOrder && stateOrder.orderId) {
        setOrderData(stateOrder);
        console.log("Using order data from navigation state:", stateOrder);
      } else if (savedOrder) {
        try {
          const parsedOrder = JSON.parse(savedOrder);
          setOrderData(parsedOrder);
          console.log("Using order data from localStorage:", parsedOrder);
          toast.success('Restored your pending order');
        } catch (e) {
          console.error("Error parsing saved order:", e);
        }
      } else if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart);
          if (cartItems && cartItems.length > 0) {
            const total = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
            const tempOrder = {
              orderId: `TEMP_${Date.now()}`,
              totalAmount: total,
              courses: cartItems,
              isTemp: true
            };
            setOrderData(tempOrder);
            console.log("Created temporary order from cart:", tempOrder);
            toast.warning('Please create a new order from cart');
          } else {
            toast.error('No items in cart');
            navigate('/cart');
          }
        } catch (e) {
          console.error("Error parsing cart:", e);
          toast.error('No order found. Please add courses to cart.');
          navigate('/cart');
        }
      } else {
        console.error("No order data found");
        toast.error('No order found. Please add courses to cart.');
        navigate('/cart');
      }
      
      setLoadingOrder(false);
    };
    
    loadOrderData();
    fetchBankDetails();
  }, [location.state, navigate]);

  const fetchBankDetails = async () => {
    try {
      const response = await api.get("/api/payment/bank-details");
      if (response.data.success) {
        setBankDetails(response.data.bank_details);
      }
    } catch (error) {
      console.error("Failed to fetch bank details:", error);
    }
  };

  // Auto-check status every 30 seconds if pending
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
    if (!verificationId) return;
    
    setCheckingStatus(true);
    try {
      const response = await api.get(`/api/payment/status/${verificationId}`);
      if (response.data.success) {
        const newStatus = response.data.status;
        if (newStatus !== verificationStatus) {
          setVerificationStatus(newStatus);
          setAdminNotes(response.data.admin_notes || '');
          
          if (newStatus === 'approved') {
            toast.success('Payment verified! Courses added to your account.');
            clearCart();
            localStorage.removeItem('sjs_cart');
          } else if (newStatus === 'declined') {
            toast.error('Payment verification failed. Please contact support.');
          }
        }
      }
    } catch (error) {
      console.error('Status check error:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, JPEG)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    setScreenshot(file);
  };

  // Razorpay Payment Handler
  const handleRazorpayPayment = async () => {
    if (!orderData) {
      toast.error('No order found');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post("/api/payment/create-razorpay-order", {
        amount: orderData.totalAmount,
        order_type: 'course'
      });

      if (response.data.success) {
        const options = {
          key: response.data.key_id,
          amount: response.data.amount,
          currency: response.data.currency,
          name: "SJS Global Tech Academy",
          description: "Course Purchase",
          order_id: response.data.order_id,
          handler: async (razorpayResponse) => {
            const verifyRes = await api.post("/api/payment/verify-razorpay-payment", {
              order_id: razorpayResponse.razorpay_order_id,
              payment_id: razorpayResponse.razorpay_payment_id,
              signature: razorpayResponse.razorpay_signature
            });

            if (verifyRes.data.success) {
              toast.success("Payment successful!");
              setVerificationStatus('approved');
              clearCart();
              localStorage.removeItem('sjs_cart');
              setTimeout(() => {
                navigate("/my-courses");
              }, 2000);
            }
          },
          prefill: {
            name: localStorage.getItem("userName") || "",
            email: localStorage.getItem("userEmail") || "",
            contact: localStorage.getItem("userPhone") || ""
          },
          theme: {
            color: "#1a3a5c"
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        toast.error("Failed to create payment order");
      }
    } catch (error) {
      console.error("Razorpay error:", error);
      toast.error(error.response?.data?.error || "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Manual Payment Submission (UPI / Bank Transfer)
  const handleManualPaymentSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Session expired. Please login again.');
      navigate('/login', { state: { returnUrl: '/payment-verification' } });
      return;
    }

    if (!orderData) {
      toast.error('No order found. Please go back to cart.');
      navigate('/cart');
      return;
    }

    if (orderData.isTemp) {
      toast.error('Please create a valid order from cart');
      navigate('/cart');
      return;
    }

    if (!transactionId) {
      toast.error('Please enter transaction ID / UTR number');
      return;
    }
    
    if (!screenshot) {
      toast.error('Please upload payment screenshot');
      return;
    }

    setSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('screenshot', screenshot);
      formData.append('order_id', orderData.orderId);
      formData.append('payment_method', selectedMethod);
      
      console.log("Uploading screenshot for order:", orderData.orderId);
      
      const uploadResponse = await api.post('/api/payment/upload-screenshot', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000
      });
      
      if (!uploadResponse.data.success) {
        throw new Error(uploadResponse.data.error || 'Upload failed');
      }
      
      const screenshotUrl = uploadResponse.data.screenshot_url;
      console.log("Screenshot uploaded:", screenshotUrl);
      
      const verifyResponse = await api.post('/api/payment/submit-verification', {
        order_id: orderData.orderId,
        transaction_id: transactionId,
        screenshot_url: screenshotUrl,
        payment_method: selectedMethod
      });
      
      if (verifyResponse.data.success) {
        setVerificationId(verifyResponse.data.verification_id);
        setVerificationStatus('pending');
        
        const pendingData = {
          verificationId: verifyResponse.data.verification_id,
          orderId: orderData.orderId,
          transactionId: transactionId,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('pendingVerification', JSON.stringify(pendingData));
        
        toast.success('Verification submitted! Admin will review within 24 hours.');
      } else {
        toast.error(verifyResponse.data.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login', { state: { returnUrl: '/payment-verification' } });
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please try again.');
      } else {
        toast.error('Failed to submit verification. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setVerificationStatus(null);
    setVerificationId(null);
    setTransactionId('');
    setScreenshot(null);
    setScreenshotPreview(null);
    localStorage.removeItem('pendingVerification');
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(YOUR_UPI_ID);
    setCopied(true);
    toast.success('UPI ID copied!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadQR = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(YOUR_UPI_ID)}`;
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = "upi-qr-code.png";
    link.click();
    toast.success("QR Code downloaded!");
  };

  if (loadingOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-32">
        <div className="container mx-auto px-4 text-center">
          <FaSpinner className="text-5xl text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'approved') {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Verified!</h2>
            <p className="text-gray-600 mb-4">Your payment has been verified successfully.</p>
            <p className="text-gray-600 mb-4">Your courses have been added to your account.</p>
            {adminNotes && (
              <div className="bg-green-50 p-3 rounded-lg mb-4 text-sm">
                <p className="text-green-700">{adminNotes}</p>
              </div>
            )}
            <div className="space-y-3">
              <button onClick={() => navigate('/my-courses')} className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">
                Go to My Courses
              </button>
              <button onClick={() => navigate('/dashboard')} className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700">
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'declined') {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Declined</h2>
            {adminNotes && (
              <div className="bg-red-50 p-3 rounded-lg mb-4 text-sm">
                <p className="text-red-700">{adminNotes}</p>
              </div>
            )}
            <p className="text-gray-600 mb-6">Your payment could not be verified. Please contact support.</p>
            <div className="space-y-3">
              <a href={`https://wa.me/${YOUR_PHONE}?text=Hello%20SJS%20Academy%2C%20I%20need%20help%20with%20my%20payment`} target="_blank" rel="noopener noreferrer">
                <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg">
                  <FaWhatsapp /> Contact WhatsApp Support
                </button>
              </a>
              <button onClick={handleRetry} className="w-full bg-primary-600 text-white py-3 rounded-lg">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 py-32">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Order Found</h2>
          <p className="text-gray-600 mb-6">Please add courses to your cart and try again.</p>
          <button onClick={() => navigate('/cart')} className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">
            Go to Cart →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-primary-600 mb-6 hover:underline">
          <FaArrowLeft /> Back to Cart
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white text-center">
            <h1 className="text-2xl font-bold">Complete Payment</h1>
            <p className="text-primary-100 mt-2">Choose your payment method</p>
          </div>

          <div className="p-6">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <FaMoneyBillWave className="text-primary-600" /> Order Summary
              </h3>
              <p className="text-sm text-gray-600 break-all">Order ID: {orderData.orderId}</p>
              <p className="text-2xl font-bold text-primary-600 mt-2">Total: ₹{orderData.totalAmount?.toLocaleString()}</p>
              {orderData.courses?.map((course, idx) => (
                <div key={idx} className="flex justify-between text-sm mt-2">
                  <span>{course.name}</span>
                  <span>₹{course.price?.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Select Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div
                  className={`border rounded-lg p-3 cursor-pointer transition ${
                    selectedMethod === 'upi' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMethod('upi')}
                >
                  <div className="flex items-center gap-2">
                    <FaMobileAlt className="text-blue-600 text-xl" />
                    <div>
                      <p className="font-semibold text-sm">UPI</p>
                      <p className="text-xs text-gray-500">Instant Access</p>
                    </div>
                    {selectedMethod === 'upi' && <FaCheckCircle className="text-primary-600 ml-auto text-sm" />}
                  </div>
                </div>

                <div
                  className={`border rounded-lg p-3 cursor-pointer transition ${
                    selectedMethod === 'razorpay' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMethod('razorpay')}
                >
                  <div className="flex items-center gap-2">
                    <FaCreditCard className="text-purple-600 text-xl" />
                    <div>
                      <p className="font-semibold text-sm">Card/NetBanking</p>
                      <p className="text-xs text-gray-500">Instant Access</p>
                    </div>
                    {selectedMethod === 'razorpay' && <FaCheckCircle className="text-primary-600 ml-auto text-sm" />}
                  </div>
                </div>

                <div
                  className={`border rounded-lg p-3 cursor-pointer transition ${
                    selectedMethod === 'bank_transfer' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMethod('bank_transfer')}
                >
                  <div className="flex items-center gap-2">
                    <FaUniversity className="text-orange-600 text-xl" />
                    <div>
                      <p className="font-semibold text-sm">Bank Transfer</p>
                      <p className="text-xs text-gray-500">Manual Verification</p>
                    </div>
                    {selectedMethod === 'bank_transfer' && <FaCheckCircle className="text-primary-600 ml-auto text-sm" />}
                  </div>
                </div>
              </div>
            </div>

            {/* UPI Payment Section */}
            {selectedMethod === 'upi' && (
              <>
                <div className="bg-white rounded-xl p-4 mb-6 text-center border-2 border-dashed border-primary-200">
                  <h3 className="font-semibold mb-3 text-gray-800">📱 Scan QR Code to Pay</h3>
                  <div className="flex justify-center mb-3">
                    <div className="bg-white p-4 rounded-2xl shadow-lg inline-block">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(YOUR_UPI_ID)}`}
                        alt="UPI QR Code"
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                  </div>
                  <button onClick={handleDownloadQR} className="text-primary-600 text-sm flex items-center gap-1 mx-auto hover:text-primary-700">
                    <FaDownload /> Download QR Code
                  </button>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold mb-2">📱 Payment Instructions</h3>
                  <p className="text-sm mb-2">Pay using UPI ID:</p>
                  <div className="bg-white p-3 rounded-lg text-center mb-3">
                    <code className="font-mono text-primary-600 font-bold">{YOUR_UPI_ID}</code>
                    <button onClick={handleCopyUPI} className="ml-2 text-xs bg-primary-600 text-white px-2 py-1 rounded">
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Bank Transfer Section */}
            {selectedMethod === 'bank_transfer' && bankDetails && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold mb-3">Bank Account Details</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Account Name:</strong> {bankDetails.account_name}</p>
                  <p><strong>Account Number:</strong> {bankDetails.account_number}</p>
                  <p><strong>Bank Name:</strong> {bankDetails.bank_name}</p>
                  <p><strong>IFSC Code:</strong> {bankDetails.ifsc_code}</p>
                  <p><strong>Branch:</strong> {bankDetails.branch}</p>
                  {bankDetails.upi_id && <p><strong>UPI ID:</strong> {bankDetails.upi_id}</p>}
                </div>
              </div>
            )}

            {/* Verification Form (for UPI and Bank Transfer) */}
            {(selectedMethod === 'upi' || selectedMethod === 'bank_transfer') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Transaction ID / UTR Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter transaction ID from your payment app"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Upload Payment Screenshot <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition">
                    <FaUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">Click to upload payment screenshot</p>
                    <p className="text-sm text-gray-400 mb-3">PNG or JPG (Max 5MB)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="screenshot-upload"
                    />
                    <label htmlFor="screenshot-upload" className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-700">
                      Choose File
                    </label>
                    {screenshot && (
                      <div className="mt-3">
                        <p className="text-sm text-green-600">✓ {screenshot.name}</p>
                      </div>
                    )}
                  </div>
                  
                  {screenshotPreview && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-2">Preview:</p>
                      <img src={screenshotPreview} alt="Preview" className="max-h-48 mx-auto rounded border" />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleManualPaymentSubmit}
                  disabled={submitting || !transactionId || !screenshot}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><FaSpinner className="animate-spin" /> Submitting...</>
                  ) : (
                    <><FaCheckCircle /> Submit for Verification →</>
                  )}
                </button>
              </div>
            )}

            {/* Razorpay Payment Section */}
            {selectedMethod === 'razorpay' && (
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700 text-center">
                    You will be redirected to Razorpay secure payment page.
                    Supports Credit/Debit Cards, NetBanking, and UPI.
                  </p>
                </div>
                <button
                  onClick={handleRazorpayPayment}
                  disabled={submitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><FaSpinner className="animate-spin" /> Processing...</>
                  ) : (
                    <><FaCreditCard /> Pay with Cards / NetBanking</>
                  )}
                </button>
              </div>
            )}

            {verificationStatus === 'pending' && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaClock className="text-yellow-600" />
                  <span className="font-semibold">Verification Pending</span>
                </div>
                <p className="text-sm text-gray-600">
                  Your payment proof has been submitted. Our team will verify within 24 hours.
                </p>
                <button onClick={checkStatus} disabled={checkingStatus} className="mt-3 text-primary-600 text-sm hover:underline flex items-center gap-1">
                  {checkingStatus ? <FaSpinner className="animate-spin" /> : <FaEye />}
                  {checkingStatus ? 'Checking...' : 'Check Status'}
                </button>
              </div>
            )}

            {/* Support Section */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex gap-3">
                <a href={`https://wa.me/${YOUR_PHONE}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 border border-green-500 text-green-600 py-2 rounded-lg hover:bg-green-50 transition">
                    <FaWhatsapp /> WhatsApp
                  </button>
                </a>
                <a href="mailto:sjsglobaltech@gmail.com" className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 border border-primary-500 text-primary-600 py-2 rounded-lg hover:bg-primary-50 transition">
                    <FaEnvelope /> Email
                  </button>
                </a>
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                For assistance, contact us on WhatsApp or Email. We're here to help!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;