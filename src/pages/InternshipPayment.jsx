import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaCopy,
  FaCheckCircle,
  FaArrowLeft,
  FaWhatsapp,
  FaDownload,
  FaSpinner,
  FaUpload,
  FaClock,
  FaTimesCircle,
  FaEye,
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../services/api";

const YOUR_UPI_ID = "sjsacademy@okhdfcbank";

const InternshipPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [verificationId, setVerificationId] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [checkingStatus, setCheckingStatus] = useState(false);

  const { internshipId } = useParams();
  const { internship } = location.state || {};

  useEffect(() => {
    if (!internship) {
      navigate("/internship");
    }
  }, [internship, navigate]);

  // Check verification status periodically
  useEffect(() => {
    let interval;
    if (verificationId && paymentStatus === "pending") {
      interval = setInterval(() => checkStatus(), 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [verificationId, paymentStatus]);

  // ✅ FIXED: Added /api/ prefix
  const checkStatus = async () => {
    if (!verificationId) return;

    setCheckingStatus(true);
    try {
      const response = await api.get(`/api/payment/status/${verificationId}`);
      if (response.data.success) {
        const newStatus = response.data.status;
        if (newStatus !== paymentStatus) {
          setPaymentStatus(newStatus);
          setAdminNotes(response.data.admin_notes || "");

          if (newStatus === "approved") {
            toast.success(
              "Payment verified! You are now enrolled in the internship.",
            );
            setTimeout(() => navigate("/my-internships"), 3000);
          } else if (newStatus === "declined") {
            toast.error("Payment verification failed. Please contact support.");
          }
        }
      }
    } catch (error) {
      console.error("Status check error:", error);
    } finally {
      setCheckingStatus(false);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg")
    ) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setScreenshot(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload PNG or JPG file");
    }
  };

  // ✅ FIXED: Added /api/ prefix
  const handleCreateOrder = async () => {
    setVerifying(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const userData = JSON.parse(localStorage.getItem("user") || "{}");

      console.log("Creating order with data:", {
        internship_id: internship.id,
        internship_title: internship.title,
        amount: internship.fee,
      });

      const response = await api.post("/api/internship/create-order", {
        internship_id: internship.id,
        internship_title: internship.title,
        amount: internship.fee,
        phone: userData.phone || "",
      });

      console.log("Order creation response:", response.data);

      if (response.data.success) {
        setOrderId(response.data.order_id);
        toast.success("Order created! Please upload payment screenshot.");
      } else {
        toast.error(response.data.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      if (error.code === "ERR_NETWORK") {
        toast.error(
          "Cannot connect to server. Please check if backend is running",
        );
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.error || "Failed to create order");
      }
    } finally {
      setVerifying(false);
    }
  };

  // ✅ FIXED: Added /api/ prefix
  const handleUploadAndVerify = async () => {
    if (!screenshot) {
      toast.error("Please upload payment screenshot");
      return;
    }

    if (!orderId) {
      toast.error("No order found. Please create order first.");
      return;
    }

    setVerifying(true);

    const formData = new FormData();
    formData.append("screenshot", screenshot);
    formData.append("order_id", orderId);

    try {
      // Upload screenshot
      const uploadResponse = await api.post(
        "/api/payment/upload-screenshot",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (uploadResponse.data.success) {
        const screenshotUrl = uploadResponse.data.screenshot_url;

        // Submit verification
        const verifyResponse = await api.post("/api/payment/submit-verification", {
          order_id: orderId,
          transaction_id: `TXN_${Date.now()}`,
          screenshot_url: screenshotUrl,
        });

        if (verifyResponse.data.success) {
          setVerificationId(verifyResponse.data.verification_id);
          setPaymentStatus("pending");

          // Save to localStorage for recovery
          const pendingData = {
            verificationId: verifyResponse.data.verification_id,
            orderId: orderId,
            timestamp: new Date().toISOString(),
          };
          localStorage.setItem(
            "pendingInternshipVerification",
            JSON.stringify(pendingData),
          );

          toast.success(
            "Payment verification submitted! Admin will review within 24 hours.",
          );
        } else {
          toast.error(verifyResponse.data.error || "Verification failed");
        }
      } else {
        toast.error(uploadResponse.data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.error || "Payment verification failed");
    } finally {
      setVerifying(false);
    }
  };

  // ✅ FIXED: Added /api/ prefix
  const handleFreeEnroll = async () => {
    setVerifying(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await api.post("/api/internship/enroll-free", {
        internship_id: internship.id,
        internship_title: internship.title,
      }, config);

      if (response.data.success) {
        toast.success("Successfully enrolled in FREE internship!");
        navigate("/my-internships");
      } else {
        toast.error(response.data.error || "Failed to enroll");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error(error.response?.data?.error || "Failed to enroll in internship");
    } finally {
      setVerifying(false);
    }
  };

  // Approved status view
  if (paymentStatus === "approved") {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Verified!
            </h2>
            <p className="text-gray-600 mb-4">
              Your payment has been verified successfully.
            </p>
            <p className="text-gray-600 mb-4">
              You are now enrolled in {internship?.title}.
            </p>
            {adminNotes && (
              <div className="bg-green-50 p-3 rounded-lg mb-4 text-sm">
                <p className="text-green-700">{adminNotes}</p>
              </div>
            )}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/my-internships")}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
              >
                Go to My Internships
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Declined status view
  if (paymentStatus === "declined") {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Declined
            </h2>
            {adminNotes && (
              <div className="bg-red-50 p-3 rounded-lg mb-4 text-sm">
                <p className="text-red-700">{adminNotes}</p>
              </div>
            )}
            <p className="text-gray-600 mb-6">
              Your payment could not be verified. Please contact support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary-600 text-white py-3 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!internship) {
    return null;
  }

  // Free internship - direct enrollment
  if (internship.fee === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-green-600 text-6xl mb-4">🎓</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Free Internship!
            </h2>
            <p className="text-gray-600 mb-6">
              This internship is completely free. Click below to enroll
              instantly.
            </p>
            <button
              onClick={handleFreeEnroll}
              disabled={verifying}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {verifying ? (
                <FaSpinner className="animate-spin inline mr-2" />
              ) : (
                "Enroll Now for Free →"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pending status view
  if (paymentStatus === "pending") {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <FaClock className="text-6xl text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Verification Pending
            </h2>
            <p className="text-gray-600 mb-4">
              Your payment proof has been submitted. Our team will verify within
              24 hours.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              You will receive a notification once your payment is verified.
            </p>
            <button
              onClick={checkStatus}
              disabled={checkingStatus}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {checkingStatus ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaEye />
              )}
              {checkingStatus ? "Checking..." : "Check Status"}
            </button>
            <button
              onClick={() => navigate("/internship")}
              className="w-full mt-3 bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400"
            >
              Browse More Internships
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
          onClick={() => navigate("/internship")}
          className="flex items-center gap-2 text-primary-600 mb-6"
        >
          <FaArrowLeft /> Back to Internships
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white text-center">
            <h1 className="text-2xl font-bold">Complete Payment</h1>
            <p className="text-primary-100 mt-2">{internship.title}</p>
          </div>

          <div className="p-6 text-center border-b">
            <p className="text-gray-500 mb-2">Amount to Pay</p>
            <p className="text-4xl font-bold text-gray-800">
              ₹{internship.fee?.toLocaleString()}
            </p>
            {internship.original_fee > internship.fee && (
              <p className="text-gray-400 line-through text-sm">
                Originally ₹{internship.original_fee?.toLocaleString()}
              </p>
            )}
          </div>

          {!orderId ? (
            <div className="p-6 text-center">
              <p className="text-gray-600 mb-4">
                Click below to create your payment order
              </p>
              <button
                onClick={handleCreateOrder}
                disabled={verifying}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {verifying ? (
                  <FaSpinner className="animate-spin inline mr-2" />
                ) : (
                  "Proceed to Payment"
                )}
              </button>
            </div>
          ) : (
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

              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-6">
                <FaUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Upload Payment Screenshot</p>
                <p className="text-sm text-gray-400 mb-3">
                  PNG or JPG (Max 5MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="screenshot-upload"
                />
                <label
                  htmlFor="screenshot-upload"
                  className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-700"
                >
                  Choose File
                </label>
                {screenshot && (
                  <div className="mt-3">
                    <p className="text-sm text-green-600">
                      ✓ {screenshot.name}
                    </p>
                    {screenshotPreview && (
                      <img
                        src={screenshotPreview}
                        alt="Preview"
                        className="mt-2 max-h-32 mx-auto rounded border"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Verify Button */}
              <button
                onClick={handleUploadAndVerify}
                disabled={verifying || !screenshot}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 mb-3"
              >
                {verifying ? (
                  <FaSpinner className="animate-spin inline mr-2" />
                ) : (
                  "✅ Submit for Verification"
                )}
              </button>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="font-semibold mb-2">📝 Instructions:</p>
                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                  <li>Pay using UPI QR code or UPI ID above</li>
                  <li>Take a screenshot of successful payment</li>
                  <li>Upload the screenshot above</li>
                  <li>Click "Submit for Verification"</li>
                  <li>Admin will verify within 24 hours</li>
                  <li>You will be enrolled automatically after verification</li>
                </ol>
              </div>
            </div>
          )}

          <div className="p-6 text-center border-t">
            <a
              href="https://wa.me/918950026639?text=Hello%20SJS%20Academy%2C%20I%20need%20help%20with%20my%20internship%20payment."
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <button className="w-full flex items-center justify-center gap-2 border border-green-500 text-green-600 py-2 rounded-lg hover:bg-green-50 transition">
                <FaWhatsapp /> Need Help? WhatsApp Us
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipPayment;