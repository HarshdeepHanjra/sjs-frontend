import React from 'react';
import { motion } from 'framer-motion';
import { FaBullseye, FaEye, FaHeart, FaTrophy, FaUsers, FaChartLine, FaShieldAlt, FaAward } from 'react-icons/fa';

const About = () => {
  const values = [
    { icon: FaTrophy, title: 'Excellence', desc: 'Striving for the highest quality in education' },
    { icon: FaUsers, title: 'Student First', desc: 'Every decision prioritizes student success' },
    { icon: FaChartLine, title: 'Innovation', desc: 'Constantly evolving with industry trends' },
    { icon: FaHeart, title: 'Passion', desc: 'Love for teaching and technology' },
  ];

  const milestones = [
  { 
    // year: '2026', 
    title: 'Foundation', 
    desc: 'SJS GLOBAL TECH was established' 
  },

  { 
    // year: '2026', 
    title: 'Online Learning Platform', 
    desc: 'Started providing industry-focused online tech education' 
  },

  { 
    // year: '2026', 
    title: 'Career-Focused Training', 
    desc: 'Helping students build skills in Data Science & AI' 
  },

  { 
    // year: '2026', 
    title: 'Growing Tech Community', 
    desc: 'Expanding professional learning opportunities across India' 
  },
];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            About <span className="text-orange-400">SJS Global Tech</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl max-w-3xl mx-auto"
          >
            Empowering careers through quality tech education since 2026
          </motion.p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Who We Are</h2>
              <div className="w-20 h-1 bg-orange-500 mx-auto mb-6"></div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-gray-600 text-lg leading-relaxed mb-6"
            >
              SJS Global Tech is a premier institute dedicated to transforming careers through 
              cutting-edge technology education. Founded in 2026 by industry experts with Better
               experience in Data Science and Artificial Intelligence, we have successfully trained 
              over 1000 students across India.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-lg leading-relaxed"
            >
              Our mission is to bridge the gap between academic knowledge and industry requirements, 
              providing students with practical, job-ready skills that help them excel in their careers.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-6">
                <FaBullseye className="text-4xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide accessible, high-quality tech education that empowers individuals 
                to build successful careers and contribute meaningfully to the digital economy.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <div className="inline-block p-4 bg-purple-100 rounded-full mb-6">
                <FaEye className="text-4xl text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become India's most trusted tech academy, creating industry-ready professionals 
                who drive innovation and growth in the technology sector.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-block p-4 bg-primary-100 rounded-full mb-4">
                  <value.icon className="text-3xl text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Students Trust Us */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Students <span className="text-primary-600">Trust Us</span>
            </h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <FaShieldAlt className="text-4xl text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Government Approved</h3>
              <p className="text-gray-600">Recognized by education authorities and Internationally certified</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <FaAward className="text-4xl text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Industry Recognized</h3>
              <p className="text-gray-600">Certifications valued by top MNCs</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <FaUsers className="text-4xl text-primary-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">1000+ Alumni</h3>
              <p className="text-gray-600">Strong alumni network across India</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Journey (2026)</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">{milestone.year}</div>
                <div className="font-bold text-gray-800">{milestone.title}</div>
                <div className="text-sm text-gray-600">{milestone.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;