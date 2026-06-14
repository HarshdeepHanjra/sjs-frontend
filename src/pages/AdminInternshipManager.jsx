// AdminInternshipManager.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSave, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../services/api";

const AdminInternshipManager = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    fee: 0,
    original_fee: 0,
    stipend: "",
    mode: "Online",
    start_date: "",
    slots: 0,
    enrolled: 0,
    rating: 4.5,
    description: "",
    syllabus: [],
    benefits: [],
    requirements: [],
    is_active: true
  });

  // Fetch internships
  const fetchInternships = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/internships/admin');
      if (response.data.success) {
        setInternships(response.data.internships);
      }
    } catch (error) {
      console.error('Failed to fetch internships:', error);
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle array fields (syllabus, benefits, requirements)
  const handleArrayInput = (field, value) => {
    const arrayValue = value.split(',').map(item => item.trim());
    setFormData({
      ...formData,
      [field]: arrayValue
    });
  };

  // Create or Update Internship
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      let response;
      if (editingInternship) {
        // Update existing internship
        response = await api.put(`/api/internships/${editingInternship.id}`, formData, config);
        if (response.data.success) {
          toast.success('Internship updated successfully!');
        }
      } else {
        // Create new internship
        response = await api.post('/api/internships', formData, config);
        if (response.data.success) {
          toast.success('Internship created successfully!');
        }
      }
      
      if (response.data.success) {
        setShowModal(false);
        resetForm();
        fetchInternships();
      }
    } catch (error) {
      console.error('Failed to save internship:', error);
      toast.error(error.response?.data?.message || 'Failed to save internship');
    } finally {
      setLoading(false);
    }
  };

  // Delete Internship
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await api.delete(`/api/internships/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          toast.success('Internship deleted successfully!');
          fetchInternships();
        }
      } catch (error) {
        console.error('Failed to delete internship:', error);
        toast.error('Failed to delete internship');
      }
    }
  };

  // Edit Internship
  const handleEdit = (internship) => {
    setEditingInternship(internship);
    setFormData({
      title: internship.title,
      category: internship.category,
      duration: internship.duration,
      fee: internship.fee,
      original_fee: internship.original_fee,
      stipend: internship.stipend,
      mode: internship.mode,
      start_date: internship.start_date,
      slots: internship.slots,
      enrolled: internship.enrolled,
      rating: internship.rating,
      description: internship.description,
      syllabus: internship.syllabus || [],
      benefits: internship.benefits || [],
      requirements: internship.requirements || [],
      is_active: internship.is_active
    });
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setEditingInternship(null);
    setFormData({
      title: "",
      category: "",
      duration: "",
      fee: 0,
      original_fee: 0,
      stipend: "",
      mode: "Online",
      start_date: "",
      slots: 0,
      enrolled: 0,
      rating: 4.5,
      description: "",
      syllabus: [],
      benefits: [],
      requirements: [],
      is_active: true
    });
  };

  // Toggle internship active status
  const toggleActiveStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.patch(`/api/internships/${id}/toggle-status`, 
        { is_active: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success(`Internship ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
        fetchInternships();
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast.error('Failed to update internship status');
    }
  };

  if (loading && internships.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Internships</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Add New Internship
        </button>
      </div>

      {/* Internships Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slots</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {internships.map((internship) => (
                <tr key={internship.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{internship.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{internship.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{internship.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {internship.fee === 0 ? 'FREE' : `₹${internship.fee}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{internship.slots}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{internship.enrolled}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActiveStatus(internship.id, internship.is_active)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        internship.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {internship.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(internship)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(internship.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingInternship ? 'Edit Internship' : 'Add New Internship'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Category *</label>
                  <input
                    type="text"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    required
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 3 Months"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Mode</label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option>Online</option>
                    <option>Offline</option>
                    <option>Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Fee (₹)</label>
                  <input
                    type="number"
                    name="fee"
                    value={formData.fee}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Original Fee (₹)</label>
                  <input
                    type="number"
                    name="original_fee"
                    value={formData.original_fee}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Stipend</label>
                  <input
                    type="text"
                    name="stipend"
                    value={formData.stipend}
                    onChange={handleInputChange}
                    placeholder="e.g., Unpaid, Performance Based"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Start Date</label>
                  <input
                    type="text"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    placeholder="e.g., Monthly Batch"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Total Slots</label>
                  <input
                    type="number"
                    name="slots"
                    value={formData.slots}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Enrolled Students</label>
                  <input
                    type="number"
                    name="enrolled"
                    value={formData.enrolled}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Rating</label>
                  <input
                    type="number"
                    name="rating"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold">Active</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Description *</label>
                <textarea
                  name="description"
                  required
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Syllabus (comma separated)</label>
                <textarea
                  rows="3"
                  value={formData.syllabus.join(', ')}
                  onChange={(e) => handleArrayInput('syllabus', e.target.value)}
                  placeholder="Python, SQL, Machine Learning, etc."
                  className="w-full px-3 py-2 border rounded-lg"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Benefits (comma separated)</label>
                <textarea
                  rows="3"
                  value={formData.benefits.join(', ')}
                  onChange={(e) => handleArrayInput('benefits', e.target.value)}
                  placeholder="Certificate, Live Projects, Mentorship, etc."
                  className="w-full px-3 py-2 border rounded-lg"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Requirements (comma separated)</label>
                <textarea
                  rows="3"
                  value={formData.requirements.join(', ')}
                  onChange={(e) => handleArrayInput('requirements', e.target.value)}
                  placeholder="Basic programming knowledge, Laptop, etc."
                  className="w-full px-3 py-2 border rounded-lg"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <FaSpinner className="animate-spin" />}
                  {editingInternship ? 'Update' : 'Create'} Internship
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminInternshipManager;