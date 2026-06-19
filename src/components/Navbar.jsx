// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { 
//   FaUser, FaShoppingCart, FaBars, FaTimes, FaUserCircle, 
//   FaBook, FaHome, FaSignOutAlt, FaTachometerAlt, FaCertificate, 
//   FaSearch, FaQrcode, FaSpinner, FaBriefcase, FaInfoCircle, 
//   FaEnvelope, FaCheckCircle, FaGraduationCap, FaLaptopCode,
//   FaChartLine, FaUsers, FaAward, FaGlobe, FaDownload, FaPrint, 
//   FaCopy, FaWhatsapp, FaLinkedin, FaEye, FaEyeSlash, FaShieldAlt,
//   FaCalendarAlt, FaArrowLeft, FaSave, FaEdit, FaTimes as FaTimesIcon,
//   FaRedo, FaTrash, FaPlus, FaImage, FaComment, FaCheck
// } from 'react-icons/fa';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/UserContext';
// import api from '../services/api';
// import toast from 'react-hot-toast';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { cartItems } = useCart();
//   const { user, isAuthenticated, logout } = useAuth();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [userType, setUserType] = useState(null);
//   const [showVerifyModal, setShowVerifyModal] = useState(false);
//   const [verificationToken, setVerificationToken] = useState('');
//   const [verifying, setVerifying] = useState(false);
//   const [verifiedCertificate, setVerifiedCertificate] = useState(null);
//   const [verificationError, setVerificationError] = useState('');
//   const [scrolled, setScrolled] = useState(false);

//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     const getUserTypeFromSession = () => {
//       return localStorage.getItem('userType');
//     };
    
//     const type = getUserTypeFromSession();
//     setUserType(type);
//   }, [isAuthenticated, user]);

//   const cartItemCount = cartItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

//   const handleLogout = () => {
//     logout();
//     toast.success('Logged out successfully');
//     navigate('/');
//     setIsProfileOpen(false);
//   };

//   // ✅ FIXED: Add /api/ prefix to the verification endpoint
//   const handleVerifyCertificate = async () => {
//     if (!verificationToken.trim()) {
//       toast.error('Please enter a verification token or link');
//       return;
//     }

//     let token = verificationToken.trim();
//     if (token.includes('verify-certificate?token=')) {
//       token = token.split('verify-certificate?token=')[1];
//       token = token.split('&')[0];
//     }

//     setVerifying(true);
//     setVerificationError('');
//     setVerifiedCertificate(null);

//     try {
//       const response = await api.get(`/api/certificates/verify?token=${token}`);
      
//       if (response.data.valid) {
//         setVerifiedCertificate(response.data.certificate);
//         toast.success('Certificate verified successfully!');
//       } else {
//         setVerificationError(response.data.message || 'Invalid certificate');
//         toast.error('Certificate not found');
//       }
//     } catch (error) {
//       console.error('Verification error:', error);
//       if (error.response?.status === 404) {
//         setVerificationError('Certificate not found. Please check the link.');
//       } else if (error.response?.status === 400) {
//         setVerificationError(error.response.data.message || 'Certificate has been revoked');
//       } else {
//         setVerificationError('Unable to verify certificate. Please try again.');
//       }
//       toast.error('Verification failed');
//     } finally {
//       setVerifying(false);
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
//               <h1>SJS GLOBAL TECH</h1>
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

//   const handlePrintCertificate = () => {
//     if (!verifiedCertificate) return;
//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(getCertificateHTML(verifiedCertificate));
//     printWindow.document.close();
//     printWindow.print();
//   };

//   const handleDownloadCertificate = () => {
//     if (!verifiedCertificate) return;
//     const htmlContent = getCertificateHTML(verifiedCertificate);
//     const blob = new Blob([htmlContent], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `certificate_${verifiedCertificate.certificate_id}.html`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//     toast.success('Certificate downloaded!');
//   };

//   // Public Navigation Links (visible to everyone)
//   const publicNavLinks = [
//     { path: '/', name: 'Home', icon: <FaHome className="mr-2" /> },
//     { path: '/courses', name: 'Courses', icon: <FaBook className="mr-2" /> },
//     { path: '/internship', name: 'Internship', icon: <FaBriefcase className="mr-2" /> },
//     { path: '/about', name: 'About', icon: <FaInfoCircle className="mr-2" /> },
//     { path: '/contact', name: 'Contact', icon: <FaEnvelope className="mr-2" /> },
//   ];

//   const navLinks = publicNavLinks;

//   return (
//     <>
//       <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
//         scrolled ? 'bg-white shadow-md py-2' : 'bg-white shadow-sm py-3'
//       }`}>
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center">
//             {/* Logo */}
//             <Link to="/" className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
//                 <FaGraduationCap className="text-white text-sm" />
//               </div>
//               <div className="flex flex-col leading-tight">
//                 <span className="text-lg font-bold text-gray-800">SJS</span>
//                 <span className="text-xs text-gray-500 -mt-1">Global Tech</span>
//               </div>
//             </Link>

//             {/* Desktop Navigation - Only Public Links */}
//             <div className="hidden md:flex items-center space-x-1">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className={`px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center text-sm ${
//                     location.pathname === link.path
//                       ? 'text-primary-600 bg-primary-50'
//                       : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   {link.icon}
//                   <span>{link.name}</span>
//                 </Link>
//               ))}
//             </div>

//             {/* Right side */}
//             <div className="flex items-center space-x-3">
//               {/* Verify Certificate Button */}
//               <button
//                 onClick={() => setShowVerifyModal(true)}
//                 className="hidden sm:flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition text-sm"
//               >
//                 <FaCertificate size={12} /> Verify
//               </button>

//               {/* Cart Icon - Only for students */}
//               {userType === 'student' && (
//                 <Link to="/cart" className="relative">
//                   <div className="p-1.5 rounded-full hover:bg-gray-100 transition">
//                     <FaShoppingCart className="text-gray-600 text-lg" />
//                   </div>
//                   {cartItemCount > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                       {cartItemCount}
//                     </span>
//                   )}
//                 </Link>
//               )}

//               {/* Profile Dropdown */}
//               {isAuthenticated && user ? (
//                 <div className="relative">
//                   <button
//                     onClick={() => setIsProfileOpen(!isProfileOpen)}
//                     className="flex items-center space-x-2 focus:outline-none"
//                   >
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center">
//                       <FaUserCircle className="text-white text-lg" />
//                     </div>
//                     <span className="text-gray-700 text-sm hidden lg:inline">
//                       {user.name?.split(' ')[0] || 'User'}
//                     </span>
//                   </button>

//                   {isProfileOpen && (
//                     <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
//                       <div className="px-4 py-2 border-b">
//                         <p className="text-sm font-semibold text-gray-800">{user.name}</p>
//                         <p className="text-xs text-gray-500 truncate">{user.email}</p>
//                         <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 capitalize">
//                           {userType}
//                         </span>
//                       </div>
                      
//                       {/* Dashboard Links - Only in Dropdown */}
//                       {userType === 'student' && (
//                         <>
//                           <Link
//                             to="/dashboard"
//                             className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
//                             onClick={() => setIsProfileOpen(false)}
//                           >
//                             <FaTachometerAlt className="mr-3 text-gray-400 text-sm" /> Dashboard
//                           </Link>
//                           <Link
//                             to="/my-courses"
//                             className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
//                             onClick={() => setIsProfileOpen(false)}
//                           >
//                             <FaBook className="mr-3 text-gray-400 text-sm" /> My Courses
//                           </Link>
//                           <Link
//                             to="/my-internships"
//                             className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
//                             onClick={() => setIsProfileOpen(false)}
//                           >
//                             <FaBriefcase className="mr-3 text-gray-400 text-sm" /> My Internships
//                           </Link>
//                           <Link
//                             to="/my-certificates"
//                             className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
//                             onClick={() => setIsProfileOpen(false)}
//                           >
//                             <FaCertificate className="mr-3 text-gray-400 text-sm" /> My Certificates
//                           </Link>
//                         </>
//                       )}
                      
//                       {userType === 'admin' && (
//                         <Link
//                           to="/admin"
//                           className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
//                           onClick={() => setIsProfileOpen(false)}
//                         >
//                           <FaTachometerAlt className="mr-3 text-gray-400 text-sm" /> Admin Panel
//                         </Link>
//                       )}
                      
//                       <Link
//                         to="/profile"
//                         className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
//                         onClick={() => setIsProfileOpen(false)}
//                       >
//                         <FaUser className="mr-3 text-gray-400 text-sm" /> My Profile
//                       </Link>
                      
//                       <div className="border-t my-1"></div>
                      
//                       <button
//                         onClick={handleLogout}
//                         className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
//                       >
//                         <FaSignOutAlt className="mr-3 text-sm" /> Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <Link
//                   to="/login"
//                   className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 rounded-lg transition text-sm"
//                 >
//                   Login
//                 </Link>
//               )}

//               {/* Mobile Menu Button */}
//               <button
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition"
//               >
//                 {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
//               </button>
//             </div>
//           </div>

//           {/* Mobile Navigation */}
//           {isMenuOpen && (
//             <div className="md:hidden mt-3 pb-3 border-t">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className={`flex items-center py-2 px-2 rounded-lg transition ${
//                     location.pathname === link.path
//                       ? 'text-primary-600 bg-primary-50'
//                       : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
//                   }`}
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {link.icon}
//                   <span className="text-sm">{link.name}</span>
//                 </Link>
//               ))}
              
//               {/* Mobile Dashboard Links */}
//               {isAuthenticated && userType === 'student' && (
//                 <div className="border-t mt-2 pt-2">
//                   <p className="text-xs text-gray-500 px-2 py-1">Account</p>
//                   <Link
//                     to="/dashboard"
//                     className="flex items-center py-2 px-2 rounded-lg text-gray-600 hover:bg-gray-50"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     <FaTachometerAlt className="mr-3 text-gray-400 text-sm" /> Dashboard
//                   </Link>
//                   <Link
//                     to="/my-courses"
//                     className="flex items-center py-2 px-2 rounded-lg text-gray-600 hover:bg-gray-50"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     <FaBook className="mr-3 text-gray-400 text-sm" /> My Courses
//                   </Link>
//                   <Link
//                     to="/my-internships"
//                     className="flex items-center py-2 px-2 rounded-lg text-gray-600 hover:bg-gray-50"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     <FaBriefcase className="mr-3 text-gray-400 text-sm" /> My Internships
//                   </Link>
//                   <Link
//                     to="/my-certificates"
//                     className="flex items-center py-2 px-2 rounded-lg text-gray-600 hover:bg-gray-50"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     <FaCertificate className="mr-3 text-gray-400 text-sm" /> My Certificates
//                   </Link>
//                 </div>
//               )}
              
//               {/* Mobile Verify Button */}
//               <button
//                 onClick={() => {
//                   setShowVerifyModal(true);
//                   setIsMenuOpen(false);
//                 }}
//                 className="w-full mt-2 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg text-sm"
//               >
//                 <FaCertificate size={12} /> Verify Certificate
//               </button>
              
//               {!isAuthenticated && (
//                 <Link
//                   to="/login"
//                   className="block mt-2 bg-primary-600 text-white py-2 rounded-lg text-center text-sm"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Login / Register
//                 </Link>
//               )}
//             </div>
//           )}
//         </div>
//       </nav>

//       {/* Verify Certificate Modal */}
//       {showVerifyModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
//           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
//                     <FaCertificate className="text-white text-2xl" />
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-800">Verify Certificate</h2>
//                     <p className="text-sm text-gray-500">Check the authenticity of any certificate</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowVerifyModal(false);
//                     setVerifiedCertificate(null);
//                     setVerificationToken('');
//                     setVerificationError('');
//                   }}
//                   className="text-gray-400 hover:text-gray-600 transition"
//                 >
//                   <FaTimesIcon size={24} />
//                 </button>
//               </div>

