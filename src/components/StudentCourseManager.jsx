import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaTimes, FaSpinner, FaBook, FaUser } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const StudentCourseManager = ({ student, onClose, onUpdate }) => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingCourse, setAddingCourse] = useState(false);
  const [removingCourse, setRemovingCourse] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  useEffect(() => {
    if (student) {
      fetchStudentCourses();
    }
  }, [student]);

  const fetchStudentCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/students/${student.id}/courses`);
      console.log("Student courses response:", response.data);
      
      if (response.data.success) {
        setPurchasedCourses(response.data.purchased_courses || []);
        setAllCourses(response.data.all_courses || []);
      } else {
        toast.error(response.data.error || 'Failed to fetch student courses');
      }
    } catch (error) {
      console.error('Failed to fetch student courses:', error);
      toast.error(error.response?.data?.error || 'Failed to load student courses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async () => {
    if (!selectedCourseId) {
      toast.error('Please select a course');
      return;
    }

    setAddingCourse(true);
    try {
      const response = await api.post(`/admin/students/${student.id}/courses/add`, {
        course_id: parseInt(selectedCourseId)
      });
      
      console.log("Add course response:", response.data);
      
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchStudentCourses();
        setSelectedCourseId('');
        if (onUpdate) onUpdate();
      } else {
        toast.error(response.data.error || 'Failed to add course');
      }
    } catch (error) {
      console.error('Failed to add course:', error);
      toast.error(error.response?.data?.error || 'Failed to add course');
    } finally {
      setAddingCourse(false);
    }
  };

  const handleRemoveCourse = async (courseId, courseName) => {
    if (window.confirm(`Are you sure you want to remove "${courseName}" from ${student.name}'s courses?`)) {
      setRemovingCourse(courseId);
      try {
        const response = await api.post(`/admin/students/${student.id}/courses/remove`, {
          course_id: courseId
        });
        
        console.log("Remove course response:", response.data);
        
        if (response.data.success) {
          toast.success(response.data.message);
          await fetchStudentCourses();
          if (onUpdate) onUpdate();
        } else {
          toast.error(response.data.error || 'Failed to remove course');
        }
      } catch (error) {
        console.error('Failed to remove course:', error);
        toast.error(error.response?.data?.error || 'Failed to remove course');
      } finally {
        setRemovingCourse(null);
      }
    }
  };

  // Filter out courses that are already purchased
  const availableCourses = allCourses.filter(
    course => !purchasedCourses.some(pc => pc.id === course.id)
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Manage Student Courses</h3>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <FaUser className="text-sm" />
              <span>{student?.name} ({student?.student_id})</span>
            </div>
            <p className="text-sm text-gray-500">{student?.email}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Add Course Section */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FaPlus className="text-green-600" /> Add New Course
          </h4>
          <div className="flex gap-3">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={addingCourse}
            >
              <option value="">Select a course...</option>
              {availableCourses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} - ₹{course.price?.toLocaleString()} ({course.duration})
                </option>
              ))}
            </select>
            <button
              onClick={handleAddCourse}
              disabled={addingCourse || !selectedCourseId || availableCourses.length === 0}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {addingCourse ? <FaSpinner className="animate-spin" /> : <FaPlus />}
              Add
            </button>
          </div>
          {availableCourses.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">All courses are already added to this student.</p>
          )}
        </div>

        {/* Current Courses Section */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FaBook className="text-primary-600" /> Purchased Courses ({purchasedCourses.length})
          </h4>
          
          {purchasedCourses.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No courses purchased yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {purchasedCourses.map(course => (
                <div key={course.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div>
                    <p className="font-medium text-gray-800">{course.name}</p>
                    <p className="text-sm text-gray-500">
                      {course.duration} • ₹{course.price?.toLocaleString()} • {course.course_code}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveCourse(course.id, course.name)}
                    disabled={removingCourse === course.id}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                    title="Remove Course"
                  >
                    {removingCourse === course.id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total Stats */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Courses:</span>
            <span className="font-semibold">{purchasedCourses.length}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Total Amount Spent:</span>
            <span className="font-semibold text-primary-600">
              ₹{purchasedCourses.reduce((sum, c) => sum + (c.price || 0), 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseManager;