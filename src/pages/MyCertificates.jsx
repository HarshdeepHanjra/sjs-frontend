import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSpinner, 
  FaCertificate, 
  FaDownload, 
  FaShare, 
  FaCheckCircle, 
  FaCalendarAlt, 
  FaUser, 
  FaBook, 
  FaStar,
  FaRedo,
  FaEye,
  FaCopy,
  FaWhatsapp,
  FaEnvelope,
  FaLinkedin,
  FaPrint,
  FaQrcode,
  FaMedal
} from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [stats, setStats] = useState({ total: 0, avgScore: 0 });

  useEffect(() => {
    fetchCertificates();
    
    const handleCertificateGenerated = () => {
      fetchCertificates();
    };
    
    window.addEventListener('certificateGenerated', handleCertificateGenerated);
    return () => window.removeEventListener('certificateGenerated', handleCertificateGenerated);
  }, []);

  // ✅ FIXED: Added /api/ prefix
  const fetchCertificates = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view your certificates');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get('/api/certificates/my-certificates', config);
      
      console.log("My certificates response:", response.data);
      
      if (response.data.success) {
        const certs = response.data.certificates || [];
        setCertificates(certs);
        
        const avgScore = certs.length > 0 
          ? certs.reduce((sum, c) => sum + (c.score || 0), 0) / certs.length 
          : 0;
        
        setStats({
          total: certs.length,
          avgScore: Math.round(avgScore)
        });
        
        if (!silent && certs.length > 0) {
          toast.success(`Loaded ${certs.length} certificates`);
        }
      } else {
        setCertificates([]);
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      if (!silent) {
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
        } else {
          toast.error('Failed to load certificates');
        }
      }
      setCertificates([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDownload = async (certificate) => {
    try {
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
    } catch (error) {
      console.error('Failed to download certificate:', error);
      toast.error('Failed to download certificate');
    }
  };

  const handlePrint = (certificate) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(getCertificateHTML(certificate));
    printWindow.document.close();
    printWindow.print();
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
          @page {
            size: landscape;
            margin: 0;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 40px;
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
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            position: relative;
          }
          .certificate-inner {
            padding: 50px;
            position: relative;
          }
          .sjs-logo {
            text-align: center;
            margin-bottom: 10px;
          }
          .sjs-logo h1 {
            font-size: 36px;
            color: #1a3a5c;
            letter-spacing: 8px;
            margin: 0;
            font-family: 'Georgia', serif;
          }
          .sjs-logo p {
            font-size: 11px;
            color: #888;
            letter-spacing: 3px;
            margin-top: 5px;
          }
          .academy-name {
            text-align: center;
            margin-bottom: 30px;
          }
          .academy-name h2 {
            font-size: 18px;
            color: #1a3a5c;
            letter-spacing: 2px;
            font-weight: normal;
          }
          .certificate-title {
            text-align: center;
            margin: 30px 0;
          }
          .certificate-title h3 {
            font-size: 32px;
            color: #c9a03d;
            letter-spacing: 3px;
            font-family: 'Georgia', serif;
          }
          .presented-to {
            text-align: center;
            margin: 30px 0 10px;
            font-size: 16px;
            color: #555;
          }
          .student-name {
            text-align: center;
            font-size: 48px;
            color: #1a3a5c;
            margin: 15px 0;
            font-weight: bold;
            font-family: 'Georgia', serif;
          }
          .completion-text {
            text-align: center;
            font-size: 16px;
            color: #444;
            margin: 25px 0;
            line-height: 1.6;
          }
          .score-section {
            text-align: center;
            margin: 20px 0;
          }
          .score {
            font-size: 24px;
            font-weight: bold;
            color: #c9a03d;
          }
          .wish-text {
            text-align: center;
            font-size: 14px;
            color: #666;
            margin: 30px 0;
            font-style: italic;
          }
          .signature-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 50px;
            margin-bottom: 30px;
          }
          .signature {
            text-align: center;
            width: 250px;
          }
          .signature-line {
            border-top: 1px solid #333;
            width: 100%;
            margin-bottom: 8px;
          }
          .signature-name {
            font-size: 14px;
            font-weight: bold;
            color: #1a3a5c;
          }
          .signature-title {
            font-size: 11px;
            color: #666;
          }
          .qr-code {
            text-align: center;
          }
          .qr-code img {
            width: 80px;
            height: 80px;
          }
          .qr-text {
            font-size: 9px;
            color: #888;
            margin-top: 5px;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
          .date {
            font-size: 12px;
            color: #666;
          }
          .certificate-id {
            font-size: 10px;
            color: #999;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="certificate-inner">
            <div class="sjs-logo">
              <h1>SJS</h1>
              <p>ESTABLISHING EXCELLENCE IN TECHNOLOGY EDUCATION</p>
            </div>
            
            <div class="academy-name">
              <h2>SJS GLOBAL TECH ACADEMY</h2>
            </div>
            
            <div class="certificate-title">
              <h3>CERTIFICATE OF ACHIEVEMENT</h3>
            </div>
            
            <div class="presented-to">
              THIS CERTIFICATE IS PROUDLY PRESENTED TO
            </div>
            
            <div class="student-name">
              ${certificate.student_name}
            </div>
            
            <div class="completion-text">
              For successfully completing the course <strong>"${certificate.course_name}"</strong><br>
              and demonstrating outstanding performance and dedication.
            </div>
            
            <div class="score-section">
              <span class="score">Score: ${certificate.score}%</span>
            </div>
            
            <div class="wish-text">
              We wish you continued success in all your future endeavors
            </div>
            
            <div class="signature-section">
              <div class="signature">
                <div class="signature-line"></div>
                <div class="signature-name">Harshdeep Singh</div>
                <div class="signature-title">AUTHORIZED SIGNATURE</div>
              </div>
              <div class="qr-code">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(verificationUrl)}" alt="QR Code" />
                <div class="qr-text">SCAN TO VERIFY</div>
              </div>
            </div>
            
            <div class="footer">
              <div class="date">
                Date: ${new Date(certificate.issue_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div class="certificate-id">
                Certificate ID: ${certificate.certificate_id}
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handleShare = (certificate) => {
    setSelectedCertificate(certificate);
    setShowShareModal(true);
  };

  const handlePreview = (certificate) => {
    setSelectedCertificate(certificate);
    setShowPreviewModal(true);
  };

  const handleCopyLink = (certificate) => {
    const verificationUrl = `${window.location.origin}/verify-certificate?token=${certificate.verification_token}`;
    navigator.clipboard.writeText(verificationUrl);
    toast.success('Verification link copied to clipboard!');
  };

  const handleShareWhatsApp = (certificate) => {
    const text = `I have successfully completed "${certificate.course_name}" with ${certificate.score}% score from SJS Global Tech Academy! Verify here: ${window.location.origin}/verify-certificate?token=${certificate.verification_token}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareEmail = (certificate) => {
    const subject = `Certificate of Completion - ${certificate.course_name}`;
    const body = `I have successfully completed "${certificate.course_name}" with ${certificate.score}% score from SJS Global Tech Academy.\n\nCertificate ID: ${certificate.certificate_id}\nIssue Date: ${new Date(certificate.issue_date).toLocaleDateString()}\n\nVerify here: ${window.location.origin}/verify-certificate?token=${certificate.verification_token}`;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Certificates</h1>
              <p className="text-gray-600 mt-1">
                View and download your earned certificates
              </p>
            </div>
            <button
              onClick={() => fetchCertificates(false)}
              disabled={refreshing}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              <FaRedo className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Stats Cards */}
          {stats.total > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Certificates</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                  </div>
                  <FaMedal className="text-3xl text-primary-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Average Score</p>
                    <p className="text-3xl font-bold text-primary-600">{stats.avgScore}%</p>
                  </div>
                  <FaStar className="text-3xl text-yellow-500" />
                </div>
              </div>
            </div>
          )}

          {/* Certificates Grid */}
          {certificates.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <FaCertificate className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Certificates Yet</h3>
              <p className="text-gray-600 mb-6">
                Complete courses to earn certificates. Your achievements will appear here.
              </p>
              <Link to="/courses">
                <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  Browse Courses →
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <FaMedal className="text-2xl" />
                      <span className="text-xs opacity-80">Verified ✓</span>
                    </div>
                    <h3 className="font-bold text-lg mt-2 line-clamp-1">{cert.course_name}</h3>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-3">
                      <p className="text-xs text-gray-500">Certificate ID</p>
                      <p className="text-xs font-mono text-gray-700 truncate">{cert.certificate_id}</p>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-xs text-gray-500">Issue Date</p>
                      <p className="text-sm font-semibold">
                        {new Date(cert.issue_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-xs text-gray-500">Score</p>
                      <div className="flex items-center gap-2">
                        <p className={`text-xl font-bold ${getScoreColor(cert.score)}`}>
                          {cert.score}%
                        </p>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 rounded-full h-2 transition-all duration-500"
                            style={{ width: `${cert.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePreview(cert)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm transition"
                      >
                        <FaEye size={14} /> View
                      </button>
                      <button
                        onClick={() => handleDownload(cert)}
                        className="flex-1 bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2 text-sm transition"
                      >
                        <FaDownload size={14} /> Download
                      </button>
                      <button
                        onClick={() => handleShare(cert)}
                        className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 text-sm transition"
                      >
                        <FaShare size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
            >
              ×
            </button>
            <div 
              dangerouslySetInnerHTML={{ __html: getCertificateHTML(selectedCertificate) }}
              className="bg-white rounded-lg overflow-hidden shadow-2xl"
            />
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() => handlePrint(selectedCertificate)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FaPrint /> Print
              </button>
              <button
                onClick={() => handleDownload(selectedCertificate)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FaDownload /> Download
              </button>
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
                <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:text-gray-700">
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleCopyLink(selectedCertificate)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <FaCopy /> Copy Verification Link
                </button>
                <button
                  onClick={() => handleShareWhatsApp(selectedCertificate)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <FaWhatsapp /> Share on WhatsApp
                </button>
                <button
                  onClick={() => handleShareEmail(selectedCertificate)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <FaEnvelope /> Share via Email
                </button>
                <button
                  onClick={() => handleShareLinkedIn(selectedCertificate)}
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <FaLinkedin /> Share on LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCertificates;