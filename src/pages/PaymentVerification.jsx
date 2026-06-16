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
  FaQrcode, FaPaypal, FaUniversity, FaMobileAlt, FaBuilding
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const YOUR_UPI_ID = "sjsacademy@okhdfcbank";
const YOUR_PAYPAL_EMAIL = "sjsglobaltech@gmail.com";
const YOUR_PHONE = "918950026639";

const PaymentVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  
  // Payment method state
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [verificationId, setVerificationId] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [copiedPaypal, setCopiedPaypal] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [bankDetails, setBankDetails] = useState(null);
  const [loadingBankDetails, setLoadingBankDetails] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [selectedBankField, setSelectedBankField] = useState(null);

  // Load order data
  useEffect(() => {
    const loadOrderData = async () => {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      
      if (!token || userType !== 'student') {
        toast.error('Please login to continue');
        navigate('/login', { state: { returnUrl: '/payment-verification' } });
        return;
      }
      
      const stateOrder = location.state;
      const savedOrder = localStorage.getItem('pendingOrder');
      const savedCart = localStorage.getItem('sjs_cart');
      
      if (stateOrder && stateOrder.orderId) {
        setOrderData(stateOrder);
      } else if (savedOrder) {
        try {
          const parsedOrder = JSON.parse(savedOrder);
          setOrderData(parsedOrder);
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
        toast.error('No order found. Please add courses to cart.');
        navigate('/cart');
      }
      
      setLoadingOrder(false);
    };
    
    loadOrderData();
  }, [location.state, navigate]);

  // Fetch bank details when bank transfer is selected
  useEffect(() => {
    if (selectedMethod === 'bank_transfer') {
      fetchBankDetails();
    }
  }, [selectedMethod]);

  // Timer for pending status
  useEffect(() => {
    let interval;
    if (verificationStatus === 'pending') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [verificationStatus]);

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

  const fetchBankDetails = async () => {
    setLoadingBankDetails(true);
    try {
      const response = await api.get("/api/payment/bank-details");
      if (response.data.success) {
        setBankDetails(response.data.bank_details);
      } else {
        // Default bank details
        setBankDetails({
          account_name: "SJS Global Tech Academy",
          account_number: "123456789012",
          bank_name: "State Bank of India",
          ifsc_code: "SBIN0012345",
          branch: "Main Branch",
          upi_id: YOUR_UPI_ID
        });
      }
    } catch (error) {
      console.error("Failed to fetch bank details:", error);
      setBankDetails({
        account_name: "SJS Global Tech Academy",
        account_number: "123456789012",
        bank_name: "State Bank of India",
        ifsc_code: "SBIN0012345",
        branch: "Main Branch",
        upi_id: YOUR_UPI_ID
      });
    } finally {
      setLoadingBankDetails(false);
    }
  };

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
            toast.success('Payment verified! Your courses have been activated.');
            localStorage.removeItem('pendingVerification');
            localStorage.removeItem('pendingOrder');
            localStorage.removeItem('sjs_cart');
            clearCart();
            setTimeout(() => {
              navigate('/my-courses');
            }, 2000);
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

  const handleFileChange = (e) => {
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

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(YOUR_UPI_ID);
    setCopiedUPI(true);
    toast.success('UPI ID copied!');
    setTimeout(() => setCopiedUPI(false), 3000);
  };

  const handleCopyPaypal = () => {
    navigator.clipboard.writeText(YOUR_PAYPAL_EMAIL);
    setCopiedPaypal(true);
    toast.success('PayPal email copied!');
    setTimeout(() => setCopiedPaypal(false), 3000);
  };

  const handleCopyBankField = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setSelectedBankField(fieldName);
    toast.success(`${fieldName} copied!`);
    setTimeout(() => setSelectedBankField(null), 2000);
  };

  const handleDownloadQR = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(YOUR_UPI_ID)}`;
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = "upi-qr-code.png";
    link.click();
    toast.success("QR Code downloaded!");
  };

  const handlePaypalPayment = () => {
    // Redirect to PayPal payment page
    const amount = orderData?.totalAmount;
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${YOUR_PAYPAL_EMAIL}&item_name=SJS%20Academy%20Course%20Purchase&item_number=${orderData?.orderId}&amount=${amount}&currency_code=INR&return=https://sjs-frontend-delta.vercel.app/payment-verification&cancel_return=https://sjs-frontend-delta.vercel.app/cart`;
    
    window.open(paypalUrl, '_blank');
    toast.success('PayPal window opened. After payment, submit transaction ID and screenshot for verification.');
  };

  const handleManualPaymentSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Session expired. Please login again.');
      navigate('/login', { state: { returnUrl: '/payment-verification' } });
      return;
    }

    if (!orderData || orderData.isTemp) {
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
      // Upload screenshot
      const formData = new FormData();
      formData.append('screenshot', screenshot);
      formData.append('order_id', orderData.orderId);
      formData.append('payment_method', selectedMethod);
      
      const uploadResponse = await api.post('/api/payment/upload-screenshot', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000
      });
      
      if (!uploadResponse.data.success) {
        throw new Error(uploadResponse.data.error || 'Upload failed');
      }
      
      const screenshotUrl = uploadResponse.data.screenshot_url;
      
      // Submit verification
      const verifyResponse = await api.post('/api/payment/submit-verification', {
        order_id: orderData.orderId,
        transaction_id: transactionId,
        screenshot_url: screenshotUrl,
        payment_method: selectedMethod
      });
      
      if (verifyResponse.data.success) {
        setVerificationId(verifyResponse.data.verification_id);
        setVerificationStatus('pending');
        
        localStorage.setItem('pendingVerification', JSON.stringify({
          verificationId: verifyResponse.data.verification_id,
          orderId: orderData.orderId,
          transactionId: transactionId,
          timestamp: new Date().toISOString()
        }));
        
        toast.success('Verification submitted! Admin will review within 24 hours.');
      } else {
        toast.error(verifyResponse.data.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.error || 'Failed to submit verification');
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualCheck = () => {
    if (!verificationId) {
      toast.error('No verification ID found');
      return;
    }
    checkStatus();
    toast.success('Checking status...');
  };

  const formatElapsedTime = () => {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Verified!</h1>
            <p className="text-gray-600 mb-6">Your payment has been verified successfully. Your courses have been added to your account.</p>
            {adminNotes && (
              <div className="bg-green-50 p-3 rounded-lg mb-6 text-sm">
                <p className="text-green-700">{adminNotes}</p>
              </div>
            )}
            <button onClick={() => navigate('/my-courses')} className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">
              Go to My Courses
            </button>
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Declined</h1>
            {adminNotes && <div className="bg-red-50 p-3 rounded-lg mb-6 text-sm text-red-700">{adminNotes}</div>}
            <a href={`https://wa.me/${YOUR_PHONE}`} target="_blank" rel="noopener noreferrer">
              <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg">Contact Support</button>
            </a>
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
          <button onClick={() => navigate('/cart')} className="bg-primary-600 text-white px-6 py-3 rounded-lg">Go to Cart →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-primary-600 mb-6 hover:underline">
          <FaArrowLeft /> Back to Cart
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white text-center">
            <h1 className="text-2xl font-bold">Complete Payment</h1>
            <p className="text-primary-100 mt-1">Choose your payment method</p>
          </div>

          <div className="p-6">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <FaBuilding className="text-primary-600" /> Order Summary
              </h3>
              <p className="text-sm text-gray-600 break-all">Order ID: {orderData.orderId}</p>
              <p className="text-2xl font-bold text-primary-600 mt-2">Total: ₹{orderData.totalAmount?.toLocaleString('en-IN')}</p>
              {orderData.courses?.map((course, idx) => (
                <div key={idx} className="flex justify-between text-sm mt-2">
                  <span>{course.name}</span>
                  <span>₹{course.price?.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Select Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* UPI Option */}
                <div 
                  className={`border rounded-lg p-3 cursor-pointer transition ${selectedMethod === 'upi' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`} 
                  onClick={() => setSelectedMethod('upi')}
                >
                  <div className="flex items-center gap-2">
                    <FaMobileAlt className="text-blue-600 text-xl" />
                    <div>
                      <p className="font-semibold text-sm">UPI</p>
                      <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p>
                    </div>
                    {selectedMethod === 'upi' && <FaCheckCircle className="text-primary-600 ml-auto" />}
                  </div>
                </div>

                {/* PayPal Option */}
                <div 
                  className={`border rounded-lg p-3 cursor-pointer transition ${selectedMethod === 'paypal' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`} 
                  onClick={() => setSelectedMethod('paypal')}
                >
                  <div className="flex items-center gap-2">
                    <FaPaypal className="text-blue-600 text-xl" />
                    <div>
                      <p className="font-semibold text-sm">PayPal</p>
                      <p className="text-xs text-gray-500">International Payments</p>
                    </div>
                    {selectedMethod === 'paypal' && <FaCheckCircle className="text-primary-600 ml-auto" />}
                  </div>
                </div>

                {/* Bank Transfer Option */}
                <div 
                  className={`border rounded-lg p-3 cursor-pointer transition ${selectedMethod === 'bank_transfer' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`} 
                  onClick={() => setSelectedMethod('bank_transfer')}
                >
                  <div className="flex items-center gap-2">
                    <FaUniversity className="text-orange-600 text-xl" />
                    <div>
                      <p className="font-semibold text-sm">Bank Transfer</p>
                      <p className="text-xs text-gray-500">NEFT / RTGS / IMPS</p>
                    </div>
                    {selectedMethod === 'bank_transfer' && <FaCheckCircle className="text-primary-600 ml-auto" />}
                  </div>
                </div>
              </div>
            </div>

            {/* UPI Section */}
            {selectedMethod === 'upi' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 text-center border-2 border-dashed border-primary-200">
                  <p className="text-gray-600 mb-2">Scan QR code with any UPI app</p>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(YOUR_UPI_ID)}`} 
                    alt="UPI QR Code" 
                    className="w-48 h-48 mx-auto" 
                  />
                  <button onClick={handleDownloadQR} className="mt-2 text-primary-600 text-sm flex items-center gap-1 mx-auto">
                    <FaDownload /> Download QR
                  </button>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-sm mb-2">Or pay using UPI ID:</p>
                  <code className="bg-white px-4 py-2 rounded-lg font-mono text-primary-600">{YOUR_UPI_ID}</code>
                  <button onClick={handleCopyUPI} className="ml-2 text-xs bg-primary-600 text-white px-3 py-1 rounded">
                    {copiedUPI ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Transaction ID / UTR Number *</label>
                  <input 
                    type="text" 
                    value={transactionId} 
                    onChange={(e) => setTransactionId(e.target.value)} 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter transaction ID from your UPI app" 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Payment Screenshot *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      id="upi-screenshot" 
                    />
                    <label htmlFor="upi-screenshot" className="bg-primary-600 text-white px-4 py-2 rounded-lg cursor-pointer inline-block">
                      Choose File
                    </label>
                    {screenshot && <p className="text-sm text-green-600 mt-2">✓ {screenshot.name}</p>}
                    {screenshotPreview && <img src={screenshotPreview} alt="Preview" className="max-h-32 mx-auto mt-2 rounded" />}
                  </div>
                </div>
                <button 
                  onClick={handleManualPaymentSubmit} 
                  disabled={submitting || !transactionId || !screenshot} 
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold disabled:opacity-50"
                >
                  {submitting ? <FaSpinner className="animate-spin mx-auto" /> : 'Submit for Verification →'}
                </button>
              </div>
            )}

            {/* PayPal Section */}
            {selectedMethod === 'paypal' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <FaPaypal className="text-blue-600" /> PayPal Payment
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">Send payment to:</p>
                      <code className="font-mono text-primary-600 font-bold">{YOUR_PAYPAL_EMAIL}</code>
                      <button onClick={handleCopyPaypal} className="ml-2 text-xs bg-primary-600 text-white px-2 py-1 rounded">
                        {copiedPaypal ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    
                    <button 
                      onClick={handlePaypalPayment}
                      className="w-full bg-[#0070ba] hover:bg-[#003087] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                    >
                      <FaPaypal /> Pay with PayPal →
                    </button>
                    
                    <div className="bg-yellow-50 p-3 rounded-lg mt-3">
                      <p className="text-xs text-yellow-800">
                        <strong>Note:</strong> After PayPal payment, please enter the Transaction ID and upload screenshot below.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">PayPal Transaction ID *</label>
                  <input 
                    type="text" 
                    value={transactionId} 
                    onChange={(e) => setTransactionId(e.target.value)} 
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Enter PayPal transaction ID" 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Payment Screenshot *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      id="paypal-screenshot" 
                    />
                    <label htmlFor="paypal-screenshot" className="bg-primary-600 text-white px-4 py-2 rounded-lg cursor-pointer inline-block">
                      Choose File
                    </label>
                    {screenshot && <p className="text-sm text-green-600 mt-2">✓ {screenshot.name}</p>}
                    {screenshotPreview && <img src={screenshotPreview} alt="Preview" className="max-h-32 mx-auto mt-2 rounded" />}
                  </div>
                </div>
                <button 
                  onClick={handleManualPaymentSubmit} 
                  disabled={submitting || !transactionId || !screenshot} 
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold disabled:opacity-50"
                >
                  {submitting ? <FaSpinner className="animate-spin mx-auto" /> : 'Submit for Verification →'}
                </button>
              </div>
            )}

            {/* Bank Transfer Section */}
            {selectedMethod === 'bank_transfer' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <FaBuilding className="text-primary-600" /> Bank Account Details
                  </h3>
                  {loadingBankDetails ? (
                    <div className="text-center py-4"><FaSpinner className="animate-spin mx-auto" /><p className="text-sm mt-2">Loading...</p></div>
                  ) : bankDetails ? (
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500">Account Holder Name</p>
                        <div className="flex justify-between items-center">
                          <p className="font-semibold">{bankDetails.account_name}</p>
                          <button onClick={() => handleCopyBankField(bankDetails.account_name, 'Account Name')} className="text-primary-600">
                            {selectedBankField === 'Account Name' ? <FaCheckCircle /> : <FaCopy />}
                          </button>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500">Account Number</p>
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-primary-600">{bankDetails.account_number}</p>
                          <button onClick={() => handleCopyBankField(bankDetails.account_number, 'Account Number')} className="text-primary-600">
                            {selectedBankField === 'Account Number' ? <FaCheckCircle /> : <FaCopy />}
                          </button>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500">IFSC Code</p>
                        <div className="flex justify-between items-center">
                          <p className="font-semibold">{bankDetails.ifsc_code}</p>
                          <button onClick={() => handleCopyBankField(bankDetails.ifsc_code, 'IFSC Code')} className="text-primary-600">
                            {selectedBankField === 'IFSC Code' ? <FaCheckCircle /> : <FaCopy />}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-500">Bank Name</p>
                          <p className="text-sm font-semibold">{bankDetails.bank_name}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-500">Branch</p>
                          <p className="text-sm font-semibold">{bankDetails.branch}</p>
                        </div>
                      </div>
                      {bankDetails.upi_id && (
                        <div className="bg-white rounded-lg p-3 border border-green-200 bg-green-50">
                          <p className="text-xs text-gray-500">UPI ID (Alternate)</p>
                          <div className="flex justify-between items-center">
                            <p className="font-semibold text-green-700">{bankDetails.upi_id}</p>
                            <button onClick={() => handleCopyBankField(bankDetails.upi_id, 'UPI ID')} className="text-primary-600">
                              {selectedBankField === 'UPI ID' ? <FaCheckCircle /> : <FaCopy />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-red-500">Failed to load bank details</div>
                  )}
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-semibold mb-2">📝 Instructions:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>Use the exact account number shown above</li>
                      <li>Include your Order ID in payment description</li>
                      <li>Upload screenshot below for verification</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Transaction ID / UTR Number *</label>
                  <input 
                    type="text" 
                    value={transactionId} 
                    onChange={(e) => setTransactionId(e.target.value)} 
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Enter bank transaction reference number" 
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Payment Screenshot *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      id="bank-screenshot" 
                    />
                    <label htmlFor="bank-screenshot" className="bg-primary-600 text-white px-4 py-2 rounded-lg cursor-pointer inline-block">
                      Choose File
                    </label>
                    {screenshot && <p className="text-sm text-green-600 mt-2">✓ {screenshot.name}</p>}
                    {screenshotPreview && <img src={screenshotPreview} alt="Preview" className="max-h-32 mx-auto mt-2 rounded" />}
                  </div>
                </div>
                <button 
                  onClick={handleManualPaymentSubmit} 
                  disabled={submitting || !transactionId || !screenshot} 
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold disabled:opacity-50"
                >
                  {submitting ? <FaSpinner className="animate-spin mx-auto" /> : 'Submit for Verification →'}
                </button>
              </div>
            )}

            {/* Pending Status Section */}
            {verificationStatus === 'pending' && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaClock className="text-yellow-600" />
                  <span className="font-semibold">Verification Pending ({formatElapsedTime})</span>
                </div>
                <p className="text-sm text-gray-600">Your payment proof has been submitted. Our team will verify within 24 hours.</p>
                <button 
                  onClick={handleManualCheck} 
                  disabled={checkingStatus} 
                  className="mt-3 text-primary-600 text-sm hover:underline flex items-center gap-1"
                >
                  {checkingStatus ? <FaSpinner className="animate-spin" /> : <FaEye />} Check Status
                </button>
              </div>
            )}

            {/* Support Section */}
            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-gray-500 text-center mb-3">Need help with payment?</p>
              <div className="flex gap-3">
                <a href={`https://wa.me/${YOUR_PHONE}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 border border-green-500 text-green-600 py-2 rounded-lg hover:bg-green-50">
                    <FaWhatsapp /> WhatsApp
                  </button>
                </a>
                <a href="mailto:sjsglobaltech@gmail.com" className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 border border-primary-500 text-primary-600 py-2 rounded-lg hover:bg-primary-50">
                    <FaEnvelope /> Email
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;


