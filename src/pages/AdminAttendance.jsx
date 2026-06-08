import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUsers, FaCheckCircle, FaTimesCircle, FaClock, FaSearch, FaSpinner, FaSave, FaDownload, FaUserGraduate } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendances, setAttendances] = useState({});
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to load courses');
    }
  };

  const fetchStudentsForCourse = async (courseId) => {
    setLoadingStudents(true);
    try {
      console.log('Fetching students for course:', courseId);
      const response = await api.get(`/admin/attendance/courses/${courseId}/students`);
      console.log('Students response:', response.data);
      
      if (response.data.success) {
        setStudents(response.data.students);
        const initialStatus = {};
        const initialRemark = {};
        response.data.students.forEach(student => {
          initialStatus[student.id] = 'present';
          initialRemark[student.id] = '';
        });
        setAttendances(initialStatus);
        setRemarks(initialRemark);
        
        if (response.data.students.length === 0) {
          toast('No students found for this course', { icon: 'ℹ️' });
        } else {
          toast.success(`Loaded ${response.data.students.length} students`);
        }
      } else {
        toast.error(response.data.error || 'Failed to load students');
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
      toast.error(error.response?.data?.error || 'Failed to load students');
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchExistingAttendance = async (courseId, date) => {
    try {
      const response = await api.get(`/admin/attendance/course/${courseId}/date/${date}`);
      if (response.data.success && response.data.attendances.length > 0) {
        const existingStatus = { ...attendances };
        const existingRemarks = { ...remarks };
        response.data.attendances.forEach(att => {
          existingStatus[att.student_id] = att.status;
          existingRemarks[att.student_id] = att.remarks || '';
        });
        setAttendances(existingStatus);
        setRemarks(existingRemarks);
        toast.success(`Loaded ${response.data.attendances.length} existing attendance records`);
      }
    } catch (error) {
      console.error('Failed to fetch existing attendance:', error);
    }
  };

  const handleCourseSelect = async (courseId) => {
    setSelectedCourse(courseId);
    await fetchStudentsForCourse(courseId);
    await fetchExistingAttendance(courseId, selectedDate);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendances(prev => ({ ...prev, [studentId]: status }));
  };

  const handleRemarkChange = (studentId, remark) => {
    setRemarks(prev => ({ ...prev, [studentId]: remark }));
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    if (selectedCourse) {
      await fetchExistingAttendance(selectedCourse, date);
    }
  };

  const handleMarkAll = (status) => {
    const newAttendances = {};
    students.forEach(student => {
      newAttendances[student.id] = status;
    });
    setAttendances(newAttendances);
    toast.success(`All students marked as ${status}`);
  };

  const handleSubmitAttendance = async () => {
    if (!selectedCourse) {
      toast.error('Please select a course');
      return;
    }

    if (students.length === 0) {
      toast.error('No students found for this course');
      return;
    }

    const attendanceData = students.map(student => ({
      student_id: student.id,
      status: attendances[student.id] || 'present',
      remarks: remarks[student.id] || ''
    }));

    setSaving(true);
    try {
      const response = await api.post('/admin/attendance/mark', {
        course_id: selectedCourse,
        date: selectedDate,
        attendances: attendanceData
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchSummaries();
      } else {
        toast.error(response.data.error || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      toast.error(error.response?.data?.error || 'Failed to mark attendance');
    } finally {
      setSaving(false);
    }
  };

  const fetchSummaries = async () => {
    if (!selectedCourse) return;
    
    try {
      const response = await api.get(`/admin/attendance/summary/${selectedCourse}`);
      if (response.data.success) {
        setSummaries(response.data.summaries);
      }
    } catch (error) {
      console.error('Failed to fetch summaries:', error);
    }
  };

  const downloadAttendanceReport = () => {
    if (!summaries.length) {
      toast.error('No data to download');
      return;
    }
    
    let csvContent = "Student Name,Student Email,Total Classes,Present,Absent,Late,Percentage\n";
    summaries.forEach(summary => {
      csvContent += `"${summary.student_name}","${summary.student_email}",${summary.total_classes},${summary.present},${summary.absent},${summary.late},${summary.percentage}%\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_summary_course_${selectedCourse}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded!');
  };

  const getStatusButtonClass = (studentId, status) => {
    const isActive = attendances[studentId] === status;
    return `px-3 py-1 rounded-lg text-sm transition flex items-center gap-1 ${
      isActive
        ? status === 'present' ? 'bg-green-600 text-white' :
          status === 'absent' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`;
  };

  if (!courses.length) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FaSpinner className="animate-spin text-3xl text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Attendance Management</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSummary(!showSummary)}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              showSummary ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showSummary ? '📝 Mark Attendance' : '📊 View Summary'}
          </button>
          {showSummary && summaries.length > 0 && (
            <button
              onClick={downloadAttendanceReport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <FaDownload /> Export Report
            </button>
          )}
        </div>
      </div>

      {!showSummary ? (
        // Mark Attendance View
        <div>
          {/* Course and Date Selection */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaUserGraduate className="inline mr-2" /> Select Course
                </label>
                <select
                  value={selectedCourse || ''}
                  onChange={(e) => handleCourseSelect(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">-- Select a course --</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaCalendarAlt className="inline mr-2" /> Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {selectedCourse && students.length > 0 && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Quick Actions</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarkAll('present')}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700"
                    >
                      All Present
                    </button>
                    <button
                      onClick={() => handleMarkAll('absent')}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700"
                    >
                      All Absent
                    </button>
                    <button
                      onClick={() => handleMarkAll('late')}
                      className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-yellow-700"
                    >
                      All Late
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Students List for Attendance */}
          {selectedCourse && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b">
                <p className="font-semibold">
                  {loadingStudents ? 'Loading students...' : `${students.length} Students Enrolled`}
                </p>
              </div>
              
              {loadingStudents ? (
                <div className="flex justify-center py-12">
                  <FaSpinner className="animate-spin text-3xl text-primary-600" />
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-12">
                  <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No students enrolled in this course</p>
                  <p className="text-sm text-gray-400 mt-2">Add students to the course first</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {students.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-gray-500">{student.email}</p>
                            </td>
                            <td className="px-6 py-4 text-sm font-mono">{student.student_id}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2 flex-wrap">
                                <button
                                  onClick={() => handleStatusChange(student.id, 'present')}
                                  className={getStatusButtonClass(student.id, 'present')}
                                >
                                  <FaCheckCircle size={12} /> Present
                                </button>
                                <button
                                  onClick={() => handleStatusChange(student.id, 'absent')}
                                  className={getStatusButtonClass(student.id, 'absent')}
                                >
                                  <FaTimesCircle size={12} /> Absent
                                </button>
                                <button
                                  onClick={() => handleStatusChange(student.id, 'late')}
                                  className={getStatusButtonClass(student.id, 'late')}
                                >
                                  <FaClock size={12} /> Late
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={remarks[student.id] || ''}
                                onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                                placeholder="Optional remarks"
                                className="w-48 px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 bg-gray-50 border-t">
                    <button
                      onClick={handleSubmitAttendance}
                      disabled={saving}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                      {saving ? 'Saving...' : 'Save Attendance'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        // Attendance Summary View
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex gap-4">
              <select
                value={selectedCourse || ''}
                onChange={(e) => {
                  setSelectedCourse(parseInt(e.target.value));
                  fetchSummaries();
                }}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">-- Select a course to view summary --</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
              <button
                onClick={fetchSummaries}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
              >
                <FaSearch /> Refresh
              </button>
            </div>
          </div>
          
          {selectedCourse && summaries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Classes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {summaries.map((summary) => (
                    <tr key={summary.student_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium">{summary.student_name}</p>
                        <p className="text-sm text-gray-500">{summary.student_email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm">{summary.total_classes}</td>
                      <td className="px-6 py-4 text-sm text-green-600 font-semibold">{summary.present}</td>
                      <td className="px-6 py-4 text-sm text-red-600">{summary.absent}</td>
                      <td className="px-6 py-4 text-sm text-yellow-600">{summary.late}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                summary.percentage >= 75 ? 'bg-green-600' : 
                                summary.percentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${Math.min(summary.percentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">{summary.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : selectedCourse && (
            <div className="p-12 text-center">
              <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No attendance data available for this course</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAttendance;