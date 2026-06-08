import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { 
  FaUser, FaEnvelope, FaIdCard, FaSave, FaEdit, 
  FaGlobe, FaGithub, FaLinkedin, FaTwitter, FaLock, FaBell, FaCheckCircle,
  FaSpinner, FaTimes, FaArrowLeft, FaUserCircle,
  FaShieldAlt, FaEye, FaEyeSlash,
  FaFacebook, FaInstagram, FaYoutube
} from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser, refreshUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSocial, setIsEditingSocial] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    student_id: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    youtube: ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [activeTab, setActiveTab] = useState('personal');
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    payment_alerts: true,
    course_updates: true,
    promotional_emails: false
  });
  const [savingPreferences, setSavingPreferences] = useState(false);

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      console.log("User data received:", user);
      
      setFormData({
        name: user.name || '',
        email: user.email || '',
        student_id: user.student_id || '',
        website: user.website || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
        facebook: user.facebook || '',
        instagram: user.instagram || '',
        youtube: user.youtube || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const updateData = {
      name: formData.name,
      website: formData.website,
      github: formData.github,
      linkedin: formData.linkedin,
      twitter: formData.twitter,
      facebook: formData.facebook,
      instagram: formData.instagram,
      youtube: formData.youtube
    };
    
    console.log("Sending update data:", updateData);
    
    try {
      const response = await api.put('/api/user/update-profile', updateData);
      
      console.log("Update response:", response.data);
      
      if (response.data.success) {
        if (updateUser) {
          updateUser(response.data.user);
        }
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        setIsEditingSocial(false);
        if (refreshUser) await refreshUser();
      } else {
        toast.error(response.data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.new_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (!passwordData.current_password) {
      toast.error('Please enter current password');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/api/auth/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      
      if (response.data.success) {
        toast.success('Password changed successfully! Please login again.');
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        setTimeout(() => {
          localStorage.clear();
          window.location.href = '/login';
        }, 2000);
      } else {
        toast.error(response.data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password error:', error);
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = async (key) => {
    const newValue = !notifications[key];
    setNotifications({ ...notifications, [key]: newValue });
    
    try {
      const response = await api.put('/api/user/notification-preferences', {
        preferences: { ...notifications, [key]: newValue }
      });
      if (response.data.success) {
        toast.success('Preferences updated');
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setNotifications({ ...notifications, [key]: !newValue });
      toast.error('Failed to save preferences');
    }
  };

  const saveNotificationPreferences = async () => {
    setSavingPreferences(true);
    try {
      const response = await api.put('/api/user/notification-preferences', {  
        preferences: notifications
      });
      if (response.data.success) {
        toast.success('Notification preferences saved!');
      } else {
        toast.error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSavingPreferences(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: FaUser },
    { id: 'social', label: 'Social Links', icon: FaGlobe },
    { id: 'security', label: 'Security', icon: FaLock },
    { id: 'notifications', label: 'Notifications', icon: FaBell }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition" /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-white">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-primary-100 mt-2">Manage your personal information and preferences</p>
          </div>
          
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:w-72 bg-gray-50 p-6 border-r">
              <div className="text-center mb-6 pb-6 border-b">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg mb-3">
                  <FaUserCircle className="text-5xl text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">{formData.name || user.name}</h3>
                <p className="text-sm text-gray-500">{formData.student_id || user.student_id || 'Student'}</p>
                <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Active</span>
              </div>
              
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="text-lg" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition ${
                          !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.email || user.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                      />
                      <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Student ID</label>
                      <input
                        type="text"
                        value={formData.student_id || user.student_id || 'Not assigned'}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>

                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl transition flex items-center gap-2"
                    >
                      <FaEdit /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl transition flex items-center gap-2 disabled:opacity-50"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          if (user) {
                            setFormData({
                              name: user.name || '',
                              email: user.email || '',
                              student_id: user.student_id || '',
                              website: user.website || '',
                              github: user.github || '',
                              linkedin: user.linkedin || '',
                              twitter: user.twitter || '',
                              facebook: user.facebook || '',
                              instagram: user.instagram || '',
                              youtube: user.youtube || ''
                            });
                          }
                        }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl transition"
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  )}
                </form>
              )}

              {/* Social Links Tab */}
              {activeTab === 'social' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <p className="text-blue-800 text-sm">Connect your social profiles to showcase your professional presence</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2"><FaGlobe className="inline mr-2" /> Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      disabled={!isEditingSocial}
                      placeholder="https://yourwebsite.com"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        !isEditingSocial ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2"><FaGithub className="inline mr-2" /> GitHub</label>
                    <input
                      type="text"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      disabled={!isEditingSocial}
                      placeholder="https://github.com/username"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        !isEditingSocial ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2"><FaLinkedin className="inline mr-2" /> LinkedIn</label>
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      disabled={!isEditingSocial}
                      placeholder="https://linkedin.com/in/username"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        !isEditingSocial ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2"><FaTwitter className="inline mr-2" /> Twitter/X</label>
                    <input
                      type="text"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      disabled={!isEditingSocial}
                      placeholder="https://twitter.com/username"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        !isEditingSocial ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2"><FaFacebook className="inline mr-2" /> Facebook</label>
                    <input
                      type="text"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      disabled={!isEditingSocial}
                      placeholder="https://facebook.com/username"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        !isEditingSocial ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2"><FaInstagram className="inline mr-2" /> Instagram</label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      disabled={!isEditingSocial}
                      placeholder="https://instagram.com/username"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        !isEditingSocial ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2"><FaYoutube className="inline mr-2" /> YouTube</label>
                    <input
                      type="text"
                      name="youtube"
                      value={formData.youtube}
                      onChange={handleChange}
                      disabled={!isEditingSocial}
                      placeholder="https://youtube.com/@username"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        !isEditingSocial ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  {!isEditingSocial ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingSocial(true)}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl transition flex items-center gap-2"
                    >
                      <FaEdit /> Edit Social Links
                    </button>
                  ) : (
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl transition flex items-center gap-2 disabled:opacity-50"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingSocial(false)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <div className="bg-yellow-50 rounded-xl p-4 mb-4 border border-yellow-200">
                    <p className="text-yellow-800 text-sm"><FaShieldAlt className="inline mr-2" /> For security, you'll be logged out after changing your password</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="current_password"
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="new_password"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter new password (min 6 characters)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirm_password"
                        value={passwordData.confirm_password}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaLock />}
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="bg-purple-50 rounded-xl p-4 mb-4">
                    <p className="text-purple-800 text-sm"><FaBell className="inline mr-2" /> Choose how you want to receive updates and notifications</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b">
                      <div>
                        <h4 className="font-semibold text-gray-800">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive email updates about your account</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('email_notifications')}
                        className={`w-14 h-7 rounded-full transition-all duration-300 ${
                          notifications.email_notifications ? 'bg-primary-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-all duration-300 ${
                          notifications.email_notifications ? 'translate-x-8' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b">
                      <div>
                        <h4 className="font-semibold text-gray-800">Payment Alerts</h4>
                        <p className="text-sm text-gray-500">Get notified about payment transactions</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('payment_alerts')}
                        className={`w-14 h-7 rounded-full transition-all duration-300 ${
                          notifications.payment_alerts ? 'bg-primary-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-all duration-300 ${
                          notifications.payment_alerts ? 'translate-x-8' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b">
                      <div>
                        <h4 className="font-semibold text-gray-800">Course Updates</h4>
                        <p className="text-sm text-gray-500">Receive updates about your enrolled courses</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('course_updates')}
                        className={`w-14 h-7 rounded-full transition-all duration-300 ${
                          notifications.course_updates ? 'bg-primary-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-all duration-300 ${
                          notifications.course_updates ? 'translate-x-8' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b">
                      <div>
                        <h4 className="font-semibold text-gray-800">Promotional Emails</h4>
                        <p className="text-sm text-gray-500">Receive offers and updates about new courses</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('promotional_emails')}
                        className={`w-14 h-7 rounded-full transition-all duration-300 ${
                          notifications.promotional_emails ? 'bg-primary-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-all duration-300 ${
                          notifications.promotional_emails ? 'translate-x-8' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={saveNotificationPreferences}
                    disabled={savingPreferences}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {savingPreferences ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                    {savingPreferences ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;