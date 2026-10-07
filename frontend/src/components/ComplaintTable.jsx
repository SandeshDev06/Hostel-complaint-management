import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

const ComplaintTable = ({
  complaints = [],
  role = 'student',
  onDelete = null,
  isRecent = false
}) => {
  if (!complaints || complaints.length === 0) {
    return (
      <div className="text-center py-5 bg-white rounded border">
        <i className="bi bi-inbox text-muted display-5 d-block mb-2"></i>
        <h6 className="fw-semibold text-dark">No complaints found</h6>
        <p className="text-muted small mb-3">
          {role === 'student'
            ? "You haven't submitted any complaints matching this criteria."
            : 'No student complaints match the applied filters.'}
        </p>
        {role === 'student' && (
          <Link to="/student/complaints/new" className="btn btn-sm btn-primary">
            <i className="bi bi-plus-circle me-1"></i> Submit New Complaint
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="table-responsive bg-white rounded border shadow-sm">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th className="ps-3 py-3">Complaint ID</th>
            {role === 'admin' && <th>Student</th>}
            <th>Category</th>
            <th>Room</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Date</th>
            <th className="text-end pe-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((item) => (
            <tr key={item.id} className="transition-all">
              <td className="ps-3 fw-bold text-primary font-monospace">
                {item.id}
              </td>
              {role === 'admin' && (
                <td>
                  <div className="d-flex flex-column">
                    <span className="fw-semibold text-dark">{item.studentName}</span>
                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                      {item.hostelBlock || 'Hostel'}
                    </span>
                  </div>
                </td>
              )}
              <td>
                <span className="fw-medium text-dark">{item.category}</span>
              </td>
              <td>
                <span className="badge bg-light text-dark border px-2 py-1">
                  <i className="bi bi-door-closed me-1 text-muted"></i>
                  {item.roomNumber}
                </span>
              </td>
              <td>
                <PriorityBadge priority={item.priority} />
              </td>
              <td>
                <StatusBadge status={item.status} />
              </td>
              <td className="text-muted small">
                {item.date}
              </td>
              <td className="text-end pe-3">
                <div className="btn-group btn-group-sm">
                  {role === 'admin' ? (
                    <Link
                      to={`/admin/complaints/${item.id}`}
                      className="btn btn-outline-primary"
                      title="Manage Complaint"
                    >
                      <i className="bi bi-pencil-square me-1"></i> Manage
                    </Link>
                  ) : (
                    <Link
                      to={`/student/complaints/${item.id}`}
                      className="btn btn-outline-primary"
                      title="View Details"
                    >
                      <i className="bi bi-eye me-1"></i> View
                    </Link>
                  )}

                  {role === 'student' && onDelete && item.status === 'Pending' && (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => onDelete(item.id)}
                      title="Cancel Complaint"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintTable;
