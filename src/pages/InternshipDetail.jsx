import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaClock, FaRupeeSign, FaCheckCircle, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const InternshipDetail = () => {
  const { id } = useParams();

  const internships = {
    1: { 
      title: 'Data Science Internship', 
      duration: '3 Months', 
      fee: 6000, 
      originalFee: 19999,
      description: 'Learn Data Science from scratch with real-world projects. Get hands-on experience in Python, SQL, and Machine Learning.',
      syllabus: ['Python Programming', 'Data Analysis', 'Machine Learning', 'SQL', 'Projects'],
      benefits: ['Certificate', 'Live Projects', 'Mentorship', 'Placement Support']
    },
    2: { 
      title: 'Web Development Internship', 
      duration: '2 Months', 
      fee: 0, 
      originalFee: 14999,
      description: 'Master MERN stack development. Build real websites and web applications.',
      syllabus: ['HTML/CSS', 'JavaScript', 'React JS', 'Node JS', 'MongoDB'],
      benefits: ['Live Coding', 'Portfolio', 'Certificate', 'Interview Prep']
    },
    3: { 
      title: 'Digital Marketing Internship', 
      duration: '2 Months', 
      fee: 0, 
      originalFee: 12999,
      description: 'Learn SEO, Social Media Marketing, Google Ads, and Analytics.',
      syllabus: ['SEO', 'Social Media', 'Google Ads', 'Analytics', 'Email Marketing'],
      benefits: ['Free Certification', 'Live Campaigns', 'Industry Tools']
    },
    4: { 
      title: 'Data Analytics Internship', 
      duration: '3 Months', 
      fee: 4999, 
      originalFee: 29999,
      description: 'Advanced Data Analytics program with Power BI, Tableau, and SQL.',
      syllabus: ['Advanced Excel', 'SQL', 'Power BI', 'Tableau', 'Business Intelligence'],
      benefits: ['Certificate', 'Job Guarantee', 'Industry Recognition']
    },
    5: { 
      title: 'AI/ML Internship', 
      duration: '4 Months', 
      fee: 9999, 
      originalFee: 49999,
      description: 'Advanced AI/ML program with deep learning, NLP, and computer vision.',
      syllabus: ['Python Advanced', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision'],
      benefits: ['Certificate', 'Research Projects', 'Industry Mentorship']
    },
    6: { 
      title: 'Python Developer Internship', 
      duration: '2 Months', 
      fee: 2999, 
      originalFee: 19999,
      description: 'Learn Python development with real-world projects.',
      syllabus: ['Python Basics', 'OOP', 'Flask/Django', 'APIs', 'Database'],
      benefits: ['Python Certificate', 'Portfolio', 'Mock Interviews']
    }
  };

  const internship = internships[id];

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
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold mb-4">Program Overview</h2>
                <p className="text-gray-600 mb-6">{internship.description}</p>

                <h2 className="text-xl font-bold mb-4">What You'll Learn</h2>
                <ul className="space-y-2 mb-6">
                  {internship.syllabus.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h2 className="text-xl font-bold mb-4">Benefits</h2>
                <ul className="space-y-2">
                  {internship.benefits.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FaCheckCircle className="text-primary-500" />
                      <span>{item}</span>
                    </li>
                  ))}
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
                      <span className="font-semibold">Online</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fee:</span>
                      <span className={`font-bold ${internship.fee === 0 ? 'text-green-600' : 'text-primary-600'}`}>
                        {internship.fee === 0 ? 'FREE' : `₹${internship.fee}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original Fee:</span>
                      <span className="text-gray-400 line-through">₹{internship.originalFee}</span>
                    </div>
                  </div>

                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition">
                    Apply Now →
                  </button>

                  <div className="mt-4 space-y-2">
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                      <button className="w-full flex items-center justify-center gap-2 border border-green-500 text-green-600 py-2 rounded-lg hover:bg-green-50 transition">
                        <FaWhatsapp /> WhatsApp
                      </button>
                    </a>
                    <a href="mailto:internship@sjsacademy.com">
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