import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaClock, FaRupeeSign, FaCertificate, FaStar, FaFilter, 
  FaSearch, FaGraduationCap, FaChartLine, FaDatabase, 
  FaPython, FaChartBar, FaLaptopCode, FaUserGraduate,
  FaChevronRight, FaTimes, FaBookOpen, FaProjectDiagram
} from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Course icons mapping
  const courseIcons = {
    'Data Science': <FaDatabase className="text-4xl" />,
    'Machine Learning': <FaChartLine className="text-4xl" />,
    'Advance Python': <FaPython className="text-4xl" />,
    'Power BI': <FaChartBar className="text-4xl" />,
    'Advance Excel': <FaBookOpen className="text-4xl" />,
    'Data Analyst': <FaLaptopCode className="text-4xl" />
  };

  const courseColors = {
    'Data Science': 'from-blue-500 to-blue-700',
    'Machine Learning': 'from-purple-500 to-purple-700',
    'Advance Python': 'from-green-500 to-green-700',
    'Power BI': 'from-yellow-500 to-yellow-700',
    'Advance Excel': 'from-red-500 to-red-700',
    'Data Analyst': 'from-indigo-500 to-indigo-700'
  };

  // Fetch courses function - defined here
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/courses');
      if (response.data && response.data.courses) {
        setCourses(response.data.courses);
        setFilteredCourses(response.data.courses);
      } else {
        // Fallback data if API fails
        const fallbackCourses = [
          { id: 1, name: 'Data Science', price: 49999, duration: '6 Months', level: 'Advanced', rating: 4.9, students: 2500 },
          { id: 2, name: 'Machine Learning', price: 39999, duration: '4 Months', level: 'Advanced', rating: 4.8, students: 1800 },
          { id: 3, name: 'Advance Python', price: 24999, duration: '3 Months', level: 'Intermediate', rating: 4.7, students: 3200 },
          { id: 4, name: 'Power BI', price: 19999, duration: '2 Months', level: 'Beginner', rating: 4.8, students: 1500 },
          { id: 5, name: 'Advance Excel', price: 14999, duration: '1.5 Months', level: 'Beginner', rating: 4.6, students: 4000 },
          { id: 6, name: 'Data Analyst', price: 44999, duration: '5 Months', level: 'Intermediate', rating: 4.9, students: 1200 }
        ];
        setCourses(fallbackCourses);
        setFilteredCourses(fallbackCourses);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    
    // Listen for course updates from admin panel
    const handleCoursesUpdate = () => {
      console.log("Courses updated, refreshing...");
      fetchCourses();
    };
    
    window.addEventListener('coursesUpdated', handleCoursesUpdate);
    
    return () => {
      window.removeEventListener('coursesUpdated', handleCoursesUpdate);
    };
  }, []);

  useEffect(() => {
    filterAndSortCourses();
  }, [searchTerm, selectedCategory, selectedLevel, sortBy, courses]);

  const filterAndSortCourses = () => {
    let filtered = [...courses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    // Sorting
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.students || 0) - (a.students || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }

    setFilteredCourses(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSortBy('popular');
  };

  const categories = ['all', 'Data Science', 'Programming', 'Analytics', 'Business'];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const handleQuickView = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our <span className="text-primary-600">Courses</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose from our comprehensive range of industry-relevant courses designed by experts
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Box */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center space-x-2 bg-gray-100 px-4 py-3 rounded-lg"
            >
              <FaFilter />
              <span>Filters</span>
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Levels' : level}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              {(searchTerm || selectedCategory !== 'all' || selectedLevel !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-4"
                >
                  <FaTimes />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-4 space-y-3"
              >
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>
                      {level === 'all' ? 'All Levels' : level}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                {(searchTerm || selectedCategory !== 'all' || selectedLevel !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="w-full flex items-center justify-center space-x-2 text-red-600 border border-red-600 py-2 rounded-lg"
                  >
                    <FaTimes />
                    <span>Clear All Filters</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredCourses.length}</span> courses
          </p>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <FaBookOpen className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-primary-600 hover:text-primary-700 font-semibold"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group"
              >
                {/* Course Header with Color Gradient */}
                <div className={`bg-gradient-to-r ${courseColors[course.name] || 'from-primary-500 to-primary-700'} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    {courseIcons[course.name] || <FaBookOpen className="text-4xl" />}
                    <h3 className="text-2xl font-bold mt-3">{course.name}</h3>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="bg-white/20 px-2 py-1 rounded text-sm">{course.level}</span>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Body */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description || 'Learn from industry experts with hands-on projects'}</p>

                  {/* Stats */}
                  <div className="flex justify-between mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400" />
                      <span className="text-gray-600">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUserGraduate className="text-gray-400" />
                      <span className="text-gray-600">{course.students}+ students</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-primary-600">₹{course.price?.toLocaleString()}</span>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <FaCertificate className="text-green-500" />
                      <span className="text-gray-600">International Certificate</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FaProjectDiagram className="text-blue-500" />
                      <span className="text-gray-600">Real Projects</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <Link to={`/course/${course.id}`} className="flex-1">
                      <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded-lg transition">
                        View Details
                      </button>
                    </Link>
                    <button
                      onClick={() => handleQuickView(course)}
                      className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition"
                    >
                      Quick View
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-center text-white">
  <h2 className="text-3xl font-bold mb-4">Not sure which course is right for you?</h2>
  <p className="text-lg mb-6">Book a free consultation with our career counselors</p>
  
  <div className="flex flex-col sm:flex-row gap-4 justify-center">
    {/* WhatsApp Button */}
    <a
      href={`https://wa.me/918950026639?text=${encodeURIComponent(
        "Hello, I want to book a free consultation for courses at SJS Academy."
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block"
    >
      <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition cursor-pointer flex items-center gap-2">
        <FaWhatsapp /> WhatsApp Us
      </button>
    </a>
    
    {/* Call Button */}
    <a href="tel:+918950026639">
      <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition cursor-pointer">
        Book Free Consultation →
      </button>
    </a>
  </div>
</div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showModal && selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`bg-gradient-to-r ${courseColors[selectedCourse.name] || 'from-primary-500 to-primary-700'} p-6 text-white sticky top-0`}>
                <div className="flex justify-between items-start">
                  <div>
                    {courseIcons[selectedCourse.name] || <FaBookOpen className="text-4xl" />}
                    <h2 className="text-2xl font-bold mt-2">{selectedCourse.name}</h2>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="bg-white/20 px-2 py-1 rounded">{selectedCourse.level}</span>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span>{selectedCourse.rating}</span>
                      </div>
                      <span>{selectedCourse.students}+ students</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3">Course Overview</h3>
                    <p className="text-gray-600 mb-4">{selectedCourse.description || 'Learn from industry experts with hands-on projects and real-world applications.'}</p>
                    
                    <h3 className="font-bold text-lg mb-3">What You'll Learn</h3>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start gap-2">
                        <FaChevronRight className="text-primary-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">Core concepts and fundamentals</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaChevronRight className="text-primary-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">Hands-on projects</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaChevronRight className="text-primary-600 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">Industry best practices</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-primary-600">₹{selectedCourse.price?.toLocaleString()}</span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-semibold">{selectedCourse.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Certificate:</span>
                          <span className="font-semibold text-green-600">Yes</span>
                        </div>
                      </div>
                      <Link to={`/course/${selectedCourse.id}`}>
                        <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition">
                          View Full Details →
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Courses;