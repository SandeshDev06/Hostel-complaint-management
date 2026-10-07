import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import Timeline from '../../components/Timeline';

const STATUS_OPTIONS = ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];

const ComplaintManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getComplaintById, modifyComplaintStatus } = useComplaints();

  const complaint = getComplaintById(id);

  const [status, setStatus] = useState(complaint?.status || 'Pending');
  const [assignedTo, setAssignedTo] = useState(complaint?.assignedTo || '');
  const [adminRemarks, setAdminRemarks] = useState(complaint?.adminRemarks || '');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status);
      setAssignedTo(complaint.assignedTo || '');
      setAdminRemarks(complaint.adminRemarks || '');
    }
  }, [complaint]);

  if (!complaint) {
    return (
      <div className="card border-0 shadow-sm p-5 text-center my-4 bg-white">
        <i className="bi bi-search display-5 text-muted mb-3"></i>
        <h4 className="fw-bold">Complaint Not Found</h4>
        <p className="text-muted">The complaint record for ID '{id}' was not found.</p>
        <Link to="/admin/complaints" className="btn btn-primary btn-sm px-4 mx-auto">
          Return to Complaints List
        </Link>
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const result = await modifyComplaintStatus(complaint.id, {
      status,
      assignedTo: assignedTo.trim() || 'Warden Office',
      adminRemarks: adminRemarks.trim()
    });

    setSaving(false);

    if (result.success) {
      setFeedback({
        type: 'success',
        message: `Complaint ${complaint.id} status successfully updated to "${status}"!`
      });
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback({
        type: 'danger',
        message: result.error || 'Failed to update complaint'
      });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-primary-subtle text-primary font-monospace px-2.5 py-1">
              {complaint.id}
            </span>
            <span className="text-muted small">&bull; Submitted on {complaint.date}</span>
          </div>
          <h3 className="fw-bold text-dark mb-0">Complaint Management: {complaint.category}</h3>
        </div>
        <Link to="/admin/complaints" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1"></i> Back to All Complaints
        </Link>
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show`} role="alert">
          <i className={`bi ${feedback.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
          {feedback.message}
          <button type="button" className="btn-close" onClick={() => setFeedback(null)}></button>
        </div>
      )}

      {/* Visual Status Timeline */}
      <Timeline
        currentStatus={complaint.status}
        submissionDate={complaint.date}
        resolutionDate={complaint.resolutionDate}
        assignedTo={complaint.assignedTo}
      />

      <div className="row g-4">
        {/* Left Column: Complaint Details & Student Info */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm p-4 bg-white mb-4">
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">Issue Details</h5>
            <p className="text-dark lh-base" style={{ whiteSpace: 'pre-line' }}>
              {complaint.description}
            </p>

            {complaint.imageUrl && (
              <div className="mt-3 pt-3 border-top">
                <h6 className="fw-semibold text-dark mb-2">Student Photo Attachment:</h6>
                <div className="rounded overflow-hidden border" style={{ maxWidth: '400px' }}>
                  <img
                    src={complaint.imageUrl}
                    alt="Problem attachment"
                    className="img-fluid"
                    style={{ maxHeight: '280px', objectFit: 'cover', width: '100%' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Snapshot */}
          <div className="card border-0 shadow-sm p-4 bg-white">
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-person-circle text-primary"></i>
              Complainant Information
            </h5>

            <div className="row g-3 small">
              <div className="col-12 col-sm-6">
                <span className="text-muted d-block">Student Name</span>
                <span className="fw-bold text-dark fs-6">{complaint.studentName}</span>
              </div>

              <div className="col-12 col-sm-6">
                <span className="text-muted d-block">Email Address</span>
                <span className="fw-semibold text-dark">{complaint.studentEmail}</span>
              </div>

              <div className="col-12 col-sm-6">
                <span className="text-muted d-block">Hostel Block</span>
                <span className="badge bg-light text-dark border px-2 py-1">
                  {complaint.hostelBlock || 'Block A'}
                </span>
              </div>

              <div className="col-12 col-sm-6">
                <span className="text-muted d-block">Room Number</span>
                <span className="badge bg-light text-dark border px-2 py-1">
                  {complaint.roomNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Admin Action & Status Update Form */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm p-4 bg-white border-top border-4 border-primary">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-sliders text-primary"></i>
              Administrative Action
            </h5>

            <form onSubmit={handleUpdate}>
              {/* Status Dropdown */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark small">
                  Update Status <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <div className="mt-1">
                  <small className="text-muted">Current Badge: </small>
                  <StatusBadge status={status} />
                </div>
              </div>

              {/* Priority Display */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark small d-block">Complaint Priority</label>
                <PriorityBadge priority={complaint.priority} />
              </div>

              {/* Assigned Staff */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark small">
                  Assigned Personnel / Technician
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-person-wrench"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Mr. Suresh (Electrician) / IT Desk"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  />
                </div>
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                  Technician or department responsible for resolution
                </small>
              </div>

              {/* Resolution Remarks */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-dark small">
                  Resolution Remarks & Notes
                </label>
                <textarea
                  rows="4"
                  className="form-control"
                  placeholder="Record investigation findings, parts replaced, or justification if rejecting..."
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                ></textarea>
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                  Remarks will be visible to the student on their timeline
                </small>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-100 py-2.5 fw-semibold shadow-sm"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-1"></i> Update Complaint
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintManagement;
