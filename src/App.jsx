import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CertificateVerify from "./pages/CertificateVerify";  // Keep only one import
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import PaymentPage from "./pages/PaymentPage";
import PaymentPending from "./pages/PaymentPending";
import MyCourses from "./pages/MyCourses";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Internship from "./pages/Internship";
import InternshipDetail from "./pages/InternshipDetail"; 
import PaymentVerification from './pages/PaymentVerification';
import AdminPayments from './pages/AdminPayments';
import InternshipPayment from './pages/InternshipPayment';
import MyInternships from './pages/MyInternships';
import StudentCourseManager from "./components/StudentCourseManager";
import ProtectedRoute from './components/ProtectedRoute';


// New Certificate Management Pages
import CertificateManagement from './pages/CertificateManagement';
import MyCertificates from './pages/MyCertificates';
// CertificateVerify is already imported above - DO NOT IMPORT AGAIN

const queryClient = new QueryClient();

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/verify-certificate" element={<CertificateVerify />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-certificate" element={<CertificateVerify />} />
          
          {/* Protected Routes - Student */}
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Cart />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <PaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment-pending" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <PaymentPending />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment-verification" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <PaymentVerification />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-courses" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyCourses />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-certificates" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyCertificates />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/internship" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Internship />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/internship/:id" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <InternshipDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/internship-payment/:internshipId" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <InternshipPayment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-internships" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyInternships />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes - Admin */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/payments" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPayments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/certificates" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CertificateManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student-course-manager" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <StudentCourseManager />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <CartProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <AppContent />
          </Router>
        </CartProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App; 