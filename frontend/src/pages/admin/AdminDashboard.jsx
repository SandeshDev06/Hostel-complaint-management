import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import ComplaintTable from '../../components/ComplaintTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useComplaints } from '../../context/ComplaintContext';

const CAT_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6'];

const FILTERS = ['All', 'Pending', 'Assigned', 'In Progress', 'Resolved'];

const AdminDashboard = () => {
  const { complaints, adminStats, loading } = useComplaints();
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);
  const [hl, setHl] = useState(null); // highlighted pipeline status
  const [filter, setFilter] = useState('All');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    const clock = setInterval(() => setNow(new Date()), 30000);
    return () => { clearTimeout(t); clearInterval(clock); };
  }, []);

  const recentComplaints = useMemo(
    () => complaints.filter((c) => filter === 'All' || c.status === filter).slice(0, 6),
    [complaints, filter]
  );

  const categoryCounts = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});
  const categories = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]);
  const maxCategoryCount = Math.max(...Object.values(categoryCounts), 1);

  const total = adminStats.total || 1;
  const pct = (n) => Math.round((n / total) * 100);

  const pipeline = [
    { key: 'Pending', label: 'Pending Review', n: adminStats.pending, color: '#f59e0b' },
    { key: 'Assigned', label: 'Assigned to Technicians', n: adminStats.assigned, color: '#06b6d4' },
    { key: 'In Progress', label: 'Work In Progress', n: adminStats.inProgress, color: '#6366f1' },
    { key: 'Resolved', label: 'Resolved & Closed', n: adminStats.resolved, color: '#10b981' }
  ];

  const urgentOpen = complaints.filter(
    (c) => (c.priority === 'Urgent' || c.priority === 'High') && c.status !== 'Resolved' && c.status !== 'Rejected'
  ).length;

  const goStatus = (s) => navigate(s ? `/admin/complaints?status=${encodeURIComponent(s)}` : '/admin/complaints');
  const goCat = (c) => navigate(`/admin/complaints?category=${encodeURIComponent(c)}`);

  return (
    <div>
      {/* Header Banner */}
      <div className="card banner-card banner-admin p-4 mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <span className="badge badge-light-pill px-3 py-2 rounded-pill mb-2">
              <i className="bi bi-shield-check me-1"></i> Hostel Administration &amp; Warden Portal
            </span>
            <h2 className="fw-bold mb-1">Estate &amp; Grievance Overview</h2>
            <p className="mb-0 banner-sub">
              <span className="live-dot me-2"></span>
              Live monitoring &bull; {now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })},{' '}
              {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/admin/complaints" className="btn btn-light px-3 py-2">
              <i className="bi bi-list-task me-1"></i> Manage Complaints
            </Link>
            <Link to="/admin/students" className="btn btn-outline-light px-3 py-2">
              <i className="bi bi-people me-1"></i> Student Roster
            </Link>
          </div>
        </div>
      </div>

      {/* Attention strip */}
      {urgentOpen > 0 && (
        <div
          className="card card-hover mb-4 p-3 d-flex flex-row align-items-center gap-3 cursor-pointer"
          style={{ borderLeft: '5px solid #ef4444' }}
          onClick={() => navigate('/admin/complaints')}
          role="button"
        >
          <span className="tile-icon d-flex align-items-center justify-content-center text-white rounded-3" style={{ width: 42, height: 42, background: 'linear-gradient(135deg,#ef4444,#f97316)' }}>
            <i className="bi bi-exclamation-triangle-fill"></i>
          </span>
          <div>
            <div className="fw-bold text-dark">{urgentOpen} high-priority complaint{urgentOpen > 1 ? 's' : ''} still open</div>
            <div className="section-sub">Click to review and assign technicians</div>
          </div>
          <i className="bi bi-chevron-right ms-auto text-danger fs-5"></i>
        </div>
      )}

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-4 col-xl">
          <StatCard title="Total Complaints" value={adminStats.total} icon="bi-collection" color="primary" subtitle="Campus wide" onClick={() => goStatus()} />
        </div>
        <div className="col-12 col-sm-6 col-lg-4 col-xl">
          <StatCard title="Pending" value={adminStats.pending} icon="bi-hourglass-top" color="warning" subtitle="Needs assignment" onClick={() => goStatus('Pending')} />
        </div>
        <div className="col-12 col-sm-6 col-lg-4 col-xl">
          <StatCard title="Assigned" value={adminStats.assigned} icon="bi-person-check" color="info" subtitle="Technician dispatched" onClick={() => goStatus('Assigned')} />
        </div>
        <div className="col-12 col-sm-6 col-lg-4 col-xl">
          <StatCard title="In Progress" value={adminStats.inProgress} icon="bi-gear-wide-connected" color="primary" subtitle="Work underway" onClick={() => goStatus('In Progress')} />
        </div>
        <div className="col-12 col-sm-6 col-lg-4 col-xl">
          <StatCard title="Resolved" value={adminStats.resolved} icon="bi-check2-all" color="success" subtitle="Closed tickets" onClick={() => goStatus('Resolved')} />
        </div>
      </div>

      {/* Analytics */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-7">
          <div className="card p-4 h-100">
            <div className="d-flex justify-content-between align-items-start mb-3 gap-2">
              <div>
                <h5 className="section-title"><span className="title-icon"><i className="bi bi-bar-chart-line"></i></span>Complaints by Category</h5>
                <div className="section-sub mt-1">Click a bar to open those complaints</div>
              </div>
              <span className="badge bg-primary-subtle px-3 py-2 rounded-pill"><span className="live-dot me-1"></span> Live</span>
            </div>

            {categories.length === 0 && <div className="text-muted">No complaints yet.</div>}
            <div className="d-flex flex-column gap-1">
              {categories.map((cat, i) => {
                const count = categoryCounts[cat];
                const width = Math.round((count / maxCategoryCount) * 100);
                return (
                  <div key={cat} className="bar-row" onClick={() => goCat(cat)} title={`View ${cat} complaints`}>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="bar-label">{cat}</span>
                      <span className="bar-value">{count} complaint{count > 1 ? 's' : ''} &middot; {pct(count)}%</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: mounted ? `${width}%` : 0, background: CAT_COLORS[i % CAT_COLORS.length], transitionDelay: `${i * 90}ms` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card p-4 h-100">
            <h5 className="section-title mb-1"><span className="title-icon"><i className="bi bi-pie-chart"></i></span>Resolution Pipeline</h5>
            <div className="section-sub mb-3">Hover to highlight, click to filter</div>

            <div className="d-flex mb-4 rounded-pill overflow-hidden" style={{ height: 18, background: 'rgba(148,163,184,.3)' }}>
              {pipeline.map((p) => (
                <div
                  key={p.key}
                  className={`pipeline-seg ${hl === p.key ? 'hl' : ''}`}
                  style={{ width: mounted ? `${pct(p.n)}%` : 0, background: p.color }}
                  title={`${p.key}: ${pct(p.n)}%`}
                  onMouseEnter={() => setHl(p.key)}
                  onMouseLeave={() => setHl(null)}
                  onClick={() => goStatus(p.key)}
                ></div>
              ))}
            </div>

            <div className="d-flex flex-column gap-2">
              {pipeline.map((p) => (
                <div
                  key={p.key}
                  className={`legend-row ${hl === p.key ? 'hl' : ''}`}
                  onMouseEnter={() => setHl(p.key)}
                  onMouseLeave={() => setHl(null)}
                  onClick={() => goStatus(p.key)}
                >
                  <span className="d-flex align-items-center gap-2">
                    <span className="dot" style={{ background: p.color }}></span>
                    <span className="lbl">{p.label}</span>
                  </span>
                  <span className="val">{p.n} <span className="text-muted fw-semibold">({pct(p.n)}%)</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent table with chips */}
      <div className="card p-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3">
          <div>
            <h5 className="section-title"><span className="title-icon"><i className="bi bi-clock-history"></i></span>Recent Campus Grievances</h5>
            <div className="section-sub mt-1">Review, assign, and update complaints across all hostel wings</div>
          </div>
          <Link to="/admin/complaints" className="btn btn-sm btn-outline-primary">
            View All ({complaints.length}) <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-3">
          {FILTERS.map((f) => {
            const n = f === 'All' ? complaints.length : complaints.filter((c) => c.status === f).length;
            return (
              <button key={f} type="button" className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f} <span className="count">{n}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <LoadingSpinner message="Loading grievance records..." />
        ) : (
          <ComplaintTable complaints={recentComplaints} role="admin" isRecent={true} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
