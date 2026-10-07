import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';

const AdminProfile = () => {
  const { user } = useAuth();
  const { adminStats } = useComplaints();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Administrator Profile</h3>
          <p className="text-muted small mb-0">Official hostel warden credentials and administrative privileges</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Warden Card */}
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center bg-white rounded-3">
            <div
              className="rounded-circle mx-auto d-flex align-items-center justify-content-center text-white display-5 fw-bold mb-3 shadow"
              style={{ width: '96px', height: '96px', backgroundColor: '#ef4444' }}
            >
              {user?.name?.charAt(0) || 'W'}
            </div>
            <h5 className="fw-bold text-dark mb-1">{user?.name || 'Chief Warden'}</h5>
            <p className="text-muted small mb-2">{user?.email || 'admin@hostelcare.com'}</p>
            <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-1 rounded-pill">
              Hostel Warden / Administrator
            </span>

            <hr className="my-3 text-secondary opacity-25" />

            <div className="row g-2 text-center">
              <div className="col-6">
                <div className="p-2 rounded bg-light border">
                  <div className="fw-bold text-primary fs-5">{adminStats.total}</div>
                  <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Campus Tickets</div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 rounded bg-light border">
                  <div className="fw-bold text-success fs-5">{adminStats.resolved}</div>
                  <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Resolved</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Administration Info */}
        <div className="col-12 col-md-8">
          <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
              Official Administration Record
            </h5>

            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <span className="text-muted small d-block">Full Name</span>
                <span className="fw-semibold text-dark fs-6">{user?.name || 'Warden S. K. Ramesh'}</span>
              </div>

              <div className="col-12 col-sm-6">
                <span className="text-muted small d-block">Official Email</span>
                <span className="fw-semibold text-dark fs-6">{user?.email || 'admin@hostelcare.com'}</span>
              </div>

              <div className="col-12 col-sm-6">
                <span className="text-muted small d-block">Designation</span>
                <span className="badge bg-light text-dark border px-2.5 py-1.5 fs-6">
                  {user?.designation || 'Chief Hostel Warden'}
                </span>
              </div>

              <div className="col-12 col-sm-6">
                <span className="text-muted small d-block">Department</span>
                <span className="fw-semibold text-dark fs-6">
                  {user?.department || 'Hostel Administration & Estate Office'}
                </span>
              </div>

              <div className="col-12 col-sm-6">
                <span className="text-muted small d-block">Official Contact</span>
                <span className="fw-semibold text-dark fs-6">{user?.phone || '+91 94220 11223'}</span>
              </div>

              <div className="col-12 col-sm-6">
                <span className="text-muted small d-block">Access Level</span>
                <span className="badge bg-danger text-white px-2.5 py-1.5 fs-6">
                  Super Admin Privileges
                </span>
              </div>
            </div>

            <hr className="my-4 text-secondary opacity-25" />

            <h6 className="fw-bold text-dark mb-2">Administrative Responsibilities</h6>
            <ul className="text-muted small mb-0 ps-3">
              <li>Supervision of civil, electrical, plumbing, sanitation, and networking repairs in all student hostels.</li>
              <li>Assignment of campus maintenance contractors and college service personnel.</li>
              <li>Verification of resolution reports and closure of student grievances.</li>
              <li>Coordination with the campus Estate Officer for major capital expenditure repairs.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
