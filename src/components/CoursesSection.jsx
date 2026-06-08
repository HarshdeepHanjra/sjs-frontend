import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaRupeeSign, FaCertificate, FaStar } from 'react-icons/fa';

const CoursesSection = () => {
  const featuredCourses = [
    { id: 1, name: 'Data Science', duration: '6 Months', price: '18,000', rating: 4.9, students: 2500, color: 'from-blue-500 to-blue-700' },
    { id: 2, name: 'Machine Learning', duration: '4 Months', price: '39,999', rating: 4.8, students: 1800, color: 'from-purple-500 to-purple-700' },
    { id: 3, name: 'Data Analyst', duration: '5 Months', price: '44,999', rating: 4.9, students: 1200, color: 'from-indigo-500 to-indigo-700' },
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden group"
          >
            <div className={`bg-gradient-to-r ${course.color} p-6 text-white`}>
              <h3 className="text-2xl font-bold">{course.name}</h3>
              <div className="flex items-center mt-2">
                <FaStar className="text-yellow-400 mr-1" />
                <span>{course.rating}</span>
                <span className="ml-2">({course.students}+ students)</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaClock className="text-gray-400" />
                  <span>{course.duration}</span>
                </div>
                <span className="text-2xl font-bold text-primary-600">₹{course.price}</span>
              </div>
              <div className="flex items-center mb-4">
                <FaCertificate className="text-green-500 mr-2" />
                <span>Certificate Included</span>
              </div>
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