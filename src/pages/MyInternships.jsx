import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBriefcase, FaClock, FaCheckCircle, FaSpinner, FaRedo, FaArrowRight, FaBookOpen } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const MyInternships = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0
  });

  const fetchMyInternships = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view your internships');
        navigate('/login');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // ✅ Use the correct endpoint
      const response = await api.get('/user/my-internships', config);
      
      console.log("My internships response:", response.data);
      
      if (response.data.success) {
        const internshipList = response.data.internships || [];
        setInternships(internshipList);
        
        const active = internshipList.filter(i => i.status === 'active' || i.status === 'in_progress').length;
        const completed = internshipList.filter(i => i.status === 'completed').length;
        
        setStats({
          total: internshipList.length,
          active: active,
          completed: completed
        });
        
        if (!silent && internshipList.length > 0) {
          toast.success(`Loaded ${internshipList.length} internships`);
        } else if (!silent && internshipList.length === 0) {
          toast.success("You haven't enrolled in any internships yet");
        }
      } else {
        setInternships([]);
        setStats({ total: 0, active: 0, completed: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch internships:', error);
      if (!silent) {
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          navigate('/login');
        } else if (error.response?.status === 404) {
          toast.error('API endpoint not found. Please contact support.');
        } else {
          toast.error('Failed to load your internships');
        }
      }
      setInternships([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchMyInternships(false);
  };

  useEffect(() => {
    const handleInternshipApproved = (event) => {
      console.log("Internship approved event received:", event.detail);
      setTimeout(() => {
        fetchMyInternships(false);
      }, 2000);
    };
    
    window.addEventListener('internshipPaymentApproved', handleInternshipApproved);
    window.addEventListener('paymentApproved', handleInternshipApproved);
    
    return () => {
      window.removeEventListener('internshipPaymentApproved', handleInternshipApproved);
      window.removeEventListener('paymentApproved', handleInternshipApproved);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'student') {
      navigate('/login');
      return;
    }
    
    fetchMyInternships();
    
    const interval = setInterval(() => {
      fetchMyInternships(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Internships</h1>
              <p className="text-gray-600 mt-1">View all your enrolled internships</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              <FaRedo className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {stats.total > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Internships</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                  </div>
                  <FaBriefcase className="text-3xl text-primary-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">In Progress</p>
                    <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <FaClock className="text-3xl text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Completed</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.completed}</p>
                  </div>
                  <FaCheckCircle className="text-3xl text-blue-600" />
                </div>
              </div>
            </div>
          )}

          {internships.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <FaBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Internships Enrolled Yet</h3>
              <p className="text-gray-600 mb-6">You haven't enrolled in any internships yet. Browse our internships and start your journey!</p>
              <Link to="/internship">
                <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                  Browse Internships →
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {internships.map((internship) => (
                <div key={internship.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-4 text-white">
                    <h3 className="text-xl font-bold">{internship.title}</h3>
                    <p className="text-sm opacity-90">{internship.duration}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {internship.description || "Gain practical experience with this internship program."}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-xs text-gray-500">Mode</span>
                        <p className="text-sm font-semibold text-gray-700">{internship.mode || 'Online'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Stipend</span>
                        <p className="text-sm font-semibold text-primary-600">
                          {internship.fee === 0 ? 'Free' : `₹${internship.fee?.toLocaleString()}`}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                        {internship.status === 'active' ? 'Enrolled' : internship.status}
                      </span>
                    </div>
                    <Link to={`/internship/${internship.id}`}>
                      <button className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2">
                        View Details <FaArrowRight size={12} />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyInternships;