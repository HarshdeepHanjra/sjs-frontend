// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext';

const ProtectedRoute = ({ children, allowedUserType, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  // Handle both allowedUserType (string) and allowedRoles (array)
  let roles = allowedRoles;
  if (allowedUserType && !roles.length) {
    roles = [allowedUserType];
  }
  
  // Check tab-specific session
  const tabToken = sessionStorage.getItem('tabToken');
  const tabUserType = sessionStorage.getItem('tabUserType');
  const token = sessionStorage.getItem('token');
  const userType = sessionStorage.getItem('userType');
  const userData = sessionStorage.getItem('user');
  const currentTabId = sessionStorage.getItem('currentTabId');
  const sessionTabId = sessionStorage.getItem('tabId');
  
  console.log("ProtectedRoute - Checking auth:", { 
    tabToken: !!tabToken,
    tabUserType,
    tokenExists: !!token, 
    userType, 
    contextAuth: isAuthenticated,
    loading,
    path: window.location.pathname,
    requiredRoles: roles,
    currentTabId,
    sessionTabId
  });
  
  // Wait for loading to complete
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your session...</p>
        </div>
      </div>
    );
  }
  
  // Check if this tab has a valid session
  const hasTabSession = tabToken && tabToken === token;
  const hasLocalData = token && userType && userData;
  const isAuth = isAuthenticated || (hasLocalData && hasTabSession);
  
  // If not authenticated, redirect to login
  if (!isAuth) {
    const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
    console.log("Not authenticated, redirecting to login");
    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
  }
  
  // Check role if required
  if (roles.length > 0) {
    const role = tabUserType || userType || user?.userType || user?.role;
    console.log("Role check - User role:", role, "Required roles:", roles);
    
    if (!roles.includes(role)) {
      console.log("Role not allowed, redirecting to appropriate page");
      if (role === 'admin') {
        return <Navigate to="/admin" replace />;
      } else if (role === 'student') {
        return <Navigate to="/dashboard" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

export default ProtectedRoute;