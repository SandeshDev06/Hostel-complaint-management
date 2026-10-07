import React from 'react';
import useCountUp from '../hooks/useCountUp';

const StatCard = ({ title, value, icon, color = 'primary', subtitle, onClick }) => {
  const colorMap = {
    primary: {
      bg: 'rgba(79, 70, 229, 0.1)',
      text: '#4f46e5',
      border: 'rgba(79, 70, 229, 0.2)'
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.1)',
      text: '#d97706',
      border: 'rgba(245, 158, 11, 0.2)'
    },
    info: {
      bg: 'rgba(6, 182, 212, 0.1)',
      text: '#0891b2',
      border: 'rgba(6, 182, 212, 0.2)'
    },
    success: {
      bg: 'rgba(16, 185, 129, 0.1)',
      text: '#059669',
      border: 'rgba(16, 185, 129, 0.2)'
    },
    danger: {
      bg: 'rgba(239, 68, 68, 0.1)',
      text: '#dc2626',
      border: 'rgba(239, 68, 68, 0.2)'
    }
  };

  const scheme = colorMap[color] || colorMap.primary;
  const animated = useCountUp(value);
  const display = typeof value === 'number' ? animated : value;

  return (
    <div
      className="card h-100 border-0 stat-card"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick(); }}
      style={{ '--accent': scheme.text, cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="card-body p-3 ps-4">
        <div className="d-flex align-items-center justify-content-between gap-2">
          <div>
            <span className="stat-title">{title}</span>
            <div className="stat-value mt-1">{display}</div>
            {subtitle && <span className="stat-sub d-block mt-1">{subtitle}</span>}
          </div>
          <div
            className="stat-card-icon"
            style={{ backgroundColor: scheme.bg, color: scheme.text, border: `1px solid ${scheme.border}` }}
          >
            <i className={`bi ${icon}`}></i>
          </div>
        </div>
        {onClick && <i className="bi bi-arrow-right-circle-fill stat-go fs-5"></i>}
      </div>
    </div>
  );
};

export default StatCard;
