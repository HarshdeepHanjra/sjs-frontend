import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSpinner, 
  FaShare, 
  FaCopy,
  FaWhatsapp,
  FaEnvelope,
  FaLinkedin,
  FaArrowLeft,
  FaDownload,
  FaShieldAlt,
  FaBuilding,
  FaGlobe
} from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const CertificateVerify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [verifying, setVerifying] = useState(true);
  const [certificate, setCertificate] = useState(null);
  const [valid, setValid] = useState(false);
  const [error, setError] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (token) {
      verifyCertificate();
    } else {
      setVerifying(false);
      setError('No verification token provided');
    }
  }, [token]);

  // ✅ FIXED: Added /api/ prefix
  const verifyCertificate = async () => {
    setVerifying(true);
    try {
      const response = await api.get(`/api/certificates/verify?token=${token}`);
      
      if (response.data.valid) {
        setValid(true);
        setCertificate(response.data.certificate);
        toast.success('Certificate verified successfully!');
      } else {
        setValid(false);
        setError(response.data.message || 'Invalid certificate');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setValid(false);
      if (error.response?.status === 404) {
        setError('Certificate not found. Please check the verification link.');
      } else if (error.response?.status === 400) {
        setError(error.response.data.message || 'Certificate has been revoked');
      } else {
        setError('Unable to verify certificate. Please try again later.');
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleCopyLink = () => {
    const verificationUrl = `${window.location.origin}/verify-certificate?token=${token}`;
    navigator.clipboard.writeText(verificationUrl);
    toast.success('Verification link copied to clipboard!');
  };

  const handleShareWhatsApp = () => {
    const text = `Certificate Verification: ${certificate?.student_name} has successfully completed "${certificate?.course_name}" with ${certificate?.score}% score from SJS Global Tech.\n\nVerified by SJS Global Tech\nVerify: ${window.location.origin}/verify-certificate?token=${token}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = `Certificate Verification - ${certificate?.student_name}`;
    const body = `Certificate Verified by SJS Global Tech \n\nStudent: ${certificate?.student_name}\nCourse: ${certificate?.course_name}\nScore: ${certificate?.score}%\nIssue Date: ${new Date(certificate?.issue_date).toLocaleDateString()}\nCertificate ID: ${certificate?.certificate_id}\n\nVerification URL: ${window.location.origin}/verify-certificate?token=${token}\n\nThis is an official certificate issued by SJS Global Tech.`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleShareLinkedIn = () => {
    const url = `${window.location.origin}/verify-certificate?token=${token}`;
    const text = `I have successfully completed "${certificate?.course_name}" with ${certificate?.score}% score from SJS Global Tech. Verified certificate: ${url}`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDownloadCertificate = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(getCertificateHTML());
    printWindow.document.close();
    printWindow.print();
  };

  const getCertificateHTML = () => {
    const verificationUrl = `${window.location.origin}/verify-certificate?token=${token}`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate of Achievement - ${certificate?.course_name}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @page { size: landscape; margin: 0; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            margin: 0;
            padding: 20px;
            font-family: 'Georgia', 'Times New Roman', serif;
            background: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .certificate {
            width: 100%;
            max-width: 900px;
            background: white;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          }
          .certificate-border {
            border: 12px solid #1a3a5c;
          }
          .certificate-inner {
            border: 1px solid #c9a03d;
            margin: 20px;
            padding: 30px 20px;
            text-align: center;
          }
          .logo h1 {
            font-size: clamp(24px, 5vw, 32px);
            color: #1a3a5c;
            letter-spacing: 6px;
            margin: 0;
          }
          .logo p {
            font-size: clamp(8px, 2vw, 10px);
            color: #888;
            letter-spacing: 2px;
            margin-top: 5px;
          }
          .academy {
            margin: 15px 0;
            font-size: clamp(12px, 3vw, 16px);
            color: #1a3a5c;
            letter-spacing: 1px;
          }
          .title h2 {
            font-size: clamp(18px, 4vw, 28px);
            color: #c9a03d;
            margin: 15px 0;
            letter-spacing: 2px;
          }
          .presented {
            font-size: clamp(11px, 2.5vw, 14px);
            color: #555;
            margin: 10px 0;
          }
          .student {
            font-size: clamp(28px, 6vw, 42px);
            color: #1a3a5c;
            margin: 10px 0;
            font-weight: bold;
            border-bottom: 1px solid #c9a03d;
            display: inline-block;
            padding: 0 15px 5px;
            word-break: break-word;
          }
          .course-text {
            font-size: clamp(12px, 3vw, 15px);
            color: #444;
            margin: 15px 0;
            line-height: 1.6;
          }
          .score {
            font-size: clamp(16px, 4vw, 20px);
            font-weight: bold;
            color: #c9a03d;
            margin: 10px 0;
          }
          .wish {
            font-size: clamp(11px, 2.5vw, 13px);
            color: #666;
            margin: 15px 0;
            font-style: italic;
          }
          .verified-by {
            margin: 20px 0;
            padding: 10px;
            background: #f0f7ff;
            border-radius: 8px;
            display: inline-block;
          }
          .verified-by p {
            font-size: clamp(11px, 2.5vw, 13px);
            color: #1a3a5c;
            margin: 3px 0;
          }
          .verified-by strong {
            color: #c9a03d;
          }
          .verification-badge {
            margin: 12px 0;
            padding: 6px 12px;
            background: #e8f5e9;
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
          .verification-badge span {
            font-size: clamp(10px, 2vw, 12px);
            color: #2e7d32;
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            padding-top: 12px;
            border-top: 1px solid #eee;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 10px;
            font-size: 9px;
            color: #999;
          }
          @media (max-width: 600px) {
            body { padding: 10px; }
            .certificate-inner { margin: 10px; padding: 15px; }
            .certificate-border { border-width: 6px; }
            .footer { flex-direction: column; text-align: center; gap: 5px; }
          }
        </style>
      </head>
      <body>
        <div class="certificate certificate-border">
          <div class="certificate-inner">
            <div class="logo">
              <h1>SJS</h1>
              <p>ESTABLISHING EXCELLENCE IN TECHNOLOGY EDUCATION</p>
            </div>
            <div class="academy">
              <strong>SJS GLOBAL TECH</strong>
            </div>
            <div class="title">
              <h2>CERTIFICATE OF ACHIEVEMENT</h2>
            </div>
            <div class="presented">THIS CERTIFICATE IS PROUDLY PRESENTED TO</div>
            <div class="student">${certificate?.student_name}</div>
            <div class="course-text">
              For successfully completing the course <strong>"${certificate?.course_name}"</strong><br>
              with outstanding performance and dedication.
            </div>
            <div class="score">Score: ${certificate?.score}%</div>
            <div class="wish">We wish you continued success in all your future endeavors</div>
            
            <div class="verified-by">
              <p><strong>✓ VERIFIED BY</strong></p>
              <p>SJS Global Tech Academy</p>
              <p>An ISO Certified Institution</p>
            </div>
            
            <div class="verification-badge">
              <span>🔒</span>
              <span>Blockchain Verified Certificate</span>
              <span>✓</span>
            </div>
            
            <div class="footer">
              <span>Date: ${new Date(certificate?.issue_date).toLocaleDateString()}</span>
              <span>Certificate ID: ${certificate?.certificate_id}</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <FaSpinner className="animate-spin text-3xl sm:text-4xl text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 text-sm sm:text-base">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-16 px-4">
        <div className="container mx-auto max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
            <FaTimesCircle className="text-4xl sm:text-5xl text-red-500 mx-auto mb-4" />
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No Verification Token</h1>
            <p className="text-gray-500 text-sm sm:text-base mb-6">Please provide a valid verification link.</p>
            <Link to="/">
              <button className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm sm:text-base">Back to Home</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-16 px-4">
        <div className="container mx-auto max-w-md">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-500 p-4 text-white text-center">
              <FaTimesCircle className="text-2xl sm:text-3xl mx-auto mb-2" />
              <h1 className="text-lg sm:text-xl font-bold">Invalid Certificate</h1>
            </div>
            <div className="p-6 text-center">
              <p className="text-red-600 text-sm sm:text-base mb-4">{error}</p>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">This certificate could not be verified by SJS Global Tech.</p>
              <Link to="/">
                <button className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm sm:text-base">Back to Home</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="container mx-auto px-2 sm:px-4 max-w-6xl">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition text-sm sm:text-base"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* Certificate Display - Responsive */}
        <div className="flex justify-center overflow-x-auto">
          <div 
            dangerouslySetInnerHTML={{ __html: getCertificateHTML() }}
            className="shadow-xl rounded-lg overflow-hidden w-full"
            style={{ minWidth: isMobile ? '100%' : 'auto' }}
          />
        </div>

        {/* Verification Proof Section - Responsive */}
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-5">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FaShieldAlt className="text-green-600 text-base sm:text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm sm:text-base">Verified by SJS Global Tech</h3>
                <p className="text-xs text-gray-500">Official Certification Authority</p>
              </div>
            </div>
            
            {/* Responsive Grid for Certificate Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">Certificate ID</p>
                <p className="font-mono font-semibold text-gray-800 text-xs sm:text-sm break-all">{certificate?.certificate_id}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">Issue Date</p>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm">{new Date(certificate?.issue_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">Student Name</p>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm break-words">{certificate?.student_name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">Course</p>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm break-words">{certificate?.course_name}</p>
              </div>
            </div>
            
            {/* Responsive Button Group */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={handleCopyLink}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-2 text-xs sm:text-sm transition"
              >
                <FaCopy className="text-xs sm:text-sm" /> Copy Link
              </button>
              <button
                onClick={handleDownloadCertificate}
                className="bg-primary-600 hover:bg-primary-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-2 text-xs sm:text-sm transition"
              >
                <FaDownload className="text-xs sm:text-sm" /> Download / Print
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-2 text-xs sm:text-sm transition"
              >
                <FaShare className="text-xs sm:text-sm" /> Share
              </button>
            </div>
            
            {/* Footer Text */}
            <div className="text-center mt-4 pt-3 border-t">
              <p className="text-xs text-gray-400 flex flex-wrap items-center justify-center gap-2">
                <FaBuilding size={12} />
                This certificate is issued and verified by SJS Global Tech
                <FaGlobe size={10} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal - Responsive */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full mx-4">
            <div className="p-4 sm:p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base sm:text-lg font-bold">Share Certificate</h3>
                <button 
                  onClick={() => setShowShareModal(false)} 
                  className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleCopyLink}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg flex items-center justify-center gap-2 transition text-sm"
                >
                  <FaCopy /> Copy Verification Link
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition text-sm"
                >
                  <FaWhatsapp /> WhatsApp
                </button>
                <button
                  onClick={handleShareEmail}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition text-sm"
                >
                  <FaEnvelope /> Email
                </button>
                <button
                  onClick={handleShareLinkedIn}
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition text-sm"
                >
                  <FaLinkedin /> LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateVerify;