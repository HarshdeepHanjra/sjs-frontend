import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaClock, FaRupeeSign, FaCheckCircle, FaWhatsapp, FaEnvelope, FaSpinner } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const InternshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  // Fetch internship details from backend
  useEffect(() => {
    fetchInternshipDetails();
  }, [id]);

  // ✅ FIXED: Added /api/ prefix
  const fetchInternshipDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/internships/${id}`);
      if (response.data.success) {
        setInternship(response.data.internship);
      } else {
        toast.error('Internship not found');
        navigate('/internship');
      }
    } catch (error) {
      console.error('Failed to fetch internship:', error);
      if (error.response?.status === 404) {
        toast.error('Internship not found');
        navigate('/internship');
      } else {
        toast.error('Failed to load internship details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to apply for internship');
      navigate('/login', { state: { returnUrl: `/internship/${id}` } });
      return;
    }
    
    navigate(`/internship-payment/${id}`, { state: { internship } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading internship details...</p>
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Internship not found</p>
          <Link to="/internship" className="text-primary-600 hover:underline mt-4 inline-block">
            Back to Internships
          </Link>
        </div>
      </div>
    );
  }

  // Helper to get syllabus array (handle both array and string)
  const syllabusItems = Array.isArray(internship.syllabus) 
    ? internship.syllabus 
    : internship.syllabus ? internship.syllabus.split(',').map(s => s.trim()) : [];
  
  const benefitsItems = Array.isArray(internship.benefits) 
    ? internship.benefits 
    : internship.benefits ? internship.benefits.split(',').map(b => b.trim()) : [];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/internship" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6">
          <FaArrowLeft /> Back to Internships
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-white">
            <h1 className="text-3xl font-bold">{internship.title}</h1>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                <FaClock className="inline mr-1" /> {internship.duration}
              </span>
              {internship.fee === 0 ? (
                <span className="bg-green-500 px-3 py-1 rounded-full text-sm">FREE</span>
              ) : (
                <span className="bg-orange-500 px-3 py-1 rounded-full text-sm">₹{internship.fee}</span>
              )}
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {internship.mode || 'Online'}
              </span>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold mb-4">Program Overview</h2>
                <p className="text-gray-600 mb-6">{internship.description}</p>

                <h2 className="text-xl font-bold mb-4">What You'll Learn</h2>
                <ul className="space-y-2 mb-6">
                  {syllabusItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                  {syllabusItems.length === 0 && (
                    <li className="text-gray-500">Syllabus information coming soon...</li>
                  )}
                </ul>

                <h2 className="text-xl font-bold mb-4">Benefits</h2>
                <ul className="space-y-2">
                  {benefitsItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FaCheckCircle className="text-primary-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                  {benefitsItems.length === 0 && (
                    <li className="text-gray-500">Benefits information coming soon...</li>
                  )}
                </ul>
              </div>

              <div>
                <div className="bg-gray-50 rounded-xl p-6 sticky top-20">
                  <h3 className="text-lg font-bold mb-4">Quick Info</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">{internship.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mode:</span>
                      <span className="font-semibold">{internship.mode || 'Online'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-semibold">{internship.startDate || 'Monthly Batch'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Slots Available:</span>
                      <span className="font-semibold">{internship.slots || 'Limited'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fee:</span>
                      <span className={`font-bold ${internship.fee === 0 ? 'text-green-600' : 'text-primary-600'}`}>
                        {internship.fee === 0 ? 'FREE' : `₹${internship.fee}`}
                      </span>
                    </div>
                    {internship.originalFee && internship.fee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Original Fee:</span>
                        <span className="text-gray-400 line-through">₹{internship.originalFee}</span>
                      </div>
                    )}
                    {internship.stipend && internship.stipend !== 'Unpaid' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stipend:</span>
                        <span className="font-semibold text-green-600">{internship.stipend}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                  >
                    {applying ? <FaSpinner className="animate-spin inline mr-2" /> : null}
                    Apply Now →
                  </button>

                  <div className="mt-4 space-y-2">
                    <a href="https://wa.me/918950026639" target="_blank" rel="noopener noreferrer">
                      <button className="w-full flex items-center justify-center gap-2 border border-green-500 text-green-600 py-2 rounded-lg hover:bg-green-50 transition">
                        <FaWhatsapp /> WhatsApp
                      </button>
                    </a>
                    <a href="mailto:sjsglobaltech@gmail.com">
                      <button className="w-full flex items-center justify-center gap-2 border border-primary-500 text-primary-600 py-2 rounded-lg hover:bg-primary-50 transition">
                        <FaEnvelope /> Email
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetail;