import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Verify Certificate', path: '/verify-certificate' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const courses = [
    { name: 'Data Science', path: '/course/1' },
    { name: 'Machine Learning', path: '/course/2' },
    { name: 'Advance Python', path: '/course/3' },
    { name: 'Power BI', path: '/course/4' },
    { name: 'Advance Excel', path: '/course/5' },
    { name: 'Data Analyst', path: '/course/6' },
  ];

  const socialLinks = [
    // { icon: FaFacebook, href: 'https://facebook.com', color: 'hover:text-blue-600' },
    { icon: FaTwitter, href: 'https://x.com/sjsglobaltech', color: 'hover:text-blue-400' },
    { icon: FaInstagram, href: 'https://www.instagram.com/sjsglobaltech/', color: 'hover:text-pink-600' },
    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/sjs-global-tech-017927414/', color: 'hover:text-blue-700' },
    // { icon: FaYoutube, href: 'https://youtube.com', color: 'hover:text-red-600' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-primary-500">SJS</span>
              <span className="text-orange-500"> Global Tech</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Empowering careers through quality tech education. Join us to transform your future with industry-ready skills.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 hover:text-white transition ${social.color}`}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-gray-400 hover:text-primary-500 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-xl font-bold mb-4">Popular Courses</h3>
            <ul className="space-y-2">
              {courses.map((course, index) => (
                <li key={index}>
                  <Link to={course.path} className="text-gray-400 hover:text-primary-500 transition">
                    {course.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary-500 mt-1" />
                <span className="text-gray-400">FM2J+8H, Mamera, Ellenabad, Haryana-125102, India</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-primary-500" />
                <span className="text-gray-400">+91 89500 26639</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-500" />
                <span className="text-gray-400">sjsglobaltech@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaWhatsapp className="text-green-500" />
                <span className="text-gray-400">+91 89500 26639 (WhatsApp)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Subscribe to our Newsletter</h3>
              <p className="text-gray-400">Get the latest updates on new courses and events</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-primary-500"
              />
              <button className="bg-primary-600 hover:bg-primary-700 px-6 py-2 rounded-lg transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} SJS Global Tech. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/privacy" className="text-gray-400 hover:text-primary-500 text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-primary-500 text-sm">
              Terms of Service
            </Link>
            <Link to="/refund" className="text-gray-400 hover:text-primary-500 text-sm">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;