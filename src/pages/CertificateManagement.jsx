import React, { useState, useEffect } from 'react';
import { FaSpinner, FaDownload, FaEye, FaRedo, FaCheckCircle, FaTimesCircle, FaQrcode, FaShare, FaTrashAlt, FaPlus } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const CertificateManagement = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [score, setScore] = useState(100);
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedCertificates, setSelectedCertificates] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCertificates();
    fetchStudents();
    fetchCourses();
  }, []);

  // ✅ FIXED: Added /api/ prefix
  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get('/api/admin/certificates', config);
      if (response.data.success) {
        setCertificates(response.data.certificates);
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

  // ✅ FIXED: Added /api/ prefix
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get('/api/admin/students', config);
      if (response.data.success) {
        setStudents(response.data.students);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  // ✅ FIXED: Added /api/ prefix
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get('/api/admin/courses', config);
      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  // ✅ FIXED: Added /api/ prefix
  const handleGenerateCertificate = async () => {
    if (!selectedStudent || !selectedCourse) {
      toast.error('Please select student and course');
      return;
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.post('/api/certificates/generate', {
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
      }
    } catch (error) {
      console.error('Failed to generate certificate:', error);
      toast.error(error.response?.data?.error || 'Failed to generate certificate');
    } finally {
      setGenerating(false);
    }
  };

  // ✅ FIXED: Added /api/ prefix
  const handleDeleteCertificate = async () => {
    if (!selectedCertificate) return;
    
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.delete(`/api/admin/certificates/${selectedCertificate.id}`, config);
      
      if (response.data.success) {
        toast.success('Certificate permanently deleted from database!');
        setShowDeleteConfirm(false);
        setSelectedCertificate(null);
        await fetchCertificates();
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

  // ✅ FIXED: Added /api/ prefix
  const handleDownloadPDF = async (certificateId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get(`/api/certificates/download/${certificateId}`, config);
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

  const handleShare = (certificate) => {
    const verificationUrl = `${window.location.origin}/verify-certificate?token=${certificate.verification_token}`;
    navigator.clipboard.writeText(verificationUrl);
    toast.success('Verification link copied to clipboard!');
  };

  const confirmDelete = (certificate) => {
    setSelectedCertificate(certificate);
    setShowDeleteConfirm(true);
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

  // ✅ FIXED: Added /api/ prefix for bulk delete
  const handleBulkDelete = async () => {
    if (selectedCertificates.length === 0) {
      toast.error('No certificates selected for deletion');
      return;
    }

    if (window.confirm(`Are you sure you want to permanently delete ${selectedCertificates.length} certificate(s)? This action cannot be undone!`)) {
      setDeleting(true);
      let successCount = 0;

      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        for (const certId of selectedCertificates) {
          try {
            await api.delete(`/api/admin/certificates/${certId}`, config);
            successCount++;
          } catch (error) {
            console.error(`Failed to delete certificate ${certId}:`, error);
          }
        }
        
        toast.success(`${successCount} certificate(s) deleted permanently!`);
        await fetchCertificates();
        setSelectedCertificates([]);
        setSelectAll(false);
      } catch (error) {
        console.error('Bulk delete error:', error);
        toast.error('Failed to delete certificates');
      } finally {
        setDeleting(false);
      }
    }
  };

  // ✅ FIXED: Added /api/ prefix for delete all
  const handleDeleteAll = async () => {
    if (certificates.length === 0) {
      toast.error('No certificates to delete');
      return;
    }

    if (window.confirm(`⚠️ WARNING: This will delete ALL ${certificates.length} certificates permanently! Are you absolutely sure?`)) {
      setDeleting(true);
      let successCount = 0;

      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        for (const cert of certificates) {
          try {
            await api.delete(`/api/admin/certificates/${cert.id}`, config);
            successCount++;
          } catch (error) {
            console.error(`Failed to delete certificate ${cert.id}:`, error);
          }
        }
        
        toast.success(`${successCount} certificate(s) deleted permanently!`);
        await fetchCertificates();
        setSelectedCertificates([]);
        setSelectAll(false);
      } catch (error) {
        console.error('Delete all error:', error);
        toast.error('Failed to delete all certificates');
      } finally {
        setDeleting(false);
      }
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
          Active
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
          Revoked
        </span>
      );
    }
  };

  // Filter certificates with null safety
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = 
      (cert.certificate_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cert.student_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cert.student_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cert.course_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Certificate Management</h1>
              <p className="text-gray-600 mt-1">Manage and issue certificates to students</p>
            </div>
            <div className="flex gap-3">
              {certificates.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  disabled={deleting}
                  className="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded-lg transition flex items-center gap-2"
                >
                  <FaTrashAlt /> Delete All
                </button>
              )}
              <button
                onClick={() => setShowGenerateModal(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition flex items-center gap-2"
              >
                <FaPlus /> Generate New Certificate
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by ID, student, course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <svg className="absolute left-3 top-3 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
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
              <button
                onClick={fetchCertificates}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <FaRedo /> Refresh
              </button>
            </div>
          </div>

          {/* Bulk Delete Button */}
          {selectedCertificates.length > 0 && (
            <div className="mb-4 flex justify-end">
              <button
                onClick={handleBulkDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <FaTrashAlt /> Delete Selected ({selectedCertificates.length})
              </button>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Certificates</p>
                  <p className="text-3xl font-bold text-gray-800">{filteredCertificates.length}</p>
                </div>
                <FaCheckCircle className="text-3xl text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Certificates</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {filteredCertificates.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <FaCheckCircle className="text-3xl text-primary-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Revoked Certificates</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {filteredCertificates.filter(c => c.status === 'revoked').length}
                  </p>
                </div>
                <FaTimesCircle className="text-3xl text-red-500" />
              </div>
            </div>
          </div>

          {/* Certificates Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectAll && filteredCertificates.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificate ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCertificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCertificates.includes(cert.id)}
                          onChange={() => handleSelectCertificate(cert.id)}
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-mono">{cert.certificate_id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{cert.student_name}</p>
                          <p className="text-xs text-gray-500">{cert.student_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{cert.course_name}</td>
                      <td className="px-6 py-4 text-sm">{new Date(cert.issue_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm font-semibold">{cert.score}%</td>
                      <td className="px-6 py-4">
                        {getStatusBadge(cert.status)}
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownloadPDF(cert.certificate_id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Download PDF"
                          >
                            <FaDownload size={18} />
                          </button>
                          <button
                            onClick={() => handleShare(cert)}
                            className="text-green-600 hover:text-green-800"
                            title="Share Verification Link"
                          >
                            <FaShare size={18} />
                          </button>
                          <button
                            onClick={() => confirmDelete(cert)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Certificate"
                          >
                            <FaTrashAlt size={18} />
                          </button>
                        </div>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredCertificates.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <FaTimesCircle className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No certificates found</p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Certificate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Generate Certificate</h3>
                <button onClick={() => setShowGenerateModal(false)} className="text-gray-500 hover:text-gray-700">
                  <span className="text-2xl">&times;</span>
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
                    {generating ? <FaSpinner className="animate-spin inline" /> : 'Generate Certificate'}
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

      {/* Delete Confirmation Modal */}
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
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  {deleting ? <FaSpinner className="animate-spin" /> : <FaTrashAlt />}
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
    </div>
  );
};

export default CertificateManagement;