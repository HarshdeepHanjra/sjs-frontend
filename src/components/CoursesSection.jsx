import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaRupeeSign, FaCertificate, FaStar, FaSpinner } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const CoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // No auth token needed for public courses
      const response = await api.get('/api/courses');
      if (response.data.success) {
        // Filter only active courses and limit to 3 for featured section
        const activeCourses = response.data.courses.filter(c => c.is_active).slice(0, 3);
        setCourses(activeCourses);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  // Color mapping for course cards
  const getCourseColor = (index) => {
    const colors = [
      'from-blue-500 to-blue-700',
      'from-purple-500 to-purple-700',
      'from-indigo-500 to-indigo-700',
      'from-green-500 to-green-700',
      'from-red-500 to-red-700',
      'from-orange-500 to-orange-700',
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 flex justify-center py-12">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="container mx-auto px-4 text-center py-12">
        <p className="text-gray-500">No courses available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden group"
          >
            <div className={`bg-gradient-to-r ${getCourseColor(index)} p-6 text-white`}>
              <h3 className="text-2xl font-bold">{course.name}</h3>
              <div className="flex items-center mt-2">
                <FaStar className="text-yellow-400 mr-1" />
                <span>{course.rating || 4.5}</span>
                <span className="ml-2">({course.students_enrolled || 0}+ students)</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaClock className="text-gray-400" />
                  <span>{course.duration}</span>
                </div>
                <span className="text-2xl font-bold text-primary-600">₹{course.price?.toLocaleString()}</span>
              </div>
              <div className="flex items-center mb-4">
                <FaCertificate className="text-green-500 mr-2" />
                <span>Certificate Included</span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
              <Link to={`/course/${course.id}`}>
                <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded-lg transition">
                  Learn More →
                </button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link to="/courses">
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg transition">
            View All Courses →
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CoursesSection;