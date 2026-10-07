import React from 'react';

const STEPS = [
  { id: 'Pending', label: 'Submitted', icon: 'bi-file-earmark-text' },
  { id: 'Assigned', label: 'Assigned', icon: 'bi-person-check' },
  { id: 'In Progress', label: 'In Progress', icon: 'bi-gear-wide-connected' },
  { id: 'Resolved', label: 'Resolved', icon: 'bi-check2-circle' }
];

const Timeline = ({ currentStatus, submissionDate, resolutionDate, assignedTo }) => {
  const isRejected = currentStatus === 'Rejected';

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Assigned':
        return 1;
      case 'In Progress':
        return 2;
      case 'Resolved':
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);
  const progressPercent = (currentIndex / (STEPS.length - 1)) * 100;

  return (
    <div className="card shadow-sm p-4 mb-4 border-0">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
          <i className="bi bi-clock-history text-primary"></i>
          Complaint Progress Timeline
        </h6>
        {isRejected && (
          <span className="badge bg-danger-subtle text-danger px-3 py-1.5 rounded-pill border border-danger-subtle">
            <i className="bi bi-x-circle me-1"></i> Complaint Rejected
          </span>
        )}
      </div>

      {isRejected ? (
        <div className="alert alert-danger d-flex align-items-center gap-3 my-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-3 text-danger"></i>
          <div>
            <div className="fw-semibold">This complaint has been reviewed and rejected by the administration.</div>
            <div className="small text-muted">Please refer to the admin remarks below for justification and policy guidelines.</div>
          </div>
        </div>
      ) : (
        <div className="position-relative py-3">
          {/* Progress Connecting Line */}
          <div
            className="position-absolute bg-light-subtle"
            style={{
              top: '32px',
              left: '12%',
              right: '12%',
              height: '4px',
              backgroundColor: '#e2e8f0',
              zIndex: 1
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                backgroundColor: '#4f46e5',
                transition: 'width 0.4s ease-in-out'
              }}
            ></div>
          </div>

          {/* Timeline Nodes */}
          <div className="d-flex justify-content-between position-relative" style={{ zIndex: 2 }}>
            {STEPS.map((step, idx) => {
              const isCompleted = idx < currentIndex;
              const isActive = idx === currentIndex;
              const isFuture = idx > currentIndex;

              let nodeBg = '#f1f5f9';
              let nodeColor = '#64748b';
              let nodeBorder = '2px solid #cbd5e1';

              if (isCompleted) {
                nodeBg = '#10b981';
                nodeColor = '#ffffff';
                nodeBorder = '2px solid #10b981';
              } else if (isActive) {
                nodeBg = '#4f46e5';
                nodeColor = '#ffffff';
                nodeBorder = '4px solid #c7d2fe';
              }

              return (
                <div
                  key={step.id}
                  className="d-flex flex-column align-items-center text-center"
                  style={{ width: '22%' }}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style={{
                      width: '44px',
                      height: '44px',
                      backgroundColor: nodeBg,
                      color: nodeColor,
                      border: nodeBorder,
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isCompleted ? (
                      <i className="bi bi-check-lg fw-bold"></i>
                    ) : (
                      <i className={`bi ${step.icon}`}></i>
                    )}
                  </div>
                  <div className="mt-2">
                    <span
                      className={`d-block small ${
                        isActive
                          ? 'fw-bold text-primary'
                          : isCompleted
                          ? 'fw-semibold text-dark'
                          : 'text-muted'
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {idx === 0 && submissionDate ? submissionDate : ''}
                      {idx === 1 && assignedTo ? assignedTo.split(' ')[0] : ''}
                      {idx === 3 && resolutionDate ? resolutionDate : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
