// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaUsers,
//   FaBook,
//   FaCertificate,
//   FaMoneyBillWave,
//   FaBell,
//   FaChartLine,
//   FaSignOutAlt,
//   FaCreditCard,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaImage,
//   FaSpinner,
//   FaEye,
//   FaTrash,
//   FaEdit,
//   FaCalendarAlt,
//   FaPlus,
//   FaSave,
//   FaTimes,
//   FaToggleOn,
//   FaToggleOff,
//   FaBriefcase,
//   FaComment,
//   FaCheck,
//   FaTimes as FaTimesIcon,
//   FaRedo,
//   FaShare,
//   FaDownload,
//   FaQrcode,
//   FaWhatsapp,
//   FaEnvelope,
//   FaTrashAlt,
//   FaBars,
//   FaChevronLeft,
//   FaChevronRight
// } from "react-icons/fa";
// import api from "../services/api";
// import toast from "react-hot-toast";
// import AdminAttendance from "./AdminAttendance";

// const AdminPanel = () => {
//   const navigate = useNavigate();
//   const [activeSection, setActiveSection] = useState("dashboard");
//   const [admin, setAdmin] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // Check if mobile view
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth >= 768) {
//         setSidebarOpen(true);
//       } else {
//         setSidebarOpen(false);
//       }
//     };
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Payment Verification State
//   const [paymentRequests, setPaymentRequests] = useState([]);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [adminNotes, setAdminNotes] = useState("");
//   const [loadingRequests, setLoadingRequests] = useState(false);
//   const [paymentStats, setPaymentStats] = useState(null);
//   const [processingId, setProcessingId] = useState(null);
//   const [viewImage, setViewImage] = useState(null);

//   // Students State
//   const [students, setStudents] = useState([]);
//   const [loadingStudents, setLoadingStudents] = useState(false);

//   // Orders State
//   const [orders, setOrders] = useState([]);
//   const [loadingOrders, setLoadingOrders] = useState(false);

//   // Internship Payments State
//   const [internshipPayments, setInternshipPayments] = useState([]);
//   const [loadingInternshipPayments, setLoadingInternshipPayments] = useState(false);
//   const [selectedInternshipPayment, setSelectedInternshipPayment] = useState(null);
//   const [selectedStudentForCourse, setSelectedStudentForCourse] = useState(null);
//   const [showCourseManager, setShowCourseManager] = useState(false);

//   // Course Management State
//   const [courses, setCourses] = useState([]);
//   const [loadingCourses, setLoadingCourses] = useState(false);
//   const [showCourseModal, setShowCourseModal] = useState(false);
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [courseForm, setCourseForm] = useState({
//     name: "",
//     price: "",
//     duration: "",
//     description: "",
//     level: "Beginner",
//     rating: 4.5,
//     students_enrolled: 0,
//     is_active: true,
//   });

//   // Certificate State
//   const [showCertificateModal, setShowCertificateModal] = useState(false);
//   const [selectedStudentId, setSelectedStudentId] = useState('');
//   const [selectedCourseId, setSelectedCourseId] = useState('');
//   const [certificateScore, setCertificateScore] = useState(100);
//   const [generatingCertificate, setGeneratingCertificate] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [certificateToDelete, setCertificateToDelete] = useState(null);
//   const [deletingCertificate, setDeletingCertificate] = useState(false);
//   const [certificates, setCertificates] = useState([]);
//   const [loadingCertificates, setLoadingCertificates] = useState(false);

//   // Helper function to get auth headers
//   const getAuthConfig = () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       throw new Error("No token found");
//     }
//     return {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     };
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userType = localStorage.getItem("userType");
//     const userData = localStorage.getItem("user") || localStorage.getItem("userData");

//     console.log("AdminPanel - Auth Check:", {
//       token: !!token,
//       userType,
//       userData: !!userData,
//     });

//     if (!token || userType !== "admin") {
//       toast.error("Access denied. Please login as admin.");
//       navigate("/login");
//       return;
//     }

//     try {
//       const adminData = userData ? JSON.parse(userData) : null;
//       setAdmin(adminData);
//     } catch (error) {
//       console.error("Error parsing admin data:", error);
//       navigate("/login");
//       return;
//     }

//     const getScreenshotUrl = (filename) => {
//   if (!filename) return null;
//   // If it's already a full URL, return as is
//   if (filename.startsWith('http')) return filename;
//   // Otherwise, add backend URL
//   return `${BACKEND_URL}/uploads/screenshots/${filename}`;
// };

//     const loadInitialData = async () => {
//       try {
//         await Promise.all([
//           fetchCourses(),
//           fetchStudents(),
//           fetchOrders(),
//           fetchInternshipPayments(),
//           fetchPaymentRequests(),
//           fetchPaymentStats(),
//           fetchCertificates(),
//         ]);
//       } catch (error) {
//         console.error("Initial data load error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadInitialData();

//     const intervals = [
//       setInterval(() => fetchCourses(), 30000),
//       setInterval(() => fetchStudents(), 30000),
//       setInterval(() => fetchOrders(), 30000),
//       setInterval(() => fetchInternshipPayments(), 30000),
//       setInterval(() => fetchCertificates(), 30000),
//       setInterval(() => {
//         if (activeSection === "payment-verification") {
//           fetchPaymentRequests();
//           fetchPaymentStats();
//         }
//       }, 30000),
//     ];

//     return () => {
//       intervals.forEach((interval) => clearInterval(interval));
//     };
//   }, [navigate, activeSection]);

//   // Certificate Functions
//   const fetchCertificates = async () => {
//     setLoadingCertificates(true);
//     try {
//       const config = getAuthConfig();
//       const response = await api.get('/admin/certificates', config);
//       if (response.data.success) {
//         setCertificates(response.data.certificates);
//       }
//     } catch (error) {
//       console.error('Failed to fetch certificates:', error);
//       toast.error('Failed to fetch certificates');
//     } finally {
//       setLoadingCertificates(false);
//     }
//   };

//   const handleGenerateCertificate = async () => {
//     if (!selectedStudentId || !selectedCourseId) {
//       toast.error('Please select student and course');
//       return;
//     }

//     setGeneratingCertificate(true);
//     try {
//       const config = getAuthConfig();
//       const response = await api.post('/certificates/generate', {
//         student_id: parseInt(selectedStudentId),
//         course_id: parseInt(selectedCourseId),
//         score: certificateScore
//       }, config);

//       if (response.data.success) {
//         toast.success('Certificate generated successfully!');
//         setShowCertificateModal(false);
//         fetchCertificates();
//         setSelectedStudentId('');
//         setSelectedCourseId('');
//         setCertificateScore(100);
//       }
//     } catch (error) {
//       console.error('Failed to generate certificate:', error);
//       toast.error(error.response?.data?.error || 'Failed to generate certificate');
//     } finally {
//       setGeneratingCertificate(false);
//     }
//   };

//   const handleDownloadCertificate = async (certificate) => {
//     try {
//       const token = localStorage.getItem('token');
//       const config = { headers: { Authorization: `Bearer ${token}` } };
//       const response = await api.get(`/certificates/download/${certificate.certificate_id}`, config);

//       if (response.data.success) {
//         const printWindow = window.open('', '_blank');
//         printWindow.document.write(`
//           <!DOCTYPE html>
//           <html>
//           <head>
//             <title>Certificate - ${certificate.student_name}</title>
//             <style>
//               body { font-family: Arial, sans-serif; padding: 40px; }
//               .certificate { border: 2px solid #1a3a5c; padding: 30px; text-align: center; }
//               h1 { color: #1a3a5c; }
//               .student-name { font-size: 24px; font-weight: bold; margin: 20px 0; }
//             </style>
//           </head>
//           <body>
//             <div class="certificate">
//               <h1>CERTIFICATE OF ACHIEVEMENT</h1>
//               <p>This certificate is proudly presented to</p>
//               <div class="student-name">${certificate.student_name}</div>
//               <p>for successfully completing the course</p>
//               <h3>${certificate.course_name}</h3>
//               <p>Score: ${certificate.score}%</p>
//               <p>Issue Date: ${new Date(certificate.issue_date).toLocaleDateString()}</p>
//               <p>Certificate ID: ${certificate.certificate_id}</p>
//             </div>
//           </body>
//           </html>
//         `);
//         printWindow.document.close();
//         printWindow.print();
//       } else {
//         toast.info('Certificate download will be available soon');
//       }
//     } catch (error) {
//       console.error('Failed to download certificate:', error);
//       toast.error('Failed to download certificate');
//     }
//   };

//   const handleDeleteCertificate = async () => {
//     if (!certificateToDelete) return;

//     setDeletingCertificate(true);
//     try {
//       const config = getAuthConfig();
//       const response = await api.delete(`/admin/certificates/${certificateToDelete.id}`, config);

//       if (response.data.success) {
//         toast.success('Certificate permanently deleted from database!');
//         setShowDeleteConfirm(false);
//         setCertificateToDelete(null);
//         await fetchCertificates();
//         window.dispatchEvent(new CustomEvent('certificateDeleted'));
//       } else {
//         toast.error(response.data.message || 'Failed to delete certificate');
//       }
//     } catch (error) {
//       console.error('Failed to delete certificate:', error);
//       toast.error(error.response?.data?.error || 'Failed to delete certificate');
//     } finally {
//       setDeletingCertificate(false);
//     }
//   };

//   const confirmDelete = (certificate) => {
//     setCertificateToDelete(certificate);
//     setShowDeleteConfirm(true);
//   };

//   // =====================================================
//   // COURSE MANAGEMENT FUNCTIONS
//   // =====================================================

//   const fetchCourses = async () => {
//     setLoadingCourses(true);
//     try {
//       const config = getAuthConfig();
//       const response = await api.get("/admin/courses", config);
//       if (response.data.success) {
//         setCourses(response.data.courses);
//         window.dispatchEvent(
//           new CustomEvent("coursesUpdated", {
//             detail: { courses: response.data.courses },
//           }),
//         );
//       }
//     } catch (error) {
//       console.error("Failed to fetch courses:", error);
//       if (error.response?.status === 401 || error.response?.status === 403) {
//         toast.error("Session expired. Please login again.");
//         handleLogout();
//       } else if (error.code === "ERR_NETWORK") {
//         toast.error("Cannot connect to server.");
//       }
//     } finally {
//       setLoadingCourses(false);
//     }
//   };

//   const handleAddCourse = () => {
//     setEditingCourse(null);
//     setCourseForm({
//       name: "",
//       price: "",
//       duration: "",
//       description: "",
//       level: "Beginner",
//       rating: 4.5,
//       students_enrolled: 0,
//       is_active: true,
//     });
//     setShowCourseModal(true);
//   };

//   const handleEditCourse = (course) => {
//     setEditingCourse(course);
//     setCourseForm({
//       name: course.name,
//       price: course.price,
//       duration: course.duration,
//       description: course.description || "",
//       level: course.level,
//       rating: course.rating,
//       students_enrolled: course.students_enrolled,
//       is_active: course.is_active,
//     });
//     setShowCourseModal(true);
//   };

//   const handleDeleteCourse = async (course) => {
//     if (window.confirm(`Are you sure you want to delete "${course.name}"?`)) {
//       try {
//         const config = getAuthConfig();
//         const response = await api.delete(`/admin/courses/${course.id}`, config);
//         if (response.data.success) {
//           toast.success("Course deleted successfully");
//           await fetchCourses();
//           window.dispatchEvent(new CustomEvent("coursesUpdated"));
//         }
//       } catch (error) {
//         console.error("Failed to delete course:", error);
//         toast.error("Failed to delete course");
//       }
//     }
//   };

//   const handleToggleCourseStatus = async (course) => {
//     try {
//       const config = getAuthConfig();
//       const response = await api.put(`/admin/courses/${course.id}`, {
//         ...course,
//         is_active: !course.is_active,
//       }, config);
//       if (response.data.success) {
//         toast.success(`Course ${course.is_active ? "deactivated" : "activated"} successfully`);
//         await fetchCourses();
//         window.dispatchEvent(new CustomEvent("coursesUpdated"));
//       }
//     } catch (error) {
//       console.error("Failed to update course status:", error);
//       toast.error("Failed to update course status");
//     }
//   };

//   const handleSaveCourse = async () => {
//     if (!courseForm.name || !courseForm.name.trim()) {
//       toast.error("Please enter course name");
//       return;
//     }
//     if (!courseForm.price || courseForm.price <= 0) {
//       toast.error("Please enter a valid price");
//       return;
//     }
//     if (!courseForm.duration || !courseForm.duration.trim()) {
//       toast.error("Please enter course duration");
//       return;
//     }

//     const savingToast = toast.loading(editingCourse ? "Updating course..." : "Adding course...");

//     try {
//       const config = getAuthConfig();
//       const courseData = {
//         name: courseForm.name.trim(),
//         price: parseFloat(courseForm.price),
//         duration: courseForm.duration.trim(),
//         description: courseForm.description || "",
//         level: courseForm.level,
//         rating: parseFloat(courseForm.rating) || 4.5,
//         students_enrolled: parseInt(courseForm.students_enrolled) || 0,
//         is_active: courseForm.is_active,
//       };

//       let response;
//       if (editingCourse) {
//         response = await api.put(`/admin/courses/${editingCourse.id}`, courseData, config);
//       } else {
//         response = await api.post("/admin/courses", courseData, config);
//       }

//       if (response.data.success) {
//         toast.success(editingCourse ? "Course updated successfully!" : "Course added successfully!", { id: savingToast });
//         setShowCourseModal(false);
//         setCourseForm({
//           name: "",
//           price: "",
//           duration: "",
//           description: "",
//           level: "Beginner",
//           rating: 4.5,
//           students_enrolled: 0,
//           is_active: true,
//         });
//         setEditingCourse(null);
//         await fetchCourses();
//         window.dispatchEvent(new CustomEvent("coursesUpdated"));
//       } else {
//         toast.error(response.data.message || "Failed to save course", { id: savingToast });
//       }
//     } catch (error) {
//       console.error("Failed to save course:", error);
//       toast.error("Failed to save course", { id: savingToast });
//     }
//   };

//   // =====================================================
//   // PAYMENT VERIFICATION FUNCTIONS
//   // =====================================================

//   const fetchPaymentRequests = async () => {
//     setLoadingRequests(true);
//     try {
//       const config = getAuthConfig();
//       const response = await api.get("/admin/payment-requests", config);
//       if (response.data.success) {
//         setPaymentRequests(response.data.verifications || []);
//       }
//     } catch (error) {
//       console.error("Failed to fetch payment requests:", error);
//     } finally {
//       setLoadingRequests(false);
//     }
//   };

//   const fetchPaymentStats = async () => {
//     try {
//       const config = getAuthConfig();
//       const response = await api.get("/admin/payment-stats", config);
//       if (response.data.success) {
//         setPaymentStats(response.data.stats);
//       } else {
//         setPaymentStats({ total_amount: 0, pending: 0, approved: 0, declined: 0 });
//       }
//     } catch (error) {
//       console.error("Failed to fetch stats:", error);
//       setPaymentStats({ total_amount: 0, pending: 0, approved: 0, declined: 0 });
//     }
//   };

//   const handleApprove = async (request) => {
//     setProcessingId(request.id);
//     try {
//       const config = getAuthConfig();
//       const response = await api.post(`/admin/payment-requests/${request.id}/approve`, {
//         notes: adminNotes || "Payment verified and approved successfully.",
//       }, config);

//       if (response.data.success) {
//         toast.success("Payment approved! Courses added to student account.");
//         await Promise.all([
//           fetchPaymentRequests(),
//           fetchPaymentStats(),
//           fetchStudents(),
//           fetchOrders(),
//         ]);
//         window.dispatchEvent(new CustomEvent("paymentApproved", {
//           detail: { orderId: request.order_id, studentId: request.student_id, coursesAdded: response.data.courses_added || [] },
//         }));
//         setSelectedRequest(null);
//         setAdminNotes("");
//         if (response.data.courses_added && response.data.courses_added.length > 0) {
//           toast.success(`${response.data.courses_added.length} course(s) added to student's account`);
//         }
//       } else {
//         toast.error(response.data.message || "Failed to approve payment");
//       }
//     } catch (error) {
//       console.error("Approval error:", error);
//       toast.error(error.response?.data?.message || "Failed to approve payment");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const handleDecline = async (request) => {
//     setProcessingId(request.id);
//     try {
//       const config = getAuthConfig();
//       const response = await api.post(`/admin/payment-requests/${request.id}/decline`, {
//         notes: adminNotes || "Payment verification failed.",
//       }, config);

//       if (response.data.success) {
//         toast.success("Payment declined");
//         await Promise.all([fetchPaymentRequests(), fetchPaymentStats()]);
//         setSelectedRequest(null);
//         setAdminNotes("");
//       } else {
//         toast.error(response.data.message || "Failed to decline payment");
//       }
//     } catch (error) {
//       console.error("Decline error:", error);
//       toast.error("Failed to decline payment");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const fetchInternshipPayments = async () => {
//     setLoadingInternshipPayments(true);
//     try {
//       const config = getAuthConfig();
//       const response = await api.get("/admin/internship-payment-requests", config);
//       if (response.data.success) {
//         setInternshipPayments(response.data.payments || []);
//       }
//     } catch (error) {
//       console.error("Failed to fetch internship payments:", error);
//       toast.error("Failed to fetch internship payments");
//     } finally {
//       setLoadingInternshipPayments(false);
//     }
//   };

//   const handleInternshipApprove = async (payment) => {
//     setProcessingId(payment.id);
//     try {
//       const config = getAuthConfig();
//       const response = await api.post(`/admin/internship-payment-requests/${payment.id}/approve`, {
//         notes: adminNotes || "Internship payment verified and approved.",
//       }, config);

//       if (response.data.success) {
//         toast.success("Internship payment approved! Student enrolled.");
//         await Promise.all([fetchInternshipPayments(), fetchPaymentStats()]);
//         setSelectedInternshipPayment(null);
//         setAdminNotes("");
//         window.dispatchEvent(new CustomEvent("internshipPaymentApproved", { detail: { orderId: payment.order_id } }));
//       } else {
//         toast.error(response.data.message || "Failed to approve payment");
//       }
//     } catch (error) {
//       console.error("Approval error:", error);
//       toast.error(error.response?.data?.message || "Failed to approve internship payment");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const handleInternshipDecline = async (payment) => {
//     setProcessingId(payment.id);
//     try {
//       const config = getAuthConfig();
//       const response = await api.post(`/admin/internship-payment-requests/${payment.id}/decline`, {
//         notes: adminNotes || "Internship payment verification failed.",
//       }, config);

//       if (response.data.success) {
//         toast.success("Internship payment declined");
//         await fetchInternshipPayments();
//         setSelectedInternshipPayment(null);
//         setAdminNotes("");
//       } else {
//         toast.error(response.data.message || "Failed to decline payment");
//       }
//     } catch (error) {
//       console.error("Decline error:", error);
//       toast.error("Failed to decline internship payment");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const fetchStudents = async () => {
//     setLoadingStudents(true);
//     try {
//       const config = getAuthConfig();
//       const response = await api.get("/admin/students", config);
//       if (response.data.success) {
//         setStudents(response.data.students);
//       }
//     } catch (error) {
//       console.error("Failed to fetch students:", error);
//       toast.error("Failed to fetch students");
//     } finally {
//       setLoadingStudents(false);
//     }
//   };

//   const fetchOrders = async () => {
//     setLoadingOrders(true);
//     try {
//       const config = getAuthConfig();
//       const response = await api.get("/admin/orders", config);
//       if (response.data.success) {
//         setOrders(response.data.orders);
//       }
//     } catch (error) {
//       console.error("Failed to fetch orders:", error);
//       toast.error("Failed to fetch orders");
//     } finally {
//       setLoadingOrders(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("userData");
//     localStorage.removeItem("userType");
//     sessionStorage.clear();
//     toast.success("Logged out successfully");
//     navigate("/login");
//   };

//   const sidebarItems = [
//     { id: "dashboard", label: "Dashboard", icon: FaChartLine },
//     { id: "students", label: "Students", icon: FaUsers },
//     { id: "courses", label: "Courses", icon: FaBook },
//     { id: "attendance", label: "Attendance", icon: FaCalendarAlt },
//     { id: "orders", label: "Orders", icon: FaCreditCard },
//     { id: "payment-verification", label: "Course Payments", icon: FaMoneyBillWave },
//     { id: "internship-payments", label: "Internship Payments", icon: FaBriefcase },
//     { id: "certificates", label: "Certificates", icon: FaCertificate },
//     { id: "notices", label: "Notices", icon: FaBell },
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Mobile Menu Button */}
//       {isMobile && !sidebarOpen && (
//         <button
//           onClick={() => setSidebarOpen(true)}
//           className="fixed top-4 left-4 z-50 bg-primary-600 text-white p-2 rounded-lg shadow-lg md:hidden"
//         >
//           <FaBars size={20} />
//         </button>
//       )}

//       {/* Overlay for mobile */}
//       {isMobile && sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-transform duration-300 z-50 overflow-y-auto ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:translate-x-0 w-64`}
//       >
//         {/* Close button for mobile */}
//         {isMobile && (
//           <button
//             onClick={() => setSidebarOpen(false)}
//             className="absolute top-4 right-4 text-gray-400 hover:text-white md:hidden"
//           >
//             <FaTimes size={20} />
//           </button>
//         )}

//         <div className="p-6">
//           <h2 className="text-2xl font-bold">Admin Panel</h2>
//           <p className="text-gray-400 text-sm mt-1">SJS Global Tech Academy</p>
//           <div className="mt-4 pt-4 border-t border-gray-700">
//             <p className="text-sm text-gray-400">Logged in as:</p>
//             <p className="font-semibold break-words">{admin?.full_name || admin?.username || admin?.name || "Admin"}</p>
//             <p className="text-xs text-gray-500 break-words">{admin?.email}</p>
//           </div>
//         </div>

//         <nav className="mt-6">
//           {sidebarItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => {
//                 setActiveSection(item.id);
//                 if (item.id === "courses") fetchCourses();
//                 if (item.id === "students") fetchStudents();
//                 if (item.id === "internship-payments") fetchInternshipPayments();
//                 if (item.id === "orders") fetchOrders();
//                 if (item.id === "payment-verification") {
//                   fetchPaymentRequests();
//                   fetchPaymentStats();
//                 }
//                 if (item.id === "certificates") {
//                   fetchCertificates();
//                 }
//                 if (isMobile) setSidebarOpen(false);
//               }}
//               className={`w-full flex items-center space-x-3 px-6 py-3 transition-colors duration-200 ${
//                 activeSection === item.id
//                   ? "bg-primary-600 text-white"
//                   : "text-gray-300 hover:bg-gray-800"
//               }`}
//             >
//               <item.icon />
//               <span>{item.label}</span>
//             </button>
//           ))}
//         </nav>

//         <div className="absolute bottom-0 w-full p-4">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
//           >
//             <FaSignOutAlt />
//             <span>Logout</span>
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className={`transition-all duration-300 ${isMobile ? 'ml-0' : 'ml-64'}`}>
//         {/* Header */}
//         <div className="bg-white shadow-md p-4 sticky top-0 z-30">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
//             <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
//               {sidebarItems.find((i) => i.id === activeSection)?.label}
//             </h1>
//             {activeSection === "courses" && (
//               <button
//                 onClick={handleAddCourse}
//                 className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm sm:text-base"
//               >
//                 <FaPlus /> Add New Course
//               </button>
//             )}
//             <div className="flex items-center space-x-4">
//               <span className="text-sm text-gray-600">
//                 Welcome, {admin?.full_name?.split(" ")[0] || admin?.username || "Admin"}!
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Rest of the content remains the same - just wrapped in responsive container */}
//         <div className="p-4 sm:p-6">
//           {/* Dashboard Content */}
//           {activeSection === "dashboard" && (
//             <div className="space-y-6">
//               {/* Stats Cards - Responsive Grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//                 <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
//                   <FaUsers className="text-primary-600 text-2xl sm:text-3xl mb-2" />
//                   <p className="text-xl sm:text-2xl font-bold">{students.length}</p>
//                   <p className="text-gray-600 text-sm">Total Students</p>
//                 </div>
//                 <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
//                   <FaBook className="text-primary-600 text-2xl sm:text-3xl mb-2" />
//                   <p className="text-xl sm:text-2xl font-bold">{courses.length}</p>
//                   <p className="text-gray-600 text-sm">Active Courses</p>
//                 </div>
//                 <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
//                   <FaCreditCard className="text-primary-600 text-2xl sm:text-3xl mb-2" />
//                   <p className="text-xl sm:text-2xl font-bold">₹{paymentStats?.total_amount?.toLocaleString() || 0}</p>
//                   <p className="text-gray-600 text-sm">Total Revenue</p>
//                 </div>
//                 <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
//                   <FaMoneyBillWave className="text-primary-600 text-2xl sm:text-3xl mb-2" />
//                   <p className="text-xl sm:text-2xl font-bold">{paymentStats?.pending || 0}</p>
//                   <p className="text-gray-600 text-sm">Pending Verifications</p>
//                 </div>
//               </div>

//               {/* Recent Data Grid - Responsive */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 overflow-x-auto">
//                   <h2 className="text-lg sm:text-xl font-bold mb-4">Recent Students</h2>
//                   <div className="space-y-2">
//                     {students.slice(0, 5).map((student) => (
//                       <div key={student.id} className="flex justify-between items-center py-2 border-b">
//                         <div>
//                           <p className="font-semibold text-sm sm:text-base">{student.name}</p>
//                           <p className="text-xs sm:text-sm text-gray-500">{student.email}</p>
//                         </div>
//                         <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
//                           {student.status}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 overflow-x-auto">
//                   <h2 className="text-lg sm:text-xl font-bold mb-4">Recent Orders</h2>
//                   <div className="space-y-2">
//                     {orders.slice(0, 5).map((order) => (
//                       <div key={order.id} className="flex justify-between items-center py-2 border-b">
//                         <div>
//                           <p className="font-semibold text-sm sm:text-base">{order.student_name}</p>
//                           <p className="text-xs sm:text-sm text-gray-500">₹{order.total_amount?.toLocaleString()}</p>
//                         </div>
//                         <span className={`text-xs px-2 py-1 rounded-full ${
//                           order.payment_status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
//                         }`}>
//                           {order.payment_status}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Students Section - Responsive Table */}
//           {activeSection === "students" && (
//             <div className="bg-white rounded-xl shadow-md overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-[600px]">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {loadingStudents ? (
//                       <tr><td colSpan="6" className="text-center py-8"><FaSpinner className="animate-spin mx-auto" /></td></tr>
//                     ) : (
//                       students.map((student) => (
//                         <tr key={student.id} className="hover:bg-gray-50">
//                           <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-mono">{student.student_id}</td>
//                           <td className="px-4 sm:px-6 py-4 text-sm font-medium">{student.name}</td>
//                           <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">{student.email}</td>
//                           <td className="px-4 sm:px-6 py-4 text-sm">{student.phone || "-"}</td>
//                           <td className="px-4 sm:px-6 py-4">
//                             <span className={`px-2 py-1 rounded-full text-xs ${
//                               student.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                             }`}>
//                               {student.status}
//                             </span>
//                           </td>
//                           <td className="px-4 sm:px-6 py-4 text-sm">{new Date(student.created_at).toLocaleDateString()}</td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Courses Section - Responsive Table */}
//           {activeSection === "courses" && (
//             <div className="bg-white rounded-xl shadow-md overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-[800px]">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Name</th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {loadingCourses ? (
//                       <tr><td colSpan="9" className="text-center py-8"><FaSpinner className="animate-spin mx-auto" /></td></tr>
//                     ) :
//                     (courses.map((course) => (
//                         <tr key={course.id} className="hover:bg-gray-50">
//                           <td className="px-4 sm:px-6 py-4 text-sm">{course.id}</td>
//                           <td className="px-4 sm:px-6 py-4">
//                             <div>
//                               <p className="font-medium text-gray-900 text-sm sm:text-base">{course.name}</p>
//                               <p className="text-xs text-gray-500">{course.course_code}</p>
//                             </div>
//                           </td>
//                           <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-primary-600">₹{course.price?.toLocaleString()}</td>
//                           <td className="px-4 sm:px-6 py-4 text-sm">{course.duration}</td>
//                           <td className="px-4 sm:px-6 py-4">
//                             <span className={`px-2 py-1 rounded-full text-xs ${
//                               course.level === "Advanced" ? "bg-red-100 text-red-800" :
//                               course.level === "Intermediate" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
//                             }`}>
//                               {course.level}
//                             </span>
//                           </td>
//                           <td className="px-4 sm:px-6 py-4 text-sm">{course.students_enrolled}</td>
//                           <td className="px-4 sm:px-6 py-4 text-sm">{course.rating} ★</td>
//                           <td className="px-4 sm:px-6 py-4">
//                             <button onClick={() => handleToggleCourseStatus(course)} className="flex items-center gap-1">
//                               {course.is_active ? <FaToggleOn className="text-green-600 text-lg sm:text-xl" /> : <FaToggleOff className="text-gray-400 text-lg sm:text-xl" />}
//                               <span className="text-xs hidden sm:inline">{course.is_active ? "Active" : "Inactive"}</span>
//                             </button>
//                           </td>
//                           <td className="px-4 sm:px-6 py-4">
//                             <div className="flex gap-2">
//                               <button onClick={() => handleEditCourse(course)} className="text-blue-600 hover:text-blue-800"><FaEdit size={16} /></button>
//                               <button onClick={() => handleDeleteCourse(course)} className="text-red-600 hover:text-red-800"><FaTrash size={16} /></button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Attendance Section */}
//           {activeSection === "attendance" && <AdminAttendance />}

//           {/* Orders Section - Responsive Table */}
//           {activeSection === "orders" && (
//             <div className="bg-white rounded-xl shadow-md overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-[600px]">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                       <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {loadingOrders ? (
//                       <tr><td colSpan="5" className="text-center py-8"><FaSpinner className="animate-spin mx-auto" /></td></tr>
//                     ) : (
//                       orders.map((order) => (
//                         <tr key={order.id} className="hover:bg-gray-50">
//                           <td className="px-4 sm:px-6 py-4 text-sm font-mono">{order.order_id}</td>
//                           <td className="px-4 sm:px-6 py-4 text-sm">{order.student_name}</td>
//                           <td className="px-4 sm:px-6 py-4 text-sm font-bold text-primary-600">₹{order.total_amount?.toLocaleString()}</td>
//                           <td className="px-4 sm:px-6 py-4">
//                             <span className={`px-2 py-1 rounded-full text-xs ${
//                               order.payment_status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
//                             }`}>
//                               {order.payment_status}
//                             </span>
//                           </td>
//                           <td className="px-4 sm:px-6 py-4 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Payment Verification Section - Responsive Cards on Mobile */}
//           {activeSection === "payment-verification" && (
//             <div className="space-y-6">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
//                 <div>
//                   <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Course Payment Verification</h2>
//                   <p className="text-gray-600 text-sm mt-1">Verify and approve student payment submissions</p>
//                 </div>
//                 <button onClick={() => { fetchPaymentRequests(); fetchPaymentStats(); }} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition text-sm sm:text-base">
//                   {loadingRequests ? <FaSpinner className="animate-spin" /> : <FaRedo />}
//                   Refresh
//                 </button>
//               </div>

//               {paymentStats && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//                   <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
//                     <p className="text-yellow-600 text-sm">Pending</p>
//                     <p className="text-2xl font-bold text-yellow-700">{paymentStats.pending || 0}</p>
//                   </div>
//                   <div className="bg-green-50 rounded-xl p-4 border border-green-200">
//                     <p className="text-green-600 text-sm">Approved</p>
//                     <p className="text-2xl font-bold text-green-700">{paymentStats.approved || 0}</p>
//                   </div>
//                   <div className="bg-red-50 rounded-xl p-4 border border-red-200">
//                     <p className="text-red-600 text-sm">Declined</p>
//                     <p className="text-2xl font-bold text-red-700">{paymentStats.declined || 0}</p>
//                   </div>
//                 </div>
//               )}

//               {loadingRequests ? (
//                 <div className="flex justify-center py-12">
//                   <FaSpinner className="animate-spin text-4xl text-primary-600" />
//                   <p className="ml-3 text-gray-600">Loading payment requests...</p>
//                 </div>
//               ) : paymentRequests.length === 0 ? (
//                 <div className="bg-white rounded-xl shadow-md p-8 sm:p-12 text-center">
//                   <FaCheckCircle className="text-5xl sm:text-6xl text-green-500 mx-auto mb-4" />
//                   <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Pending Requests</h3>
//                   <p className="text-gray-600 text-sm">All payment verification requests have been processed.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {paymentRequests.map((request) => (
//                     <div key={request.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
//                       <div className="p-4 sm:p-6">
//                         <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
//                           <div className="flex-1">
//                             <div className="flex flex-wrap items-center gap-2 mb-2">
//                               <h3 className="font-semibold text-base sm:text-lg">{request.student_name}</h3>
//                               <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
//                                 {request.status || "Pending"}
//                               </span>
//                             </div>
//                             <p className="text-gray-600 text-xs sm:text-sm">{request.student_email}</p>
//                             <p className="text-gray-600 text-xs sm:text-sm mt-1">
//                               <strong>Transaction ID:</strong> {request.transaction_id || "N/A"}
//                             </p>
//                             <p className="text-lg sm:text-xl font-bold text-primary-600 mt-2">
//                               ₹{request.amount?.toLocaleString()}
//                             </p>
//                             <p className="text-xs text-gray-400 mt-2">
//                               Submitted: {new Date(request.created_at).toLocaleString()}
//                             </p>
//                           </div>
//                           <div className="flex gap-3">
//                             {request.screenshot_url && (
//                               <button onClick={() => setViewImage(request.screenshot_url)} className="bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm">
//                                 <FaEye /> View
//                               </button>
//                             )}
//                             <button onClick={() => setSelectedRequest(request)} className="bg-primary-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-primary-700 transition text-sm">
//                               Review
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Payment Review Modal - Responsive */}
//           {selectedRequest && (
//   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//     <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//       <div className="p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-bold">Review Payment Verification</h3>
//           <button onClick={() => { setSelectedRequest(null); setAdminNotes(""); }} className="text-gray-500 hover:text-gray-700">
//             <FaTimes size={20} />
//           </button>
//         </div>
//         <div className="space-y-4">
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h4 className="font-semibold mb-2">Student Information</h4>
//             <p><strong>Name:</strong> {selectedRequest.student_name}</p>
//             <p><strong>Email:</strong> {selectedRequest.student_email}</p>
//           </div>
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h4 className="font-semibold mb-2">Payment Information</h4>
//             <p><strong>Order ID:</strong> {selectedRequest.order_id}</p>
//             <p><strong>Amount:</strong> <span className="text-primary-600 font-bold">₹{selectedRequest.amount?.toLocaleString()}</span></p>
//             <p><strong>Transaction ID:</strong> {selectedRequest.transaction_id || "N/A"}</p>
//             <p><strong>Submitted:</strong> {new Date(selectedRequest.created_at).toLocaleString()}</p>
//           </div>

