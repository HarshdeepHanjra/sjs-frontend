// import React, { useState, useEffect } from 'react';
// import { 
//   FaSpinner, 
//   FaCheckCircle, 
//   FaTimesCircle, 
//   FaCertificate, 
//   FaShare, 
//   FaTrash, 
//   FaEye, 
//   FaDownload,
//   FaPlus,
//   FaCopy,
//   FaRedo,
//   FaFilter,
//   FaSearch,
//   FaFilePdf,
//   FaQrcode
// } from 'react-icons/fa';
// import api from '../services/api';
// import toast from 'react-hot-toast';

// const AdminCertificates = () => {
//   const [certificates, setCertificates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [students, setStudents] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [showGenerateModal, setShowGenerateModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedCertificate, setSelectedCertificate] = useState(null);
//   const [selectedStudent, setSelectedStudent] = useState('');
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [score, setScore] = useState(100);
//   const [generating, setGenerating] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [courseFilter, setCourseFilter] = useState('all');
//   const [stats, setStats] = useState({ total: 0, active: 0, revoked: 0 });

//   useEffect(() => {
//     fetchCertificates();
//     fetchStudents();
//     fetchCourses();
//   }, []);

//   const fetchCertificates = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const config = { headers: { Authorization: `Bearer ${token}` } };
//       const response = await api.get('/admin/certificates', config);
//       if (response.data.success) {
//         setCertificates(response.data.certificates);
//         calculateStats(response.data.certificates);
//       }
//     } catch (error) {
//       console.error('Failed to fetch certificates:', error);
//       toast.error('Failed to load certificates');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = (certs) => {
//     setStats({
//       total: certs.length,
//       active: certs.filter(c => c.status === 'active').length,
//       revoked: certs.filter(c => c.status === 'revoked').length
//     });
//   };

//   const fetchStudents = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const config = { headers: { Authorization: `Bearer ${token}` } };
//       const response = await api.get('/admin/students', config);
//       if (response.data.success) {
//         setStudents(response.data.students);
//       }
//     } catch (error) {
//       console.error('Failed to fetch students:', error);
//     }
//   };

//   const fetchCourses = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const config = { headers: { Authorization: `Bearer ${token}` } };
//       const response = await api.get('/admin/courses', config);
//       if (response.data.success) {
//         setCourses(response.data.courses);
//       }
//     } catch (error) {
//       console.error('Failed to fetch courses:', error);
//     }
//   };

//   const handleGenerateCertificate = async () => {
//     if (!selectedStudent || !selectedCourse) {
//       toast.error('Please select student and course');
//       return;
//     }

//     setGenerating(true);
//     try {
//       const token = localStorage.getItem('token');
//       const config = { headers: { Authorization: `Bearer ${token}` } };
//       const response = await api.post('/certificates/generate', {
//         student_id: parseInt(selectedStudent),
//         course_id: parseInt(selectedCourse),
//         score: score
//       }, config);

//       if (response.data.success) {
//         toast.success('Certificate generated successfully!');
//         setShowGenerateModal(false);
//         fetchCertificates();
//         setSelectedStudent('');
//         setSelectedCourse('');
//         setScore(100);
        
//         // Dispatch event for real-time update
//         window.dispatchEvent(new CustomEvent('certificateGenerated'));
//       }
//     } catch (error) {
//       console.error('Failed to generate certificate:', error);
//       toast.error(error.response?.data?.error || 'Failed to generate certificate');
//     } finally {
//       setGenerating(false);
//     }
//   };

//   const handleRevokeCertificate = async (certificate) => {
//     if (window.confirm(`Are you sure you want to revoke certificate for ${certificate.student_name}?`)) {
//       try {
//         const token = localStorage.getItem('token');
//         const config = { headers: { Authorization: `Bearer ${token}` } };
//         const response = await api.post(`/admin/certificates/${certificate.id}/revoke`, {}, config);
//         if (response.data.success) {
//           toast.success('Certificate revoked successfully');
//           fetchCertificates();
          
//           // Dispatch event for real-time update
//           window.dispatchEvent(new CustomEvent('certificateRevoked'));
//         }
//       } catch (error) {
//         console.error('Failed to revoke certificate:', error);
//         toast.error('Failed to revoke certificate');
//       }
//     }
//   };

