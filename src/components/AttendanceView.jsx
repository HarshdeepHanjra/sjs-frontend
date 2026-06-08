import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock, FaChartLine, FaSpinner } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const AttendanceView = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchAttendance();
    fetchMonthlyData();
  }, []);

  // ✅ FIXED: Add /api/ prefix to endpoints
  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get('/api/student/attendance/my-attendance', config);
      if (response.data.success) {
        setAttendanceData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Add /api/ prefix to endpoints
  const fetchMonthlyData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get('/api/student/attendance/monthly', config);
      if (response.data.success) {
        setMonthlyData(response.data.monthly_data || []);
      }
    } catch (error) {
      console.error('Failed to fetch monthly data:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <FaSpinner className="animate-spin text-3xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      {attendanceData?.overall && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <FaChartLine className="text-3xl mb-2" />
            <p className="text-sm opacity-90">Overall Attendance</p>
            <p className="text-3xl font-bold">{attendanceData.overall.percentage}%</p>
            <p className="text-sm mt-2">{attendanceData.overall.total_present} / {attendanceData.overall.total_classes} classes</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <FaCheckCircle className="text-3xl mb-2" />
            <p className="text-sm opacity-90">Present</p>
            <p className="text-3xl font-bold">{attendanceData.overall.total_present}</p>
            <p className="text-sm mt-2">Classes attended</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <FaCalendarAlt className="text-3xl mb-2" />
            <p className="text-sm opacity-90">Total Classes</p>
            <p className="text-3xl font-bold">{attendanceData.overall.total_classes}</p>
            <p className="text-sm mt-2">Classes conducted</p>
          </div>
        </div>
      )}

      {/* Course-wise Summary */}
      {attendanceData?.course_summaries && Object.keys(attendanceData.course_summaries).length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Course-wise Attendance</h3>
          <div className="space-y-4">
            {Object.values(attendanceData.course_summaries).map((course) => (
              <div key={course.course_id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{course.course_name}</h4>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    course.percentage >= 75 ? 'bg-green-100 text-green-800' :
                    course.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {course.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      course.percentage >= 75 ? 'bg-green-600' :
                      course.percentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${course.percentage}%` }}
                  ></div>
                </div>
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="text-green-600">Present: {course.present}</span>
                  <span className="text-red-600">Absent: {course.absent}</span>
                  <span className="text-yellow-600">Late: {course.late}</span>
                  <span className="text-gray-600">Total: {course.total_classes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Breakdown */}
      {monthlyData.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Monthly Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Month</th>
                  <th className="px-4 py-2 text-left">Course</th>
                  <th className="px-4 py-2 text-center">Present</th>
                  <th className="px-4 py-2 text-center">Absent</th>
                  <th className="px-4 py-2 text-center">Late</th>
                  <th className="px-4 py-2 text-center">Total</th>
                  <th className="px-4 py-2 text-center">%</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">{data.month}</td>
                    <td className="px-4 py-2">{data.course_name}</td>
                    <td className="px-4 py-2 text-center text-green-600">{data.present}</td>
                    <td className="px-4 py-2 text-center text-red-600">{data.absent}</td>
                    <td className="px-4 py-2 text-center text-yellow-600">{data.late}</td>
                    <td className="px-4 py-2 text-center">{data.total_classes}</td>
                    <td className="px-4 py-2 text-center font-semibold">{data.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Attendance Records */}
      {attendanceData?.attendances && attendanceData.attendances.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Recent Attendance Records</h3>
          <div className="space-y-2">
            {attendanceData.attendances.slice(0, 10).map((record) => (
              <div key={record.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{record.course_name}</p>
                  <p className="text-sm text-gray-500">{record.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  {record.status === 'present' && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <FaCheckCircle /> Present
                    </span>
                  )}
                  {record.status === 'absent' && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <FaTimesCircle /> Absent
                    </span>
                  )}
                  {record.status === 'late' && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <FaClock /> Late
                    </span>
                  )}
                  {record.remarks && <span className="text-sm text-gray-500">Note: {record.remarks}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceView;