import React from 'react';

const PriorityBadge = ({ priority }) => {
  let badgeClass = 'bg-secondary-subtle text-secondary';
  let dotColor = '#64748b';

  switch (priority) {
    case 'Urgent':
      badgeClass = 'bg-danger-subtle text-danger border border-danger-subtle';
      dotColor = '#dc3545';
      break;
    case 'High':
      badgeClass = 'bg-warning-subtle text-warning-emphasis border border-warning-subtle';
      dotColor = '#d97706';
      break;
    case 'Medium':
      badgeClass = 'bg-primary-subtle text-primary border border-primary-subtle';
      dotColor = '#4f46e5';
      break;
    case 'Low':
      badgeClass = 'bg-light text-muted border';
      dotColor = '#94a3b8';
      break;
    default:
      badgeClass = 'bg-light text-muted border';
      dotColor = '#94a3b8';
  }

  return (
    <span className={`badge rounded-pill px-2.5 py-1 fw-medium d-inline-flex align-items-center gap-1.5 ${badgeClass}`} style={{ fontSize: '0.8rem' }}>
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          display: 'inline-block'
        }}
      ></span>
      <span>{priority || 'Normal'}</span>
    </span>
  );
};

export default PriorityBadge;
