// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   FaCopy,
//   FaCheckCircle,
//   FaArrowLeft,
//   FaWhatsapp,
//   FaDownload,
//   FaSpinner,
//   FaMoneyBillWave,
//   FaEnvelope
// } from "react-icons/fa";
// import toast from "react-hot-toast";
// import api from "../services/api";

// const YOUR_UPI_ID = "sjsacademy@okhdfcbank";
// const YOUR_PHONE = "918950026639";  // ✅ Fixed phone number

// const PaymentPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [copied, setCopied] = useState(false);
//   const [verifying, setVerifying] = useState(false);
//   const [paymentStatus, setPaymentStatus] = useState(null);

//   const { orderId, totalAmount, courses } = location.state || {};

//   useEffect(() => {
//     if (!orderId) {
//       toast.error("No order found");
//       navigate("/cart");
//     }
//   }, [orderId, navigate]);

//   const handleCopyUPI = () => {
//     navigator.clipboard.writeText(YOUR_UPI_ID);
//     setCopied(true);
//     toast.success("UPI ID copied!");
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

//   // ✅ FIXED: Added /api/ prefix
//   const handleVerifyPayment = async () => {
//     if (!orderId) {
//       toast.error("No order found");
//       navigate("/cart");
//       return;
//     }

//     setVerifying(true);

//     try {
//       const response = await api.post("/api/cart/verify-payment", {
//         order_id: orderId,
//         payment_method: "upi",
//       });

//       if (response.data.success) {
//         setPaymentStatus("success");
//         toast.success("✅ Payment successful! Courses added to your account.");
//         setTimeout(() => {
//           navigate("/my-courses");
//         }, 2000);
//       } else {
//         toast.error(response.data.error || "Verification failed");
//       }
//     } catch (error) {
//       console.error("Verification error:", error);
//       toast.error(error.response?.data?.error || "Something went wrong. Please contact support.");
//     } finally {
//       setVerifying(false);
//     }
//   };

//   if (paymentStatus === "success") {
//     return (
//       <div className="min-h-screen bg-gray-50 py-16">
//         <div className="container mx-auto px-4 max-w-md">
//           <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
//             <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">
//               Payment Successful!
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Your courses have been added to your account.
//             </p>
//             <button
//               onClick={() => navigate("/my-courses")}
//               className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
//             >
//               Go to My Courses
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-16">
//       <div className="container mx-auto px-4 max-w-2xl">
//         <button
//           onClick={() => navigate("/cart")}
//           className="flex items-center gap-2 text-primary-600 mb-6 hover:underline"
//         >
//           <FaArrowLeft /> Back to Cart
//         </button>

//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white text-center">
//             <h1 className="text-2xl font-bold">Complete Payment</h1>
//             <p className="text-primary-100 mt-2">
//               Pay via UPI & Get Instant Access
//             </p>
//           </div>

//           {/* Amount Section */}
//           <div className="p-6 text-center border-b">
//             <p className="text-gray-500 mb-2">Amount to Pay</p>
//             <p className="text-4xl font-bold text-gray-800">
//               ₹{totalAmount?.toLocaleString()}
//             </p>
//           </div>

//           {/* Courses List */}
//           {courses && courses.length > 0 && (
//             <div className="p-6 border-b bg-gray-50">
//               <h3 className="font-semibold mb-3 flex items-center gap-2">
//                 <FaMoneyBillWave className="text-primary-600" /> Order Summary
//               </h3>
//               {courses.map((course, idx) => (
//                 <div key={idx} className="flex justify-between text-sm mb-2">
//                   <span>{course.name}</span>
//                   <span className="font-semibold">
//                     ₹{course.price?.toLocaleString()}
//                   </span>
//                 </div>
//               ))}
//               <div className="border-t pt-2 mt-2 font-bold flex justify-between">
//                 <span>Total</span>
//                 <span className="text-primary-600">
//                   ₹{totalAmount?.toLocaleString()}
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* UPI Payment Section */}
//           <div className="p-6">
//             <h2 className="text-xl font-bold text-center mb-4">
//               Pay with UPI (Instant Access)
//             </h2>

//             {/* QR Code */}
//             <div className="text-center mb-6">
//               <p className="text-gray-600 mb-3">
//                 Scan QR code with any UPI app
//               </p>
//               <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-primary-200 inline-block">
//                 <img
//                   src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(YOUR_UPI_ID)}`}
//                   alt="UPI QR Code"
//                   className="w-64 h-64 object-contain"
//                 />
//               </div>
//               <button
//                 onClick={handleDownloadQR}
//                 className="mt-3 text-primary-600 text-sm flex items-center gap-1 mx-auto"
//               >
//                 <FaDownload /> Download QR Code
//               </button>
//             </div>

//             {/* UPI ID */}
//             <div className="text-center mb-6">
//               <p className="text-gray-600 mb-2">Or pay using UPI ID</p>
//               <div className="flex items-center justify-center gap-3 flex-wrap">
//                 <code className="bg-gray-100 px-4 py-2 rounded-lg font-mono text-primary-600 text-lg">
//                   {YOUR_UPI_ID}
//                 </code>
//                 <button
//                   onClick={handleCopyUPI}
//                   className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
//                 >
//                   {copied ? <FaCheckCircle /> : <FaCopy />}
//                   {copied ? "Copied!" : "Copy"}
//                 </button>
//               </div>
//             </div>

//             {/* Instructions */}
//             <div className="bg-blue-50 rounded-xl p-4 mb-6">
//               <p className="font-semibold mb-2">How to get instant access:</p>
//               <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
//                 <li>Open Google Pay / PhonePe / Paytm / Any UPI app</li>
//                 <li>
//                   Scan QR code or enter UPI ID: <strong>{YOUR_UPI_ID}</strong>
//                 </li>
//                 <li>
//                   Enter amount:{" "}
//                   <strong>₹{totalAmount?.toLocaleString()}</strong>
//                 </li>
//                 <li>Make the payment</li>
//                 <li>
//                   Click <strong>"I have completed the payment"</strong> below
//                 </li>
//                 <li>
//                   Your courses will be added{" "}
//                   <strong className="text-green-600">INSTANTLY</strong> to your
//                   account!
//                 </li>
//               </ol>
//             </div>

//             {/* Payment Options Note */}
//             <div className="bg-purple-50 rounded-xl p-4 mb-6">
//               <p className="font-semibold mb-2">📱 Other Payment Options</p>
//               <p className="text-sm text-gray-700">
//                 For NetBanking, Card, or other payment methods, please contact
//                 us on WhatsApp.
//               </p>
//             </div>

//             {/* Confirm Button - Immediate Access */}
//             <button
//               onClick={handleVerifyPayment}
//               disabled={verifying}
//               className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 mb-3 flex items-center justify-center gap-2"
//             >
//               {verifying ? (
//                 <>
//                   <FaSpinner className="animate-spin" /> Verifying Payment...
//                 </>
//               ) : (
//                 <>
//                   <FaCheckCircle /> I have completed the payment - Get Instant
//                   Access
//                 </>
//               )}
//             </button>

//             {/* Support Buttons */}
//             <div className="flex gap-3">
//               <a
//                 href={`https://wa.me/${YOUR_PHONE}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex-1"
//               >
//                 <button className="w-full flex items-center justify-center gap-2 border border-green-500 text-green-600 py-2 rounded-lg hover:bg-green-50 transition">
//                   <FaWhatsapp /> WhatsApp Support
//                 </button>
//               </a>
//               <a href="mailto:sjsglobaltech@gmail.com" className="flex-1">
//                 <button className="w-full flex items-center justify-center gap-2 border border-primary-500 text-primary-600 py-2 rounded-lg hover:bg-primary-50 transition">
//                   <FaEnvelope /> Email Support
//                 </button>
//               </a>
//             </div>

//             {/* Note */}
//             <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-center">
//               <p className="text-xs text-yellow-700">
//                 ⚡ After payment, click the button above to get{" "}
//                 <strong>INSTANT access</strong> to your courses!
//                 <br />
//                 For assistance, contact us on WhatsApp.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;






import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaCopy,
  FaCheckCircle,
  FaArrowLeft,
  FaWhatsapp,
  FaDownload,
  FaSpinner,
  FaMoneyBillWave,
  FaEnvelope,
  FaUniversity,
  FaCreditCard,
  FaMobileAlt,
  FaGooglePay,
  FaPhoneAlt,
  FaQrcode
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../services/api";

// Payment methods configuration
const PAYMENT_METHODS = {
  UPI: {
    id: 'upi',
    name: 'UPI (Google Pay / PhonePe / Paytm)',
    icon: <FaGooglePay className="text-blue-600" />,
    description: 'Instant access after payment'
  },
  RAZORPAY: {
    id: 'razorpay',
    name: 'Cards / NetBanking / UPI',
    icon: <FaCreditCard className="text-purple-600" />,
    description: 'Credit/Debit Card, NetBanking'
  },
  STRIPE: {
    id: 'stripe',
    name: 'International Cards',
    icon: <FaCreditCard className="text-green-600" />,
    description: 'Visa, Mastercard, Amex (USD/EUR)'
  },
  BANK_TRANSFER: {
    id: 'bank_transfer',
    name: 'Bank Transfer / NEFT / RTGS',
    icon: <FaUniversity className="text-orange-600" />,
    description: 'Manual verification (24-48 hours)'
  }
};

const YOUR_UPI_ID = "sjsacademy@okhdfcbank";
const YOUR_PHONE = "918950026639";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [bankDetails, setBankDetails] = useState(null);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  const { orderId, totalAmount, courses, internshipId, internshipTitle } = location.state || {};
  const isInternship = !!internshipId;

  useEffect(() => {
    if (!orderId) {
      toast.error("No order found");
      navigate(isInternship ? "/internship" : "/cart");
    }
    fetchPaymentMethods();
  }, [orderId, navigate, isInternship]);

  const fetchPaymentMethods = async () => {
    setLoadingMethods(true);
    try {
      const response = await api.get("/api/payment/payment-methods");
      if (response.data.success) {
        // Methods will be used to show available options
        console.log("Payment methods:", response.data.payment_methods);
      }
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
    } finally {
      setLoadingMethods(false);
    }
  };

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

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(YOUR_UPI_ID);
    setCopied(true);
    toast.success("UPI ID copied!");
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

  // Razorpay Payment (Indian Users)
  const handleRazorpayPayment = async () => {
    setVerifying(true);
    try {
      // Create Razorpay order
      const response = await api.post("/api/payment/create-razorpay-order", {
        amount: totalAmount,
        internship_id: internshipId,
        internship_title: internshipTitle,
        order_type: isInternship ? 'internship' : 'course'
      });

      if (response.data.success) {
        const options = {
          key: response.data.key_id,
          amount: response.data.amount,
          currency: response.data.currency,
          name: "SJS Global Tech Academy",
          description: isInternship ? internshipTitle : "Course Purchase",
          order_id: response.data.order_id,
          handler: async (razorpayResponse) => {
            // Verify payment
            const verifyRes = await api.post("/api/payment/verify-razorpay-payment", {
              order_id: razorpayResponse.razorpay_order_id,
              payment_id: razorpayResponse.razorpay_payment_id,
              signature: razorpayResponse.razorpay_signature
            });

            if (verifyRes.data.success) {
              toast.success("Payment successful!");
              setPaymentStatus("success");
              setTimeout(() => {
                navigate(isInternship ? "/my-internships" : "/my-courses");
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
      setVerifying(false);
    }
  };

  // Stripe Payment (International Users)
  const handleStripePayment = async () => {
    setVerifying(true);
    try {
      const response = await api.post("/api/payment/create-stripe-payment-intent", {
        amount: totalAmount,
        currency: 'usd',
        internship_id: internshipId,
        internship_title: internshipTitle,
        order_type: isInternship ? 'internship' : 'course'
      });

      if (response.data.success) {
        // Redirect to Stripe Checkout or use Stripe Elements
        window.location.href = `/stripe-checkout?clientSecret=${response.data.clientSecret}`;
      }
    } catch (error) {
      console.error("Stripe error:", error);
      toast.error("Failed to initialize Stripe payment");
    } finally {
      setVerifying(false);
    }
  };

  // Manual Payment Verification (Bank Transfer / UPI Screenshot)
  const handleManualPaymentVerification = async () => {
    if (!transactionId) {
      toast.error("Please enter Transaction ID / UTR Number");
      return;
    }

    if (!screenshotFile && selectedMethod === 'bank_transfer') {
      toast.error("Please upload payment screenshot");
      return;
    }

    setVerifying(true);

    try {
      let screenshotUrl = null;

      // Upload screenshot if provided
      if (screenshotFile) {
        const formData = new FormData();
        formData.append("screenshot", screenshotFile);
        formData.append("order_id", orderId);
        formData.append("payment_method", selectedMethod);

        const uploadRes = await api.post("/api/payment/upload-screenshot", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        if (uploadRes.data.success) {
          screenshotUrl = uploadRes.data.screenshot_url;
        }
      }

      // Submit verification
      const response = await api.post("/api/payment/submit-verification", {
        order_id: orderId,
        transaction_id: transactionId,
        screenshot_url: screenshotUrl,
        payment_method: selectedMethod
      });

      if (response.data.success) {
        toast.success("Payment verification submitted! Admin will verify within 24 hours.");
        setTimeout(() => {
          navigate(isInternship ? "/internship" : "/");
        }, 2000);
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(error.response?.data?.error || "Failed to submit verification");
    } finally {
      setVerifying(false);
    }
  };

  const handleMethodSelect = async (methodId) => {
    setSelectedMethod(methodId);
    if (methodId === 'bank_transfer') {
      await fetchBankDetails();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              {isInternship 
                ? "You have been successfully enrolled in the internship!"
                : "Your courses have been added to your account."}
            </p>
            <button
              onClick={() => navigate(isInternship ? "/my-internships" : "/my-courses")}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              {isInternship ? "Go to My Internships" : "Go to My Courses"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={() => navigate(isInternship ? "/internship" : "/cart")}
          className="flex items-center gap-2 text-primary-600 mb-6 hover:underline"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white text-center">
            <h1 className="text-2xl font-bold">Complete Payment</h1>
            <p className="text-primary-100 mt-2">
              {isInternship ? "Enroll in Internship" : "Purchase Courses"}
            </p>
          </div>

          {/* Amount Section */}
          <div className="p-6 text-center border-b">
            <p className="text-gray-500 mb-2">Amount to Pay</p>
            <p className="text-4xl font-bold text-gray-800">
              ₹{totalAmount?.toLocaleString()}
            </p>
          </div>

          {/* Order Summary */}
          {(courses || internshipTitle) && (
            <div className="p-6 border-b bg-gray-50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FaMoneyBillWave className="text-primary-600" /> Order Summary
              </h3>
              {isInternship ? (
                <div className="flex justify-between text-sm mb-2">
                  <span>{internshipTitle}</span>
                  <span className="font-semibold">₹{totalAmount?.toLocaleString()}</span>
                </div>
              ) : (
                courses?.map((course, idx) => (
                  <div key={idx} className="flex justify-between text-sm mb-2">
                    <span>{course.name}</span>
                    <span className="font-semibold">₹{course.price?.toLocaleString()}</span>
                  </div>
                ))
              )}
              <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                <span>Total</span>
                <span className="text-primary-600">₹{totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="p-6 border-b">
            <h3 className="font-semibold mb-4">Select Payment Method</h3>
            <div className="space-y-3">
              {/* UPI Option */}
              <div
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  selectedMethod === 'upi' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleMethodSelect('upi')}
              >
                <div className="flex items-center gap-3">
                  <FaMobileAlt className="text-blue-600 text-xl" />
                  <div>
                    <p className="font-semibold">UPI (Instant Access)</p>
                    <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</p>
                  </div>
                  {selectedMethod === 'upi' && <FaCheckCircle className="text-primary-600 ml-auto" />}
                </div>
              </div>

              {/* Razorpay Option */}
              <div
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  selectedMethod === 'razorpay' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleMethodSelect('razorpay')}
              >
                <div className="flex items-center gap-3">
                  <FaCreditCard className="text-purple-600 text-xl" />
                  <div>
                    <p className="font-semibold">Cards / NetBanking / UPI</p>
                    <p className="text-sm text-gray-500">Credit/Debit Card, NetBanking</p>
                  </div>
                  {selectedMethod === 'razorpay' && <FaCheckCircle className="text-primary-600 ml-auto" />}
                </div>
              </div>

              {/* Bank Transfer Option */}
              <div
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  selectedMethod === 'bank_transfer' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleMethodSelect('bank_transfer')}
              >
                <div className="flex items-center gap-3">
                  <FaUniversity className="text-orange-600 text-xl" />
                  <div>
                    <p className="font-semibold">Bank Transfer / NEFT / RTGS</p>
                    <p className="text-sm text-gray-500">Manual verification (24-48 hours)</p>
                  </div>
                  {selectedMethod === 'bank_transfer' && <FaCheckCircle className="text-primary-600 ml-auto" />}
                </div>
              </div>
            </div>
          </div>

          {/* UPI Payment Section */}
          {selectedMethod === 'upi' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-center mb-4">
                Pay with UPI (Instant Access)
              </h2>

              <div className="text-center mb-6">
                <p className="text-gray-600 mb-3">Scan QR code with any UPI app</p>
                <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-primary-200 inline-block">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(YOUR_UPI_ID)}`}
                    alt="UPI QR Code"
                    className="w-64 h-64 object-contain"
                  />
                </div>
                <button
                  onClick={handleDownloadQR}
                  className="mt-3 text-primary-600 text-sm flex items-center gap-1 mx-auto"
                >
                  <FaDownload /> Download QR Code
                </button>
              </div>

              <div className="text-center mb-6">
                <p className="text-gray-600 mb-2">Or pay using UPI ID</p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <code className="bg-gray-100 px-4 py-2 rounded-lg font-mono text-primary-600 text-lg">
                    {YOUR_UPI_ID}
                  </code>
                  <button
                    onClick={handleCopyUPI}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                  >
                    {copied ? <FaCheckCircle /> : <FaCopy />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <p className="font-semibold mb-2">How to get instant access:</p>
                <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                  <li>Open Google Pay / PhonePe / Paytm / Any UPI app</li>
                  <li>Scan QR code or enter UPI ID: <strong>{YOUR_UPI_ID}</strong></li>
                  <li>Enter amount: <strong>₹{totalAmount?.toLocaleString()}</strong></li>
                  <li>Make the payment</li>
                  <li>Click <strong>"I have completed the payment"</strong> below</li>
                  <li>Your {isInternship ? "internship enrollment" : "courses"} will be added <strong className="text-green-600">INSTANTLY</strong>!</li>
                </ol>
              </div>

              <button
                onClick={handleManualPaymentVerification}
                disabled={verifying}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 mb-3 flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <><FaSpinner className="animate-spin" /> Verifying Payment...</>
                ) : (
                  <><FaCheckCircle /> I have completed the payment - Get Instant Access</>
                )}
              </button>
            </div>
          )}

          {/* Razorpay Section */}
          {selectedMethod === 'razorpay' && (
            <div className="p-6">
              <div className="bg-purple-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-700">
                  You will be redirected to Razorpay secure payment page.
                  Supports Credit/Debit Cards, NetBanking, and UPI.
                </p>
              </div>
              <button
                onClick={handleRazorpayPayment}
                disabled={verifying}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <><FaSpinner className="animate-spin" /> Processing...</>
                ) : (
                  <><FaCreditCard /> Pay with Cards / NetBanking</>
                )}
              </button>
            </div>
          )}

          {/* Bank Transfer Section */}
          {selectedMethod === 'bank_transfer' && bankDetails && (
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold mb-3">Bank Account Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Account Name:</strong> {bankDetails.account_name}</p>
                  <p><strong>Account Number:</strong> {bankDetails.account_number}</p>
                  <p><strong>Bank Name:</strong> {bankDetails.bank_name}</p>
                  <p><strong>IFSC Code:</strong> {bankDetails.ifsc_code}</p>
                  <p><strong>Branch:</strong> {bankDetails.branch}</p>
                  {bankDetails.upi_id && (
                    <p><strong>UPI ID:</strong> {bankDetails.upi_id}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Transaction ID / UTR Number *</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter transaction ID"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Payment Screenshot *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
                {screenshotPreview && (
                  <div className="mt-2">
                    <img src={screenshotPreview} alt="Preview" className="h-32 object-contain" />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Upload screenshot of payment confirmation</p>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  ⚠️ Bank transfers take 24-48 hours to verify. Your {isInternship ? "internship" : "courses"} will be activated after admin approval.
                </p>
              </div>

              <button
                onClick={handleManualPaymentVerification}
                disabled={verifying}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <><FaSpinner className="animate-spin" /> Submitting...</>
                ) : (
                  <><FaCheckCircle /> Submit for Verification</>
                )}
              </button>
            </div>
          )}

          {/* Support Section */}
          <div className="p-6 border-t bg-gray-50">
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
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-center">
              <p className="text-xs text-yellow-700">
                ⚡ For UPI payments, click the button above after payment to get INSTANT access!
                <br />
                For assistance, contact us on WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;