//   const handleCopyVerificationLink = (certificate) => {
//     const verificationUrl = `${window.location.origin}/verify-certificate?token=${certificate.verification_token}`;
//     navigator.clipboard.writeText(verificationUrl);
//     toast.success('Verification link copied to clipboard!');
//   };

//   const handleDownloadCertificate = async (certificate) => {
//     try {
//       const token = localStorage.getItem('token');
//       const config = { headers: { Authorization: `Bearer ${token}` } };
//       const response = await api.get(`/certificates/download/${certificate.certificate_id}`, config);
      
//       // If PDF is available, download it
//       if (response.data.pdf_url) {
//         window.open(response.data.pdf_url, '_blank');
//       } else {
//         toast.info('PDF download will be available soon');
//       }
//     } catch (error) {
//       console.error('Failed to download certificate:', error);
//       toast.error('Failed to download certificate');
//     }
//   };

//   const handleViewDetails = (certificate) => {
//     setSelectedCertificate(certificate);
//     setShowViewModal(true);
//   };

//   const getStatusBadge = (status) => {
//     if (status === 'active') {
//       return (
//         <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 flex items-center gap-1 w-fit">
//           <FaCheckCircle size={10} /> Active
//         </span>
//       );
//     } else {
//       return (
//         <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1 w-fit">
//           <FaTimesCircle size={10} /> Revoked
//         </span>
//       );
//     }
//   };

//   // Filter certificates based on search and filters
//   const filteredCertificates = certificates.filter(cert => {
//     const matchesSearch = 
//       cert.certificate_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       cert.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       cert.course_name.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
//     const matchesCourse = courseFilter === 'all' || cert.course_id.toString() === courseFilter;
    
//     return matchesSearch && matchesStatus && matchesCourse;
//   });

//   // Get unique courses for filter dropdown
//   const uniqueCourses = [...new Map(certificates.map(cert => [cert.course_id, cert.course_name])).entries()];

//   if (loading) {
//     return (
//       <div className="flex justify-center py-12">
//         <FaSpinner className="animate-spin text-4xl text-primary-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Certificate Management</h2>
//           <p className="text-gray-600 mt-1">Manage and issue certificates to students</p>
//         </div>
//         <button
//           onClick={() => setShowGenerateModal(true)}
//           className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
//         >
//           <FaPlus /> Generate Certificate
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Total Certificates</p>
//               <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
//             </div>
//             <FaCertificate className="text-2xl text-primary-600" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Active</p>
//               <p className="text-2xl font-bold text-green-600">{stats.active}</p>
//             </div>
//             <FaCheckCircle className="text-2xl text-green-500" />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Revoked</p>
//               <p className="text-2xl font-bold text-red-600">{stats.revoked}</p>
//             </div>
//             <FaTimesCircle className="text-2xl text-red-500" />
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow mb-6 p-4">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="relative">
//             <FaSearch className="absolute left-3 top-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by ID, student, course..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//             />
//           </div>
//           <div>
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="revoked">Revoked</option>
//             </select>
//           </div>
//           <div>
//             <select
//               value={courseFilter}
//               onChange={(e) => setCourseFilter(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//             >
//               <option value="all">All Courses</option>
//               {uniqueCourses.map(([id, name]) => (
//                 <option key={id} value={id}>{name}</option>
//               ))}
//             </select>
//           </div>
//           <button
//             onClick={fetchCertificates}
//             className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
//           >
//             <FaRedo /> Refresh
//           </button>
//         </div>
//       </div>

//       {/* Certificates Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificate ID</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredCertificates.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
//                     No certificates found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredCertificates.map((cert) => (
//                   <tr key={cert.id} className="hover:bg-gray-50 transition">
//                     <td className="px-4 py-3">
//                       <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
//                         {cert.certificate_id}
//                       </code>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div>
//                         <p className="font-medium text-gray-900">{cert.student_name}</p>
//                         <p className="text-xs text-gray-500">{cert.student_email}</p>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-sm">{cert.course_name}</td>
//                     <td className="px-4 py-3 text-sm">
//                       {new Date(cert.issue_date).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className="font-semibold text-primary-600">{cert.score}%</span>
//                     </td>
//                     <td className="px-4 py-3">
//                       {getStatusBadge(cert.status)}
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex gap-2">
//                         {/* View Details */}
//                         <button
//                           onClick={() => handleViewDetails(cert)}
//                           className="text-blue-600 hover:text-blue-800"
//                           title="View Details"
//                         >
//                           <FaEye size={16} />
//                         </button>
                        
