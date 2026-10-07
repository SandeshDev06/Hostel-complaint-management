import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';

const BLOCKS = ['Block A', 'Block B', 'Block C', 'Block D', 'PG Block'];

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { studentComplaints, studentStats } = useComplaints();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    roomNumber: user?.roomNumber || '',
    hostelBlock: user?.hostelBlock || 'Block A',
    phone: user?.phone || '+91 98765 43210'
  });

  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setSuccessMsg('Profile information updated successfully!');
    setIsEditing(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Student Profile</h3>
          <p className="text-muted small mb-0">Manage your resident credentials and room allocation details</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1.5"
          >
            <i className="bi bi-pencil-square"></i>
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Profile Avatar Card */}
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center bg-white rounded-3">
            <div
              className="rounded-circle mx-auto d-flex align-items-center justify-content-center text-white display-5 fw-bold mb-3 shadow"
              style={{ width: '96px', height: '96px', backgroundColor: '#4f46e5' }}
            >
              {user?.name?.charAt(0) || 'S'}
            </div>
            <h5 className="fw-bold text-dark mb-1">{user?.name || 'Student Resident'}</h5>
            <p className="text-muted small mb-2">{user?.email}</p>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill">
              Registered Hostel Resident
            </span>

            <hr className="my-3 text-secondary opacity-25" />

            <div className="row g-2 text-center">
              <div className="col-6">
                <div className="p-2 rounded bg-light border">
                  <div className="fw-bold text-primary fs-5">{studentStats.total}</div>
                  <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Complaints</div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 rounded bg-light border">
                  <div className="fw-bold text-success fs-5">{studentStats.resolved}</div>
                  <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Resolved</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information / Edit Form */}
        <div className="col-12 col-md-8">
          <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
              {isEditing ? 'Edit Profile Information' : 'Resident Information'}
            </h5>

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark small">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark small">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark small">Hostel Block</label>
                    <select
                      name="hostelBlock"
                      className="form-select"
                      value={formData.hostelBlock}
                      onChange={handleChange}
                    >
                      {BLOCKS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark small">Room Number</label>
                    <input
                      type="text"
                      name="roomNumber"
                      className="form-control"
                      value={formData.roomNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark small">Contact Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <span className="text-muted small d-block">Full Name</span>
                  <span className="fw-semibold text-dark fs-6">{user?.name}</span>
                </div>

                <div className="col-12 col-sm-6">
                  <span className="text-muted small d-block">College Email</span>
                  <span className="fw-semibold text-dark fs-6">{user?.email}</span>
                </div>

                <div className="col-12 col-sm-6">
                  <span className="text-muted small d-block">Hostel Block</span>
                  <span className="badge bg-light text-dark border px-2.5 py-1.5 fs-6">
                    <i className="bi bi-building me-1 text-primary"></i>
                    {user?.hostelBlock || 'Block A'}
                  </span>
                </div>

                <div className="col-12 col-sm-6">
                  <span className="text-muted small d-block">Room Number</span>
                  <span className="badge bg-light text-dark border px-2.5 py-1.5 fs-6">
                    <i className="bi bi-door-closed me-1 text-primary"></i>
                    {user?.roomNumber || 'A-204'}
                  </span>
                </div>

                <div className="col-12 col-sm-6">
                  <span className="text-muted small d-block">Phone Number</span>
                  <span className="fw-semibold text-dark fs-6">{user?.phone || '+91 98765 43210'}</span>
                </div>

                <div className="col-12 col-sm-6">
                  <span className="text-muted small d-block">Resident Status</span>
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 fs-6">
                    Active Resident
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
