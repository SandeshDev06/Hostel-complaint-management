import React from 'react';

const Footer = () => {
  return (
    <footer className="glass-footer border-top py-3 mt-auto text-center text-muted">
      <div className="container">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <div className="fw-semibold text-dark d-flex align-items-center gap-1.5">
            <i className="bi bi-building-fill-gear text-primary"></i>
            <span>HostelCare – Hostel Complaint Management System</span>
          </div>
          <div className="small text-muted">
            Designed By 2403131 &bull; MERN Stack Frontend
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
