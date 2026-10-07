import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import ComplaintTable from '../../components/ComplaintTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const FILTERS = [
  { key: 'All', label: 'All' },
  { key: 'Pending', label: 'Pending' },
  { key: 'Active', label: 'In Progress' },
  { key: 'Resolved', label: 'Resolved' }
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const { studentComplaints, studentStats, loading } = useComplaints();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const matches = (c, key) =>
    key === 'All' ||
    (key === 'Active' ? c.status === 'In Progress' || c.status === 'Assigned' : c.status === key);

  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f.key, studentComplaints.filter((c) => matches(c, f.key)).length])),
    [studentComplaints]
  );

  const recentComplaints = useMemo(
    () => studentComplaints.filter((c) => matches(c, filter)).slice(0, 5),
    [studentComplaints, filter]
  );

  const resolvedPct = studentStats.total ? Math.round((studentStats.resolved / studentStats.total) * 100) : 0;
  const R = 52;
  const C = 2 * Math.PI * R;

  const go = (status) => navigate(status ? `/student/complaints?status=${encodeURIComponent(status)}` : '/student/complaints');

  return (
    <div>
      {/* Welcome Banner */}
      <div className="card banner-card banner-student p-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <span className="badge badge-light-pill px-3 py-2 rounded-pill mb-2">
              <i className="bi bi-mortarboard-fill me-1"></i> Student Resident Portal
            </span>
            <h2 className="fw-bold mb-1">{greeting()}, {user?.name?.split(' ')[0] || 'Student'}! 👋</h2>
            <p className="mb-3 banner-sub">
              Hostel Block: <strong>{user?.hostelBlock || 'Block A'}</strong> &bull; Room: <strong>{user?.roomNumber || 'A-204'}</strong>
            </p>
            <Link to="/student/complaints/new" className="btn btn-light px-4 py-2 shadow-sm d-inline-flex align-items-center gap-2">
              <i className="bi bi-plus-circle-fill"></i> Submit New Complaint
            </Link>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="ring-wrap">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle className="ring-bg" cx="60" cy="60" r={R} fill="none" strokeWidth="10" />
                <circle className="ring-fg" cx="60" cy="60" r={R} fill="none" strokeWidth="10"
                  strokeDasharray={C} strokeDashoffset={C - (C * resolvedPct) / 100} />
              </svg>
              <div className="ring-text">{resolvedPct}%<small>RESOLVED</small></div>
            </div>
            <div className="banner-sub small d-none d-sm-block">
              <div className="fw-bold fs-6 text-white">Your resolution rate</div>
              {studentStats.resolved} of {studentStats.total} complaints solved
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards (click to open filtered list) */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Total Complaints" value={studentStats.total} icon="bi-folder2-open" color="primary" subtitle="All logged grievances" onClick={() => go()} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Pending" value={studentStats.pending} icon="bi-clock-history" color="warning" subtitle="Awaiting admin review" onClick={() => go('Pending')} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="In Progress" value={studentStats.inProgress} icon="bi-gear-wide-connected" color="info" subtitle="Assigned / work ongoing" onClick={() => go('In Progress')} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Resolved" value={studentStats.resolved} icon="bi-check2-circle" color="success" subtitle="Successfully resolved" onClick={() => go('Resolved')} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="row g-3 mb-4">
        {[
          { to: '/student/complaints/new', icon: 'bi-plus-lg', bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', title: 'New Complaint', sub: 'Report a hostel problem' },
          { to: '/student/complaints', icon: 'bi-search', bg: 'linear-gradient(135deg,#06b6d4,#3b82f6)', title: 'Track Complaints', sub: 'Search & filter all tickets' },
          { to: '/student/profile', icon: 'bi-person-gear', bg: 'linear-gradient(135deg,#f59e0b,#ef4444)', title: 'My Profile', sub: 'Update room & contact' }
        ].map((a) => (
          <div className="col-12 col-md-4" key={a.to}>
            <Link to={a.to} className="card card-hover action-tile">
              <span className="tile-icon" style={{ background: a.bg }}><i className={`bi ${a.icon}`}></i></span>
              <span>
                <span className="tile-title">{a.title}</span>
                <span className="tile-sub">{a.sub}</span>
              </span>
              <i className="bi bi-chevron-right ms-auto text-primary"></i>
            </Link>
          </div>
        ))}
      </div>

      {/* Recent complaints with interactive chips */}
      <div className="card p-4 mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3">
          <div>
            <h5 className="section-title"><span className="title-icon"><i className="bi bi-clock-history"></i></span>Recent Complaints</h5>
            <div className="section-sub mt-1">Your most recent hostel problem reports</div>
          </div>
          <Link to="/student/complaints" className="btn btn-sm btn-outline-primary">
            View All ({studentComplaints.length}) <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-3">
          {FILTERS.map((f) => (
            <button key={f.key} type="button" className={`chip ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
              {f.label} <span className="count">{counts[f.key]}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner message="Loading your recent complaints..." />
        ) : (
          <ComplaintTable complaints={recentComplaints} role="student" isRecent={true} />
        )}
      </div>

      {/* Tips */}
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="card tip-card p-4 h-100" style={{ borderLeft: '5px solid #f59e0b' }}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-lightning-charge-fill text-warning fs-4"></i>
              <h6 className="fw-bold mb-0">Emergency Guidelines</h6>
            </div>
            <p className="mb-0 text-muted">
              For life-threatening emergencies, severe electrical sparking, or pipe bursts at night, alert the ground floor warden desk or call <strong className="text-dark">+91 94220 11223</strong> immediately.
            </p>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card tip-card p-4 h-100" style={{ borderLeft: '5px solid #06b6d4' }}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-info-circle-fill text-info fs-4"></i>
              <h6 className="fw-bold mb-0">Resolution Timelines</h6>
            </div>
            <p className="mb-0 text-muted">
              High &amp; Urgent complaints are inspected within <strong className="text-dark">4 to 12 hours</strong>. Normal tickets are resolved within <strong className="text-dark">24 to 48 hours</strong>. Open any complaint to see technician remarks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