//               {!verifiedCertificate && (
//                 <div className="space-y-4">
//                   <div className="flex gap-3">
//                     <input
//                       type="text"
//                       value={verificationToken}
//                       onChange={(e) => setVerificationToken(e.target.value)}
//                       placeholder="Enter verification token or paste full link"
//                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition text-sm"
//                       onKeyPress={(e) => e.key === 'Enter' && handleVerifyCertificate()}
//                     />
//                     <button
//                       onClick={handleVerifyCertificate}
//                       disabled={verifying}
//                       className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2 transition text-sm"
//                     >
//                       {verifying ? <FaSpinner className="animate-spin" /> : <FaSearch />}
//                       Verify
//                     </button>
//                   </div>
                  
//                   {verificationError && (
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                       <p className="text-red-600 text-sm">{verificationError}</p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Verified Certificate Display */}
//               {verifiedCertificate && (
//                 <div className="space-y-4">
//                   <div className="bg-green-50 border border-green-200 rounded-lg p-3">
//                     <p className="text-green-700 text-sm flex items-center gap-2">
//                       <FaCheckCircle /> Certificate verified successfully!
//                     </p>
//                   </div>
                  
//                   <div className="border rounded-lg overflow-hidden">
//                     <div 
//                       dangerouslySetInnerHTML={{ __html: getCertificateHTML(verifiedCertificate) }}
//                       className="bg-white"
//                     />
//                   </div>
                  