//           {/* Screenshot Display - Fixed */}
//           {selectedRequest.screenshot_url && (
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">Payment Screenshot</label>
//               <div
//                 className="rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition"
//                 onClick={() => setViewImage(selectedRequest.screenshot_url)}
//               >
//                 <img
//                   src={selectedRequest.screenshot_url}
//                   alt="Payment Screenshot"
//                   className="w-full max-h-64 object-contain bg-gray-50"
//                   onError={(e) => {
//                     console.error("Screenshot failed to load:", selectedRequest.screenshot_url);
//                     e.target.src = "https://via.placeholder.com/400x300?text=Screenshot+Not+Available";
//                   }}
//                 />
//                 <div className="bg-gray-50 p-2 text-center text-sm text-gray-600">
//                   <FaEye className="inline mr-1" /> Click to view full size
//                 </div>
//               </div>
//             </div>
//           )}

//           <div>
//             <label className="block text-gray-700 font-medium mb-2">Admin Notes (Optional)</label>
//             <textarea
//               value={adminNotes}
//               onChange={(e) => setAdminNotes(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//               rows="3"
//               placeholder="Add any notes about this verification..."
//             />
//           </div>
//           <div className="flex gap-3 pt-4">
//             <button
//               onClick={() => handleApprove(selectedRequest)}
//               disabled={processingId === selectedRequest.id}
//               className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50"
//             >
//               {processingId === selectedRequest.id ? <FaSpinner className="animate-spin" /> : <FaCheck />}
//               Approve Payment
//             </button>
//             <button
//               onClick={() => handleDecline(selectedRequest)}
//               disabled={processingId === selectedRequest.id}
//               className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50"
//             >
//               {processingId === selectedRequest.id ? <FaSpinner className="animate-spin" /> : <FaTimesIcon />}
//               Decline Payment
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// )}

