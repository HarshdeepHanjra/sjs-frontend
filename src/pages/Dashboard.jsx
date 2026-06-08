// // import React, { useState, useEffect } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { motion } from 'framer-motion';
// // import { 
// //   FaBook, FaCertificate, FaCalendarCheck, FaUser, FaChartLine,
// //   FaArrowRight, FaBookOpen, FaSpinner, FaCheckCircle, FaClock
// // } from 'react-icons/fa';
// // import api from '../services/api';
// // import toast from 'react-hot-toast';
// // import { useAuth } from '../context/UserContext';
// // import AttendanceView from '../components/AttendanceView';

// // const Dashboard = () => {
// //   const navigate = useNavigate();
// //   const { user, isAuthenticated, loading: authLoading } = useAuth();
// //   const [activeTab, setActiveTab] = useState('overview');
// //   const [stats, setStats] = useState({
// //     purchased_courses: 0,
// //     certificates: 0,
// //     attendance_percentage: 0,
// //     completion_percentage: 0
// //   });
// //   const [recentCourses, setRecentCourses] = useState([]);
// //   const [certificates, setCertificates] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [attendanceData, setAttendanceData] = useState(null);
// //   const [courseCount, setCourseCount] = useState(0);

// //   useEffect(() => {
// //   const fetchCourseCount = async () => {
// //     try {
// //       const response = await api.get('/user/purchased-courses');
// //       if (response.data.success) {
// //         setCourseCount(response.data.courses.length);
// //       }
// //     } catch (error) {
// //       console.error("Failed to fetch course count:", error);
// //     }
// //   };
  
// //   fetchCourseCount();
// // }, []);

// //   useEffect(() => {
// //     // Check authentication
// //     if (!authLoading) {
// //       const token = localStorage.getItem('token');
// //       const userType = localStorage.getItem('userType');
      
// //       if (!token || userType !== 'student') {
// //         navigate('/login', { replace: true });
// //         return;
// //       }
      
// //       fetchDashboardData();
// //     }
// //   }, [isAuthenticated, authLoading, navigate]);

// //   useEffect(() => {
// //     // Listen for course updates from admin panel
// //     const handleCoursesUpdate = () => {
// //       fetchDashboardData();
// //     };
    
// //     window.addEventListener('coursesUpdated', handleCoursesUpdate);
    
// //     return () => {
// //       window.removeEventListener('coursesUpdated', handleCoursesUpdate);
// //     };
// //   }, []);

// //   const fetchDashboardData = async () => {
// //     setLoading(true);
// //     const token = localStorage.getItem('token');
// //     const config = { headers: { Authorization: `Bearer ${token}` } };
    
// //     try {
// //       // Fetch dashboard stats
// //       try {
// //         const statsRes = await api.get('/user/dashboard/stats', config);
// //         if (statsRes.data.success) {
// //           setStats({
// //             purchased_courses: statsRes.data.stats?.purchased_courses || 0,
// //             certificates: statsRes.data.stats?.certificates || 0,
// //             attendance_percentage: statsRes.data.stats?.attendance_percentage || 0,
// //             completion_percentage: statsRes.data.stats?.completion_percentage || 0
// //           });
// //         }
// //       } catch (statsError) {
// //         console.error('Failed to fetch stats:', statsError);
// //       }
      
// //       // Fetch purchased courses (real data)
// //       try {
// //         const coursesRes = await api.get('/cart/my-courses', config);
// //         if (coursesRes.data && coursesRes.data.courses) {
// //           setRecentCourses(coursesRes.data.courses);
// //           // Update purchased courses count from actual data
// //           setStats(prev => ({
// //             ...prev,
// //             purchased_courses: coursesRes.data.courses.length
// //           }));
// //         }
// //       } catch (coursesError) {
// //         console.error('Failed to fetch courses:', coursesError);
// //       }
      
// //       // Fetch certificates (real data)
// //       try {
// //         const certRes = await api.get('/student/certificates', config);
// //         if (certRes.data && certRes.data.certificates) {
// //           setCertificates(certRes.data.certificates);
// //           setStats(prev => ({
// //             ...prev,
// //             certificates: certRes.data.certificates.length
// //           }));
// //         }
// //       } catch (certError) {
// //         console.error('Failed to fetch certificates:', certError);
// //       }
      
// //       // Fetch attendance (real data)
// //       try {
// //         const attendanceRes = await api.get('/student/attendance/my-attendance', config);
// //         if (attendanceRes.data && attendanceRes.data.overall) {
// //           setAttendanceData(attendanceRes.data);
// //           setStats(prev => ({
// //             ...prev,
// //             attendance_percentage: attendanceRes.data.overall?.percentage || 0
// //           }));
// //         }
// //       } catch (attError) {
// //         console.error('Failed to fetch attendance:', attError);
// //       }
      
// //     } catch (error) {
// //       console.error('Dashboard error:', error);
// //       toast.error('Failed to load dashboard data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const tabs = [
// //     { id: 'overview', label: 'Overview', icon: FaChartLine },
// //     { id: 'my-courses', label: 'My Courses', icon: FaBook },
// //     { id: 'certificates', label: 'Certificates', icon: FaCertificate },
// //     { id: 'attendance', label: 'Attendance', icon: FaCalendarCheck },
// //   ];

// //   const statCards = [
// //     { 
// //       icon: FaBook, 
// //       label: 'Courses Enrolled', 
// //       value: stats.purchased_courses, 
// //       color: 'bg-blue-500',
// //       bgColor: 'bg-blue-50',
// //       textColor: 'text-blue-600'
// //     },
// //     { 
// //       icon: FaCertificate, 
// //       label: 'Certificates Earned', 
// //       value: stats.certificates, 
// //       color: 'bg-green-500',
// //       bgColor: 'bg-green-50',
// //       textColor: 'text-green-600'
// //     },
// //     { 
// //       icon: FaCalendarCheck, 
// //       label: 'Attendance', 
// //       value: `${Math.round(stats.attendance_percentage)}%`, 
// //       color: 'bg-purple-500',
// //       bgColor: 'bg-purple-50',
// //       textColor: 'text-purple-600'
// //     },
// //     { 
// //       icon: FaChartLine, 
// //       label: 'Overall Progress', 
// //       value: `${Math.round(stats.completion_percentage)}%`, 
// //       color: 'bg-orange-500',
// //       bgColor: 'bg-orange-50',
// //       textColor: 'text-orange-600'
// //     },
// //   ];

