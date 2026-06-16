import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaClock,
  FaRupeeSign,
  FaCalendarAlt,
  FaCheckCircle,
  FaSpinner,
  FaBookOpen,
  FaRedo,
  FaArrowRight,
  FaStar
} from "react-icons/fa";
import api from "../services/api";
import toast from "react-hot-toast";
import { FaWhatsapp} from 'react-icons/fa';

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    totalSpent: 0,
  });

  const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/FmIIVkekb68LZV0rbKW8VN?s=cl&p=a&ilr=2&amv=2";
  const WHATSAPP_NUMBER = "+91 9468088336";

  // ✅ FIXED: Added /api/ prefix to all endpoints
  const fetchMyCourses = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view your courses");
        navigate("/login");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      let enrolledCourses = [];
      
      // ✅ Try multiple endpoints to get enrolled courses (all with /api/ prefix)
      const endpoints = [
        "/api/user/enrolled-courses",
        "/api/cart/my-courses", 
        "/api/my-courses",
        "/api/user/profile"
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint, config);
          console.log(`Response from ${endpoint}:`, response.data);
          
          if (response.data.success) {
            // Handle different response formats
            if (response.data.courses) {
              enrolledCourses = response.data.courses;
              break;
            } else if (response.data.user && response.data.user.course_ids) {
              // Fetch course details from course_ids with /api/ prefix
              const courseIds = response.data.user.course_ids;
              if (courseIds && courseIds.length > 0) {
                const coursePromises = courseIds.map(async (courseId) => {
                  try {
                    const courseRes = await api.get(`/api/courses/${courseId}`, config);
                    return courseRes.data;
                  } catch (err) {
                    return null;
                  }
                });
                const courseResults = await Promise.all(coursePromises);
                enrolledCourses = courseResults.filter(c => c !== null);
                break;
              }
            }
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed:`, err.message);
        }
      }
      
      if (enrolledCourses.length === 0) {
        setCourses([]);
        setStats({ total: 0, totalSpent: 0 });
        setLastUpdated(new Date());
        if (!silent) {
          toast.success("You haven't enrolled in any courses yet");
        }
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      console.log("Final enrolled courses:", enrolledCourses);
      setCourses(enrolledCourses);
      
      // Calculate stats
      const totalSpent = enrolledCourses.reduce((sum, course) => sum + (course.price || 0), 0);
      
      setStats({
        total: enrolledCourses.length,
        totalSpent: totalSpent,
      });
      
      setLastUpdated(new Date());
      
      if (!silent && enrolledCourses.length > 0) {
        toast.success(`Loaded ${enrolledCourses.length} courses`);
      }
    } catch (error) {
      console.error("Failed to fetch my courses:", error);
      if (!silent) {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
        } else {
          toast.error("Failed to load your courses");
        }
      }
      setCourses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchMyCourses(false);
  };

  // Listen for payment approval events
  useEffect(() => {
    const handlePaymentApproved = (event) => {
      console.log("Payment approved, refreshing courses...", event.detail);
      // Immediate refresh and then again after 2 seconds
      fetchMyCourses(false);
      setTimeout(() => {
        fetchMyCourses(false);
      }, 3000);
    };

    window.addEventListener("paymentApproved", handlePaymentApproved);
    return () => window.removeEventListener("paymentApproved", handlePaymentApproved);
  }, []);

  // Listen for course updates from admin panel
  useEffect(() => {
    const handleCoursesUpdated = () => {
      console.log("Courses updated event received");
      fetchMyCourses(true);
    };
    
    window.addEventListener("coursesUpdated", handleCoursesUpdated);
    return () => window.removeEventListener("coursesUpdated", handleCoursesUpdated);
  }, []);

  // Initial fetch
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    if (!token || userType !== "student") {
      navigate("/login");
      return;
    }

    fetchMyCourses();

    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchMyCourses(true);
    }, 30000);

    return () => {
      clearInterval(interval);
    };
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
          {/* Header with Refresh Button */}
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
              <p className="text-gray-600 mt-1">
                View all your enrolled courses
              </p>
              {lastUpdated && (
                <p className="text-xs text-gray-400 mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              <FaRedo className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh Courses"}
            </button>
          </div>

          {/* Stats Cards */}
          {stats.total > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Courses</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {stats.total}
                    </p>
                  </div>
                  <FaBookOpen className="text-3xl text-primary-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Investment</p>
                    <p className="text-3xl font-bold text-primary-600">
                      ₹{stats.totalSpent.toLocaleString()}
                    </p>
                  </div>
                  <FaRupeeSign className="text-3xl text-primary-600" />
                </div>
              </div>
            </div>
          )}

          {/* Courses List */}
{courses.length === 0 ? (
  <div className="bg-white rounded-xl shadow-md p-12 text-center">
    <FaBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      No Courses Enrolled Yet
    </h3>
    <p className="text-gray-600 mb-6">
      You haven't enrolled in any courses yet. Browse our courses and start learning!
    </p>
    <Link to="/courses">
      <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
        Browse Courses →
      </button>
    </Link>
  </div>
) : (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-4 text-white">
            <h3 className="text-xl font-bold">{course.name || course.title}</h3>
            <p className="text-sm opacity-90">{course.duration || 'Self-paced'}</p>
          </div>
          <div className="p-4">
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {course.description ||
                "Comprehensive course to master the subject with practical knowledge."}
            </p>
            <div className="flex items-center justify-between mt-3">
              <div>
                <span className="text-xs text-gray-500">Price</span>
                <p className="text-lg font-bold text-primary-600">
                  ₹{course.price?.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400 text-sm" />
                <span className="text-sm text-gray-600">{course.rating || 4.5}</span>
              </div>
            </div>

            {/* ✅ WhatsApp Group & Contact Buttons - Added Here */}
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
              <button 
                onClick={() => window.open('https://chat.whatsapp.com/your-group-link-here', '_blank')}
                className="flex-1 text-xs bg-green-500 hover:bg-green-600 text-white px-2.5 py-1.5 rounded flex items-center justify-center gap-1 transition"
              >
                <FaWhatsapp size={12} />
                Join Group
              </button>
              <button 
                onClick={() => window.open('https://wa.me/919468088336', '_blank')}
                className="flex-1 text-xs bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1.5 rounded flex items-center justify-center gap-1 transition"
              >
                <FaWhatsapp size={12} />
                Contact Admin
              </button>
            </div>

            {course.enrolled_at && (
              <p className="text-xs text-gray-400 mt-2">
                Enrolled: {new Date(course.enrolled_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* ✅ WhatsApp Community Section - Full Width */}
    <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
      <div className="flex items-center gap-3 mb-3">
        <FaWhatsapp className="text-green-600 text-2xl" />
        <h3 className="text-lg font-semibold text-gray-800">
          Join Our WhatsApp Community
        </h3>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">
        Connect with fellow students, get instant course updates, and clear your doubts 
        directly with our team!
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={() => window.open('https://chat.whatsapp.com/your-group-link-here', '_blank')}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg transition flex items-center justify-center gap-2 font-medium"
        >
          <FaWhatsapp size={18} />
          Join WhatsApp Group
        </button>
        
        <button 
          onClick={() => window.open('https://wa.me/919468088336?text=Hi%20Team%2C%20I%20want%20to%20join%20the%20SJS%20Academy%20WhatsApp%20group.%20Please%20add%20me.', '_blank')}
          className="flex-1 bg-white border border-green-500 text-green-600 hover:bg-green-50 py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm font-medium"
        >
          <FaWhatsapp size={16} />
          Contact Admin to Add
        </button>
      </div>
      
      <p className="text-xs text-gray-400 mt-3 text-center">
        💡 Get: Course Updates • Doubt Solving • Peer Learning • Job Alerts
      </p>
    </div>

    {/* Course Value Summary */}
    {stats.total > 0 && (
      <div className="mt-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Course Investment Summary
        </h3>
        <p className="text-gray-600">
          You have invested a total of{" "}
          <strong className="text-primary-600">
            ₹{stats.totalSpent.toLocaleString()}
          </strong>{" "}
          in your education. The skills you've gained have an estimated
          value of{" "}
          <strong className="text-green-600">
            ₹{(stats.totalSpent * 3).toLocaleString()}+
          </strong>{" "}
          in the job market!
        </p>
      </div>
    )}
  </>
)}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;