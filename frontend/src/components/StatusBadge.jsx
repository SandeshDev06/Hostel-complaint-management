import React from 'react';

const StatusBadge = ({ status }) => {
  let badgeClass = 'bg-secondary';
  let iconClass = 'bi-circle';

  switch (status) {
    case 'Pending':
      badgeClass = 'bg-warning text-dark';
      iconClass = 'bi-clock-history';
      break;
    case 'Assigned':
      badgeClass = 'bg-info text-dark';
      iconClass = 'bi-person-check';
      break;
    case 'In Progress':
      badgeClass = 'bg-primary text-white';
      iconClass = 'bi-arrow-repeat';
      break;
    case 'Resolved':
      badgeClass = 'bg-success text-white';
      iconClass = 'bi-check-circle-fill';
      break;
    case 'Rejected':
      badgeClass = 'bg-danger text-white';
      iconClass = 'bi-x-circle-fill';
      break;
    default:
      badgeClass = 'bg-secondary text-white';
      iconClass = 'bi-dash-circle';
  }

  return (
    <span className={`badge rounded-pill px-2.5 py-1.5 fw-medium d-inline-flex align-items-center gap-1.5 ${badgeClass}`} style={{ fontSize: '0.825rem' }}>
      <i className={`bi ${iconClass}`}></i>
      <span>{status || 'Unknown'}</span>
    </span>
  );
};

export default StatusBadge;
