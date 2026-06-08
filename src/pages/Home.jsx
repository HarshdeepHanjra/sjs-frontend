import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { 
  FaChalkboardTeacher, FaProjectDiagram, FaRupeeSign, FaCertificate, 
  FaBuilding, FaBriefcase, FaWhatsapp, FaEnvelope, FaPhone, 
  FaStar, FaUserTie, FaGraduationCap, FaClock, FaBookOpen,
  FaVideo, FaLaptopCode, FaChartLine, FaDatabase, FaPython, FaChartBar
} from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import api from '../services/api';

const Home = () => {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: '', email: '', phone: '', date: '' });
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', message: '' });
  
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const courses = [
    { id: 1, name: 'Data Science', duration: '6 Months', price: '₹18,000', icon: FaDatabase, color: 'from-blue-500 to-blue-600', level: 'Advanced', students: '2,500+' },
    { id: 2, name: 'Machine Learning', duration: '4 Months', price: '₹16,000', icon: FaChartLine, color: 'from-purple-500 to-purple-600', level: 'Advanced', students: '1,800+' },
    { id: 3, name: 'Advance Python', duration: '3 Months', price: '₹12,000', icon: FaPython, color: 'from-green-500 to-green-600', level: 'Intermediate', students: '3,200+' },
    { id: 4, name: 'Power BI', duration: '2 Months', price: '₹8,000', icon: FaChartBar, color: 'from-yellow-500 to-yellow-600', level: 'Beginner', students: '1,500+' },
    { id: 5, name: 'Advance Excel', duration: '2 Months', price: '₹8,000', icon: FaBookOpen, color: 'from-red-500 to-red-600', level: 'Beginner', students: '4,000+' },
    { id: 6, name: 'Data Analyst', duration: '6 Months', price: '₹18,000', icon: FaLaptopCode, color: 'from-indigo-500 to-indigo-600', level: 'Intermediate', students: '1,200+' },
  ];

  const features = [
    { icon: FaChalkboardTeacher, title: 'Live Classes', desc: 'Interactive live sessions with industry experts', color: 'bg-blue-100 text-blue-600' },
    { icon: FaProjectDiagram, title: 'Real Projects', desc: 'Work on 10+ real-world industry projects', color: 'bg-green-100 text-green-600' },
    { icon: FaRupeeSign, title: 'Affordable Fees', desc: 'Quality education at best prices with EMI options', color: 'bg-orange-100 text-orange-600' },
    { icon: FaCertificate, title: 'International Certificate', desc: 'Globally recognized certification', color: 'bg-purple-100 text-purple-600' },
    { icon: FaBuilding, title: 'Government Approved', desc: 'Recognized by education authorities', color: 'bg-red-100 text-red-600' },
    { icon: FaBriefcase, title: 'Placement Guidance', desc: '100% placement assistance with top companies', color: 'bg-indigo-100 text-indigo-600' },
  ];

  const testimonials = [
    { id: 1, name: 'Rajesh Kumar', course: 'Data Science', rating: 5, text: 'The best decision of my career! The trainers are amazing and the projects helped me get a job at Amazon.', image: 'https://randomuser.me/api/portraits/men/1.jpg', company: 'Amazon', salary: '12 LPA' },
    { id: 2, name: 'Priya Singh', course: 'Machine Learning', rating: 5, text: 'Excellent curriculum and great support. Got placed in Microsoft with 15 LPA package!', image: 'https://randomuser.me/api/portraits/women/1.jpg', company: 'Microsoft', salary: '15 LPA' },
    { id: 3, name: 'Amit Sharma', course: 'Data Analyst', rating: 5, text: 'The practical approach and real-world projects made all the difference. Highly recommended!', image: 'https://randomuser.me/api/portraits/men/2.jpg', company: 'Deloitte', salary: '9 LPA' },
    { id: 4, name: 'Neha Gupta', course: 'Power BI', rating: 5, text: 'Got promoted within 3 months of completing the course. The certification really added value.', image: 'https://randomuser.me/api/portraits/women/2.jpg', company: 'Accenture', salary: '11 LPA' },
  ];

  const stats = [
    { number: '1000+', label: 'Students Trained', icon: FaGraduationCap },
    { number: '100+', label: 'Live Classes', icon: FaVideo },
    { number: '98%', label: 'Placement Rate', icon: FaBriefcase },
    { number: '5+', label: 'Expert Trainers', icon: FaUserTie },
  ];

  const handleDemoBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/demo/book`, demoForm);
      toast.success('Demo class booked successfully! We will contact you soon.');
      setShowDemoModal(false);
      setDemoForm({ name: '', email: '', phone: '', date: '' });
    } catch (error) {
      toast.error('Failed to book demo. Please try again.');
    }
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact/inquiry`, inquiryForm);
      toast.success('Message sent successfully! We will get back to you soon.');
      setInquiryForm({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-dark-300 via-primary-900 to-primary-800 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block bg-orange-500/20 backdrop-blur-sm rounded-full px-4 py-1 mb-6"
              >
                <span className="text-orange-400 text-sm font-semibold">⚡ India's Leading Tech Academy</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Build Your Career in{' '}
                <span className="text-orange-400 relative inline-block">
                  Data Science & AI
                  <svg className="absolute bottom-0 left-0 w-full" height="8" viewBox="0 0 300 8" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 4 C50 8, 100 2, 150 4 C200 6, 250 2, 300 4" stroke="#f97316" fill="none" strokeWidth="3"/>
                  </svg>
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Join India's most trusted tech academy and transform your career with industry-ready skills. 
                1000+ successful students placed in top MNCs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-lg transition duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
                  >
                    Enroll Now →
                  </motion.button>
                </Link>
                {/* <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDemoModal(true)}
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-600 text-white font-bold px-8 py-4 rounded-lg transition duration-300 w-full sm:w-auto"
                >
                  Free Demo Class
                </motion.button> */}
              </div>
              
              {/* Trust Badges */}
              <div className="flex gap-8 mt-8 pt-8 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span className="text-sm">4.9 Rating (500+ reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCertificate className="text-orange-400" />
                  <span className="text-sm">Internationally Certified</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600" 
                  alt="Students learning" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent"></div>
              </div>
              
              {/* Floating Stats */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaGraduationCap className="text-green-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">1000+</p>
                    <p className="text-sm text-gray-600">Happy Students</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H0Z" fill="white"/>
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
                <h3 className="text-3xl md:text-4xl font-bold text-gray-800">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            ref={ref}
            animate={controls}
            initial="hidden"
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
              Our Popular <span className="text-primary-600">Courses</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Industry-relevant courses designed by experts to make you job-ready
            </p>
          </motion.div>

          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
              >
                <div className={`bg-gradient-to-r ${course.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <course.icon className="text-5xl mb-4 relative z-10" />
                  <h3 className="text-2xl font-bold relative z-10">{course.name}</h3>
                  <p className="text-white/90 text-sm mt-1 relative z-10">{course.level}</p>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400" />
                      <span className="text-gray-600">{course.duration}</span>
                    </div>
                    <span className="text-2xl font-bold text-primary-600">{course.price}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <FaGraduationCap className="text-gray-400" />
                      <span className="text-gray-600">{course.students} enrolled</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaCertificate className="text-green-500" />
                      <span className="text-gray-600">Certificate</span>
                    </div>
                  </div>
                  <Link to={`/course/${course.id}`}>
                    <button className="w-full bg-gray-100 hover:bg-primary-600 text-gray-700 hover:text-white font-semibold py-3 rounded-lg transition duration-300">
                      Learn More →
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="text-center mt-12">
            <Link to="/courses">
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-3 rounded-lg transition duration-300">
                View All Courses →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
              Why Choose <span className="text-primary-600">SJS Global Tech</span>
            </h2>
            <p className="text-gray-600 text-lg">What makes us different from others</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`inline-block p-3 ${feature.color} rounded-xl mb-4 group-hover:scale-110 transition`}>
                  <feature.icon className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

     
      {/* <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
              Student <span className="text-primary-600">Success Stories</span>
            </h2>
            <p className="text-gray-600 text-lg">Hear from our happy students who transformed their careers</p>
          </div>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-white rounded-2xl shadow-xl p-6 m-4">
                  <div className="flex items-center mb-4">
                    <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full mr-4 object-cover" />
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{testimonial.name}</h3>
                      <p className="text-gray-600 text-sm">{testimonial.course}</p>
                      <div className="text-yellow-400 text-sm">
                        {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 font-semibold">🏢 {testimonial.company}</span>
                      <span className="text-orange-600 font-semibold">💰 {testimonial.salary}</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section> */}

      {/* Trainer/Founder Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://res.cloudinary.com/dxxpeilta/image/upload/f_auto,q_auto/MY_PIC_ceizfl.jpg" 
                  alt="Founder" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent"></div>
              </div>
              {/* <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-4 rounded-xl shadow-lg">
                <p className="font-bold">+ Years</p>
                <p className="text-sm">Experience</p>
              </div> */}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
                Meet Your <span className="text-primary-600">Mentor</span>
              </h2>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Harshdeep Singh</h3>
              <p className="text-gray-600 mb-4">Founder & Lead Trainer, SJS Global Tech </p>
              <div className="space-y-4 text-gray-600 mb-6">
                <p>✓ Extensive Industry Experience in Data Science & AI</p>
                <p>✓ Trusted Training Platform for Future Tech Professionals</p>
                <p>✓ Skilled in Real-World Data Science & AI Applications</p>
                <p>✓ Helping Students Learn Industry-Level Data Science & AI Skills</p>
                <p>✓ Passionate about making tech education accessible to all</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span>5.0 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaGraduationCap />
                  <span>1000+ Students</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
              <p className="text-gray-300 mb-8 text-lg">Have questions? We're here to help you succeed in your career journey.</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <FaWhatsapp className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-gray-400">WhatsApp</p>
                    <a href="https://wa.me/9185950026639" className="text-xl font-semibold hover:text-orange-400 transition">
                      +91 89500 26639
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <FaEnvelope className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-gray-400">Email</p>
                    <a href="mailto:sjsglobaltech@gmail.com" className="text-xl font-semibold hover:text-orange-400 transition">
                      sjsglobaltech@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <FaPhone className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <a href="tel:+9185950026639" className="text-xl font-semibold hover:text-orange-400 transition">
                      +91 89500 26639
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      Demo Modal
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-8"
          >
            <h3 className="text-2xl font-bold mb-4">Book Free Demo Class</h3>
            <form onSubmit={handleDemoBooking} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={demoForm.name}
                onChange={(e) => setDemoForm({...demoForm, name: e.target.value})}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={demoForm.email}
                onChange={(e) => setDemoForm({...demoForm, email: e.target.value})}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={demoForm.phone}
                onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="date"
                value={demoForm.date}
                onChange={(e) => setDemoForm({...demoForm, date: e.target.value})}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">
                Book Free Demo
              </button>
              <button type="button" onClick={() => setShowDemoModal(false)} className="w-full text-gray-500 py-2">
                Cancel
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;



