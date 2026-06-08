import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaClock, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const PaymentPending = () => {
  const location = useLocation();
  const { orderId, totalAmount, courses } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <FaClock className="text-4xl text-yellow-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Initiated!</h1>
          <p className="text-gray-600 mb-4">
            Your order has been received. Order ID: <strong>{orderId || 'Processing'}</strong>
          </p>
          
          {courses && courses.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <p className="font-semibold mb-2">Order Summary:</p>
              {courses.map((course, idx) => (
                <div key={idx} className="flex justify-between text-sm mb-1">
                  <span>{course.name}</span>
                  <span>₹{course.price?.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 font-bold">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>₹{totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            Our team will verify your payment and activate your courses within 24 hours.
            You will receive an email confirmation once verified.
          </p>
          
          <div className="space-y-3">
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
              <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition">
                <FaWhatsapp /> Contact Support on WhatsApp
              </button>
            </a>
            <a href="mailto:support@sjsacademy.com">
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
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;