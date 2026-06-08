import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaClock,
  FaRupeeSign,
  FaCertificate,
  FaStar,
  FaBriefcase,
  FaChalkboardTeacher,
  FaProjectDiagram,
  FaUsers,
  FaCheckCircle,
  FaLaptopCode,
  FaWhatsapp,
  FaEnvelope,
  FaCalendarAlt,
  FaShieldAlt,
  FaTrophy,
  FaUserGraduate,
  FaArrowRight,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Internship = () => {
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    internshipType: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const internships = [
    {
      id: 1,
      title: "Data Science Internship",
      category: "Data Science",
      duration: "3 Months",
      fee: 6000,
      originalFee: 19999,
      //   type: '6000',
      stipend: "Unpaid",
      mode: "Online",
      startDate: "Monthly Batch",
      slots: 50,
      enrolled: 234,
      rating: 4.9,
      description:
        "Learn Data Science from scratch with real-world projects. Get hands-on experience in Python, SQL, and Machine Learning.",
      syllabus: [
        "Python Programming Fundamentals",
        "Data Analysis with Pandas",
        "Data Visualization",
        "SQL for Data Science",
        "Machine Learning Basics",
        "Capstone Project",
      ],
      benefits: [
        "With Certification",
        "Live Projects",
        "Industry Mentors",
        "Placement Assistance",
        "Internship Certificate",
      ],
      requirements: [
        "Basic computer knowledge",
        "Graduate/Undergraduate students",
        "Commitment of 2 hours daily",
      ],
    },
    {
      id: 2,
      title: "Web Development Internship",
      category: "Development",
      duration: "2 Months",
      fee: 0,
      originalFee: 14999,
      type: "free",
      stipend: "Unpaid",
      mode: "Online",
      startDate: "Monthly Batch",
      slots: 40,
      enrolled: 156,
      rating: 4.8,
      description:
        "Master MERN stack development. Build real websites and web applications with industry experts.",
      syllabus: [
        "HTML/CSS Fundamentals",
        "JavaScript Essentials",
        "React JS",
        "Node JS & Express",
        "MongoDB Database",
        "Full Stack Projects",
      ],
      benefits: [
        "Live Coding Sessions",
        "Portfolio Development",
        "Certificate of Completion",
        "Interview Preparation",
        "GitHub Projects",
      ],
      requirements: [
        "Basic programming knowledge",
        "Laptop with 8GB RAM",
        "Self-learning attitude",
      ],
    },
    {
      id: 3,
      title: "Digital Marketing Internship",
      category: "Marketing",
      duration: "2 Months",
      fee: 0,
      originalFee: 12999,
      type: "free",
      stipend: "Unpaid",
      mode: "Online",
      startDate: "Monthly Batch",
      slots: 60,
      enrolled: 189,
      rating: 4.7,
      description:
        "Learn SEO, Social Media Marketing, Google Ads, and Analytics. Get practical experience.",
      syllabus: [
        "SEO Fundamentals",
        "Social Media Marketing",
        "Google Ads",
        "Google Analytics",
        "Email Marketing",
        "Content Strategy",
      ],
      benefits: [
        "Free Certification",
        "Live Campaigns",
        "Industry Tools Access",
        "Freelancing Tips",
        "Placement Support",
      ],
      requirements: [
        "Good communication skills",
        "Interest in digital marketing",
        "Creative mindset",
      ],
    },
    {
      id: 4,
      title: "Data Analytics Internship",
      category: "Analytics",
      duration: "3 Months",
      fee: 4999,
      originalFee: 29999,
      type: "paid",
      stipend: "Performance Based",
      mode: "Hybrid",
      startDate: "Next Batch: Jan 15",
      slots: 30,
      enrolled: 78,
      rating: 4.9,
      description:
        "Advanced Data Analytics program with Power BI, Tableau, and SQL. Get a stipend based on performance.",
      syllabus: [
        "Advanced Excel",
        "SQL Mastery",
        "Power BI",
        "Tableau",
        "Business Intelligence",
        "Real-world Dashboards",
      ],
      benefits: [
        "With Certification",
        "Job Guarantee",
        "Industry Recognition",
        "LinkedIn Recommendations",
        "Premium Tools Access",
      ],
      requirements: [
        "Graduate in any stream",
        "Analytical mindset",
        "Knowledge of basic statistics",
      ],
    },
    {
      id: 5,
      title: "AI/ML Internship",
      category: "Artificial Intelligence",
      duration: "4 Months",
      fee: 9999,
      originalFee: 49999,
      type: "paid",
      stipend: "Yes (Based on performance)",
      mode: "Online",
      startDate: "Next Batch: Feb 1",
      slots: 25,
      enrolled: 45,
      rating: 5.0,
      description:
        "Advanced AI/ML program with deep learning, NLP, and computer vision. Top performers get stipend.",
      syllabus: [
        "Python Advanced",
        "Machine Learning Algorithms",
        "Deep Learning",
        "NLP",
        "Computer Vision",
        "Research Projects",
      ],
      benefits: [
        "With Certification",
        "Research Projects",
        "Publication Support",
        "Industry Mentorship",
        "Job Referrals",
      ],
      requirements: [
        "Programming knowledge",
        "Mathematics background",
        "Passion for AI/ML",
      ],
    },
    {
      id: 6,
      title: "Python Developer Internship",
      category: "Development",
      duration: "2 Months",
      fee: 2999,
      originalFee: 19999,
      type: "paid",
      stipend: "Certificate Only",
      mode: "Online",
      startDate: "Monthly Batch",
      slots: 35,
      enrolled: 92,
      rating: 4.8,
      description:
        "Learn UI/UX design with Figma, Adobe XD, and create professional portfolios.",
      syllabus: [
        "Design Principles",
        "Figma Mastery",
        "Adobe XD",
        "User Research",
        "Prototyping",
        "Portfolio Creation",
      ],
      benefits: [
        "Python Certificate",
        "Portfolio Review",
        "Mock Interviews",
        "Freelance Projects",
        "Community Access",
      ],
      requirements: [
        "Creative mindset",
        "Basic computer skills",
        "Eye for design",
      ],
    },
  ];

  const stats = [
    { number: "500+", label: "Interns Completed", icon: FaUsers },
    { number: "85%", label: "Placement Rate", icon: FaTrophy },
    { number: "50+", label: "Partner Companies", icon: FaBriefcase },
    { number: "4.9", label: "Student Rating", icon: FaStar },
  ];

  const handleApply = (internship) => {
    setSelectedInternship(internship);
    setApplicationForm({
      ...applicationForm,
      internshipType: internship.title,
    });
    setShowApplyModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(
        `Application submitted for ${selectedInternship.title}! We'll contact you soon.`,
      );
      setShowApplyModal(false);
      setApplicationForm({
        name: "",
        email: "",
        phone: "",
        qualification: "",
        internshipType: "",
        message: "",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Start Your <span className="text-orange-400">Career Journey</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Gain real-world experience with our industry-focused internship
              programs
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-2">
                <span className="font-semibold">
                  🎓 Free Internships Available
                </span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-2">
                <span className="font-semibold">💰 Paid Opportunities</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-2">
                <span className="font-semibold">📜 Certificate Provided</span>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-block p-4 bg-primary-100 rounded-full mb-4">
                  <stat.icon className="text-3xl text-primary-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stat.number}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Internships Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Available <span className="text-primary-600">Internships</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our diverse range of internship programs. Free and
              paid options available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {internships.map((internship, index) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group"
              >
                {/* Badge */}
                <div className="relative">
                  {internship.fee === 0 ? (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                      🎓 FREE
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                      💰 PAID
                    </div>
                  )}

                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
                    <FaLaptopCode className="text-4xl mb-3" />
                    <h3 className="text-xl font-bold">{internship.title}</h3>
                    <div className="flex items-center mt-2">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>{internship.rating}</span>
                      <span className="mx-2">•</span>
                      <span className="text-sm">{internship.mode}</span>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {internship.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <FaClock className="text-gray-400" />
                        <span>{internship.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>{internship.startDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-gray-400" />
                        <span className="text-sm">
                          {internship.slots} slots
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUserGraduate className="text-gray-400" />
                        <span className="text-sm">
                          {internship.enrolled} enrolled
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="mb-4">
                    {internship.fee === 0 ? (
                      <div className="text-center">
                        <span className="text-2xl font-bold text-green-600">
                          FREE
                        </span>
                        <span className="text-gray-400 line-through ml-2">
                          ₹{internship.originalFee}
                        </span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-2xl font-bold text-primary-600">
                          ₹{internship.fee}
                        </span>
                        <span className="text-gray-400 line-through ml-2">
                          ₹{internship.originalFee}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {internship.stipend}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Benefits Preview */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-green-600 mb-1">
                      <FaCheckCircle />
                      <span>{internship.benefits[0]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <FaCheckCircle />
                      <span>{internship.benefits[1]}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        navigate(`/internship-payment/${internship.id}`, {
                          state: { internship },
                        })
                      }
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                      Apply Now →
                    </button>
                    <Link to={`/internship/${internship.id}`}>
                      <button className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition">
                        Details
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Our{" "}
              <span className="text-primary-600">Internship Program</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive support to help you succeed in your
              career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <FaChalkboardTeacher className="text-3xl text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Expert Mentors</h3>
              <p className="text-gray-600 text-sm">
                Learn from industry professionals
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                <FaProjectDiagram className="text-3xl text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Live Projects</h3>
              <p className="text-gray-600 text-sm">
                Work on real-world projects
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-block p-4 bg-orange-100 rounded-full mb-4">
                <FaCertificate className="text-3xl text-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Certification</h3>
              <p className="text-gray-600 text-sm">
                Industry-recognized certificate
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
                <FaBriefcase className="text-3xl text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Placement Support</h3>
              <p className="text-gray-600 text-sm">
                Get hired by top companies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {showApplyModal && selectedInternship && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Apply for Internship
              </h2>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="bg-primary-50 p-3 rounded-lg mb-4">
              <p className="font-semibold text-primary-800">
                {selectedInternship.title}
              </p>
              <p className="text-sm text-primary-600">
                {selectedInternship.fee === 0
                  ? "Free Internship"
                  : `Fee: ₹${selectedInternship.fee}`}
              </p>
            </div>

            <form onSubmit={handleApplicationSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={applicationForm.name}
                  onChange={(e) =>
                    setApplicationForm({
                      ...applicationForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={applicationForm.email}
                  onChange={(e) =>
                    setApplicationForm({
                      ...applicationForm,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={applicationForm.phone}
                  onChange={(e) =>
                    setApplicationForm({
                      ...applicationForm,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Qualification *
                </label>
                <select
                  required
                  value={applicationForm.qualification}
                  onChange={(e) =>
                    setApplicationForm({
                      ...applicationForm,
                      qualification: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Qualification</option>
                  <option>High School</option>
                  <option>Graduate</option>
                  <option>Post Graduate</option>
                  <option>Working Professional</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Why should we select you?
                </label>
                <textarea
                  rows="3"
                  value={applicationForm.message}
                  onChange={(e) =>
                    setApplicationForm({
                      ...applicationForm,
                      message: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tell us about your skills and motivation..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Application →"}
              </button>
            </form>

            <div className="mt-4 flex gap-3 justify-center">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="flex items-center gap-2 text-green-600 hover:text-green-700">
                  <FaWhatsapp /> WhatsApp
                </button>
              </a>
              <a href="mailto:internship@sjsacademy.com">
                <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
                  <FaEnvelope /> Email
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Limited Slots Available!</h2>
          <p className="text-xl mb-6">
            Register now to secure your spot in our internship program
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <button className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-lg font-semibold transition">
                Contact Us
              </button>
            </Link>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2">
                <FaWhatsapp /> Chat on WhatsApp
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Internship;