//           {/* Image View Modal
//           {viewImage && (
//   <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setViewImage(null)}>
//     <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
//       <button
//         onClick={() => setViewImage(null)}
//         className="absolute -top-12 right-0 text-white hover:text-gray-300 transition z-10"
//       >
//         <FaTimes size={28} />
//       </button>
//       <div className="bg-white rounded-lg p-2">
//         {viewImage ? (
//           <img
//             src={viewImage}
//             alt="Payment Screenshot"
//             className="max-w-full max-h-[85vh] object-contain rounded-lg"
//             onError={(e) => {
//               console.error("Image failed to load:", viewImage);
//               e.target.src = "https://via.placeholder.com/500x300?text=Image+Not+Found";
//               e.target.onerror = null;
//             }}
//           />
//         ) : (
//           <div className="w-96 h-64 flex items-center justify-center">
//             <p className="text-gray-500">No image available</p>
//           </div>
//         )}
//       </div>
//       {viewImage && (
//         <div className="mt-3 flex justify-center gap-3">
//           <a
//             href={viewImage}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
//           >
//             Open in New Tab
//           </a>
//           <a
//             href={viewImage}
//             download
//             className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//           >
//             Download Image
//           </a>
//         </div>
//       )}
//     </div>
//   </div>
// )} */}

