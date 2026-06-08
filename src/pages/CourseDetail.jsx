import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaClock, FaRupeeSign, FaCertificate, FaLaptopCode, 
  FaCheckCircle, FaPlayCircle, FaUsers, FaStar, FaBookOpen,
  FaShoppingCart, FaSpinner
} from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('syllabus');
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();

  // Fetch course details from backend API - REAL TIME DATA
  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      // Fetch from backend API (always gets latest data from database)
      const response = await api.get(`/courses/${id}`);
      
      if (response.data) {
        setCourse(response.data);
        console.log("Course data fetched from API:", response.data);
      } else {
        toast.error('Course not found');
        navigate('/courses');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      if (error.response?.status === 404) {
        toast.error('Course not found');
        navigate('/courses');
      } else {
        toast.error('Failed to load course details');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
    }
    
    // Listen for course update events (when admin updates course)
    const handleCourseUpdate = (event) => {
      if (event.detail?.courseId == id) {
        fetchCourseDetails();
      }
    };
    
    window.addEventListener('courseUpdated', handleCourseUpdate);
    
    return () => {
      window.removeEventListener('courseUpdated', handleCourseUpdate);
    };
  }, [id]);

  const handleAddToCart = async () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add courses to cart');
      navigate('/login', { state: { returnUrl: `/course/${id}` } });
      return;
    }

    if (!course) return;
    
    setAddingToCart(true);
    
    const courseToAdd = {
      id: course.id,
      name: course.name,
      price: course.price, // Real-time price from database
      duration: course.duration,
      quantity: 1
    };
    
    // Add to cart using context
    addToCart(courseToAdd);
    
    // Show success message
    toast.success(`${course.name} added to cart!`);
    
    setTimeout(() => {
      setAddingToCart(false);
    }, 500);
  };

  const handleBuyNow = async () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to purchase');
      navigate('/login', { state: { returnUrl: `/course/${id}` } });
      return;
    }

    if (!course) return;
    
    const courseToAdd = {
      id: course.id,
      name: course.name,
      price: course.price,
      duration: course.duration,
      quantity: 1
    };
    
    addToCart(courseToAdd);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-32">
        <div className="container mx-auto px-4 text-center">
          <FaSpinner className="text-5xl text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 py-32">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course not found</h2>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/courses')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
          >
            Browse Courses →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-orange-500 px-3 py-1 rounded-full text-sm font-semibold">
                  {course.level || 'Beginner'}
                </span>
                <div className="flex items-center">
                  <FaStar className="text-yellow-400" />
                  <span className="ml-1">{course.rating || 4.5}</span>
                </div>
                <div className="flex items-center">
                  <FaUsers />
                  <span className="ml-1">{course.students || 0}+ students</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.name}</h1>
              <p className="text-xl text-primary-100 mb-6">{course.description}</p>
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
                >
                  {addingToCart ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <FaShoppingCart />
                      Add to Cart →
                    </>
                  )}
                </button>
                <button 
                  onClick={() => navigate('/courses')}
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-600 text-white font-bold px-8 py-3 rounded-lg transition"
                >
                  Browse More Courses
                </button>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-center">
                {course.originalPrice && (
                  <p className="text-gray-300 line-through">₹{course.originalPrice.toLocaleString()}</p>
                )}
                <p className="text-4xl font-bold mb-2">₹{course.price?.toLocaleString()}</p>
                <p className="text-sm mb-4">Including all taxes</p>
                <div className="space-y-2 text-sm">
                  <p>✓ {course.duration} access</p>
                  <p>✓ Certificate on completion</p>
                  <p>✓ EMI options available</p>
                </div>
                {course.updated_at && (
                  <p className="text-xs text-gray-300 mt-4">
                    Last updated: {new Date(course.updated_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b">
              <div className="flex overflow-x-auto">
                {['syllabus', 'projects', 'tools', 'benefits'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-semibold capitalize transition ${
                      activeTab === tab
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-600 hover:text-primary-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-8">
              {activeTab === 'syllabus' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-2xl font-bold mb-6">Course Syllabus</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.syllabus && course.syllabus.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FaCheckCircle className="text-green-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'projects' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-2xl font-bold mb-6">Real-World Projects</h2>
                  <div className="space-y-4">
                    {course.projects && course.projects.map((project, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:shadow-md transition">
                        <h3 className="font-bold text-lg mb-2">{project}</h3>
                        <p className="text-gray-600">Hands-on project with real datasets and industry use cases</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'tools' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-2xl font-bold mb-6">Tools You'll Master</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {course.tools && course.tools.map((tool, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="font-semibold">{tool}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'benefits' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-2xl font-bold mb-6">What You'll Get</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.benefits && course.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <FaCheckCircle className="text-green-500" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">Join {course.students || 0}+ students who transformed their careers</p>
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition disabled:opacity-50"
          >
            {addingToCart ? 'Adding...' : 'Add to Cart →'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;