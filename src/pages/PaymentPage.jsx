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
  FaEnvelope
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../services/api";

const YOUR_UPI_ID = "sjsacademy@okhdfcbank";
const YOUR_PHONE = "918950026639";  // ✅ Fixed phone number

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const { orderId, totalAmount, courses } = location.state || {};

  useEffect(() => {
    if (!orderId) {
      toast.error("No order found");
      navigate("/cart");
    }
  }, [orderId, navigate]);

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

  // ✅ FIXED: Added /api/ prefix
  const handleVerifyPayment = async () => {
    if (!orderId) {
      toast.error("No order found");
      navigate("/cart");
      return;
    }

    setVerifying(true);

    try {
      const response = await api.post("/api/cart/verify-payment", {
        order_id: orderId,
        payment_method: "upi",
      });

      if (response.data.success) {
        setPaymentStatus("success");
        toast.success("✅ Payment successful! Courses added to your account.");
        setTimeout(() => {
          navigate("/my-courses");
        }, 2000);
      } else {
        toast.error(response.data.error || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(error.response?.data?.error || "Something went wrong. Please contact support.");
    } finally {
      setVerifying(false);
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
              Your courses have been added to your account.
            </p>
            <button
              onClick={() => navigate("/my-courses")}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Go to My Courses
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
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-primary-600 mb-6 hover:underline"
        >
          <FaArrowLeft /> Back to Cart
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white text-center">
            <h1 className="text-2xl font-bold">Complete Payment</h1>
            <p className="text-primary-100 mt-2">
              Pay via UPI & Get Instant Access
            </p>
          </div>

          {/* Amount Section */}
          <div className="p-6 text-center border-b">
            <p className="text-gray-500 mb-2">Amount to Pay</p>
            <p className="text-4xl font-bold text-gray-800">
              ₹{totalAmount?.toLocaleString()}
            </p>
          </div>

          {/* Courses List */}
          {courses && courses.length > 0 && (
            <div className="p-6 border-b bg-gray-50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FaMoneyBillWave className="text-primary-600" /> Order Summary
              </h3>
              {courses.map((course, idx) => (
                <div key={idx} className="flex justify-between text-sm mb-2">
                  <span>{course.name}</span>
                  <span className="font-semibold">
                    ₹{course.price?.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                <span>Total</span>
                <span className="text-primary-600">
                  ₹{totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* UPI Payment Section */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-center mb-4">
              Pay with UPI (Instant Access)
            </h2>

            {/* QR Code */}
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-3">
                Scan QR code with any UPI app
              </p>
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

            {/* UPI ID */}
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

            {/* Instructions */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="font-semibold mb-2">How to get instant access:</p>
              <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                <li>Open Google Pay / PhonePe / Paytm / Any UPI app</li>
                <li>
                  Scan QR code or enter UPI ID: <strong>{YOUR_UPI_ID}</strong>
                </li>
                <li>
                  Enter amount:{" "}
                  <strong>₹{totalAmount?.toLocaleString()}</strong>
                </li>
                <li>Make the payment</li>
                <li>
                  Click <strong>"I have completed the payment"</strong> below
                </li>
                <li>
                  Your courses will be added{" "}
                  <strong className="text-green-600">INSTANTLY</strong> to your
                  account!
                </li>
              </ol>
            </div>

            {/* Payment Options Note */}
            <div className="bg-purple-50 rounded-xl p-4 mb-6">
              <p className="font-semibold mb-2">📱 Other Payment Options</p>
              <p className="text-sm text-gray-700">
                For NetBanking, Card, or other payment methods, please contact
                us on WhatsApp.
              </p>
            </div>

            {/* Confirm Button - Immediate Access */}
            <button
              onClick={handleVerifyPayment}
              disabled={verifying}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 mb-3 flex items-center justify-center gap-2"
            >
              {verifying ? (
                <>
                  <FaSpinner className="animate-spin" /> Verifying Payment...
                </>
              ) : (
                <>
                  <FaCheckCircle /> I have completed the payment - Get Instant
                  Access
                </>
              )}
            </button>

            {/* Support Buttons */}
            <div className="flex gap-3">
              <a
                href={`https://wa.me/${YOUR_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <button className="w-full flex items-center justify-center gap-2 border border-green-500 text-green-600 py-2 rounded-lg hover:bg-green-50 transition">
                  <FaWhatsapp /> WhatsApp Support
                </button>
              </a>
              <a href="mailto:sjsglobaltech@gmail.com" className="flex-1">
                <button className="w-full flex items-center justify-center gap-2 border border-primary-500 text-primary-600 py-2 rounded-lg hover:bg-primary-50 transition">
                  <FaEnvelope /> Email Support
                </button>
              </a>
            </div>

            {/* Note */}
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-center">
              <p className="text-xs text-yellow-700">
                ⚡ After payment, click the button above to get{" "}
                <strong>INSTANT access</strong> to your courses!
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