//                   <div className="flex gap-3">
//                     <button
//                       onClick={handleDownloadCertificate}
//                       className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2 transition text-sm"
//                     >
//                       <FaDownload /> Download
//                     </button>
//                     <button
//                       onClick={handlePrintCertificate}
//                       className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 transition text-sm"
//                     >
//                       <FaPrint /> Print
//                     </button>
//                     <button
//                       onClick={() => {
//                         setVerifiedCertificate(null);
//                         setVerificationToken('');
//                       }}
//                       className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
//                     >
//                       Verify Another
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaUser, FaShoppingCart, FaBars, FaTimes, FaUserCircle, 
  FaBook, FaHome, FaSignOutAlt, FaTachometerAlt, FaCertificate, 
  FaSearch, FaQrcode, FaSpinner, FaBriefcase, FaInfoCircle, 
  FaEnvelope, FaCheckCircle, FaGraduationCap, FaLaptopCode,
  FaChartLine, FaUsers, FaAward, FaGlobe, FaDownload, FaPrint, 
  FaCopy, FaWhatsapp, FaLinkedin, FaEye, FaEyeSlash, FaShieldAlt,
  FaCalendarAlt, FaArrowLeft, FaSave, FaEdit, FaTimes as FaTimesIcon,
  FaRedo, FaTrash, FaPlus, FaImage, FaComment, FaCheck
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/UserContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const { user, isAuthenticated, logout, userType: authUserType } = useAuth(); // Use userType from auth context
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifiedCertificate, setVerifiedCertificate] = useState(null);
  const [verificationError, setVerificationError] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debug: Check userType from auth context
  useEffect(() => {
    console.log('Navbar - isAuthenticated:', isAuthenticated);
    console.log('Navbar - authUserType:', authUserType);
    console.log('Navbar - user:', user);
  }, [isAuthenticated, authUserType, user]);

  const cartItemCount = cartItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setIsProfileOpen(false);
  };

  const handleVerifyCertificate = async () => {
    if (!verificationToken.trim()) {
      toast.error('Please enter a verification token or link');
      return;
    }

    let token = verificationToken.trim();
    if (token.includes('verify-certificate?token=')) {
      token = token.split('verify-certificate?token=')[1];
      token = token.split('&')[0];
    }

    setVerifying(true);
    setVerificationError('');
    setVerifiedCertificate(null);

    try {
      const response = await api.get(`/api/certificates/verify?token=${token}`);
      
      if (response.data.valid) {
        setVerifiedCertificate(response.data.certificate);
        toast.success('Certificate verified successfully!');
      } else {
        setVerificationError(response.data.message || 'Invalid certificate');
        toast.error('Certificate not found');
      }
    } catch (error) {
      console.error('Verification error:', error);
      if (error.response?.status === 404) {
        setVerificationError('Certificate not found. Please check the link.');
      } else if (error.response?.status === 400) {
        setVerificationError(error.response.data.message || 'Certificate has been revoked');
      } else {
        setVerificationError('Unable to verify certificate. Please try again.');
      }
      toast.error('Verification failed');
    } finally {
      setVerifying(false);
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
              <h1>SJS GLOBAL TECH</h1>
              <p>ESTABLISHING EXCELLENCE IN TECHNOLOGY EDUCATION</p>
            </div>
            <div class="certificate-title">
              <h2>CERTIFICATE OF ACHIEVEMENT</h2>
            </div>
            <div class="presented-to">THIS CERTIFICATE IS PROUDLY PRESENTED TO</div>
            <div class="student-name-container">
              <div class="student-name">${certificate.student_name}</div>
            </div>
            <div class="completion-text">
              For successfully completing the course <strong>“${certificate.course_name}”</strong><br>
              with outstanding performance and dedication.
            </div>
            <div class="score-section">
              <span class="score-badge">Score: ${certificate.score}%</span>
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

  const handlePrintCertificate = () => {
    if (!verifiedCertificate) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(getCertificateHTML(verifiedCertificate));
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadCertificate = () => {
    if (!verifiedCertificate) return;
    const htmlContent = getCertificateHTML(verifiedCertificate);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate_${verifiedCertificate.certificate_id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Certificate downloaded!');
  };

  // Public Navigation Links (visible to everyone)
  const publicNavLinks = [
    { path: '/', name: 'Home', icon: <FaHome className="mr-2" /> },
    { path: '/courses', name: 'Courses', icon: <FaBook className="mr-2" /> },
    { path: '/internship', name: 'Internship', icon: <FaBriefcase className="mr-2" /> },
    { path: '/about', name: 'About', icon: <FaInfoCircle className="mr-2" /> },
    { path: '/contact', name: 'Contact', icon: <FaEnvelope className="mr-2" /> },
  ];

  const navLinks = publicNavLinks;

  // Determine user type from auth context (primary) or localStorage (fallback)
  const currentUserType = authUserType || localStorage.getItem('userType');
  
  // Check if user is student
  const isStudent = currentUserType === 'student' && isAuthenticated;
  const isAdmin = currentUserType === 'admin' && isAuthenticated;

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white shadow-sm py-3'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
  <img
    src="/logo.png"
    alt="SJS Global Tech"
    className="h-12 w-auto"
  />
  <div className="flex flex-col leading-tight">
    <span className="text-xl font-bold text-gray-800">
      SJS GLOBAL TECH
    </span>
    <span className="text-xs text-gray-500">
      Empowering Futures Through Technology
    </span>
  </div>
</Link>

            {/* Desktop Navigation - Only Public Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center text-sm ${
                    location.pathname === link.path
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {/* Verify Certificate Button */}
              <button
                onClick={() => setShowVerifyModal(true)}
                className="hidden sm:flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition text-sm"
              >
                <FaCertificate size={12} /> Verify
              </button>

              {/* Cart Icon - Only for students */}
              {isStudent && (
                <Link to="/cart" className="relative">
                  <div className="p-1.5 rounded-full hover:bg-gray-100 transition">
                    <FaShoppingCart className="text-gray-600 text-lg" />
                  </div>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Profile Dropdown */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center">
                      <FaUserCircle className="text-white text-lg" />
                    </div>
                    <span className="text-gray-700 text-sm hidden lg:inline">
                      {user.name?.split(' ')[0] || 'User'}
                    </span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 capitalize">
                          {currentUserType}
                        </span>
                      </div>
                      
                      {/* Dashboard Links for Students */}
                      {isStudent && (
                        <>
                          <Link
                            to="/dashboard"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FaTachometerAlt className="mr-3 text-gray-400 text-sm" /> Dashboard
                          </Link>
                          <Link
                            to="/my-courses"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FaBook className="mr-3 text-gray-400 text-sm" /> My Courses
                          </Link>
                          <Link
                            to="/my-internships"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FaBriefcase className="mr-3 text-gray-400 text-sm" /> My Internships
                          </Link>
                          <Link
                            to="/my-certificates"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FaCertificate className="mr-3 text-gray-400 text-sm" /> My Certificates
                          </Link>
                        </>
                      )}
                      
                      {/* Admin Panel Link */}
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FaTachometerAlt className="mr-3 text-gray-400 text-sm" /> Admin Panel
                        </Link>
                      )}
                      
                      {/* Common Links */}
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FaUser className="mr-3 text-gray-400 text-sm" /> My Profile
                      </Link>
                      
                      <div className="border-t my-1"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <FaSignOutAlt className="mr-3 text-sm" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 rounded-lg transition text-sm"
                >
                  Login
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-3 pb-3 border-t">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center py-2 px-2 rounded-lg transition ${
                    location.pathname === link.path
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  <span className="text-sm">{link.name}</span>
                </Link>
              ))}
              
              {/* Mobile Dashboard Links - Only for Students */}
              {isStudent && (
                <div className="border-t mt-2 pt-2">
                  <p className="text-xs text-gray-500 px-2 py-1">Account</p>
                  <Link
                    to="/dashboard"
                    className="flex items-center py-2 px-2 rounded-lg text-gray-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaTachometerAlt className="mr-3 text-gray-400 text-sm" /> Dashboard
                  </Link>
                  <Link
                    to="/my-courses"
                    className="flex items-center py-2 px-2 rounded-lg text-gray-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaBook className="mr-3 text-gray-400 text-sm" /> My Courses
                  </Link>
                  <Link
                    to="/my-internships"
                    className="flex items-center py-2 px-2 rounded-lg text-gray-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaBriefcase className="mr-3 text-gray-400 text-sm" /> My Internships
                  </Link>
                  <Link
                    to="/my-certificates"
                    className="flex items-center py-2 px-2 rounded-lg text-gray-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaCertificate className="mr-3 text-gray-400 text-sm" /> My Certificates
                  </Link>
                </div>
              )}
              
              {/* Mobile Verify Button */}
              <button
                onClick={() => {
                  setShowVerifyModal(true);
                  setIsMenuOpen(false);
                }}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg text-sm"
              >
                <FaCertificate size={12} /> Verify Certificate
              </button>
              
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="block mt-2 bg-primary-600 text-white py-2 rounded-lg text-center text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login / Register
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Verify Certificate Modal - Same as before */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <FaCertificate className="text-white text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Verify Certificate</h2>
                    <p className="text-sm text-gray-500">Check the authenticity of any certificate</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowVerifyModal(false);
                    setVerifiedCertificate(null);
                    setVerificationToken('');
                    setVerificationError('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <FaTimesIcon size={24} />
                </button>
              </div>

              {!verifiedCertificate && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={verificationToken}
                      onChange={(e) => setVerificationToken(e.target.value)}
                      placeholder="Enter verification token or paste full link"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleVerifyCertificate()}
                    />
                    <button
                      onClick={handleVerifyCertificate}
                      disabled={verifying}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2 transition text-sm"
                    >
                      {verifying ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                      Verify
                    </button>
                  </div>
                  
                  {verificationError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm">{verificationError}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Verified Certificate Display */}
              {verifiedCertificate && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 text-sm flex items-center gap-2">
                      <FaCheckCircle /> Certificate verified successfully!
                    </p>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div 
                      dangerouslySetInnerHTML={{ __html: getCertificateHTML(verifiedCertificate) }}
                      className="bg-white"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleDownloadCertificate}
                      className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2 transition text-sm"
                    >
                      <FaDownload /> Download
                    </button>
                    <button
                      onClick={handlePrintCertificate}
                      className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 transition text-sm"
                    >
                      <FaPrint /> Print
                    </button>
                    <button
                      onClick={() => {
                        setVerifiedCertificate(null);
                        setVerificationToken('');
                      }}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
                    >
                      Verify Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;