//                         {/* Download PDF */}
//                         <button
//                           onClick={() => handleDownloadCertificate(cert)}
//                           className="text-purple-600 hover:text-purple-800"
//                           title="Download PDF"
//                         >
//                           <FaFilePdf size={16} />
//                         </button>
                        
//                         {/* Copy Verification Link */}
//                         <button
//                           onClick={() => handleCopyVerificationLink(cert)}
//                           className="text-green-600 hover:text-green-800"
//                           title="Copy Verification Link"
//                         >
//                           <FaCopy size={16} />
//                         </button>
                        
//                         {/* Revoke (only if active) */}
//                         {cert.status === 'active' && (
//                           <button
//                             onClick={() => handleRevokeCertificate(cert)}
//                             className="text-red-600 hover:text-red-800"
//                             title="Revoke Certificate"
//                           >
//                             <FaTrash size={16} />
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Generate Certificate Modal */}
//       {showGenerateModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold">Generate Certificate</h3>
//                 <button onClick={() => setShowGenerateModal(false)} className="text-gray-500 hover:text-gray-700">
//                   <FaTimes size={20} />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-gray-700 font-medium mb-1">Select Student *</label>
//                   <select
//                     value={selectedStudent}
//                     onChange={(e) => setSelectedStudent(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   >
//                     <option value="">Select Student</option>
//                     {students.map((student) => (
//                       <option key={student.id} value={student.id}>
//                         {student.name} - {student.email}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-1">Select Course *</label>
//                   <select
//                     value={selectedCourse}
//                     onChange={(e) => setSelectedCourse(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   >
//                     <option value="">Select Course</option>
//                     {courses.map((course) => (
//                       <option key={course.id} value={course.id}>
//                         {course.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-1">Score (%)</label>
//                   <input
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={score}
//                     onChange={(e) => setScore(parseInt(e.target.value))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                   />
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={handleGenerateCertificate}
//                     disabled={generating}
//                     className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
//                   >
//                     {generating ? <FaSpinner className="animate-spin inline" /> : 'Generate'}
//                   </button>
//                   <button
//                     onClick={() => setShowGenerateModal(false)}
//                     className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Certificate Modal */}
//       {showViewModal && selectedCertificate && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold">Certificate Details</h3>
//                 <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
//                   <FaTimes size={20} />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 {/* Certificate Preview */}
//                 <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white text-center rounded-lg">
//                   <h2 className="text-2xl font-bold">CERTIFICATE OF COMPLETION</h2>
//                   <div className="my-4">
//                     <p className="text-lg">This certificate is proudly presented to</p>
//                     <h3 className="text-3xl font-bold mt-2">{selectedCertificate.student_name}</h3>
//                   </div>
//                   <p>for successfully completing</p>
//                   <h4 className="text-xl font-bold mt-2">{selectedCertificate.course_name}</h4>
//                   <div className="mt-4">
//                     <p>Score: <strong>{selectedCertificate.score}%</strong></p>
//                     <p className="text-sm mt-2">Issue Date: {new Date(selectedCertificate.issue_date).toLocaleDateString()}</p>
//                   </div>
//                 </div>

//                 {/* Certificate Info */}
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <h4 className="font-semibold mb-2">Certificate Information</h4>
//                   <div className="space-y-1 text-sm">
//                     <p><strong>Certificate ID:</strong> <code className="text-xs">{selectedCertificate.certificate_id}</code></p>
//                     <p><strong>Student:</strong> {selectedCertificate.student_name} ({selectedCertificate.student_email})</p>
//                     <p><strong>Course:</strong> {selectedCertificate.course_name}</p>
//                     <p><strong>Issue Date:</strong> {new Date(selectedCertificate.issue_date).toLocaleString()}</p>
//                     <p><strong>Score:</strong> {selectedCertificate.score}%</p>
//                     <p><strong>Status:</strong> {selectedCertificate.status}</p>
//                   </div>
//                 </div>

