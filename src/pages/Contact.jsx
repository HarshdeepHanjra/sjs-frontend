import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaWhatsapp, 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube,
  FaPaperPlane, FaCheckCircle, FaUser, FaCommentDots, 
  FaTag, FaHeadset, FaRegClock, FaShieldAlt, FaGlobe,
  FaSpinner
} from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ FIXED: Added /api/ prefix
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/api/contact/send', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      });
      
      if (response.data.success) {
        toast.success('Message sent successfully! We will get back to you soon.');
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        toast.error(response.data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email Us',
      details: ['sjsglobaltech@gmail.com'],
      color: 'bg-blue-100 text-blue-600',
      action: () => window.location.href = 'mailto:sjsglobaltech@gmail.com'
    },
    {
      icon: FaPhone,
      title: 'Call Us',
      details: ['+91 89500 26639'],
      color: 'bg-green-100 text-green-600',
      action: () => window.location.href = 'tel:+918950026639'
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      details: ['+91 89500 26639 (24/7 Support)'],
      color: 'bg-green-100 text-green-600',
      action: () => window.open('https://wa.me/918950026639', '_blank')
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Visit Us',
      details: ['FM2J+8H, Mamera, Ellenabad, Haryana 125102'],
      color: 'bg-red-100 text-red-600',
      action: () => window.open('https://maps.app.goo.gl/Y4wXN8rZVtrAqAuP9', '_blank')
    }
  ];

  const faqs = [
    {
      question: 'How do I enroll in a course?',
      answer: 'You can enroll directly through our website by clicking the "Enroll Now" button on any course page. You can also contact our admission counselors for assistance.'
    },
    {
      question: 'Are the classes live',
      answer: 'We offer both! All our courses include live interactive sessions with instructors, plus recorded videos that you can access anytime for revision.'
    },
    {
      question: 'What is the refund policy?',
      answer: 'We offer a 7-day money-back guarantee. If you\'re not satisfied with the course, you can request a full refund within 7 days of enrollment.'
    },
    {
      question: 'Is the certificate recognized internationally?',
      answer: 'Yes, our certificates are internationally recognized and verified. Employers worldwide accept our certification.'
    },
    {
      question: 'Can I take multiple courses at once?',
      answer: 'Yes, you can enroll in multiple courses. Many of our students take complementary courses together for better skill development.'
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact <span className="text-orange-400">Us</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Have questions? We're here to help you succeed in your career journey
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-16 relative z-10">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={info.action}
                className="bg-white rounded-xl shadow-lg p-6 text-center group hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className={`inline-block p-4 ${info.color} rounded-full mb-4 group-hover:scale-110 transition`}>
                  <info.icon className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-gray-600 text-sm">{detail}</p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Send us a Message</h2>
                <p className="text-gray-600">Fill out the form and we'll get back to you within 24 hours</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      <FaUser className="inline mr-2" />
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      <FaEnvelope className="inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      <FaPhone className="inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      <FaTag className="inline mr-2" />
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      placeholder="Message subject"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <FaCommentDots className="inline mr-2" />
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg"
                  >
                    <FaCheckCircle />
                    <span>Message sent successfully! We'll get back to you soon.</span>
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Map and Hours */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Map */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="h-64 bg-gray-200 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3484.72026403548!2d74.735074!3d29.145267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391577ba55c8bbdb%3A0xa4c209b78a101f18!2sEllenabad%2C%20Haryana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="SJS Academy Location"
                  ></iframe>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">Our Location</h3>
                  <p className="text-gray-600">FM2J+8H, Mamera, Ellenabad, Haryana 125102</p>
                  <a 
                    href="https://maps.app.goo.gl/Y4wXN8rZVtrAqAuP9" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Get Directions →
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl shadow-xl p-6">
                <div className="flex items-center mb-4">
                  <FaRegClock className="text-2xl text-primary-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-800">Business Hours</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday:</span>
                    <span className="font-semibold">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday:</span>
                    <span className="font-semibold">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday:</span>
                    <span className="font-semibold text-green-600">Closed (Support available)</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <FaHeadset className="text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">24/7 Support available via WhatsApp & Email</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Frequently Asked <span className="text-primary-600">Questions</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about our courses, enrollment, and support
              </p>
            </motion.div>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-4"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-lg p-5 transition duration-300"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">{faq.question}</h3>
                    <span className="text-primary-600 text-xl">
                      {openFaq === index ? '−' : '+'}
                    </span>
                  </div>
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white px-5 pb-5"
                  >
                    <p className="text-gray-600 mt-2">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <FaHeadset className="text-5xl mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Need Immediate Help?</h2>
            <p className="text-xl mb-6">Our support team is available 24/7 to assist you</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/918950026639" target="_blank" rel="noopener noreferrer">
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition flex items-center space-x-2 mx-auto">
                  <FaWhatsapp />
                  <span>Chat on WhatsApp</span>
                </button>
              </a>
              <a href="tel:+918950026639">
                <button className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-600 text-white font-semibold px-8 py-3 rounded-lg transition">
                  Call Support →
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Media Links */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-lg text-gray-600 mb-4">Connect With Us On Social Media</h3>
          <div className="flex justify-center space-x-6">
            <a href="https://x.com/sjsglobaltech" className="text-gray-400 hover:text-blue-400 transition transform hover:scale-110">
              <FaTwitter size={28} />
            </a>
            <a href="https://www.instagram.com/sjsglobaltech/" className="text-gray-400 hover:text-pink-600 transition transform hover:scale-110">
              <FaInstagram size={28} />
            </a>
            <a href="https://www.linkedin.com/in/sjs-global-tech-017927414/" className="text-gray-400 hover:text-blue-700 transition transform hover:scale-110">
              <FaLinkedin size={28} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;