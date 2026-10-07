import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon = 'bi-inbox',
  title = 'No complaints found',
  description = 'There are no complaints to display at this moment.',
  actionText,
  actionLink,
  onAction
}) => {
  return (
    <div className="card border-0 shadow-sm p-5 text-center my-4 bg-white">
      <div className="mb-3">
        <div
          className="mx-auto rounded-circle d-flex align-items-center justify-content-center bg-light text-muted"
          style={{ width: '70px', height: '70px' }}
        >
          <i className={`bi ${icon} display-6`}></i>
        </div>
      </div>
      <h5 className="fw-bold text-dark">{title}</h5>
      <p className="text-muted small mx-auto" style={{ maxWidth: '420px' }}>
        {description}
      </p>
      {(actionText && actionLink) && (
        <div className="mt-2">
          <Link to={actionLink} className="btn btn-primary btn-sm px-3">
            {actionText}
          </Link>
        </div>
      )}
      {(actionText && onAction) && (
        <div className="mt-2">
          <button onClick={onAction} className="btn btn-primary btn-sm px-3">
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
