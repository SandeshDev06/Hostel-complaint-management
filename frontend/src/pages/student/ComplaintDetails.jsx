import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import Timeline from '../../components/Timeline';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getComplaintById, removeComplaint } = useComplaints();

  const complaint = getComplaintById(id);

  if (!complaint) {
    return (
      <div className="card border-0 shadow-sm p-5 text-center my-4 bg-white">
        <i className="bi bi-search display-5 text-muted mb-3"></i>
        <h4 className="fw-bold">Complaint Not Found</h4>
        <p className="text-muted">The complaint record for ID '{id}' does not exist or has been removed.</p>
        <Link to="/student/complaints" className="btn btn-primary btn-sm px-4 mx-auto">
          Return to My Complaints
        </Link>
      </div>
    );
  }

  const handleCancel = async () => {
    if (window.confirm(`Are you sure you want to cancel complaint ${complaint.id}?`)) {
      await removeComplaint(complaint.id);
      navigate('/student/complaints');
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
            <span className="text-muted small">&bull; Logged on {complaint.date}</span>
          </div>
          <h3 className="fw-bold text-dark mb-0">{complaint.category} Issue</h3>
        </div>
        <div className="d-flex gap-2">
          {complaint.status === 'Pending' && (
            <button
              onClick={handleCancel}
              className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1"
            >
              <i className="bi bi-trash"></i>
              <span>Cancel Complaint</span>
            </button>
          )}
          <Link to="/student/complaints" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i> Back to List
          </Link>
        </div>
      </div>

      {/* Visual Status Timeline Component */}
      <Timeline
        currentStatus={complaint.status}
        submissionDate={complaint.date}
        resolutionDate={complaint.resolutionDate}
        assignedTo={complaint.assignedTo}
      />

      {/* Complaint Information Cards */}
      <div className="row g-4">
        {/* Main Details */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm p-4 bg-white mb-4">
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">Problem Description</h5>
            <p className="text-dark lh-base" style={{ whiteSpace: 'pre-line' }}>
              {complaint.description}
            </p>

            {/* Attached Photo */}
            {complaint.imageUrl && (
              <div className="mt-4 pt-3 border-top">
                <h6 className="fw-semibold text-dark mb-2">Attached Problem Photo:</h6>
                <div className="rounded overflow-hidden border" style={{ maxWidth: '400px' }}>
                  <img
                    src={complaint.imageUrl}
                    alt="Complaint attachment"
                    className="img-fluid"
                    style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Admin Remarks & Resolution Section */}
          <div className="card border-0 shadow-sm p-4 bg-white">
            <h5 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-chat-left-dots text-primary"></i>
              Hostel Administration Remarks & Resolution
            </h5>

            {complaint.adminRemarks ? (
              <div className="p-3 bg-light rounded-3 border">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-semibold text-dark">
                    <i className="bi bi-person-badge me-1 text-primary"></i>
                    {complaint.assignedTo || 'Warden Office'}
                  </span>
                  {complaint.resolutionDate && (
                    <span className="badge bg-success-subtle text-success">
                      Resolved on {complaint.resolutionDate}
                    </span>
                  )}
                </div>
                <p className="small text-muted mb-0 mt-2">{complaint.adminRemarks}</p>
              </div>
            ) : (
              <div className="alert alert-light border text-muted small mb-0">
                <i className="bi bi-info-circle me-1"></i>
                No remarks added by the administration yet. A warden or technician will update this shortly.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info Card */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm p-4 bg-white mb-4">
            <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Ticket Information</h6>

            <ul className="list-group list-group-flush small">
              <li className="list-group-item px-0 py-2.5 d-flex justify-content-between align-items-center border-0 border-bottom">
                <span className="text-muted">Current Status</span>
                <StatusBadge status={complaint.status} />
              </li>
              <li className="list-group-item px-0 py-2.5 d-flex justify-content-between align-items-center border-0 border-bottom">
                <span className="text-muted">Priority</span>
                <PriorityBadge priority={complaint.priority} />
              </li>
              <li className="list-group-item px-0 py-2.5 d-flex justify-content-between align-items-center border-0 border-bottom">
                <span className="text-muted">Category</span>
                <span className="fw-semibold text-dark">{complaint.category}</span>
              </li>
              <li className="list-group-item px-0 py-2.5 d-flex justify-content-between align-items-center border-0 border-bottom">
                <span className="text-muted">Room Number</span>
                <span className="fw-semibold text-dark">{complaint.roomNumber}</span>
              </li>
              <li className="list-group-item px-0 py-2.5 d-flex justify-content-between align-items-center border-0 border-bottom">
                <span className="text-muted">Hostel Block</span>
                <span className="fw-semibold text-dark">{complaint.hostelBlock || 'Block A'}</span>
              </li>
              <li className="list-group-item px-0 py-2.5 d-flex justify-content-between align-items-center border-0 border-bottom">
                <span className="text-muted">Submitted Date</span>
                <span className="fw-semibold text-dark">{complaint.date}</span>
              </li>
              <li className="list-group-item px-0 py-2.5 d-flex justify-content-between align-items-center border-0">
                <span className="text-muted">Assigned Personnel</span>
                <span className="fw-semibold text-dark">{complaint.assignedTo || 'Unassigned'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
