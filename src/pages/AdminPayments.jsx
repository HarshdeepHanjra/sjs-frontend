import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaClock, FaRupeeSign, FaUser, FaEnvelope, FaBook, FaSpinner, FaTimesCircle, FaEye, FaImage, FaComment, FaCheck, FaTimes } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminPayments = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [viewImage, setViewImage] = useState(null);
  const [paymentStats, setPaymentStats] = useState(null);

  useEffect(() => {
    fetchPendingPayments();
    fetchPaymentStats();
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchPendingPayments();
      fetchPaymentStats();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ FIXED: Added /api/ prefix
  const fetchPendingPayments = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const config = {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const response = await api.get('/api/admin/payment-requests', config);
      console.log("Payment requests response:", response.data);
      
      if (response.data.success) {
        setPendingPayments(response.data.verifications || []);
      } else {
        setPendingPayments([]);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Please check if backend is running.');
      } else {
        toast.error('Failed to load pending payments');
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Added /api/ prefix
  const fetchPaymentStats = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) return;
    
    try {
      const config = {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const response = await api.get('/api/admin/payment-stats', config);
      if (response.data.success) {
        setPaymentStats(response.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // ✅ FIXED: Added /api/ prefix
  const handleApprove = async (payment) => {
    setProcessingId(payment.id);
    const token = sessionStorage.getItem('token');
    
    try {
      const config = {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const response = await api.post(`/api/admin/payment-requests/${payment.id}/approve`, {
        notes: adminNotes || 'Payment verified and approved successfully.'
      }, config);
      
      if (response.data.success) {
        toast.success('Payment approved! Courses have been added to student account.');
        
        // Refresh lists
        await fetchPendingPayments();
        await fetchPaymentStats();
        
        // Close modal
        setSelectedPayment(null);
        setAdminNotes('');
        
        // Dispatch event to update other components
        window.dispatchEvent(new CustomEvent('paymentApproved', { 
          detail: { 
            orderId: payment.order_id,
            studentId: payment.student_id,
            coursesAdded: response.data.courses_added || []
          } 
        }));
        
        // Show additional success message for courses added
        if (response.data.courses_added && response.data.courses_added.length > 0) {
          toast.success(`${response.data.courses_added.length} course(s) added to student's account`);
        }
      } else {
        toast.error(response.data.message || 'Failed to approve payment');
      }
    } catch (error) {
      console.error('Approval error:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      } else {
        toast.error(error.response?.data?.message || 'Failed to approve payment');
      }
    } finally {
      setProcessingId(null);
    }
  };

  // ✅ FIXED: Added /api/ prefix
  const handleDecline = async (payment) => {
    setProcessingId(payment.id);
    const token = sessionStorage.getItem('token');
    
    try {
      const config = {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const response = await api.post(`/api/admin/payment-requests/${payment.id}/decline`, {
        notes: adminNotes || 'Payment verification failed. Please upload a clear screenshot.'
      }, config);
      
      if (response.data.success) {
        toast.success('Payment declined');
        
        // Refresh lists
        await fetchPendingPayments();
        await fetchPaymentStats();
        
        // Close modal
        setSelectedPayment(null);
        setAdminNotes('');
      } else {
        toast.error(response.data.message || 'Failed to decline payment');
      }
    } catch (error) {
      console.error('Decline error:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      } else {
        toast.error('Failed to decline payment');
      }
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Approved</span>;
      case 'declined':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Declined</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white">
              <h1 className="text-2xl font-bold">Payment Verification</h1>
              <p className="text-primary-100 mt-1">Verify student payments and activate courses</p>
            </div>

            {/* Stats Summary */}
            {paymentStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <p className="text-yellow-600 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-700">{paymentStats.pending || 0}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-green-600 text-sm">Approved</p>
                  <p className="text-2xl font-bold text-green-700">{paymentStats.approved || 0}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <p className="text-red-600 text-sm">Declined</p>
                  <p className="text-2xl font-bold text-red-700">{paymentStats.declined || 0}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-blue-600 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-700">₹{paymentStats.total_amount?.toLocaleString() || 0}</p>
                </div>
              </div>
            )}

            {/* Payment List */}
            <div className="p-6">
              {pendingPayments.length === 0 ? (
                <div className="text-center py-12">
                  <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800">No Pending Payments</h3>
                  <p className="text-gray-500 mt-2">All payments have been verified</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPayments.map((payment) => (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-xl p-6 hover:shadow-lg transition"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex-1">
                          {/* Order ID and Status */}
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <FaClock className="text-orange-500" />
                              <span className="text-sm text-gray-500">Order ID: {payment.order_id}</span>
                            </div>
                            {getStatusBadge(payment.status)}
                          </div>
                          
                          {/* User Info */}
                          <div className="flex flex-wrap items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <FaUser className="text-gray-400" />
                              <span className="font-semibold">{payment.student_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaEnvelope className="text-gray-400" />
                              <span className="text-gray-600">{payment.student_email}</span>
                            </div>
                          </div>
                          
                          {/* Transaction ID */}
                          {payment.transaction_id && (
                            <div className="mb-2">
                              <span className="text-sm text-gray-500">
                                <strong>Transaction ID:</strong> {payment.transaction_id}
                              </span>
                            </div>
                          )}
                          
                          {/* Total Amount */}
                          <div className="flex items-center gap-2">
                            <FaRupeeSign className="text-green-600" />
                            <span className="text-xl font-bold text-green-600">
                              Amount: ₹{payment.amount?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-4 md:mt-0">
                          {payment.screenshot_url && (
                            <button
                              onClick={() => setViewImage(payment.screenshot_url)}
                              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                            >
                              <FaEye /> View Screenshot
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedPayment(payment)}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition flex items-center gap-2"
                          >
                            Review Payment
                          </button>
                        </div>
                      </div>
                      
                      {/* Created At */}
                      <div className="mt-3 text-xs text-gray-400">
                        Submitted: {new Date(payment.created_at).toLocaleString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Review Payment Verification</h3>
                <button 
                  onClick={() => {
                    setSelectedPayment(null);
                    setAdminNotes('');
                  }} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Student Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Student Information</h4>
                  <p><strong>Name:</strong> {selectedPayment.student_name}</p>
                  <p><strong>Email:</strong> {selectedPayment.student_email}</p>
                  {selectedPayment.student_id && (
                    <p><strong>Student ID:</strong> {selectedPayment.student_id}</p>
                  )}
                </div>
                
                {/* Payment Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Payment Information</h4>
                  <p><strong>Order ID:</strong> {selectedPayment.order_id}</p>
                  <p><strong>Amount:</strong> <span className="text-primary-600 font-bold">₹{selectedPayment.amount?.toLocaleString()}</span></p>
                  {selectedPayment.transaction_id && (
                    <p><strong>Transaction ID:</strong> {selectedPayment.transaction_id}</p>
                  )}
                  <p><strong>Submitted:</strong> {new Date(selectedPayment.created_at).toLocaleString()}</p>
                </div>
                
                {/* Screenshot */}
                {selectedPayment.screenshot_url && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Payment Screenshot</label>
                    <img 
                      src={selectedPayment.screenshot_url} 
                      alt="Payment Screenshot"
                      className="rounded-lg border max-h-96 mx-auto cursor-pointer"
                      onClick={() => setViewImage(selectedPayment.screenshot_url)}
                    />
                  </div>
                )}
                
                {/* Admin Notes */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Admin Notes <span className="text-gray-400 text-sm">(Optional)</span>
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="3"
                    placeholder="Add any notes about this verification..."
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleApprove(selectedPayment)}
                    disabled={processingId === selectedPayment.id}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {processingId === selectedPayment.id ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaCheck />
                    )}
                    Approve Payment
                  </button>
                  <button
                    onClick={() => handleDecline(selectedPayment)}
                    disabled={processingId === selectedPayment.id}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {processingId === selectedPayment.id ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaTimes />
                    )}
                    Decline Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image View Modal */}
      {viewImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setViewImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setViewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <FaTimes size={24} />
            </button>
            <img src={viewImage} alt="Full Size" className="max-w-full max-h-[90vh] rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;