// {viewImage && (
//   <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setViewImage(null)}>
//     <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
//       <button
//         onClick={() => setViewImage(null)}
//         className="absolute -top-12 right-0 text-white hover:text-gray-300 transition z-10"
//       >
//         <FaTimes size={28} />
//       </button>
//       <div className="bg-white rounded-lg p-2">
//         {viewImage ? (
//           <img
//             src={getScreenshotUrl(viewImage)}  // ✅ FIXED
//             alt="Payment Screenshot"
//             className="max-w-full max-h-[85vh] object-contain rounded-lg"
//             onError={(e) => {
//               console.error("Image failed to load:", getScreenshotUrl(viewImage));
//               e.target.src = "https://via.placeholder.com/500x300?text=Image+Not+Found";
//               e.target.onerror = null;
//             }}
//           />
//         ) : (
//           <div className="w-96 h-64 flex items-center justify-center">
//             <p className="text-gray-500">No image available</p>
//           </div>
//         )}
//       </div>
//       {viewImage && (
//         <div className="mt-3 flex justify-center gap-3">
//           <a
//             href={getScreenshotUrl(viewImage)}  // ✅ FIXED
//             target="_blank"
//             rel="noopener noreferrer"
//             className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
//           >
//             Open in New Tab
//           </a>
//           <a
//             href={getScreenshotUrl(viewImage)}  // ✅ FIXED
//             download
//             className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//           >
//             Download Image
//           </a>
//         </div>
//       )}
//     </div>
//   </div>
// )}

//           {/* Internship Payments Section - Responsive Cards */}
//           {activeSection === "internship-payments" && (
//             <div className="space-y-6">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
//                 <div>
//                   <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Internship Payment Requests</h2>
//                   <p className="text-gray-600 text-sm mt-1">Verify and approve internship payment submissions</p>
//                 </div>
//                 <button onClick={fetchInternshipPayments} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition text-sm sm:text-base">
//                   {loadingInternshipPayments ? <FaSpinner className="animate-spin" /> : <FaRedo />}
//                   Refresh
//                 </button>
//               </div>

//               {loadingInternshipPayments ? (
//                 <div className="flex justify-center py-12"><FaSpinner className="animate-spin text-4xl text-primary-600" /></div>
//               ) : internshipPayments.length === 0 ? (
//                 <div className="bg-white rounded-xl shadow-md p-8 sm:p-12 text-center">
//                   <FaCheckCircle className="text-5xl sm:text-6xl text-green-500 mx-auto mb-4" />
//                   <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Pending Internship Payments</h3>
//                   <p className="text-gray-600 text-sm">All internship payment requests have been processed.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {internshipPayments.map((payment) => (
//                     <div key={payment.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
//                       <div className="p-4 sm:p-6">
//                         <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
//                           <div className="flex-1">
//                             <div className="flex flex-wrap items-center gap-2 mb-2">
//                               <h3 className="font-semibold text-base sm:text-lg">{payment.student_name}</h3>
//                               <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
//                                 {payment.status === "pending_verification" ? "Pending" : payment.status}
//                               </span>
//                             </div>
//                             <p className="text-gray-600 text-xs sm:text-sm">{payment.student_email}</p>
//                             <p className="text-gray-600 text-xs sm:text-sm mt-1"><strong>Internship:</strong> {payment.internship_title}</p>
//                             <p className="text-gray-600 text-xs sm:text-sm mt-1"><strong>Transaction ID:</strong> {payment.transaction_id || "N/A"}</p>
//                             <p className="text-lg sm:text-xl font-bold text-primary-600 mt-2">Amount: ₹{payment.amount?.toLocaleString()}</p>
//                             <p className="text-xs text-gray-400 mt-2">Submitted: {new Date(payment.created_at).toLocaleString()}</p>
//                           </div>
//                           <div className="flex gap-3">
//                             {payment.screenshot_url && (
//                               <button onClick={() => setViewImage(payment.screenshot_url)} className="bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm">
//                                 <FaEye /> View
//                               </button>
//                             )}
//                             <button onClick={() => setSelectedInternshipPayment(payment)} className="bg-primary-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-primary-700 transition text-sm">
//                               Review
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Internship Payment Review Modal */}
// {selectedInternshipPayment && (
//   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//     <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//       <div className="p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-bold">Review Internship Payment</h3>
//           <button onClick={() => { setSelectedInternshipPayment(null); setAdminNotes(""); }} className="text-gray-500 hover:text-gray-700">
//             <FaTimes size={20} />
//           </button>
//         </div>
//         <div className="space-y-4">
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h4 className="font-semibold mb-2">Student Information</h4>
//             <p><strong>Name:</strong> {selectedInternshipPayment.student_name}</p>
//             <p><strong>Email:</strong> {selectedInternshipPayment.student_email}</p>
//           </div>
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h4 className="font-semibold mb-2">Internship Information</h4>
//             <p><strong>Internship:</strong> {selectedInternshipPayment.internship_title}</p>
//             <p><strong>Amount:</strong> <span className="text-primary-600 font-bold">₹{selectedInternshipPayment.amount?.toLocaleString()}</span></p>
//             <p><strong>Transaction ID:</strong> {selectedInternshipPayment.transaction_id || "N/A"}</p>
//             <p><strong>Submitted:</strong> {new Date(selectedInternshipPayment.created_at).toLocaleString()}</p>
//           </div>

//           {/* Screenshot Display - Fixed */}
//           {selectedInternshipPayment.screenshot_url && (
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">Payment Screenshot</label>
//               <div
//                 className="rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition"
//                 onClick={() => setViewImage(selectedInternshipPayment.screenshot_url)}
//               >
//                 <img
//                   src={selectedInternshipPayment.screenshot_url}
//                   alt="Payment Screenshot"
//                   className="w-full max-h-64 object-contain bg-gray-50"
//                   onError={(e) => {
//                     console.error("Screenshot failed to load:", selectedInternshipPayment.screenshot_url);
//                     e.target.src = "https://via.placeholder.com/400x300?text=Screenshot+Not+Available";
//                   }}
//                 />
//                 <div className="bg-gray-50 p-2 text-center text-sm text-gray-600">
//                   <FaEye className="inline mr-1" /> Click to view full size
//                 </div>
//               </div>
//             </div>
//           )}

//           <div>
//             <label className="block text-gray-700 font-medium mb-2">Admin Notes <span className="text-gray-400 text-sm">(Optional)</span></label>
//             <textarea
//               value={adminNotes}
//               onChange={(e) => setAdminNotes(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//               rows="3"
//               placeholder="Add any notes about this verification..."
//             />
//           </div>
//           <div className="flex gap-3 pt-4">
//             <button
//               onClick={() => handleInternshipApprove(selectedInternshipPayment)}
//               disabled={processingId === selectedInternshipPayment.id}
//               className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50"
//             >
//               {processingId === selectedInternshipPayment.id ? <FaSpinner className="animate-spin" /> : <FaCheck />}
//               Approve Payment
//             </button>
//             <button
//               onClick={() => handleInternshipDecline(selectedInternshipPayment)}
//               disabled={processingId === selectedInternshipPayment.id}
//               className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50"
//             >
//               {processingId === selectedInternshipPayment.id ? <FaSpinner className="animate-spin" /> : <FaTimes />}
//               Decline Payment
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// )}

//           {/* Certificates Section - Responsive Table */}
//           {activeSection === 'certificates' && (
//             <div className="space-y-6">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
//                 <div>
//                   <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Certificate Management</h2>
//                   <p className="text-gray-600 text-sm mt-1">Manage and issue certificates to students</p>
//                 </div>
//                 <button onClick={() => setShowCertificateModal(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm sm:text-base">
//                   <FaPlus /> Generate Certificate
//                 </button>
//               </div>

//               {/* Certificate Stats */}
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//                 <div className="bg-white rounded-lg shadow p-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-gray-500 text-sm">Total Certificates</p>
//                       <p className="text-2xl font-bold text-gray-800">{certificates.length}</p>
//                     </div>
//                     <FaCertificate className="text-2xl text-primary-600" />
//                   </div>
//                 </div>
//                 <div className="bg-white rounded-lg shadow p-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-gray-500 text-sm">Active</p>
//                       <p className="text-2xl font-bold text-green-600">
//                         {certificates.filter(c => c.status === 'active').length}
//                       </p>
//                     </div>
//                     <FaCheckCircle className="text-2xl text-green-500" />
//                   </div>
//                 </div>
//                 <div className="bg-white rounded-lg shadow p-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-gray-500 text-sm">Revoked</p>
//                       <p className="text-2xl font-bold text-red-600">
//                         {certificates.filter(c => c.status === 'revoked').length}
//                       </p>
//                     </div>
//                     <FaTimesCircle className="text-2xl text-red-500" />
//                   </div>
//                 </div>
//               </div>

//               {/* Certificates Table */}
//               {loadingCertificates ? (
//                 <div className="flex justify-center py-12">
//                   <FaSpinner className="animate-spin text-4xl text-primary-600" />
//                 </div>
//               ) : certificates.length === 0 ? (
//                 <div className="bg-white rounded-xl shadow-md p-8 sm:p-12 text-center">
//                   <FaCertificate className="text-5xl sm:text-6xl text-gray-300 mx-auto mb-4" />
//                   <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Certificates Yet</h3>
//                   <p className="text-gray-600 text-sm">Generate certificates for students who complete courses.</p>
//                 </div>
//               ) : (
//                 <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                   <div className="overflow-x-auto">
//                     <table className="w-full min-w-[800px]">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificate ID</th>
//                           <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
//                           <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
//                           <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
//                           <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
//                           <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                           <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         {certificates.map((cert) => (
//                           <tr key={cert.id} className="hover:bg-gray-50">
//                             <td className="px-4 sm:px-6 py-4 text-sm font-mono">{cert.certificate_id}</td>
//                             <td className="px-4 sm:px-6 py-4">
//                               <div>
//                                 <p className="font-medium text-gray-900 text-sm sm:text-base">{cert.student_name}</p>
//                                 <p className="text-xs text-gray-500">{cert.student_email}</p>
//                               </div>
//                             </td>
//                             <td className="px-4 sm:px-6 py-4 text-sm">{cert.course_name}</td>
//                             <td className="px-4 sm:px-6 py-4 text-sm">{new Date(cert.issue_date).toLocaleDateString()}</td>
//                             <td className="px-4 sm:px-6 py-4 text-sm font-semibold">{cert.score}%</td>
//                             <td className="px-4 sm:px-6 py-4">
//                               <span className={`px-2 py-1 rounded-full text-xs ${
//                                 cert.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                               }`}>
//                                 {cert.status}
//                               </span>
//                             </td>
//                             <td className="px-4 sm:px-6 py-4">
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => {
//                                     const verificationUrl = `${window.location.origin}/verify-certificate?token=${cert.verification_token}`;
//                                     navigator.clipboard.writeText(verificationUrl);
//                                     toast.success('Verification link copied!');
//                                   }}
//                                   className="text-green-600 hover:text-green-800"
//                                   title="Share Verification Link"
//                                 >
//                                   <FaShare size={16} />
//                                 </button>
//                                 <button
//                                   onClick={() => handleDownloadCertificate(cert)}
//                                   className="text-blue-600 hover:text-blue-800"
//                                   title="Download PDF"
//                                 >
//                                   <FaDownload size={16} />
//                                 </button>
//                                 <button
//                                   onClick={() => confirmDelete(cert)}
//                                   className="text-red-600 hover:text-red-800"
//                                   title="Delete Certificate (Permanent)"
//                                 >
//                                   <FaTrashAlt size={16} />
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Generate Certificate Modal - Responsive */}
//           {showCertificateModal && (
//             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//               <div className="bg-white rounded-2xl max-w-md w-full">
//                 <div className="p-4 sm:p-6">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg sm:text-xl font-bold">Generate Certificate</h3>
//                     <button onClick={() => setShowCertificateModal(false)} className="text-gray-500 hover:text-gray-700">
//                       <FaTimes size={20} />
//                     </button>
//                   </div>

