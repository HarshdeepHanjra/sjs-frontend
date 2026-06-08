import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaBell, FaUserCircle, FaCog, FaSignOutAlt, FaChevronDown,
  FaChartLine, FaUsers, FaBook, FaCalendarAlt, FaCreditCard,
  FaMoneyBillWave, FaBriefcase, FaCertificate, FaEnvelope,
  FaSearch, FaBars, FaTimes, FaShieldAlt, FaGlobe
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminNavbar = ({ activeSection, onSectionChange, onLogout }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New payment verification request', type: 'warning', read: false, time: '5 min ago' },
    { id: 2, message: 'Student enrollment increased by 15%', type: 'info', read: false, time: '1 hour ago' },
    { id: 3, message: 'System update scheduled tonight', type: 'success', read: true, time: '3 hours ago' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setAdmin(parsed);
      } catch (e) {
        console.error('Error parsing admin data:', e);
      }
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartLine, path: '/admin/dashboard' },
    { id: 'students', label: 'Students', icon: FaUsers, path: '/admin/students' },
    { id: 'courses', label: 'Courses', icon: FaBook, path: '/admin/courses' },
    { id: 'attendance', label: 'Attendance', icon: FaCalendarAlt, path: '/admin/attendance' },
    { id: 'orders', label: 'Orders', icon: FaCreditCard, path: '/admin/orders' },
    { id: 'payment-verification', label: 'Course Payments', icon: FaMoneyBillWave, path: '/admin/payments' },
    { id: 'internship-payments', label: 'Internship Payments', icon: FaBriefcase, path: '/admin/internship-payments' },
    { id: 'certificates', label: 'Certificates', icon: FaCertificate, path: '/admin/certificates' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    toast.success('Logged out successfully');
    navigate('/login');
    if (onLogout) onLogout();
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden text-gray-300 hover:text-white focus:outline-none"
              >
                {showMobileMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
              
              <Link to="/admin/dashboard" className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-lg">
                  <FaShieldAlt className="text-xl" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    SJS Academy
                  </h1>
                  <p className="text-xs text-gray-400">Admin Dashboard</p>
                </div>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-gray-700 rounded-lg px-3 py-2 w-96">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search students, courses, payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-white placeholder-gray-400 w-full"
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none"
                >
                  <FaBell className="text-xl" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-primary-600 hover:text-primary-700"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No notifications
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                              </div>
                              {!notification.read && (
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <button className="text-center text-sm text-primary-600 hover:text-primary-700 w-full">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 focus:outline-none group"
                >
                  <div className="relative">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-full w-10 h-10 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {getInitials(admin?.full_name || admin?.username || 'Admin')}
                      </span>
                    </div>
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold">
                      {admin?.full_name || admin?.username || 'Administrator'}
                    </p>
                    <p className="text-xs text-gray-400">Super Admin</p>
                  </div>
                  <FaChevronDown className={`text-gray-400 text-sm transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-full w-12 h-12 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {getInitials(admin?.full_name || admin?.username || 'Admin')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {admin?.full_name || admin?.username || 'Administrator'}
                          </h4>
                          <p className="text-sm text-gray-500">{admin?.email}</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                            Administrator
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/admin/profile');
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition"
                      >
                        <FaUserCircle className="text-gray-500" />
                        <span className="text-gray-700">My Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/admin/settings');
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition"
                      >
                        <FaCog className="text-gray-500" />
                        <span className="text-gray-700">Settings</span>
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-200 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition"
                      >
                        <FaSignOutAlt />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)}></div>
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 shadow-xl z-50 overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-lg">
                  <FaShieldAlt className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-white font-bold">SJS Academy</h2>
                  <p className="text-xs text-gray-400">Admin Panel</p>
                </div>
              </div>
            </div>
            
            <nav className="mt-6">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setShowMobileMenu(false);
                    if (onSectionChange) onSectionChange(item.id);
                  }}
                  className={`w-full flex items-center space-x-3 px-6 py-3 transition-colors duration-200 ${
                    activeSection === item.id
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">System Online</span>
              </div>
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-500">
                <span>Last backup: Today, 02:00 AM</span>
                <span>•</span>
                <span>Active sessions: 1</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <FaGlobe className="inline mr-1" /> India (IST)
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;