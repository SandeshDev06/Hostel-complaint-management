import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Layout
import DashboardLayout from './components/DashboardLayout';
import BackgroundBlobs from './components/BackgroundBlobs';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import NewComplaint from './pages/student/NewComplaint';
import MyComplaints from './pages/student/MyComplaints';
import ComplaintDetails from './pages/student/ComplaintDetails';
import StudentProfile from './pages/student/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaints from './pages/admin/Complaints';
import AdminComplaintManagement from './pages/admin/ComplaintManagement';
import AdminStudents from './pages/admin/Students';
import AdminProfile from './pages/admin/Profile';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, quickLogin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and user has different role,
  // automatically adapt demo role or redirect to their matching dashboard
  if (requiredRole && user?.role !== requiredRole) {
    if (requiredRole === 'admin') {
      return <Navigate to="/student/dashboard" replace />;
    } else {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <>
    <BackgroundBlobs />
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Portal Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="complaints/new" element={<NewComplaint />} />
        <Route path="complaints" element={<MyComplaints />} />
        <Route path="complaints/:id" element={<ComplaintDetails />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Admin Portal Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="complaints/:id" element={<AdminComplaintManagement />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

export default App;