// //   if (authLoading || loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="text-center">
// //           <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
// //           <p className="text-gray-600">Loading your dashboard...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Welcome Banner */}
// //       <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
// //         <div className="container mx-auto px-4 py-8">
// //           <div className="flex flex-col md:flex-row justify-between items-center">
// //             <div className="flex items-center space-x-4 mb-4 md:mb-0">
// //               <div className="bg-white/20 p-3 rounded-full">
// //                 <FaUser className="text-2xl" />
// //               </div>
// //               <div>
// //                 <h1 className="text-2xl font-bold">
// //                   Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
// //                 </h1>
// //                 <p className="text-primary-100">
// //                   Student ID: {user?.student_id || 'Not assigned'}
// //                 </p>
// //                 <p className="text-primary-100 text-sm">{user?.email}</p>
// //               </div>
// //             </div>
// //             <div className="flex space-x-6">
// //               <div className="text-center">
// //                 <p className="text-2xl font-bold">{stats.purchased_courses}</p>
// //                 <p className="text-sm text-primary-200">Courses</p>
// //               </div>
// //               <div className="text-center">
// //                 <p className="text-2xl font-bold">{stats.certificates}</p>
// //                 <p className="text-sm text-primary-200">Certificates</p>
// //               </div>
// //               <div className="text-center">
// //                 <p className="text-2xl font-bold">{Math.round(stats.attendance_percentage)}%</p>
// //                 <p className="text-sm text-primary-200">Attendance</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Quick Stats */}
// //       <div className="container mx-auto px-4 -mt-6">
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
// //           {statCards.map((stat, index) => (
// //             <motion.div
// //               key={index}
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ delay: index * 0.1 }}
// //               className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
// //             >
// //               <div className="flex items-center justify-between">
// //                 <div>
// //                   <p className="text-gray-500 text-sm">{stat.label}</p>
// //                   <p className="text-2xl font-bold text-gray-800 mt-1">
// //                     {stat.value}
// //                   </p>
// //                 </div>
// //                 <div className={`${stat.bgColor} p-3 rounded-full`}>
// //                   <stat.icon className={`text-xl ${stat.textColor}`} />
// //                 </div>
// //               </div>
// //             </motion.div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Tabs Navigation */}
// //       <div className="border-b bg-white mt-6">
// //         <div className="container mx-auto px-4">
// //           <div className="flex overflow-x-auto space-x-4">
// //             {tabs.map((tab) => (
// //               <button
// //                 key={tab.id}
// //                 onClick={() => setActiveTab(tab.id)}
// //                 className={`flex items-center space-x-2 px-4 py-3 font-semibold transition-all duration-300 ${
// //                   activeTab === tab.id
// //                     ? 'text-primary-600 border-b-2 border-primary-600'
// //                     : 'text-gray-600 hover:text-primary-600'
// //                 }`}
// //               >
// //                 <tab.icon />
// //                 <span>{tab.label}</span>
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Tab Content */}
// //       <div className="container mx-auto px-4 py-8">
        
// //         {/* ==================== OVERVIEW TAB ==================== */}
// //         {activeTab === 'overview' && (
// //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
// //             {/* My Courses Section */}
// //             <div className="bg-white rounded-xl shadow-md p-6">
// //               <div className="flex justify-between items-center mb-4">
// //                 <h2 className="text-xl font-bold text-gray-800">My Courses</h2>
// //                 <Link to="/my-courses" className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1">
// //                   View All Courses <FaArrowRight size={12} />
// //                 </Link>
// //               </div>
              