//                 {/* Verification Info */}
//                 <div className="bg-blue-50 rounded-lg p-4">
//                   <h4 className="font-semibold mb-2">Verification Details</h4>
//                   <div className="space-y-2">
//                     <p className="text-sm break-all">
//                       <strong>Verification Link:</strong><br />
//                       <code className="text-xs bg-white p-1 rounded">
//                         {`${window.location.origin}/verify-certificate?token=${selectedCertificate.verification_token}`}
//                       </code>
//                     </p>
//                     <button
//                       onClick={() => handleCopyVerificationLink(selectedCertificate)}
//                       className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
//                     >
//                       <FaCopy size={12} /> Copy Link
//                     </button>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={() => handleDownloadCertificate(selectedCertificate)}
//                     className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
//                   >
//                     <FaFilePdf /> Download PDF
//                   </button>
//                   {selectedCertificate.status === 'active' && (
//                     <button
//                       onClick={() => {
//                         handleRevokeCertificate(selectedCertificate);
//                         setShowViewModal(false);
//                       }}
//                       className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
//                     >
//                       <FaTrash /> Revoke Certificate
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminCertificates;


import React, { useState, useEffect } from 'react';
import { 
  FaSpinner, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaCertificate, 
  FaShare, 
  FaTrash, 
  FaEye, 
  FaDownload,
  FaPlus,
  FaCopy,
  FaRedo,
  FaFilter,
  FaSearch,
  FaFilePdf,
  FaQrcode,
  FaTrashAlt,
  FaTimes
} from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [selectedCertificates, setSelectedCertificates] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [score, setScore] = useState(100);
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [selectAll, setSelectAll] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, revoked: 0 });

  useEffect(() => {
    fetchCertificates();
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get('/admin/certificates', config);
      if (response.data.success) {
        setCertificates(response.data.certificates);
        calculateStats(response.data.certificates);
        setSelectedCertificates([]);
        setSelectAll(false);
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (certs) => {
    setStats({
      total: certs.length,
      active: certs.filter(c => c.status === 'active').length,
      revoked: certs.filter(c => c.status === 'revoked').length
    });
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get('/admin/students', config);
      if (response.data.success) {
        setStudents(response.data.students);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get('/admin/courses', config);
      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const handleGenerateCertificate = async () => {
    if (!selectedStudent || !selectedCourse) {
      toast.error('Please select student and course');
      return;
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.post('/certificates/generate', {
        student_id: parseInt(selectedStudent),
        course_id: parseInt(selectedCourse),
        score: score
      }, config);

      if (response.data.success) {
        toast.success('Certificate generated successfully!');
        setShowGenerateModal(false);
        fetchCertificates();
        setSelectedStudent('');
        setSelectedCourse('');
        setScore(100);
        window.dispatchEvent(new CustomEvent('certificateGenerated'));
      }
    } catch (error) {
      console.error('Failed to generate certificate:', error);
      toast.error(error.response?.data?.error || 'Failed to generate certificate');
    } finally {
      setGenerating(false);
    }
  };

  // REMOVED: handleRevokeCertificate function

  const handleDeleteCertificate = async () => {
    if (!selectedCertificate) return;
    
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.delete(`/admin/certificates/${selectedCertificate.id}`, config);
      
      if (response.data.success) {
        toast.success('Certificate permanently deleted from database!');
        setShowDeleteConfirm(false);
        setSelectedCertificate(null);
        await fetchCertificates();
        window.dispatchEvent(new CustomEvent('certificateDeleted'));
      } else {
        toast.error(response.data.message || 'Failed to delete certificate');
      }
    } catch (error) {
      console.error('Failed to delete certificate:', error);
      toast.error(error.response?.data?.error || 'Failed to delete certificate');
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCertificates.length === 0) {
      toast.error('No certificates selected for deletion');
      return;
    }

    setDeleting(true);
    let successCount = 0;
    let failCount = 0;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      for (const certId of selectedCertificates) {
        try {
          await api.delete(`/admin/certificates/${certId}`, config);
          successCount++;
        } catch (error) {
          console.error(`Failed to delete certificate ${certId}:`, error);
          failCount++;
        }
      }
      
      if (successCount > 0) {
        toast.success(`${successCount} certificate(s) deleted permanently!`);
        if (failCount > 0) {
          toast.warning(`${failCount} certificate(s) failed to delete`);
        }
        await fetchCertificates();
        setSelectedCertificates([]);
        setSelectAll(false);
        window.dispatchEvent(new CustomEvent('certificateDeleted'));
      } else {
        toast.error('Failed to delete certificates');
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Failed to delete certificates');
    } finally {
      setDeleting(false);
      setShowBulkDeleteConfirm(false);
    }
  };

  const handleDeleteAll = async () => {
    if (certificates.length === 0) {
      toast.error('No certificates to delete');
      return;
    }

    setDeleting(true);
    let successCount = 0;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      for (const cert of certificates) {
        try {
          await api.delete(`/admin/certificates/${cert.id}`, config);
          successCount++;
        } catch (error) {
          console.error(`Failed to delete certificate ${cert.id}:`, error);
        }
      }
      
      toast.success(`${successCount} certificate(s) deleted permanently!`);
      await fetchCertificates();
      setSelectedCertificates([]);
      setSelectAll(false);
      window.dispatchEvent(new CustomEvent('certificateDeleted'));
    } catch (error) {
      console.error('Delete all error:', error);
      toast.error('Failed to delete all certificates');
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectCertificate = (certificateId) => {
    setSelectedCertificates(prev => {
      if (prev.includes(certificateId)) {
        return prev.filter(id => id !== certificateId);
      } else {
        return [...prev, certificateId];
      }
    });
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCertificates([]);
    } else {
      setSelectedCertificates(filteredCertificates.map(cert => cert.id));
    }
    setSelectAll(!selectAll);
  };

  const handleCopyVerificationLink = (certificate) => {
    const verificationUrl = `${window.location.origin}/verify-certificate?token=${certificate.verification_token}`;
    navigator.clipboard.writeText(verificationUrl);
    toast.success('Verification link copied to clipboard!');
  };

  const handleDownloadCertificate = async (certificate) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get(`/certificates/download/${certificate.certificate_id}`, config);
      
      if (response.data.pdf_url) {
        window.open(response.data.pdf_url, '_blank');
      } else {
        toast.info('PDF download will be available soon');
      }
    } catch (error) {
      console.error('Failed to download certificate:', error);
      toast.error('Failed to download certificate');
    }
  };

  const handleViewDetails = (certificate) => {
    setSelectedCertificate(certificate);
    setShowViewModal(true);
  };

  const confirmDelete = (certificate) => {
    setSelectedCertificate(certificate);
    setShowDeleteConfirm(true);
  };

  const confirmBulkDelete = () => {
    if (selectedCertificates.length === 0) {
      toast.error('Please select certificates to delete');
      return;
    }
    setShowBulkDeleteConfirm(true);
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 flex items-center gap-1 w-fit">
          <FaCheckCircle size={10} /> Active
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1 w-fit">
          <FaTimesCircle size={10} /> Revoked
        </span>
      );
    }
  };

  // Filter certificates
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = 
      cert.certificate_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.course_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || cert.course_id.toString() === courseFilter;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const uniqueCourses = [...new Map(certificates.map(cert => [cert.course_id, cert.course_name])).entries()];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Certificate Management</h2>
          <p className="text-gray-600 mt-1">Manage and issue certificates to students</p>
        </div>
        <div className="flex gap-3">
          {selectedCertificates.length > 0 && (
            <button
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <FaTrashAlt /> Delete Selected ({selectedCertificates.length})
            </button>
          )}
          {certificates.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('⚠️ WARNING: This will delete ALL certificates permanently! Are you absolutely sure?')) {
                  handleDeleteAll();
                }
              }}
              className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <FaTrash /> Delete All
            </button>
          )}
          <button
            onClick={() => setShowGenerateModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <FaPlus /> Generate Certificate
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Certificates</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <FaCertificate className="text-2xl text-primary-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <FaCheckCircle className="text-2xl text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Revoked</p>
              <p className="text-2xl font-bold text-red-600">{stats.revoked}</p>
            </div>
            <FaTimesCircle className="text-2xl text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, student, course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
          <div>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Courses</option>
              {uniqueCourses.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchCertificates}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <FaRedo /> Refresh
          </button>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={selectAll && filteredCertificates.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificate ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCertificates.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    No certificates found
                  </td>
                </tr>
              ) : (
                filteredCertificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedCertificates.includes(cert.id)}
                        onChange={() => handleSelectCertificate(cert.id)}
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {cert.certificate_id}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{cert.student_name}</p>
                        <p className="text-xs text-gray-500">{cert.student_email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{cert.course_name}</td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(cert.issue_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-primary-600">{cert.score}%</span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(cert.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {/* View Details */}
                        <button
                          onClick={() => handleViewDetails(cert)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <FaEye size={16} />
                        </button>
                        
                        {/* Download PDF */}
                        <button
                          onClick={() => handleDownloadCertificate(cert)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Download PDF"
                        >
                          <FaFilePdf size={16} />
                        </button>
                        
                        {/* Copy Verification Link */}
                        <button
                          onClick={() => handleCopyVerificationLink(cert)}
                          className="text-green-600 hover:text-green-800"
                          title="Copy Verification Link"
                        >
                          <FaCopy size={16} />
                        </button>
                        
                        {/* Delete - Permanently remove from database (for both active and revoked) */}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Certificate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Generate Certificate</h3>
                <button onClick={() => setShowGenerateModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Select Student *</label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  <label className="block text-gray-700 font-medium mb-1">Select Course *</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  <label className="block text-gray-700 font-medium mb-1">Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleGenerateCertificate}
                    disabled={generating}
                    className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {generating ? <FaSpinner className="animate-spin inline" /> : 'Generate'}
                  </button>
                  <button
                    onClick={() => setShowGenerateModal(false)}
                    className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Single Delete Confirmation Modal */}
      {showDeleteConfirm && selectedCertificate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTrashAlt className="text-2xl text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Certificate</h3>
                <p className="text-gray-600">Are you sure you want to permanently delete this certificate?</p>
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Certificate ID:</strong> {selectedCertificate.certificate_id}<br/>
                    <strong>Student:</strong> {selectedCertificate.student_name}<br/>
                    <strong>Course:</strong> {selectedCertificate.course_name}
                  </p>
                </div>
                <p className="text-xs text-red-500 mt-3">⚠️ This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCertificate}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {deleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                  {deleting ? 'Deleting...' : 'Delete Permanently'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedCertificate(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTrashAlt className="text-2xl text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Selected Certificates</h3>
                <p className="text-gray-600">Are you sure you want to permanently delete <strong>{selectedCertificates.length}</strong> certificate(s)?</p>
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Certificates to delete:</strong> {selectedCertificates.length}
                  </p>
                </div>
                <p className="text-xs text-red-500 mt-3">⚠️ This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleBulkDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {deleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                  {deleting ? 'Deleting...' : 'Delete All Selected'}
                </button>
                <button
                  onClick={() => {
                    setShowBulkDeleteConfirm(false);
                  }}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Certificate Modal */}
      {showViewModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Certificate Details</h3>
                <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Certificate Preview */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white text-center rounded-lg">
                  <h2 className="text-2xl font-bold">CERTIFICATE OF COMPLETION</h2>
                  <div className="my-4">
                    <p className="text-lg">This certificate is proudly presented to</p>
                    <h3 className="text-3xl font-bold mt-2">{selectedCertificate.student_name}</h3>
                  </div>
                  <p>for successfully completing</p>
                  <h4 className="text-xl font-bold mt-2">{selectedCertificate.course_name}</h4>
                  <div className="mt-4">
                    <p>Score: <strong>{selectedCertificate.score}%</strong></p>
                    <p className="text-sm mt-2">Issue Date: {new Date(selectedCertificate.issue_date).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Certificate Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Certificate Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Certificate ID:</strong> <code className="text-xs">{selectedCertificate.certificate_id}</code></p>
                    <p><strong>Student:</strong> {selectedCertificate.student_name} ({selectedCertificate.student_email})</p>
                    <p><strong>Course:</strong> {selectedCertificate.course_name}</p>
                    <p><strong>Issue Date:</strong> {new Date(selectedCertificate.issue_date).toLocaleString()}</p>
                    <p><strong>Score:</strong> {selectedCertificate.score}%</p>
                    <p><strong>Status:</strong> {selectedCertificate.status}</p>
                  </div>
                </div>

                {/* Verification Info */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Verification Details</h4>
                  <div className="space-y-2">
                    <p className="text-sm break-all">
                      <strong>Verification Link:</strong><br />
                      <code className="text-xs bg-white p-1 rounded">
                        {`${window.location.origin}/verify-certificate?token=${selectedCertificate.verification_token}`}
                      </code>
                    </p>
                    <button
                      onClick={() => handleCopyVerificationLink(selectedCertificate)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                    >
                      <FaCopy size={12} /> Copy Link
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleDownloadCertificate(selectedCertificate)}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                  >
                    <FaFilePdf /> Download PDF
                  </button>
                  <button
                    onClick={() => handleDeleteCertificate(selectedCertificate)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <FaTrashAlt /> Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCertificates;