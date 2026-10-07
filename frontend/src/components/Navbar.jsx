import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, isStudent, isAdmin, quickLogin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleToggleRole = () => {
    if (isStudent) {
      quickLogin('admin');
      navigate('/admin/dashboard');
    } else {
      quickLogin('student');
      navigate('/student/dashboard');
    }
  };

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top glass-nav">
      <div className="container-fluid px-3 px-lg-4">
        {/* Mobile Sidebar Toggle Button */}
        {isAuthenticated && !isPublicPage && (
          <button
            className="btn btn-outline-light btn-sm me-2 d-lg-none"
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
          >
            <i className="bi bi-list fs-5"></i>
          </button>
        )}

        {/* Brand Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white tracking-wide">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center text-white brand-badge"
            style={{ width: '34px', height: '34px' }}
          >
            <i className="bi bi-building-check fs-6"></i>
          </div>
          <span>HostelCare</span>
        </Link>

        {/* Right Nav Options */}
        <div className="d-flex align-items-center gap-2 ms-auto">
          {isAuthenticated && (
            <>
              {/* Quick Role Switcher for seamless college presentation */}
              <button
                type="button"
                className="btn btn-sm btn-outline-light rounded-pill px-2.5 py-1 d-none d-sm-inline-flex align-items-center gap-1.5"
                onClick={handleToggleRole}
                title="Quick demo switch between Student and Admin"
                style={{ fontSize: '0.8rem', opacity: 0.9 }}
              >
                <i className="bi bi-arrow-left-right text-warning"></i>
                <span>Switch to {isStudent ? 'Admin' : 'Student'}</span>
              </button>

              {/* User badge */}
              <div className="d-flex align-items-center gap-2 ms-1 me-2 text-white">
                <span
                  className={`badge rounded-pill px-2.5 py-1 text-uppercase ${
                    isAdmin ? 'bg-danger-subtle text-danger' : 'bg-primary-subtle text-primary'
                  }`}
                  style={{ fontSize: '0.75rem', fontWeight: 600 }}
                >
                  {isAdmin ? 'Admin' : 'Student'}
                </span>
                {user?.picture && (
                  <img src={user.picture} alt="" className="user-avatar" style={{ width: 30, height: 30 }} referrerPolicy="no-referrer" />
                )}
                <span className="small d-none d-md-inline fw-medium text-white-50">
                  {user?.name}
                </span>
              </div>

              {/* Logout button */}
              <button
                type="button"
                className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right"></i>
                <span className="d-none d-sm-inline">Logout</span>
              </button>
            </>
          )}

          {!isAuthenticated && (
            <div className="d-flex align-items-center gap-2">
              <Link to="/" className="btn btn-sm btn-link text-white-50 text-decoration-none d-none d-sm-inline">
                Home
              </Link>
              <Link to="/login" className="btn btn-sm btn-outline-light">
                Login
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