//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Select Student *</label>
//                       <select
//                         value={selectedStudentId}
//                         onChange={(e) => setSelectedStudentId(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
//                       >
//                         <option value="">Select Student</option>
//                         {students.map((student) => (
//                           <option key={student.id} value={student.id}>
//                             {student.name} - {student.email}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Select Course *</label>
//                       <select
//                         value={selectedCourseId}
//                         onChange={(e) => setSelectedCourseId(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
//                       >
//                         <option value="">Select Course</option>
//                         {courses.map((course) => (
//                           <option key={course.id} value={course.id}>
//                             {course.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Score (%)</label>
//                       <input
//                         type="number"
//                         min="0"
//                         max="100"
//                         value={certificateScore}
//                         onChange={(e) => setCertificateScore(parseInt(e.target.value))}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//                       />
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-3 pt-4">
//                       <button
//                         onClick={handleGenerateCertificate}
//                         disabled={generatingCertificate}
//                         className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm sm:text-base"
//                       >
//                         {generatingCertificate ? <FaSpinner className="animate-spin inline" /> : 'Generate'}
//                       </button>
//                       <button
//                         onClick={() => setShowCertificateModal(false)}
//                         className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 text-sm sm:text-base"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Delete Certificate Confirmation Modal - Responsive */}
//           {showDeleteConfirm && certificateToDelete && (
//             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//               <div className="bg-white rounded-2xl max-w-md w-full">
//                 <div className="p-4 sm:p-6">
//                   <div className="text-center mb-4">
//                     <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <FaTrashAlt className="text-2xl text-red-600" />
//                     </div>
//                     <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Delete Certificate</h3>
//                     <p className="text-gray-600 text-sm">Are you sure you want to permanently delete this certificate?</p>
//                     <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
//                       <p className="text-xs sm:text-sm text-yellow-800">
//                         <strong>Certificate ID:</strong> {certificateToDelete.certificate_id}<br/>
//                         <strong>Student:</strong> {certificateToDelete.student_name}<br/>
//                         <strong>Course:</strong> {certificateToDelete.course_name}<br/>
//                         <strong>Issue Date:</strong> {new Date(certificateToDelete.issue_date).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <p className="text-xs text-red-500 mt-3">⚠️ This action cannot be undone. The certificate will be permanently removed.</p>
//                   </div>
//                   <div className="flex flex-col sm:flex-row gap-3">
//                     <button
//                       onClick={handleDeleteCertificate}
//                       disabled={deletingCertificate}
//                       className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
//                     >
//                       {deletingCertificate ? <FaSpinner className="animate-spin" /> : <FaTrashAlt />}
//                       {deletingCertificate ? 'Deleting...' : 'Delete Permanently'}
//                     </button>
//                     <button
//                       onClick={() => {
//                         setShowDeleteConfirm(false);
//                         setCertificateToDelete(null);
//                       }}
//                       className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 text-sm sm:text-base"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Course Add/Edit Modal - Responsive */}
//           {showCourseModal && (
//             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//               <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//                 <div className="p-4 sm:p-6">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg sm:text-xl font-bold">{editingCourse ? "Edit Course" : "Add New Course"}</h3>
//                     <button onClick={() => setShowCourseModal(false)} className="text-gray-500 hover:text-gray-700">
//                       <FaTimes size={20} />
//                     </button>
//                   </div>

//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Course Name *</label>
//                       <input
//                         type="text"
//                         value={courseForm.name}
//                         onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
//                         placeholder="Enter course name"
//                         required
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Price (₹) *</label>
//                         <input
//                           type="number"
//                           value={courseForm.price}
//                           onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//                           placeholder="Price"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Duration *</label>
//                         <input
//                           type="text"
//                           value={courseForm.duration}
//                           onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//                           placeholder="e.g., 3 Months"
//                           required
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Description</label>
//                       <textarea
//                         value={courseForm.description}
//                         onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//                         rows="3"
//                         placeholder="Course description"
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Level</label>
//                         <select
//                           value={courseForm.level}
//                           onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//                         >
//                           <option value="Beginner">Beginner</option>
//                           <option value="Intermediate">Intermediate</option>
//                           <option value="Advanced">Advanced</option>
//                         </select>
//                       </div>
//                       <div>
//                         <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">Rating</label>
//                         <input
//                           type="number"
//                           step="0.1"
//                           min="0"
//                           max="5"
//                           value={courseForm.rating}
//                           onChange={(e) => setCourseForm({ ...courseForm, rating: e.target.value })}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="checkbox"
//                           checked={courseForm.is_active}
//                           onChange={(e) => setCourseForm({ ...courseForm, is_active: e.target.checked })}
//                           className="w-4 h-4"
//                         />
//                         <span className="text-gray-700 text-sm sm:text-base">Course Active (visible to students)</span>
//                       </label>
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-3 pt-4">
//                       <button
//                         onClick={handleSaveCourse}
//                         className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2 text-sm sm:text-base"
//                       >
//                         <FaSave /> {editingCourse ? "Update Course" : "Add Course"}
//                       </button>
//                       <button
//                         onClick={() => setShowCourseModal(false)}
//                         className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 text-sm sm:text-base"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Notices Section */}
//           {activeSection === "notices" && (
//             <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
//               <h2 className="text-lg sm:text-xl font-bold mb-4">Notice Management</h2>
//               <p className="text-gray-600">Notice management features coming soon...</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;















































































import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBook,
  FaCertificate,
  FaMoneyBillWave,
  FaBell,
  FaChartLine,
  FaSignOutAlt,
  FaCreditCard,
  FaCheckCircle,
  FaTimesCircle,
  FaImage,
  FaSpinner,
  FaEye,
  FaTrash,
  FaEdit,
  FaCalendarAlt,
  FaPlus,
  FaSave,
  FaTimes,
  FaToggleOn,
  FaToggleOff,
  FaBriefcase,
  FaComment,
  FaCheck,
  FaTimes as FaTimesIcon,
  FaRedo,
  FaShare,
  FaDownload,
  FaQrcode,
  FaWhatsapp,
  FaEnvelope,
  FaTrashAlt,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import api from "../services/api";
import toast from "react-hot-toast";
import AdminAttendance from "./AdminAttendance";

// ✅ BACKEND URL - Add this at the top of the file
const BACKEND_URL = "http://localhost:5000";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Payment Verification State
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [paymentStats, setPaymentStats] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [viewImage, setViewImage] = useState(null);

  // Students State
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Internship Payments State
  const [internshipPayments, setInternshipPayments] = useState([]);
  const [loadingInternshipPayments, setLoadingInternshipPayments] =
    useState(false);
  const [selectedInternshipPayment, setSelectedInternshipPayment] =
    useState(null);
  const [selectedStudentForCourse, setSelectedStudentForCourse] =
    useState(null);
  const [showCourseManager, setShowCourseManager] = useState(false);

  // Course Management State
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
    level: "Beginner",
    rating: 4.5,
    students_enrolled: 0,
    is_active: true,
  });

  // Certificate State
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [certificateScore, setCertificateScore] = useState(100);
  const [generatingCertificate, setGeneratingCertificate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState(null);
  const [deletingCertificate, setDeletingCertificate] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [loadingCertificates, setLoadingCertificates] = useState(false);

  // ✅ HELPER FUNCTION - Get full screenshot URL
  const getScreenshotUrl = (filename) => {
    if (!filename) return null;
    // If it's already a full URL, return as is
    if (filename.startsWith("http")) return filename;
    // If it starts with /uploads, add backend URL
    if (filename.startsWith("/uploads")) return `${BACKEND_URL}${filename}`;
    // Otherwise, assume it's just a filename
    return `${BACKEND_URL}/uploads/screenshots/${filename}`;
  };

  // Helper function to get auth headers
  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    const userData =
      localStorage.getItem("user") || localStorage.getItem("userData");

    console.log("AdminPanel - Auth Check:", {
      token: !!token,
      userType,
      userData: !!userData,
    });

    if (!token || userType !== "admin") {
      toast.error("Access denied. Please login as admin.");
      navigate("/login");
      return;
    }

    try {
      const adminData = userData ? JSON.parse(userData) : null;
      setAdmin(adminData);
    } catch (error) {
      console.error("Error parsing admin data:", error);
      navigate("/login");
      return;
    }

    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchCourses(),
          fetchStudents(),
          fetchOrders(),
          fetchInternshipPayments(),
          fetchPaymentRequests(),
          fetchPaymentStats(),
          fetchCertificates(),
        ]);
      } catch (error) {
        console.error("Initial data load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();

    const intervals = [
      setInterval(() => fetchCourses(), 30000),
      setInterval(() => fetchStudents(), 30000),
      setInterval(() => fetchOrders(), 30000),
      setInterval(() => fetchInternshipPayments(), 30000),
      setInterval(() => fetchCertificates(), 30000),
      setInterval(() => {
        if (activeSection === "payment-verification") {
          fetchPaymentRequests();
          fetchPaymentStats();
        }
      }, 30000),
    ];

    return () => {
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, [navigate, activeSection]);

  // Certificate Functions
  const fetchCertificates = async () => {
    setLoadingCertificates(true);
    try {
      const config = getAuthConfig();
      const response = await api.get("/admin/certificates", config);
      if (response.data.success) {
        setCertificates(response.data.certificates);
      }
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
      toast.error("Failed to fetch certificates");
    } finally {
      setLoadingCertificates(false);
    }
  };

  const handleGenerateCertificate = async () => {
    if (!selectedStudentId || !selectedCourseId) {
      toast.error("Please select student and course");
      return;
    }

    setGeneratingCertificate(true);
    try {
      const config = getAuthConfig();
      const response = await api.post(
        "/certificates/generate",
        {
          student_id: parseInt(selectedStudentId),
          course_id: parseInt(selectedCourseId),
          score: certificateScore,
        },
        config,
      );

      if (response.data.success) {
        toast.success("Certificate generated successfully!");
        setShowCertificateModal(false);
        fetchCertificates();
        setSelectedStudentId("");
        setSelectedCourseId("");
        setCertificateScore(100);
      }
    } catch (error) {
      console.error("Failed to generate certificate:", error);
      toast.error(
        error.response?.data?.error || "Failed to generate certificate",
      );
    } finally {
      setGeneratingCertificate(false);
    }
  };

  const handleDownloadCertificate = async (certificate) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get(
        `/certificates/download/${certificate.certificate_id}`,
        config,
      );

      if (response.data.success) {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Certificate - ${certificate.student_name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              .certificate { border: 2px solid #1a3a5c; padding: 30px; text-align: center; }
              h1 { color: #1a3a5c; }
              .student-name { font-size: 24px; font-weight: bold; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="certificate">
              <h1>CERTIFICATE OF ACHIEVEMENT</h1>
              <p>This certificate is proudly presented to</p>
              <div class="student-name">${certificate.student_name}</div>
              <p>for successfully completing the course</p>
              <h3>${certificate.course_name}</h3>
              <p>Score: ${certificate.score}%</p>
              <p>Issue Date: ${new Date(certificate.issue_date).toLocaleDateString()}</p>
              <p>Certificate ID: ${certificate.certificate_id}</p>
            </div>
          </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      } else {
        toast.info("Certificate download will be available soon");
      }
    } catch (error) {
      console.error("Failed to download certificate:", error);
      toast.error("Failed to download certificate");
    }
  };

  const handleDeleteCertificate = async () => {
    if (!certificateToDelete) return;

    setDeletingCertificate(true);
    try {
      const config = getAuthConfig();
      const response = await api.delete(
        `/admin/certificates/${certificateToDelete.id}`,
        config,
      );

      if (response.data.success) {
        toast.success("Certificate permanently deleted from database!");
        setShowDeleteConfirm(false);
        setCertificateToDelete(null);
        await fetchCertificates();
        window.dispatchEvent(new CustomEvent("certificateDeleted"));
      } else {
        toast.error(response.data.message || "Failed to delete certificate");
      }
    } catch (error) {
      console.error("Failed to delete certificate:", error);
      toast.error(
        error.response?.data?.error || "Failed to delete certificate",
      );
    } finally {
      setDeletingCertificate(false);
    }
  };

  const confirmDelete = (certificate) => {
    setCertificateToDelete(certificate);
    setShowDeleteConfirm(true);
  };

  // =====================================================
  // COURSE MANAGEMENT FUNCTIONS
  // =====================================================

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const config = getAuthConfig();
      const response = await api.get("/admin/courses", config);
      if (response.data.success) {
        setCourses(response.data.courses);
        window.dispatchEvent(
          new CustomEvent("coursesUpdated", {
            detail: { courses: response.data.courses },
          }),
        );
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please login again.");
        handleLogout();
      } else if (error.code === "ERR_NETWORK") {
        toast.error("Cannot connect to server.");
      }
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setCourseForm({
      name: "",
      price: "",
      duration: "",
      description: "",
      level: "Beginner",
      rating: 4.5,
      students_enrolled: 0,
      is_active: true,
    });
    setShowCourseModal(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      name: course.name,
      price: course.price,
      duration: course.duration,
      description: course.description || "",
      level: course.level,
      rating: course.rating,
      students_enrolled: course.students_enrolled,
      is_active: course.is_active,
    });
    setShowCourseModal(true);
  };

  const handleDeleteCourse = async (course) => {
    if (window.confirm(`Are you sure you want to delete "${course.name}"?`)) {
      try {
        const config = getAuthConfig();
        const response = await api.delete(
          `/admin/courses/${course.id}`,
          config,
        );
        if (response.data.success) {
          toast.success("Course deleted successfully");
          await fetchCourses();
          window.dispatchEvent(new CustomEvent("coursesUpdated"));
        }
      } catch (error) {
        console.error("Failed to delete course:", error);
        toast.error("Failed to delete course");
      }
    }
  };

  const handleToggleCourseStatus = async (course) => {
    try {
      const config = getAuthConfig();
      const response = await api.put(
        `/admin/courses/${course.id}`,
        {
          ...course,
          is_active: !course.is_active,
        },
        config,
      );
      if (response.data.success) {
        toast.success(
          `Course ${course.is_active ? "deactivated" : "activated"} successfully`,
        );
        await fetchCourses();
        window.dispatchEvent(new CustomEvent("coursesUpdated"));
      }
    } catch (error) {
      console.error("Failed to update course status:", error);
      toast.error("Failed to update course status");
    }
  };

  const handleSaveCourse = async () => {
    if (!courseForm.name || !courseForm.name.trim()) {
      toast.error("Please enter course name");
      return;
    }
    if (!courseForm.price || courseForm.price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!courseForm.duration || !courseForm.duration.trim()) {
      toast.error("Please enter course duration");
      return;
    }

    const savingToast = toast.loading(
      editingCourse ? "Updating course..." : "Adding course...",
    );

    try {
      const config = getAuthConfig();
      const courseData = {
        name: courseForm.name.trim(),
        price: parseFloat(courseForm.price),
        duration: courseForm.duration.trim(),
        description: courseForm.description || "",
        level: courseForm.level,
        rating: parseFloat(courseForm.rating) || 4.5,
        students_enrolled: parseInt(courseForm.students_enrolled) || 0,
        is_active: courseForm.is_active,
      };

      let response;
      if (editingCourse) {
        response = await api.put(
          `/admin/courses/${editingCourse.id}`,
          courseData,
          config,
        );
      } else {
        response = await api.post("/admin/courses", courseData, config);
      }

      if (response.data.success) {
        toast.success(
          editingCourse
            ? "Course updated successfully!"
            : "Course added successfully!",
          { id: savingToast },
        );
        setShowCourseModal(false);
        setCourseForm({
          name: "",
          price: "",
          duration: "",
          description: "",
          level: "Beginner",
          rating: 4.5,
          students_enrolled: 0,
          is_active: true,
        });
        setEditingCourse(null);
        await fetchCourses();
        window.dispatchEvent(new CustomEvent("coursesUpdated"));
      } else {
        toast.error(response.data.message || "Failed to save course", {
          id: savingToast,
        });
      }
    } catch (error) {
      console.error("Failed to save course:", error);
      toast.error("Failed to save course", { id: savingToast });
    }
  };

  // =====================================================
  // PAYMENT VERIFICATION FUNCTIONS
  // =====================================================

  // const fetchPaymentRequests = async () => {
  //   setLoadingRequests(true);
  //   try {
  //     const config = getAuthConfig();
  //     const response = await api.get("/admin/payment-requests", config);
  //     if (response.data.success) {
  //       setPaymentRequests(response.data.verifications || []);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch payment requests:", error);
  //   } finally {
  //     setLoadingRequests(false);
  //   }
  // };

  // const fetchPaymentStats = async () => {
  //   try {
  //     const config = getAuthConfig();
  //     const response = await api.get("/admin/payment-stats", config);
  //     if (response.data.success) {
  //       setPaymentStats(response.data.stats);
  //     } else {
  //       setPaymentStats({
  //         total_amount: 0,
  //         pending: 0,
  //         approved: 0,
  //         declined: 0,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch stats:", error);
  //     setPaymentStats({
  //       total_amount: 0,
  //       pending: 0,
  //       approved: 0,
  //       declined: 0,
  //     });
  //   }
  // };

  // const handleApprove = async (request) => {
  //   setProcessingId(request.id);
  //   try {
  //     const config = getAuthConfig();
  //     const response = await api.post(
  //       `/admin/payment-requests/${request.id}/approve`,
  //       {
  //         notes: adminNotes || "Payment verified and approved successfully.",
  //       },
  //       config,
  //     );

  //     if (response.data.success) {
  //       toast.success("Payment approved! Courses added to student account.");
  //       await Promise.all([
  //         fetchPaymentRequests(),
  //         fetchPaymentStats(),
  //         fetchStudents(),
  //         fetchOrders(),
  //       ]);
  //       window.dispatchEvent(
  //         new CustomEvent("paymentApproved", {
  //           detail: {
  //             orderId: request.order_id,
  //             studentId: request.student_id,
  //             coursesAdded: response.data.courses_added || [],
  //           },
  //         }),
  //       );
  //       setSelectedRequest(null);
  //       setAdminNotes("");
  //       if (
  //         response.data.courses_added &&
  //         response.data.courses_added.length > 0
  //       ) {
  //         toast.success(
  //           `${response.data.courses_added.length} course(s) added to student's account`,
  //         );
  //       }
  //     } else {
  //       toast.error(response.data.message || "Failed to approve payment");
  //     }
  //   } catch (error) {
  //     console.error("Approval error:", error);
  //     toast.error(error.response?.data?.message || "Failed to approve payment");
  //   } finally {
  //     setProcessingId(null);
  //   }
  // };

  // const handleDecline = async (request) => {
  //   setProcessingId(request.id);
  //   try {
  //     const config = getAuthConfig();
  //     const response = await api.post(
  //       `/admin/payment-requests/${request.id}/decline`,
  //       {
  //         notes: adminNotes || "Payment verification failed.",
  //       },
  //       config,
  //     );

  //     if (response.data.success) {
  //       toast.success("Payment declined");
  //       await Promise.all([fetchPaymentRequests(), fetchPaymentStats()]);
  //       setSelectedRequest(null);
  //       setAdminNotes("");
  //     } else {
  //       toast.error(response.data.message || "Failed to decline payment");
  //     }
  //   } catch (error) {
  //     console.error("Decline error:", error);
  //     toast.error("Failed to decline payment");
  //   } finally {
  //     setProcessingId(null);
  //   }
  // };
  // In AdminPanel.jsx

// =====================================================
// PAYMENT VERIFICATION FUNCTIONS
// =====================================================

const fetchPaymentRequests = async () => {
  setLoadingRequests(true);
  try {
    const config = getAuthConfig();
    const response = await api.get("/admin/payment-requests", config);
    if (response.data.success) {
      setPaymentRequests(response.data.verifications || []);
    }
  } catch (error) {
    console.error("Failed to fetch payment requests:", error);
  } finally {
    setLoadingRequests(false);
  }
};

const fetchPaymentStats = async () => {
  try {
    const config = getAuthConfig();
    const response = await api.get("/admin/payment-stats", config);
    if (response.data.success) {
      setPaymentStats(response.data.stats);
    } else {
      setPaymentStats({ total_amount: 0, pending: 0, approved: 0, declined: 0 });
    }
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    setPaymentStats({ total_amount: 0, pending: 0, approved: 0, declined: 0 });
  }
};

const handleApprove = async (request) => {
  setProcessingId(request.id);
  try {
    const config = getAuthConfig();
    const response = await api.post(
      `/admin/payment-requests/${request.id}/approve`,
      {
        notes: adminNotes || "Payment verified and approved successfully.",
      },
      config
    );

    if (response.data.success) {
      toast.success("Payment approved! Courses added to student account.");
      await Promise.all([
        fetchPaymentRequests(),
        fetchPaymentStats(),
        fetchStudents(),
        fetchOrders(), // ✅ Now this will work
      ]);
      window.dispatchEvent(
        new CustomEvent("paymentApproved", {
          detail: {
            orderId: request.order_id,
            studentId: request.student_id,
            coursesAdded: response.data.courses_added || [],
          },
        })
      );
      setSelectedRequest(null);
      setAdminNotes("");
      if (response.data.courses_added && response.data.courses_added.length > 0) {
        toast.success(
          `${response.data.courses_added.length} course(s) added to student's account`
        );
      }
    } else {
      toast.error(response.data.message || "Failed to approve payment");
    }
  } catch (error) {
    console.error("Approval error:", error);
    toast.error(error.response?.data?.message || "Failed to approve payment");
  } finally {
    setProcessingId(null);
  }
};

const handleDecline = async (request) => {
  setProcessingId(request.id);
  try {
    const config = getAuthConfig();
    const response = await api.post(`/admin/payment-requests/${request.id}/decline`, {
      notes: adminNotes || "Payment verification failed.",
    }, config);

    if (response.data.success) {
      toast.success("Payment declined");
      await Promise.all([fetchPaymentRequests(), fetchPaymentStats()]);
      setSelectedRequest(null);
      setAdminNotes("");
    } else {
      toast.error(response.data.message || "Failed to decline payment");
    }
  } catch (error) {
    console.error("Decline error:", error);
    toast.error("Failed to decline payment");
  } finally {
    setProcessingId(null);
  }
};

// =====================================================
// ORDERS FUNCTIONS
// =====================================================

const fetchOrders = async () => {
  setLoadingOrders(true);
  try {
    const config = getAuthConfig();
    const response = await api.get("/admin/orders", config);
    if (response.data.success) {
      setOrders(response.data.orders);
    }
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    toast.error("Failed to fetch orders");
  } finally {
    setLoadingOrders(false);
  }
};

  // =====================================================
// INTERNSHIP PAYMENT FUNCTIONS (ADD THESE)
// =====================================================

const fetchInternshipPayments = async () => {
  setLoadingInternshipPayments(true);
  try {
    const config = getAuthConfig();
    const response = await api.get("/admin/internship-payment-requests", config);
    if (response.data.success) {
      setInternshipPayments(response.data.payments || []);
    }
  } catch (error) {
    console.error("Failed to fetch internship payments:", error);
    toast.error("Failed to fetch internship payments");
  } finally {
    setLoadingInternshipPayments(false);
  }
};

const handleInternshipApprove = async (payment) => {
  setProcessingId(payment.id);
  try {
    const config = getAuthConfig();
    const response = await api.post(`/admin/internship-payment-requests/${payment.id}/approve`, {
      notes: adminNotes || "Internship payment verified and approved.",
    }, config);

    if (response.data.success) {
      toast.success("Internship payment approved! Student enrolled.");
      await Promise.all([
        fetchInternshipPayments(), 
        fetchPaymentStats()
      ]);
      setSelectedInternshipPayment(null);
      setAdminNotes("");
      window.dispatchEvent(new CustomEvent("internshipPaymentApproved", { 
        detail: { orderId: payment.order_id } 
      }));
    } else {
      toast.error(response.data.message || "Failed to approve payment");
    }
  } catch (error) {
    console.error("Approval error:", error);
    toast.error(error.response?.data?.message || "Failed to approve internship payment");
  } finally {
    setProcessingId(null);
  }
};

const handleInternshipDecline = async (payment) => {
  setProcessingId(payment.id);
  try {
    const config = getAuthConfig();
    const response = await api.post(`/admin/internship-payment-requests/${payment.id}/decline`, {
      notes: adminNotes || "Internship payment verification failed.",
    }, config);

    if (response.data.success) {
      toast.success("Internship payment declined");
      await fetchInternshipPayments();
      setSelectedInternshipPayment(null);
      setAdminNotes("");
    } else {
      toast.error(response.data.message || "Failed to decline payment");
    }
  } catch (error) {
    console.error("Decline error:", error);
    toast.error("Failed to decline internship payment");
  } finally {
    setProcessingId(null);
  }
};

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const config = getAuthConfig();
      const response = await api.get("/admin/students", config);
      if (response.data.success) {
        setStudents(response.data.students);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
      toast.error("Failed to fetch students");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
    localStorage.removeItem("userType");
    sessionStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: FaChartLine },
    { id: "students", label: "Students", icon: FaUsers },
    { id: "courses", label: "Courses", icon: FaBook },
    { id: "attendance", label: "Attendance", icon: FaCalendarAlt },
    { id: "orders", label: "Orders", icon: FaCreditCard },
    {
      id: "payment-verification",
      label: "Course Payments",
      icon: FaMoneyBillWave,
    },
    {
      id: "internship-payments",
      label: "Internship Payments",
      icon: FaBriefcase,
    },
    { id: "certificates", label: "Certificates", icon: FaCertificate },
    { id: "notices", label: "Notices", icon: FaBell },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 bg-primary-600 text-white p-2 rounded-lg shadow-lg md:hidden"
        >
          <FaBars size={20} />
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-transform duration-300 z-50 overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64`}
      >
        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white md:hidden"
          >
            <FaTimes size={20} />
          </button>
        )}

        <div className="p-6">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-gray-400 text-sm mt-1">SJS Global Tech Academy</p>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">Logged in as:</p>
            <p className="font-semibold break-words">
              {admin?.full_name || admin?.username || admin?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-500 break-words">{admin?.email}</p>
          </div>
        </div>

        <nav className="mt-6">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                if (item.id === "courses") fetchCourses();
                if (item.id === "students") fetchStudents();
                if (item.id === "internship-payments")
                  fetchInternshipPayments();
                if (item.id === "orders") fetchOrders();
                if (item.id === "payment-verification") {
                  fetchPaymentRequests();
                  fetchPaymentStats();
                }
                if (item.id === "certificates") {
                  fetchCertificates();
                }
                if (isMobile) setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-6 py-3 transition-colors duration-200 ${
                activeSection === item.id
                  ? "bg-primary-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <item.icon />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${isMobile ? "ml-0" : "ml-64"}`}
      >
        {/* Header */}
        <div className="bg-white shadow-md p-4 sticky top-0 z-30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {sidebarItems.find((i) => i.id === activeSection)?.label}
            </h1>
            {activeSection === "courses" && (
              <button
                onClick={handleAddCourse}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm sm:text-base"
              >
                <FaPlus /> Add New Course
              </button>
            )}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome,{" "}
                {admin?.full_name?.split(" ")[0] || admin?.username || "Admin"}!
              </span>
            </div>
          </div>
        </div>

        {/* Rest of the content remains the same - just wrapped in responsive container */}
        <div className="p-4 sm:p-6">
          {/* Dashboard Content */}
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Cards - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                  <FaUsers className="text-primary-600 text-2xl sm:text-3xl mb-2" />
                  <p className="text-xl sm:text-2xl font-bold">
                    {students.length}
                  </p>
                  <p className="text-gray-600 text-sm">Total Students</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                  <FaBook className="text-primary-600 text-2xl sm:text-3xl mb-2" />
                  <p className="text-xl sm:text-2xl font-bold">
                    {courses.length}
                  </p>
                  <p className="text-gray-600 text-sm">Active Courses</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                  <FaCreditCard className="text-primary-600 text-2xl sm:text-3xl mb-2" />
                  <p className="text-xl sm:text-2xl font-bold">
                    ₹{paymentStats?.total_amount?.toLocaleString() || 0}
                  </p>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                  <FaMoneyBillWave className="text-primary-600 text-2xl sm:text-3xl mb-2" />
                  <p className="text-xl sm:text-2xl font-bold">
                    {paymentStats?.pending || 0}
                  </p>
                  <p className="text-gray-600 text-sm">Pending Verifications</p>
                </div>
              </div>

              {/* Recent Data Grid - Responsive */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 overflow-x-auto">
                  <h2 className="text-lg sm:text-xl font-bold mb-4">
                    Recent Students
                  </h2>
                  <div className="space-y-2">
                    {students.slice(0, 5).map((student) => (
                      <div
                        key={student.id}
                        className="flex justify-between items-center py-2 border-b"
                      >
                        <div>
                          <p className="font-semibold text-sm sm:text-base">
                            {student.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {student.email}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                          {student.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 overflow-x-auto">
                  <h2 className="text-lg sm:text-xl font-bold mb-4">
                    Recent Orders
                  </h2>
                  <div className="space-y-2">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex justify-between items-center py-2 border-b"
                      >
                        <div>
                          <p className="font-semibold text-sm sm:text-base">
                            {order.student_name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            ₹{order.total_amount?.toLocaleString()}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            order.payment_status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Students Section - Responsive Table */}
          {activeSection === "students" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Student ID
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Phone
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loadingStudents ? (
                      <tr>
                        <td colSpan="6" className="text-center py-8">
                          <FaSpinner className="animate-spin mx-auto" />
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-mono">
                            {student.student_id}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm font-medium">
                            {student.name}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">
                            {student.email}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm">
                            {student.phone || "-"}
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                student.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {student.status}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm">
                            {new Date(student.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Courses Section - Responsive Table */}
          {activeSection === "courses" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        ID
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Course Name
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Price
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Duration
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Level
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Students
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Rating
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loadingCourses ? (
                      <tr>
                        <td colSpan="9" className="text-center py-8">
                          <FaSpinner className="animate-spin mx-auto" />
                        </td>
                      </tr>
                    ) : (
                      courses.map((course) => (
                        <tr key={course.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 text-sm">
                            {course.id}
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900 text-sm sm:text-base">
                                {course.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {course.course_code}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-primary-600">
                            ₹{course.price?.toLocaleString()}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm">
                            {course.duration}
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                course.level === "Advanced"
                                  ? "bg-red-100 text-red-800"
                                  : course.level === "Intermediate"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {course.level}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm">
                            {course.students_enrolled}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm">
                            {course.rating} ★
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <button
                              onClick={() => handleToggleCourseStatus(course)}
                              className="flex items-center gap-1"
                            >
                              {course.is_active ? (
                                <FaToggleOn className="text-green-600 text-lg sm:text-xl" />
                              ) : (
                                <FaToggleOff className="text-gray-400 text-lg sm:text-xl" />
                              )}
                              <span className="text-xs hidden sm:inline">
                                {course.is_active ? "Active" : "Inactive"}
                              </span>
                            </button>
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditCourse(course)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(course)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <FaTrash size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Attendance Section */}
          {activeSection === "attendance" && <AdminAttendance />}

          {/* Orders Section - Responsive Table */}
          {activeSection === "orders" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Order ID
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Student
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loadingOrders ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8">
                          <FaSpinner className="animate-spin mx-auto" />
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 text-sm font-mono">
                            {order.order_id}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm">
                            {order.student_name}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm font-bold text-primary-600">
                            ₹{order.total_amount?.toLocaleString()}
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                order.payment_status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.payment_status}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payment Verification Section - Responsive Cards on Mobile */}
          {activeSection === "payment-verification" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Course Payment Verification
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Verify and approve student payment submissions
                  </p>
                </div>
                <button
                  onClick={() => {
                    fetchPaymentRequests();
                    fetchPaymentStats();
                  }}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition text-sm sm:text-base"
                >
                  {loadingRequests ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaRedo />
                  )}
                  Refresh
                </button>
              </div>

              {paymentStats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <p className="text-yellow-600 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-yellow-700">
                      {paymentStats.pending || 0}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <p className="text-green-600 text-sm">Approved</p>
                    <p className="text-2xl font-bold text-green-700">
                      {paymentStats.approved || 0}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <p className="text-red-600 text-sm">Declined</p>
                    <p className="text-2xl font-bold text-red-700">
                      {paymentStats.declined || 0}
                    </p>
                  </div>
                </div>
              )}

              {loadingRequests ? (
                <div className="flex justify-center py-12">
                  <FaSpinner className="animate-spin text-4xl text-primary-600" />
                  <p className="ml-3 text-gray-600">
                    Loading payment requests...
                  </p>
                </div>
              ) : paymentRequests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 sm:p-12 text-center">
                  <FaCheckCircle className="text-5xl sm:text-6xl text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    No Pending Requests
                  </h3>
                  <p className="text-gray-600 text-sm">
                    All payment verification requests have been processed.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-semibold text-base sm:text-lg">
                                {request.student_name}
                              </h3>
                              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                                {request.status || "Pending"}
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              {request.student_email}
                            </p>
                            <p className="text-gray-600 text-xs sm:text-sm mt-1">
                              <strong>Transaction ID:</strong>{" "}
                              {request.transaction_id || "N/A"}
                            </p>
                            <p className="text-lg sm:text-xl font-bold text-primary-600 mt-2">
                              ₹{request.amount?.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              Submitted:{" "}
                              {new Date(request.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-3">
                            {request.screenshot_url && (
                              <button
                                onClick={() =>
                                  setViewImage(request.screenshot_url)
                                }
                                className="bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm"
                              >
                                <FaEye /> View
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedRequest(request)}
                              className="bg-primary-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-primary-700 transition text-sm"
                            >
                              Review
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Payment Review Modal - Responsive */}
{selectedRequest && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Review Payment Verification</h3>
          <button onClick={() => { setSelectedRequest(null); setAdminNotes(""); }} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Student Information</h4>
            <p><strong>Name:</strong> {selectedRequest.student_name}</p>
            <p><strong>Email:</strong> {selectedRequest.student_email}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Payment Information</h4>
            <p><strong>Order ID:</strong> {selectedRequest.order_id}</p>
            <p><strong>Amount:</strong> <span className="text-primary-600 font-bold">₹{selectedRequest.amount?.toLocaleString()}</span></p>
            <p><strong>Transaction ID:</strong> {selectedRequest.transaction_id || "N/A"}</p>
            <p><strong>Submitted:</strong> {new Date(selectedRequest.created_at).toLocaleString()}</p>
          </div>
          
          {/* ✅ FIXED Screenshot Display */}
          {selectedRequest.screenshot_url && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">Payment Screenshot</label>
              <div 
                className="rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition"
                onClick={() => setViewImage(selectedRequest.screenshot_url)}
              >
                <img 
                  src={(() => {
                    const url = selectedRequest.screenshot_url;
                    if (!url) return null;
                    if (url.startsWith('http')) return url;
                    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
                    if (url.startsWith('app/uploads')) return `http://localhost:5000/${url}`;
                    return `http://localhost:5000/uploads/screenshots/${url}`;
                  })()}
                  alt="Payment Screenshot"
                  className="w-full max-h-64 object-contain bg-gray-50"
                  onError={(e) => {
                    console.error("Screenshot failed to load:", selectedRequest.screenshot_url);
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='14' fill='%23999' text-anchor='middle'%3ENo Screenshot Available%3C/text%3E%3C/svg%3E";
                    e.target.onerror = null;
                  }}
                />
                <div className="bg-gray-50 p-2 text-center text-sm text-gray-600">
                  <FaEye className="inline mr-1" /> Click to view full size
                </div>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Admin Notes (Optional)</label>
            <textarea 
              value={adminNotes} 
              onChange={(e) => setAdminNotes(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
              rows="3" 
              placeholder="Add any notes about this verification..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              onClick={() => handleApprove(selectedRequest)} 
              disabled={processingId === selectedRequest.id} 
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processingId === selectedRequest.id ? <FaSpinner className="animate-spin" /> : <FaCheck />}
              Approve Payment
            </button>
            <button 
              onClick={() => handleDecline(selectedRequest)} 
              disabled={processingId === selectedRequest.id} 
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processingId === selectedRequest.id ? <FaSpinner className="animate-spin" /> : <FaTimesIcon />}
              Decline Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

         {/* ✅ FIXED Image View Modal with better error handling */}
{viewImage && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setViewImage(null)}>
    <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setViewImage(null)}
        className="absolute -top-12 right-0 text-white hover:text-gray-300 transition z-10"
      >
        <FaTimes size={28} />
      </button>
      <div className="bg-white rounded-lg p-2">
        <img 
          src={(() => {
            if (!viewImage) return null;
            // If it's already a full URL
            if (viewImage.startsWith('http')) return viewImage;
            // If it starts with /uploads
            if (viewImage.startsWith('/uploads')) return `http://localhost:5000${viewImage}`;
            // Otherwise, assume it's just a filename
            return `http://localhost:5000/uploads/screenshots/${viewImage}`;
          })()}
          alt="Payment Screenshot" 
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
          onError={(e) => {
            console.error("Image failed to load:", viewImage);
            // Show a helpful error message
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='300' viewBox='0 0 500 300'%3E%3Crect width='500' height='300' fill='%23fff0f0'/%3E%3Ctext x='250' y='140' font-family='Arial' font-size='16' fill='%23d32f2f' text-anchor='middle'%3E⚠️ Screenshot Not Found%3C/text%3E%3Ctext x='250' y='170' font-family='Arial' font-size='12' fill='%23999' text-anchor='middle'%3EPlease ask student to re-upload%3C/text%3E%3C/svg%3E";
            e.target.onerror = null;
          }}
        />
      </div>
      {viewImage && (
        <div className="mt-3 flex justify-center gap-3">
          <a 
            href={(() => {
              if (!viewImage) return '#';
              if (viewImage.startsWith('http')) return viewImage;
              if (viewImage.startsWith('/uploads')) return `http://localhost:5000${viewImage}`;
              return `http://localhost:5000/uploads/screenshots/${viewImage}`;
            })()}
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            Open in New Tab
          </a>
          <a 
            href={(() => {
              if (!viewImage) return '#';
              if (viewImage.startsWith('http')) return viewImage;
              if (viewImage.startsWith('/uploads')) return `http://localhost:5000${viewImage}`;
              return `http://localhost:5000/uploads/screenshots/${viewImage}`;
            })()}
            download
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  </div>
)}

          {/* Internship Payments Section - Responsive Cards */}
          {activeSection === "internship-payments" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Internship Payment Requests
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Verify and approve internship payment submissions
                  </p>
                </div>
                <button
                  onClick={fetchInternshipPayments}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition text-sm sm:text-base"
                >
                  {loadingInternshipPayments ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaRedo />
                  )}
                  Refresh
                </button>
              </div>

              {loadingInternshipPayments ? (
                <div className="flex justify-center py-12">
                  <FaSpinner className="animate-spin text-4xl text-primary-600" />
                </div>
              ) : internshipPayments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 sm:p-12 text-center">
                  <FaCheckCircle className="text-5xl sm:text-6xl text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    No Pending Internship Payments
                  </h3>
                  <p className="text-gray-600 text-sm">
                    All internship payment requests have been processed.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {internshipPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-semibold text-base sm:text-lg">
                                {payment.student_name}
                              </h3>
                              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                                {payment.status === "pending_verification"
                                  ? "Pending"
                                  : payment.status}
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              {payment.student_email}
                            </p>
                            <p className="text-gray-600 text-xs sm:text-sm mt-1">
                              <strong>Internship:</strong>{" "}
                              {payment.internship_title}
                            </p>
                            <p className="text-gray-600 text-xs sm:text-sm mt-1">
                              <strong>Transaction ID:</strong>{" "}
                              {payment.transaction_id || "N/A"}
                            </p>
                            <p className="text-lg sm:text-xl font-bold text-primary-600 mt-2">
                              Amount: ₹{payment.amount?.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              Submitted:{" "}
                              {new Date(payment.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-3">
                            {payment.screenshot_url && (
                              <button
                                onClick={() =>
                                  setViewImage(payment.screenshot_url)
                                }
                                className="bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm"
                              >
                                <FaEye /> View
                              </button>
                            )}
                            <button
                              onClick={() =>
                                setSelectedInternshipPayment(payment)
                              }
                              className="bg-primary-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-primary-700 transition text-sm"
                            >
                              Review
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Internship Payment Review Modal - FIXED */}
{selectedInternshipPayment && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            Review Internship Payment
          </h3>
          <button
            onClick={() => {
              setSelectedInternshipPayment(null);
              setAdminNotes("");
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">
              Student Information
            </h4>
            <p>
              <strong>Name:</strong>{" "}
              {selectedInternshipPayment.student_name}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {selectedInternshipPayment.student_email}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">
              Internship Information
            </h4>
            <p>
              <strong>Internship:</strong>{" "}
              {selectedInternshipPayment.internship_title}
            </p>
            <p>
              <strong>Amount:</strong>{" "}
              <span className="text-primary-600 font-bold">
                ₹{selectedInternshipPayment.amount?.toLocaleString()}
              </span>
            </p>
            <p>
              <strong>Transaction ID:</strong>{" "}
              {selectedInternshipPayment.transaction_id || "N/A"}
            </p>
            <p>
              <strong>Submitted:</strong>{" "}
              {new Date(
                selectedInternshipPayment.created_at,
              ).toLocaleString()}
            </p>
          </div>

          {/* ✅ FIXED Screenshot Display - Same as course payment */}
          {selectedInternshipPayment.screenshot_url && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Payment Screenshot
              </label>
              <div
                className="rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition"
                onClick={() =>
                  setViewImage(
                    selectedInternshipPayment.screenshot_url,
                  )
                }
              >
                <img
                  src={(() => {
                    const url = selectedInternshipPayment.screenshot_url;
                    if (!url) return null;
                    if (url.startsWith('http')) return url;
                    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
                    return `http://localhost:5000/uploads/screenshots/${url}`;
                  })()}
                  alt="Payment Screenshot"
                  className="w-full max-h-64 object-contain bg-gray-50"
                  onError={(e) => {
                    console.error("Screenshot failed to load:", selectedInternshipPayment.screenshot_url);
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='14' fill='%23999' text-anchor='middle'%3ENo Screenshot Available%3C/text%3E%3C/svg%3E";
                    e.target.onerror = null;
                  }}
                />
                <div className="bg-gray-50 p-2 text-center text-sm text-gray-600">
                  <FaEye className="inline mr-1" /> Click to view full size
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Admin Notes{" "}
              <span className="text-gray-400 text-sm">
                (Optional)
              </span>
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="3"
              placeholder="Add any notes about this verification..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() =>
                handleInternshipApprove(selectedInternshipPayment)
              }
              disabled={processingId === selectedInternshipPayment.id}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processingId === selectedInternshipPayment.id ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaCheck />
              )}
              Approve Payment
            </button>
            <button
              onClick={() =>
                handleInternshipDecline(selectedInternshipPayment)
              }
              disabled={processingId === selectedInternshipPayment.id}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processingId === selectedInternshipPayment.id ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaTimes />
              )}
              Decline Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

          {/* Certificates Section - Responsive Table */}
          {activeSection === "certificates" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Certificate Management
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Manage and issue certificates to students
                  </p>
                </div>
                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm sm:text-base"
                >
                  <FaPlus /> Generate Certificate
                </button>
              </div>

              {/* Certificate Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">
                        Total Certificates
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        {certificates.length}
                      </p>
                    </div>
                    <FaCertificate className="text-2xl text-primary-600" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Active</p>
                      <p className="text-2xl font-bold text-green-600">
                        {
                          certificates.filter((c) => c.status === "active")
                            .length
                        }
                      </p>
                    </div>
                    <FaCheckCircle className="text-2xl text-green-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Revoked</p>
                      <p className="text-2xl font-bold text-red-600">
                        {
                          certificates.filter((c) => c.status === "revoked")
                            .length
                        }
                      </p>
                    </div>
                    <FaTimesCircle className="text-2xl text-red-500" />
                  </div>
                </div>
              </div>

              {/* Certificates Table */}
              {loadingCertificates ? (
                <div className="flex justify-center py-12">
                  <FaSpinner className="animate-spin text-4xl text-primary-600" />
                </div>
              ) : certificates.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 sm:p-12 text-center">
                  <FaCertificate className="text-5xl sm:text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    No Certificates Yet
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Generate certificates for students who complete courses.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Certificate ID
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Student
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Course
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Issue Date
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Score
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {certificates.map((cert) => (
                          <tr key={cert.id} className="hover:bg-gray-50">
                            <td className="px-4 sm:px-6 py-4 text-sm font-mono">
                              {cert.certificate_id}
                            </td>
                            <td className="px-4 sm:px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-900 text-sm sm:text-base">
                                  {cert.student_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {cert.student_email}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-sm">
                              {cert.course_name}
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-sm">
                              {new Date(cert.issue_date).toLocaleDateString()}
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-sm font-semibold">
                              {cert.score}%
                            </td>
                            <td className="px-4 sm:px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  cert.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {cert.status}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    const verificationUrl = `${window.location.origin}/verify-certificate?token=${cert.verification_token}`;
                                    navigator.clipboard.writeText(
                                      verificationUrl,
                                    );
                                    toast.success("Verification link copied!");
                                  }}
                                  className="text-green-600 hover:text-green-800"
                                  title="Share Verification Link"
                                >
                                  <FaShare size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDownloadCertificate(cert)
                                  }
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Download PDF"
                                >
                                  <FaDownload size={16} />
                                </button>
                                <button
                                  onClick={() => confirmDelete(cert)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete Certificate (Permanent)"
                                >
                                  <FaTrashAlt size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Generate Certificate Modal - Responsive */}
          {showCertificateModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full">
                <div className="p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg sm:text-xl font-bold">
                      Generate Certificate
                    </h3>
                    <button
                      onClick={() => setShowCertificateModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                        Select Student *
                      </label>
                      <select
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                      >
                        <option value="">Select Student</option>
                        {students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.name} - {student.email}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                        Select Course *
                      </label>
                      <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                      >
                        <option value="">Select Course</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                        Score (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={certificateScore}
                        onChange={(e) =>
                          setCertificateScore(parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        onClick={handleGenerateCertificate}
                        disabled={generatingCertificate}
                        className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm sm:text-base"
                      >
                        {generatingCertificate ? (
                          <FaSpinner className="animate-spin inline" />
                        ) : (
                          "Generate"
                        )}
                      </button>
                      <button
                        onClick={() => setShowCertificateModal(false)}
                        className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Certificate Confirmation Modal - Responsive */}
          {showDeleteConfirm && certificateToDelete && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full">
                <div className="p-4 sm:p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaTrashAlt className="text-2xl text-red-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                      Delete Certificate
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Are you sure you want to permanently delete this
                      certificate?
                    </p>
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-xs sm:text-sm text-yellow-800">
                        <strong>Certificate ID:</strong>{" "}
                        {certificateToDelete.certificate_id}
                        <br />
                        <strong>Student:</strong>{" "}
                        {certificateToDelete.student_name}
                        <br />
                        <strong>Course:</strong>{" "}
                        {certificateToDelete.course_name}
                        <br />
                        <strong>Issue Date:</strong>{" "}
                        {new Date(
                          certificateToDelete.issue_date,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-xs text-red-500 mt-3">
                      ⚠️ This action cannot be undone. The certificate will be
                      permanently removed.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleDeleteCertificate}
                      disabled={deletingCertificate}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                    >
                      {deletingCertificate ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaTrashAlt />
                      )}
                      {deletingCertificate
                        ? "Deleting..."
                        : "Delete Permanently"}
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setCertificateToDelete(null);
                      }}
                      className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Course Add/Edit Modal - Responsive */}
          {showCourseModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg sm:text-xl font-bold">
                      {editingCourse ? "Edit Course" : "Add New Course"}
                    </h3>
                    <button
                      onClick={() => setShowCourseModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                        Course Name *
                      </label>
                      <input
                        type="text"
                        value={courseForm.name}
                        onChange={(e) =>
                          setCourseForm({ ...courseForm, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                        placeholder="Enter course name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          value={courseForm.price}
                          onChange={(e) =>
                            setCourseForm({
                              ...courseForm,
                              price: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                          placeholder="Price"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                          Duration *
                        </label>
                        <input
                          type="text"
                          value={courseForm.duration}
                          onChange={(e) =>
                            setCourseForm({
                              ...courseForm,
                              duration: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                          placeholder="e.g., 3 Months"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                        Description
                      </label>
                      <textarea
                        value={courseForm.description}
                        onChange={(e) =>
                          setCourseForm({
                            ...courseForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                        rows="3"
                        placeholder="Course description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                          Level
                        </label>
                        <select
                          value={courseForm.level}
                          onChange={(e) =>
                            setCourseForm({
                              ...courseForm,
                              level: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
                          Rating
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={courseForm.rating}
                          onChange={(e) =>
                            setCourseForm({
                              ...courseForm,
                              rating: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={courseForm.is_active}
                          onChange={(e) =>
                            setCourseForm({
                              ...courseForm,
                              is_active: e.target.checked,
                            })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700 text-sm sm:text-base">
                          Course Active (visible to students)
                        </span>
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        onClick={handleSaveCourse}
                        className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <FaSave />{" "}
                        {editingCourse ? "Update Course" : "Add Course"}
                      </button>
                      <button
                        onClick={() => setShowCourseModal(false)}
                        className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notices Section */}
          {activeSection === "notices" && (
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                Notice Management
              </h2>
              <p className="text-gray-600">
                Notice management features coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
