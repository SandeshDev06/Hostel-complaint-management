import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { isStudent, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
    navigate('/login');
  };

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2' },
    { to: '/student/complaints/new', label: 'Submit Complaint', icon: 'bi-plus-circle-dotted' },
    { to: '/student/complaints', label: 'My Complaints', icon: 'bi-card-checklist' },
    { to: '/student/profile', label: 'Profile', icon: 'bi-person-circle' }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/admin/complaints', label: 'All Complaints', icon: 'bi-collection' },
    { to: '/admin/students', label: 'Students', icon: 'bi-people' },
    { to: '/admin/profile', label: 'Profile', icon: 'bi-shield-lock' }
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  const sidebarContent = (
    <div className="d-flex flex-column h-100 p-3 bg-white">
      {/* User Info Capsule */}
      <div className="p-3 mb-3 rounded-3 glass">
        <div className="d-flex align-items-center gap-2.5">
          {user?.picture ? (
            <img src={user.picture} alt="" className="user-avatar shadow-sm" referrerPolicy="no-referrer" />
          ) : (
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
              style={{
                width: '40px',
                height: '40px',
                background: isAdmin ? 'linear-gradient(135deg,#ef4444,#f97316)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)'
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div className="overflow-hidden">
            <h6 className="mb-0 text-truncate fw-semibold text-dark">{user?.name || 'User'}</h6>
            <span className="small text-muted d-block text-truncate">
              {isAdmin ? 'Administrator' : `Room ${user?.roomNumber || 'A-204'}`}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation section label */}
      <div className="text-uppercase text-muted fw-bold px-2 mb-2" style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}>
        {isAdmin ? 'Admin Portal' : 'Student Portal'}
      </div>

      {/* Nav items */}
      <ul className="nav nav-pills flex-column mb-auto">
        {links.map((link) => (
          <li className="nav-item mb-1" key={link.to}>
            <NavLink
              to={link.to}
              end={link.to.endsWith('dashboard')}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2.5 ${
                  isActive ? 'active shadow-sm' : ''
                }`
              }
            >
              <i className={`bi ${link.icon} fs-5`}></i>
              <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <hr className="my-3 text-secondary opacity-25" />

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2"
      >
        <i className="bi bi-box-arrow-right"></i>
        <span>Logout</span>
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="sidebar d-none d-lg-block border-end">
        {sidebarContent}
      </aside>

      {/* Mobile Offcanvas Drawer */}
      <div
        className={`offcanvas offcanvas-start d-lg-none ${isOpen ? 'show' : ''}`}
        tabIndex="-1"
        style={{ visibility: isOpen ? 'visible' : 'hidden' }}
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fw-bold text-dark d-flex align-items-center gap-2">
            <i className="bi bi-building-check text-primary"></i>
            HostelCare Menu
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body p-0">
          {sidebarContent}
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="offcanvas-backdrop fade show d-lg-none"
          onClick={onClose}
          style={{ zIndex: 1040 }}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