// //               {recentCourses.length === 0 ? (
// //                 <div className="text-center py-8">
// //                   <FaBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
// //                   <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
// //                   <Link to="/courses">
// //                     <button className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
// //                       Browse Courses →
// //                     </button>
// //                   </Link>
// //                 </div>
// //               ) : (
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   {recentCourses.slice(0, 4).map((course) => (
// //                     <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition">
// //                       <h3 className="font-semibold text-lg">{course.name}</h3>
// //                       <p className="text-gray-600 text-sm mt-1">{course.duration}</p>
// //                       <div className="flex justify-between items-center mt-3">
// //                         <span className="text-primary-600 font-bold">
// //                           ₹{course.price?.toLocaleString()}
// //                         </span>
// //                         <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
// //                           Enrolled
// //                         </span>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>

// //             {/* Recent Certificates */}
// //             {certificates.length > 0 && (
// //               <div className="bg-white rounded-xl shadow-md p-6">
// //                 <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Certificates</h2>
// //                 <div className="space-y-3">
// //                   {certificates.slice(0, 3).map((cert) => (
// //                     <div key={cert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
// //                       <div className="flex items-center gap-3">
// //                         <FaCertificate className="text-yellow-500 text-xl" />
// //                         <div>
// //                           <p className="font-medium text-gray-800">{cert.course_name}</p>
// //                           <p className="text-xs text-gray-500">Issued: {cert.issue_date}</p>
// //                         </div>
// //                       </div>
// //                       <Link to={`/certificate/${cert.id}`}>
// //                         <button className="text-primary-600 hover:text-primary-700 text-sm">
// //                           View
// //                         </button>
// //                       </Link>
// //                     </div>
// //                   ))}
// //                 </div>
// //                 {certificates.length > 3 && (
// //                   <button 
// //                     onClick={() => setActiveTab('certificates')}
// //                     className="mt-4 text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
// //                   >
// //                     View all certificates <FaArrowRight size={12} />
// //                   </button>
// //                 )}
// //               </div>
// //             )}

// //             {/* Attendance Summary */}
// //             {attendanceData && attendanceData.overall && (
// //               <div className="bg-white rounded-xl shadow-md p-6">
// //                 <h2 className="text-xl font-bold text-gray-800 mb-4">Attendance Summary</h2>
// //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                   <div className="text-center p-4 bg-blue-50 rounded-lg">
// //                     <p className="text-2xl font-bold text-blue-600">
// //                       {Math.round(attendanceData.overall.percentage)}%
// //                     </p>
// //                     <p className="text-sm text-gray-600">Overall Attendance</p>
// //                   </div>
// //                   <div className="text-center p-4 bg-green-50 rounded-lg">
// //                     <p className="text-2xl font-bold text-green-600">
// //                       {attendanceData.overall.total_present || 0}
// //                     </p>
// //                     <p className="text-sm text-gray-600">Classes Attended</p>
// //                   </div>
// //                   <div className="text-center p-4 bg-orange-50 rounded-lg">
// //                     <p className="text-2xl font-bold text-orange-600">
// //                       {attendanceData.overall.total_classes || 0}
// //                     </p>
// //                     <p className="text-sm text-gray-600">Total Classes</p>
// //                   </div>
// //                 </div>
// //                 <button 
// //                   onClick={() => setActiveTab('attendance')}
// //                   className="mt-4 text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
// //                 >
// //                   View detailed attendance <FaArrowRight size={12} />
// //                 </button>
// //               </div>
// //             )}
// //           </motion.div>
// //         )}

// //         {/* ==================== MY COURSES TAB ==================== */}
// //         {activeTab === 'my-courses' && (
// //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
// //             <div className="bg-white rounded-xl shadow-md p-6">
// //               <h2 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h2>
// //               {recentCourses.length === 0 ? (
// //                 <div className="text-center py-12">
// //                   <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
// //                   <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
// //                   <Link to="/courses">
// //                     <button className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
// //                       Browse Courses →
// //                     </button>
// //                   </Link>
// //                 </div>
// //               ) : (
// //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                   {recentCourses.map((course) => (
// //                     <div key={course.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition">
// //                       <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-4 text-white">
// //                         <h3 className="font-bold text-lg">{course.name}</h3>
// //                         <p className="text-sm opacity-90">{course.duration}</p>
// //                       </div>
// //                       <div className="p-4">
// //                         <p className="text-gray-600 text-sm mb-3">
// //                           {course.description?.substring(0, 100) || 'Comprehensive course to master the subject.'}
// //                         </p>
// //                         <div className="flex justify-between items-center mt-3">
// //                           <span className="text-primary-600 font-bold">
// //                             ₹{course.price?.toLocaleString()}
// //                           </span>
// //                           <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
// //                             Enrolled
// //                           </span>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           </motion.div>
// //         )}

// //         {/* ==================== CERTIFICATES TAB ==================== */}
// //         {activeTab === 'certificates' && (
// //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
// //             <div className="bg-white rounded-xl shadow-md p-6">
// //               <h2 className="text-2xl font-bold text-gray-800 mb-6">My Certificates</h2>
// //               {certificates.length === 0 ? (
// //                 <div className="text-center py-12">
// //                   <FaCertificate className="text-6xl text-gray-300 mx-auto mb-4" />
// //                   <p className="text-gray-500">No certificates earned yet.</p>
// //                   <p className="text-sm text-gray-400">Complete courses to earn certificates</p>
// //                 </div>
// //               ) : (
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                   {certificates.map((cert) => (
// //                     <div key={cert.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-300">
// //                       <div className="text-center mb-4">
// //                         <FaCertificate className="text-yellow-500 text-5xl mx-auto mb-2" />
// //                         <h3 className="font-bold text-xl">Certificate of Completion</h3>
// //                       </div>
// //                       <div className="text-center">
// //                         <p className="text-gray-600">Awarded to: {user?.name}</p>
// //                         <p className="text-gray-600">Course: {cert.course_name}</p>
// //                         <p className="text-gray-600">Date: {cert.issue_date}</p>
// //                         <p className="text-xs text-gray-500 mt-1">ID: {cert.certificate_id}</p>
// //                       </div>
// //                       <div className="flex space-x-3 mt-4">
// //                         <button className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
// //                           <FaEye className="inline mr-1" /> View
// //                         </button>
// //                         <button className="flex-1 border border-primary-600 text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50">
// //                           <FaDownload className="inline mr-1" /> Download PDF
// //                         </button>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           </motion.div>
// //         )}

// //         {/* ==================== ATTENDANCE TAB ==================== */}
// //         {activeTab === 'attendance' && (
// //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
// //             <AttendanceView />
// //           </motion.div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;


// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { 
//   FaBook, FaCertificate, FaCalendarCheck, FaUser, FaChartLine,
//   FaArrowRight, FaBookOpen, FaSpinner, FaCheckCircle, FaClock,
//   FaEye, FaDownload, FaShare, FaWhatsapp, FaEnvelope, FaLinkedin, FaCopy
// } from 'react-icons/fa';
// import api from '../services/api';
// import toast from 'react-hot-toast';
// import { useAuth } from '../context/UserContext';
// import AttendanceView from '../components/AttendanceView';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { user, isAuthenticated, loading: authLoading } = useAuth();
//   const [activeTab, setActiveTab] = useState('overview');
//   const [stats, setStats] = useState({
//     purchased_courses: 0,
//     certificates: 0,
//     attendance_percentage: 0,
//     completion_percentage: 0
//   });
//   const [recentCourses, setRecentCourses] = useState([]);
//   const [certificates, setCertificates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [attendanceData, setAttendanceData] = useState(null);
//   const [showCertificateModal, setShowCertificateModal] = useState(false);
//   const [selectedCertificate, setSelectedCertificate] = useState(null);
//   const [showShareModal, setShowShareModal] = useState(false);

//   useEffect(() => {
//     const fetchCourseCount = async () => {
//       try {
//         const response = await api.get('/user/purchased-courses');
//         if (response.data.success) {
//           // Update stats with course count
//         }
//       } catch (error) {
//         console.error("Failed to fetch course count:", error);
//       }
//     };
    
//     fetchCourseCount();
//   }, []);

//   useEffect(() => {
//     if (!authLoading) {
//       const token = localStorage.getItem('token');
//       const userType = localStorage.getItem('userType');
      
//       if (!token || userType !== 'student') {
//         navigate('/login', { replace: true });
//         return;
//       }
      
//       fetchDashboardData();
//     }
//   }, [isAuthenticated, authLoading, navigate]);

//   useEffect(() => {
//     const handleCoursesUpdate = () => {
//       fetchDashboardData();
//     };
    
//     window.addEventListener('coursesUpdated', handleCoursesUpdate);
//     window.addEventListener('certificateGenerated', handleCoursesUpdate);
    
//     return () => {
//       window.removeEventListener('coursesUpdated', handleCoursesUpdate);
//       window.removeEventListener('certificateGenerated', handleCoursesUpdate);
//     };
//   }, []);

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     const token = localStorage.getItem('token');
//     const config = { headers: { Authorization: `Bearer ${token}` } };
    
//     try {
//       // Fetch purchased courses
//       try {
//         const coursesRes = await api.get('/cart/my-courses', config);
//         if (coursesRes.data && coursesRes.data.courses) {
//           setRecentCourses(coursesRes.data.courses);
//           setStats(prev => ({
//             ...prev,
//             purchased_courses: coursesRes.data.courses.length
//           }));
//         }
//       } catch (coursesError) {
//         console.error('Failed to fetch courses:', coursesError);
//       }
      
//       // Fetch certificates
//       try {
//         const certRes = await api.get('/certificates/my-certificates', config);
//         if (certRes.data && certRes.data.certificates) {
//           setCertificates(certRes.data.certificates);
//           setStats(prev => ({
//             ...prev,
//             certificates: certRes.data.certificates.length
//           }));
//         }
//       } catch (certError) {
//         console.error('Failed to fetch certificates:', certError);
//       }
      
//       // Fetch attendance
//       try {
//         const attendanceRes = await api.get('/student/attendance/my-attendance', config);
//         if (attendanceRes.data && attendanceRes.data.overall) {
//           setAttendanceData(attendanceRes.data);
//           setStats(prev => ({
//             ...prev,
//             attendance_percentage: attendanceRes.data.overall?.percentage || 0
//           }));
//         }
//       } catch (attError) {
//         console.error('Failed to fetch attendance:', attError);
//       }
      
//     } catch (error) {
//       console.error('Dashboard error:', error);
//       toast.error('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCertificateHTML = (certificate) => {
//     const verificationUrl = `${window.location.origin}/verify-certificate?token=${certificate.verification_token}`;
    
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Certificate of Achievement - ${certificate.course_name}</title>
//         <meta charset="UTF-8">
//         <style>
//           @page { size: landscape; margin: 0; }
//           * { margin: 0; padding: 0; box-sizing: border-box; }
//           body {
//             margin: 0;
//             padding: 20px;
//             font-family: 'Georgia', 'Times New Roman', serif;
//             background: #e8e8e8;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             min-height: 100vh;
//           }
//           .certificate {
//             width: 950px;
//             background: white;
//             position: relative;
//             box-shadow: 0 20px 40px rgba(0,0,0,0.2);
//             border: 12px solid #1a3a5c;
//           }
//           .certificate-inner {
//             border: 2px solid #c9a03d;
//             margin: 20px;
//             padding: 30px;
//             position: relative;
//           }
//           .logo-top { text-align: center; margin-bottom: 20px; }
//           .logo-top h1 { font-size: 28px; color: #1a3a5c; letter-spacing: 3px; }
//           .logo-top p { font-size: 11px; color: #888; }
//           .certificate-title { text-align: center; margin: 20px 0; }
//           .certificate-title h2 { font-size: 38px; color: #c9a03d; letter-spacing: 2px; }
//           .presented-to { text-align: center; font-size: 16px; color: #555; margin: 20px 0 10px; }
//           .student-name { text-align: center; font-size: 48px; color: #1a3a5c; margin: 15px 0; font-weight: bold; border-bottom: 2px solid #c9a03d; display: inline-block; padding: 0 30px 10px; }
//           .student-name-container { text-align: center; }
//           .completion-text { text-align: center; font-size: 15px; color: #444; margin: 25px 0; line-height: 1.6; }
//           .score-section { text-align: center; margin: 20px 0; }
//           .score-badge { display: inline-block; background: #1a3a5c; color: white; padding: 5px 20px; border-radius: 25px; }
//           .signature-section { display: flex; justify-content: space-between; margin-top: 40px; }
//           .signature { text-align: center; }
//           .signature-line { width: 200px; border-top: 1px solid #333; margin-top: 40px; padding-top: 5px; }
//           .qr-section { position: absolute; bottom: 30px; right: 30px; text-align: center; }
//           .qr-section img { width: 80px; height: 80px; }
//           .date { text-align: center; margin-top: 30px; font-size: 11px; color: #666; }
//           .certificate-id { text-align: center; margin-top: 10px; font-size: 9px; color: #bbb; }
//         </style>
//       </head>
//       <body>
//         <div class="certificate">
//           <div class="certificate-inner">
//             <div class="logo-top">
//               <h1>SJS GLOBAL TECH ACADEMY</h1>
//               <p>ESTABLISHING EXCELLENCE IN TECHNOLOGY EDUCATION</p>
//             </div>
//             <div class="certificate-title">
//               <h2>CERTIFICATE OF ACHIEVEMENT</h2>
//             </div>
//             <div class="presented-to">THIS CERTIFICATE IS PROUDLY PRESENTED TO</div>
//             <div class="student-name-container">
//               <div class="student-name">${certificate.student_name}</div>
//             </div>
//             <div class="completion-text">
//               For successfully completing the course <strong>“${certificate.course_name}”</strong><br>
//               with outstanding performance and dedication.
//             </div>
//             <div class="score-section">
//               <span class="score-badge">Score: ${certificate.score}%</span>
//             </div>
//             <div class="signature-section">
//               <div class="signature"><div class="signature-line"><p>AUTHORIZED SIGNATURE</p></div></div>
//               <div class="signature"><div class="signature-line"><p>COMPANY SEAL</p></div></div>
//             </div>
//             <div class="qr-section">
//               <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(verificationUrl)}" alt="QR" />
//               <p>SCAN TO VERIFY</p>
//             </div>
//             <div class="date">Date: ${new Date(certificate.issue_date).toLocaleDateString()}</div>
//             <div class="certificate-id">Certificate ID: ${certificate.certificate_id}</div>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   };

//   const handleViewCertificate = (certificate) => {
//     setSelectedCertificate(certificate);
//     setShowCertificateModal(true);
//   };

//   const handleDownloadCertificate = (certificate) => {
//     const htmlContent = getCertificateHTML(certificate);
//     const blob = new Blob([htmlContent], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `certificate_${certificate.certificate_id}.html`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//     toast.success('Certificate downloaded!');
//   };

//   const handlePrintCertificate = (certificate) => {
//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(getCertificateHTML(certificate));
//     printWindow.document.close();
//     printWindow.print();
//   };

//   const handleShareCertificate = (certificate) => {
//     setSelectedCertificate(certificate);
//     setShowShareModal(true);
//   };

//   const handleCopyLink = (certificate) => {
//     const verificationUrl = `${window.location.origin}/verify-certificate?token=${certificate.verification_token}`;
//     navigator.clipboard.writeText(verificationUrl);
//     toast.success('Verification link copied!');
//   };

//   const handleShareWhatsApp = (certificate) => {
//     const text = `I have successfully completed "${certificate.course_name}" with ${certificate.score}% score from SJS Global Tech Academy! Verify here: ${window.location.origin}/verify-certificate?token=${certificate.verification_token}`;
//     window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
//   };

//   const handleShareEmail = (certificate) => {
//     const subject = `Certificate of Completion - ${certificate.course_name}`;
//     const body = `I have successfully completed "${certificate.course_name}" with ${certificate.score}% score.\n\nVerify: ${window.location.origin}/verify-certificate?token=${certificate.verification_token}`;
//     window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
//   };

//   const handleShareLinkedIn = (certificate) => {
//     const url = `${window.location.origin}/verify-certificate?token=${certificate.verification_token}`;
//     window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
//   };

//   const getScoreColor = (score) => {
//     if (score >= 90) return 'text-green-600';
//     if (score >= 75) return 'text-blue-600';
//     if (score >= 60) return 'text-yellow-600';
//     return 'text-red-600';
//   };

//   const tabs = [
//     { id: 'overview', label: 'Overview', icon: FaChartLine },
//     { id: 'my-courses', label: 'My Courses', icon: FaBook },
//     { id: 'certificates', label: 'Certificates', icon: FaCertificate },
//     { id: 'attendance', label: 'Attendance', icon: FaCalendarCheck },
//   ];

//   const statCards = [
//     { icon: FaBook, label: 'Courses Enrolled', value: stats.purchased_courses, bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
//     { icon: FaCertificate, label: 'Certificates Earned', value: stats.certificates, bgColor: 'bg-green-50', textColor: 'text-green-600' },
//     { icon: FaCalendarCheck, label: 'Attendance', value: `${Math.round(stats.attendance_percentage)}%`, bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
//     { icon: FaChartLine, label: 'Overall Progress', value: `${Math.round(stats.completion_percentage)}%`, bgColor: 'bg-orange-50', textColor: 'text-orange-600' },
//   ];

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
//           <p className="text-gray-600">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Welcome Banner */}
//       <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
//         <div className="container mx-auto px-4 py-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="flex items-center space-x-4 mb-4 md:mb-0">
//               <div className="bg-white/20 p-3 rounded-full">
//                 <FaUser className="text-2xl" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋</h1>
//                 <p className="text-primary-100">Student ID: {user?.student_id || 'Not assigned'}</p>
//                 <p className="text-primary-100 text-sm">{user?.email}</p>
//               </div>
//             </div>
//             <div className="flex space-x-6">
//               <div className="text-center">
//                 <p className="text-2xl font-bold">{stats.purchased_courses}</p>
//                 <p className="text-sm text-primary-200">Courses</p>
//               </div>
//               <div className="text-center">
//                 <p className="text-2xl font-bold">{stats.certificates}</p>
//                 <p className="text-sm text-primary-200">Certificates</p>
//               </div>
//               <div className="text-center">
//                 <p className="text-2xl font-bold">{Math.round(stats.attendance_percentage)}%</p>
//                 <p className="text-sm text-primary-200">Attendance</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="container mx-auto px-4 -mt-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {statCards.map((stat, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-500 text-sm">{stat.label}</p>
//                   <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
//                 </div>
//                 <div className={`${stat.bgColor} p-3 rounded-full`}>
//                   <stat.icon className={`text-xl ${stat.textColor}`} />
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Tabs Navigation */}
//       <div className="border-b bg-white mt-6">
//         <div className="container mx-auto px-4">
//           <div className="flex overflow-x-auto space-x-4">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center space-x-2 px-4 py-3 font-semibold transition-all duration-300 ${
//                   activeTab === tab.id
//                     ? 'text-primary-600 border-b-2 border-primary-600'
//                     : 'text-gray-600 hover:text-primary-600'
//                 }`}
//               >
//                 <tab.icon />
//                 <span>{tab.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Tab Content */}
//       <div className="container mx-auto px-4 py-8">
        
//         {/* OVERVIEW TAB */}
//         {activeTab === 'overview' && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
//             {/* My Courses Section */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold text-gray-800">My Courses</h2>
//                 <Link to="/my-courses" className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1">
//                   View All Courses <FaArrowRight size={12} />
//                 </Link>
//               </div>
              
//               {recentCourses.length === 0 ? (
//                 <div className="text-center py-8">
//                   <FaBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
//                   <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
//                   <Link to="/courses">
//                     <button className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
//                       Browse Courses →
//                     </button>
//                   </Link>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {recentCourses.slice(0, 4).map((course) => (
//                     <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition">
//                       <h3 className="font-semibold text-lg">{course.name}</h3>
//                       <p className="text-gray-600 text-sm mt-1">{course.duration}</p>
//                       <div className="flex justify-between items-center mt-3">
//                         <span className="text-primary-600 font-bold">₹{course.price?.toLocaleString()}</span>
//                         <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Enrolled</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Certificates Section */}
//             {certificates.length > 0 && (
//               <div className="bg-white rounded-xl shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Certificates</h2>
//                 <div className="space-y-3">
//                   {certificates.slice(0, 3).map((cert) => (
//                     <div key={cert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <div className="flex items-center gap-3">
//                         <FaCertificate className="text-yellow-500 text-xl" />
//                         <div>
//                           <p className="font-medium text-gray-800">{cert.course_name}</p>
//                           <p className="text-xs text-gray-500">Score: {cert.score}% | Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <button onClick={() => handleViewCertificate(cert)} className="text-primary-600 hover:text-primary-700 text-sm">View</button>
//                         <button onClick={() => handleDownloadCertificate(cert)} className="text-green-600 hover:text-green-700 text-sm">Download</button>
//                         <button onClick={() => handleShareCertificate(cert)} className="text-blue-600 hover:text-blue-700 text-sm">Share</button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 {certificates.length > 3 && (
//                   <button onClick={() => setActiveTab('certificates')} className="mt-4 text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1">
//                     View all certificates <FaArrowRight size={12} />
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* Attendance Summary */}
//             {attendanceData && attendanceData.overall && (
//               <div className="bg-white rounded-xl shadow-md p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Attendance Summary</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="text-center p-4 bg-blue-50 rounded-lg">
//                     <p className="text-2xl font-bold text-blue-600">{Math.round(attendanceData.overall.percentage)}%</p>
//                     <p className="text-sm text-gray-600">Overall Attendance</p>
//                   </div>
//                   <div className="text-center p-4 bg-green-50 rounded-lg">
//                     <p className="text-2xl font-bold text-green-600">{attendanceData.overall.total_present || 0}</p>
//                     <p className="text-sm text-gray-600">Classes Attended</p>
//                   </div>
//                   <div className="text-center p-4 bg-orange-50 rounded-lg">
//                     <p className="text-2xl font-bold text-orange-600">{attendanceData.overall.total_classes || 0}</p>
//                     <p className="text-sm text-gray-600">Total Classes</p>
//                   </div>
//                 </div>
//                 <button onClick={() => setActiveTab('attendance')} className="mt-4 text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1">
//                   View detailed attendance <FaArrowRight size={12} />
//                 </button>
//               </div>
//             )}
//           </motion.div>
//         )}

//         {/* MY COURSES TAB */}
//         {activeTab === 'my-courses' && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <h2 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h2>
//               {recentCourses.length === 0 ? (
//                 <div className="text-center py-12">
//                   <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
//                   <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
//                   <Link to="/courses"><button className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg">Browse Courses →</button></Link>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {recentCourses.map((course) => (
//                     <div key={course.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition">
//                       <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-4 text-white">
//                         <h3 className="font-bold text-lg">{course.name}</h3>
//                         <p className="text-sm opacity-90">{course.duration}</p>
//                       </div>
//                       <div className="p-4">
//                         <p className="text-gray-600 text-sm mb-3">{course.description?.substring(0, 100) || 'Comprehensive course.'}</p>
//                         <div className="flex justify-between items-center mt-3">
//                           <span className="text-primary-600 font-bold">₹{course.price?.toLocaleString()}</span>
//                           <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Enrolled</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}

//         {/* CERTIFICATES TAB */}
//         {activeTab === 'certificates' && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800">My Certificates</h2>
//                 <button onClick={() => window.location.reload()} className="text-gray-500 hover:text-gray-700">
//                   <FaSpinner className={loading ? "animate-spin" : ""} />
//                 </button>
//               </div>
              
//               {certificates.length === 0 ? (
//                 <div className="text-center py-12">
//                   <FaCertificate className="text-6xl text-gray-300 mx-auto mb-4" />
//                   <p className="text-gray-500">No certificates earned yet.</p>
//                   <p className="text-sm text-gray-400">Complete courses to earn certificates</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {certificates.map((cert) => (
//                     <div key={cert.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-300 hover:shadow-lg transition">
//                       <div className="text-center mb-4">
//                         <FaCertificate className="text-yellow-500 text-5xl mx-auto mb-2" />
//                         <h3 className="font-bold text-xl">Certificate of Completion</h3>
//                       </div>
//                       <div className="text-center">
//                         <p className="text-gray-600">Awarded to: <strong>{user?.name}</strong></p>
//                         <p className="text-gray-600">Course: <strong>{cert.course_name}</strong></p>
//                         <p className="text-gray-600">Score: <strong className={getScoreColor(cert.score)}>{cert.score}%</strong></p>
//                         <p className="text-gray-600">Date: {new Date(cert.issue_date).toLocaleDateString()}</p>
//                         <p className="text-xs text-gray-500 mt-1">ID: {cert.certificate_id}</p>
//                       </div>
//                       <div className="flex flex-wrap gap-2 mt-4">
//                         <button onClick={() => handleViewCertificate(cert)} className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center justify-center gap-1">
//                           <FaEye /> View
//                         </button>
//                         <button onClick={() => handleDownloadCertificate(cert)} className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-1">
//                           <FaDownload /> Download
//                         </button>
//                         <button onClick={() => handleShareCertificate(cert)} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1">
//                           <FaShare /> Share
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}

//         {/* ATTENDANCE TAB */}
//         {activeTab === 'attendance' && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//             <AttendanceView />
//           </motion.div>
//         )}
//       </div>

//       {/* Certificate Preview Modal */}
//       {showCertificateModal && selectedCertificate && (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto">
//           <div className="relative max-w-5xl w-full">
//             <button onClick={() => setShowCertificateModal(false)} className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl">×</button>
//             <div dangerouslySetInnerHTML={{ __html: getCertificateHTML(selectedCertificate) }} className="bg-white rounded-lg overflow-hidden shadow-2xl" />
//             <div className="flex justify-center gap-3 mt-4">
//               <button onClick={() => handlePrintCertificate(selectedCertificate)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaSpinner /> Print</button>
//               <button onClick={() => handleDownloadCertificate(selectedCertificate)} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaDownload /> Download</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Share Modal */}
//       {showShareModal && selectedCertificate && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold">Share Certificate</h3>
//                 <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:text-gray-700">×</button>
//               </div>
//               <div className="space-y-3">
//                 <button onClick={() => handleCopyLink(selectedCertificate)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-2"><FaCopy /> Copy Link</button>
//                 <button onClick={() => handleShareWhatsApp(selectedCertificate)} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"><FaWhatsapp /> WhatsApp</button>
//                 <button onClick={() => handleShareEmail(selectedCertificate)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"><FaEnvelope /> Email</button>
//                 <button onClick={() => handleShareLinkedIn(selectedCertificate)} className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-lg flex items-center justify-center gap-2"><FaLinkedin /> LinkedIn</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaBook, FaCertificate, FaCalendarCheck, FaUser, FaChartLine,
  FaArrowRight, FaBookOpen, FaSpinner, FaCheckCircle, FaClock,
  FaEye, FaDownload, FaShare, FaWhatsapp, FaEnvelope, FaLinkedin, FaCopy
} from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/UserContext';
import AttendanceView from '../components/AttendanceView';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    purchased_courses: 0,
    certificates: 0,
    attendance_percentage: 0,
    completion_percentage: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      
      if (!token || userType !== 'student') {
        navigate('/login', { replace: true });
        return;
      }
      
      fetchDashboardData();
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const handleCoursesUpdate = () => {
      fetchDashboardData();
    };
    
    window.addEventListener('coursesUpdated', handleCoursesUpdate);
    window.addEventListener('certificateGenerated', handleCoursesUpdate);
    window.addEventListener('paymentApproved', handleCoursesUpdate);
    
    return () => {
      window.removeEventListener('coursesUpdated', handleCoursesUpdate);
      window.removeEventListener('certificateGenerated', handleCoursesUpdate);
      window.removeEventListener('paymentApproved', handleCoursesUpdate);
    };
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      // Fetch enrolled courses - Use the correct endpoint
      try {
        // Try multiple endpoints to get courses
        let coursesRes = null;
        try {
          coursesRes = await api.get('/user/enrolled-courses', config);
        } catch (e) {
          try {
            coursesRes = await api.get('/cart/my-courses', config);
          } catch (e2) {
            coursesRes = await api.get('/my-courses', config);
          }
        }
        
        if (coursesRes && coursesRes.data && coursesRes.data.courses) {
          setRecentCourses(coursesRes.data.courses);
          setStats(prev => ({
            ...prev,
            purchased_courses: coursesRes.data.courses.length
          }));
        }
      } catch (coursesError) {
        console.error('Failed to fetch courses:', coursesError);
        setRecentCourses([]);
      }
      
      // Fetch certificates
      try {
        const certRes = await api.get('/certificates/my-certificates', config);
        if (certRes.data && certRes.data.certificates) {
          setCertificates(certRes.data.certificates);
          setStats(prev => ({
            ...prev,
            certificates: certRes.data.certificates.length
          }));
        }
      } catch (certError) {
        console.error('Failed to fetch certificates:', certError);
        setCertificates([]);
      }
      
      // Fetch attendance
      try {
        const attendanceRes = await api.get('/student/attendance/my-attendance', config);
        if (attendanceRes.data && attendanceRes.data.overall) {
          setAttendanceData(attendanceRes.data);
          setStats(prev => ({
            ...prev,
            attendance_percentage: attendanceRes.data.overall?.percentage || 0,
            completion_percentage: attendanceRes.data.overall?.percentage || 0
          }));
        }
      } catch (attError) {
        console.error('Failed to fetch attendance:', attError);
      }
      
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getCertificateHTML = (certificate) => {
    const verificationUrl = `${window.location.origin}/verify-certificate?token=${certificate.verification_token}`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate of Achievement - ${certificate.course_name}</title>
        <meta charset="UTF-8">
        <style>
          @page { size: landscape; margin: 0; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            margin: 0;
            padding: 20px;
            font-family: 'Georgia', 'Times New Roman', serif;
            background: #e8e8e8;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .certificate {
            width: 950px;
            background: white;
            position: relative;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            border: 12px solid #1a3a5c;
          }
          .certificate-inner {
            border: 2px solid #c9a03d;
            margin: 20px;
            padding: 30px;
            position: relative;
          }
          .logo-top { text-align: center; margin-bottom: 20px; }
          .logo-top h1 { font-size: 28px; color: #1a3a5c; letter-spacing: 3px; }
          .logo-top p { font-size: 11px; color: #888; }
          .certificate-title { text-align: center; margin: 20px 0; }
          .certificate-title h2 { font-size: 38px; color: #c9a03d; letter-spacing: 2px; }
          .presented-to { text-align: center; font-size: 16px; color: #555; margin: 20px 0 10px; }
          .student-name { text-align: center; font-size: 48px; color: #1a3a5c; margin: 15px 0; font-weight: bold; border-bottom: 2px solid #c9a03d; display: inline-block; padding: 0 30px 10px; }
          .student-name-container { text-align: center; }
          .completion-text { text-align: center; font-size: 15px; color: #444; margin: 25px 0; line-height: 1.6; }
          .score-section { text-align: center; margin: 20px 0; }
          .score-badge { display: inline-block; background: #1a3a5c; color: white; padding: 5px 20px; border-radius: 25px; }
          .signature-section { display: flex; justify-content: space-between; margin-top: 40px; }
          .signature { text-align: center; }
          .signature-line { width: 200px; border-top: 1px solid #333; margin-top: 40px; padding-top: 5px; }
          .qr-section { position: absolute; bottom: 30px; right: 30px; text-align: center; }
          .qr-section img { width: 80px; height: 80px; }
          .date { text-align: center; margin-top: 30px; font-size: 11px; color: #666; }
          .certificate-id { text-align: center; margin-top: 10px; font-size: 9px; color: #bbb; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="certificate-inner">
            <div class="logo-top">
              <h1>SJS GLOBAL TECH ACADEMY</h1>
              <p>ESTABLISHING EXCELLENCE IN TECHNOLOGY EDUCATION</p>
            </div>
            <div class="certificate-title">
              <h2>CERTIFICATE OF ACHIEVEMENT</h2>
            </div>
            <div class="presented-to">THIS CERTIFICATE IS PROUDLY PRESENTED TO</div>
            <div class="student-name-container">
              <div class="student-name">${certificate.student_name || user?.name || 'Student'}</div>
            </div>
            <div class="completion-text">
              For successfully completing the course <strong>“${certificate.course_name}”</strong><br>
              with outstanding performance and dedication.
            </div>
            <div class="score-section">
              <span class="score-badge">Score: ${certificate.score || 100}%</span>
            </div>
            <div class="signature-section">
              <div class="signature"><div class="signature-line"><p>AUTHORIZED SIGNATURE</p></div></div>
              <div class="signature"><div class="signature-line"><p>COMPANY SEAL</p></div></div>
            </div>
            <div class="qr-section">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(verificationUrl)}" alt="QR" />
              <p>SCAN TO VERIFY</p>
            </div>
            <div class="date">Date: ${new Date(certificate.issue_date).toLocaleDateString()}</div>
            <div class="certificate-id">Certificate ID: ${certificate.certificate_id}</div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowCertificateModal(true);
  };

  const handleDownloadCertificate = (certificate) => {
    const htmlContent = getCertificateHTML(certificate);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate_${certificate.certificate_id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Certificate downloaded!');
  };

  const handlePrintCertificate = (certificate) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(getCertificateHTML(certificate));
    printWindow.document.close();
    printWindow.print();
  };

  const handleShareCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowShareModal(true);
  };

  const handleCopyLink = (certificate) => {
    const verificationUrl = `${window.location.origin}/verify-certificate?token=${certificate.verification_token}`;
    navigator.clipboard.writeText(verificationUrl);
    toast.success('Verification link copied!');
  };

  const handleShareWhatsApp = (certificate) => {
    const text = `I have successfully completed "${certificate.course_name}" with ${certificate.score}% score from SJS Global Tech Academy! Verify here: ${window.location.origin}/verify-certificate?token=${certificate.verification_token}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareEmail = (certificate) => {
    const subject = `Certificate of Completion - ${certificate.course_name}`;
    const body = `I have successfully completed "${certificate.course_name}" with ${certificate.score}% score.\n\nVerify: ${window.location.origin}/verify-certificate?token=${certificate.verification_token}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleShareLinkedIn = (certificate) => {
    const url = `${window.location.origin}/verify-certificate?token=${certificate.verification_token}`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'my-courses', label: 'My Courses', icon: FaBook },
    { id: 'certificates', label: 'Certificates', icon: FaCertificate },
    { id: 'attendance', label: 'Attendance', icon: FaCalendarCheck },
  ];

  const statCards = [
    { icon: FaBook, label: 'Courses Enrolled', value: stats.purchased_courses, bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { icon: FaCertificate, label: 'Certificates Earned', value: stats.certificates, bgColor: 'bg-green-50', textColor: 'text-green-600' },
    { icon: FaCalendarCheck, label: 'Attendance', value: `${Math.round(stats.attendance_percentage)}%`, bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
    { icon: FaChartLine, label: 'Overall Progress', value: `${Math.round(stats.completion_percentage)}%`, bgColor: 'bg-orange-50', textColor: 'text-orange-600' },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-white/20 p-3 rounded-full">
                <FaUser className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋</h1>
                <p className="text-primary-100">Student ID: {user?.student_id || 'Not assigned'}</p>
                <p className="text-primary-100 text-sm">{user?.email}</p>
              </div>
            </div>
            <div className="flex space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.purchased_courses}</p>
                <p className="text-sm text-primary-200">Courses</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.certificates}</p>
                <p className="text-sm text-primary-200">Certificates</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{Math.round(stats.attendance_percentage)}%</p>
                <p className="text-sm text-primary-200">Attendance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <stat.icon className={`text-xl ${stat.textColor}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b bg-white mt-6">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                <tab.icon />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* My Courses Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">My Courses</h2>
                <Link to="/my-courses" className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1">
                  View All Courses <FaArrowRight size={12} />
                </Link>
              </div>
              
              {recentCourses.length === 0 ? (
                <div className="text-center py-8">
                  <FaBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
                  <Link to="/courses">
                    <button className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
                      Browse Courses →
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentCourses.slice(0, 4).map((course) => (
                    <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <h3 className="font-semibold text-lg">{course.name || course.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{course.duration}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-primary-600 font-bold">₹{course.price?.toLocaleString()}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Enrolled</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Certificates Section */}
            {certificates.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Certificates</h2>
                <div className="space-y-3">
                  {certificates.slice(0, 3).map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <FaCertificate className="text-yellow-500 text-xl" />
                        <div>
                          <p className="font-medium text-gray-800">{cert.course_name}</p>
                          <p className="text-xs text-gray-500">Score: {cert.score}% | Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleViewCertificate(cert)} className="text-primary-600 hover:text-primary-700 text-sm">View</button>
                        <button onClick={() => handleDownloadCertificate(cert)} className="text-green-600 hover:text-green-700 text-sm">Download</button>
                        <button onClick={() => handleShareCertificate(cert)} className="text-blue-600 hover:text-blue-700 text-sm">Share</button>
                      </div>
                    </div>
                  ))}
                </div>
                {certificates.length > 3 && (
                  <button onClick={() => setActiveTab('certificates')} className="mt-4 text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1">
                    View all certificates <FaArrowRight size={12} />
                  </button>
                )}
              </div>
            )}

            {/* Attendance Summary */}
            {attendanceData && attendanceData.overall && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Attendance Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{Math.round(attendanceData.overall.percentage)}%</p>
                    <p className="text-sm text-gray-600">Overall Attendance</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{attendanceData.overall.total_present || 0}</p>
                    <p className="text-sm text-gray-600">Classes Attended</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{attendanceData.overall.total_classes || 0}</p>
                    <p className="text-sm text-gray-600">Total Classes</p>
                  </div>
                </div>
                <button onClick={() => setActiveTab('attendance')} className="mt-4 text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1">
                  View detailed attendance <FaArrowRight size={12} />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* MY COURSES TAB */}
        {activeTab === 'my-courses' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h2>
              {recentCourses.length === 0 ? (
                <div className="text-center py-12">
                  <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
                  <Link to="/courses"><button className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg">Browse Courses →</button></Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentCourses.map((course) => (
                    <div key={course.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition">
                      <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-4 text-white">
                        <h3 className="font-bold text-lg">{course.name || course.title}</h3>
                        <p className="text-sm opacity-90">{course.duration}</p>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 text-sm mb-3">{course.description?.substring(0, 100) || 'Comprehensive course to master the subject.'}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-primary-600 font-bold">₹{course.price?.toLocaleString()}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Enrolled</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* CERTIFICATES TAB */}
        {activeTab === 'certificates' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Certificates</h2>
                <button onClick={() => fetchDashboardData()} className="text-gray-500 hover:text-gray-700">
                  <FaSpinner className={loading ? "animate-spin" : ""} />
                </button>
              </div>
              
              {certificates.length === 0 ? (
                <div className="text-center py-12">
                  <FaCertificate className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No certificates earned yet.</p>
                  <p className="text-sm text-gray-400">Complete courses to earn certificates</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-300 hover:shadow-lg transition">
                      <div className="text-center mb-4">
                        <FaCertificate className="text-yellow-500 text-5xl mx-auto mb-2" />
                        <h3 className="font-bold text-xl">Certificate of Completion</h3>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Awarded to: <strong>{user?.name}</strong></p>
                        <p className="text-gray-600">Course: <strong>{cert.course_name}</strong></p>
                        <p className="text-gray-600">Score: <strong className={getScoreColor(cert.score)}>{cert.score}%</strong></p>
                        <p className="text-gray-600">Date: {new Date(cert.issue_date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500 mt-1">ID: {cert.certificate_id}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <button onClick={() => handleViewCertificate(cert)} className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center justify-center gap-1">
                          <FaEye /> View
                        </button>
                        <button onClick={() => handleDownloadCertificate(cert)} className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-1">
                          <FaDownload /> Download
                        </button>
                        <button onClick={() => handleShareCertificate(cert)} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1">
                          <FaShare /> Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AttendanceView />
          </motion.div>
        )}
      </div>

      {/* Certificate Preview Modal */}
      {showCertificateModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="relative max-w-5xl w-full">
            <button onClick={() => setShowCertificateModal(false)} className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl">×</button>
            <div dangerouslySetInnerHTML={{ __html: getCertificateHTML(selectedCertificate) }} className="bg-white rounded-lg overflow-hidden shadow-2xl" />
            <div className="flex justify-center gap-3 mt-4">
              <button onClick={() => handlePrintCertificate(selectedCertificate)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaSpinner /> Print</button>
              <button onClick={() => handleDownloadCertificate(selectedCertificate)} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaDownload /> Download</button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Share Certificate</h3>
                <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
              </div>
              <div className="space-y-3">
                <button onClick={() => handleCopyLink(selectedCertificate)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-2"><FaCopy /> Copy Link</button>
                <button onClick={() => handleShareWhatsApp(selectedCertificate)} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"><FaWhatsapp /> WhatsApp</button>
                <button onClick={() => handleShareEmail(selectedCertificate)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"><FaEnvelope /> Email</button>
                <button onClick={() => handleShareLinkedIn(selectedCertificate)} className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-lg flex items-center justify-center gap-2"><FaLinkedin /> LinkedIn</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;