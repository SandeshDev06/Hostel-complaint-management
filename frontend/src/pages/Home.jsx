import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useReveal from '../hooks/useReveal';
import useCountUp from '../hooks/useCountUp';
import { useAuth } from '../context/AuthContext';

const Counter = ({ to, suffix = '' }) => {
  const v = useCountUp(to, 1400);
  return <>{v}{suffix}</>;
};

const STEPS = [
  { n: 1, title: 'Submit Complaint', icon: 'bi-pencil-square', text: 'Select category (Electrical, Plumbing, Wi-Fi…), room, priority and describe the problem with an optional photo.' },
  { n: 2, title: 'Track Complaint', icon: 'bi-geo-alt', text: 'Follow live progress on a visual timeline: Pending ➔ Assigned ➔ In Progress ➔ Resolved.' },
  { n: 3, title: 'Get Resolution', icon: 'bi-patch-check', text: 'Wardens and technicians inspect, add remarks and mark the complaint resolved.' }
];

const FEATURES = [
  { icon: 'bi-pencil-square', color: 'primary', title: 'Easy Submission', text: 'Categorised complaints with priority flags, photo upload and instant confirmation.', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=70' },
  { icon: 'bi-clock-history', color: 'info', title: 'Live Tracking', text: 'Search and filter by category, priority and status with live indicators.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=70' },
  { icon: 'bi-google', color: 'danger', title: 'Google Sign-In', text: 'One-tap secure login with your Google account – no extra password to remember.', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=70' },
  { icon: 'bi-shield-lock-fill', color: 'warning', title: 'Admin Control', text: 'Assign technicians, write resolution remarks and monitor the student roster.', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=70' }
];

const colorStyles = {
  primary: { bg: 'rgba(99,102,241,.15)', fg: '#4f46e5' },
  info: { bg: 'rgba(6,182,212,.15)', fg: '#0891b2' },
  danger: { bg: 'rgba(239,68,68,.15)', fg: '#dc2626' },
  warning: { bg: 'rgba(245,158,11,.18)', fg: '#d97706' }
};

const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const dashboardLink = isAdmin ? '/admin/dashboard' : '/student/dashboard';
  useReveal();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      {/* Hero */}
      <section className="hero py-5">
        <div className="container py-lg-5">
          <div className="row align-items-center gy-5">
            <div className="col-12 col-lg-6 text-center text-lg-start">
              <span className="badge hero-glass px-3 py-2 rounded-pill mb-3 fw-medium anim-fade-up">
                <i className="bi bi-stars me-1"></i> Smart Campus Facility Management
              </span>
              <h1 className="display-4 fw-bold lh-sm mb-3 anim-fade-up delay-1">
                Hostel Complaints,<br /><span className="gradient-text">Resolved Faster.</span>
              </h1>
              <p className="lead opacity-90 mb-4 pe-lg-4 anim-fade-up delay-2">
                Report hostel problems, track every step and get issues fixed. A transparent platform
                connecting hostel residents with the college administration.
              </p>
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 anim-fade-up delay-3">
                {isAuthenticated ? (
                  <Link to={dashboardLink} className="btn btn-primary btn-lg px-4"><i className="bi bi-speedometer2 me-2"></i>Go to Dashboard</Link>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-primary btn-lg px-4"><i className="bi bi-google me-2"></i>Login / Google</Link>
                    <Link to="/register" className="btn btn-outline-light btn-lg px-4"><i className="bi bi-person-plus me-2"></i>Register</Link>
                  </>
                )}
              </div>

              <div className="row g-3 mt-4 anim-fade-up delay-4">
                {[{ v: 500, s: '+', l: 'Residents' }, { v: 48, s: 'h', l: 'Avg. Resolution' }, { v: 98, s: '%', l: 'Resolved' }].map((x) => (
                  <div className="col-4" key={x.l}>
                    <div className="hero-glass glass rounded-4 p-3 text-center">
                      <div className="fw-bold fs-3"><Counter to={x.v} suffix={x.s} /></div>
                      <div className="small">{x.l}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12 col-lg-6 text-center position-relative anim-pop delay-2">
              <img src="/images/hero-hostel.svg" alt="Hostel building illustration" className="hero-img anim-float" />
              <div className="hero-glass glass rounded-4 p-3 position-absolute text-start d-none d-md-block anim-float" style={{ top: '8%', left: '0', width: 230, animationDelay: '-2s' }}>
                <div className="d-flex align-items-center gap-2">
                  <span className="p-2 rounded-circle bg-success text-white"><i className="bi bi-check2"></i></span>
                  <div><div className="fw-semibold small">Wi-Fi fixed</div><div className="small opacity-75">Resolved in 1 day</div></div>
                </div>
              </div>
              <div className="hero-glass glass rounded-4 p-3 position-absolute text-start d-none d-md-block anim-float" style={{ bottom: '10%', right: '0', width: 230, animationDelay: '-4s' }}>
                <div className="d-flex align-items-center gap-2">
                  <span className="p-2 rounded-circle bg-warning text-dark"><i className="bi bi-lightning-charge-fill"></i></span>
                  <div><div className="fw-semibold small">Geyser issue</div><div className="small opacity-75">In progress</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5 reveal">
            <span className="text-primary text-uppercase fw-bold small">Quick &amp; Simple</span>
            <h2 className="fw-bold mt-1">How It Works</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: 600 }}>Three transparent steps from problem to resolution.</p>
          </div>
          <div className="row g-4">
            {STEPS.map((s, i) => (
              <div className="col-12 col-md-4 reveal" key={s.n} style={{ transitionDelay: `${i * 120}ms` }}>
                <div className="card h-100 p-4 text-center card-hover">
                  <div className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3 text-white"
                    style={{ width: 68, height: 68, background: 'linear-gradient(135deg,#6366f1,#ec4899)', boxShadow: '0 10px 24px rgba(99,102,241,.4)' }}>
                    <i className={`bi ${s.icon} fs-3`}></i>
                  </div>
                  <h5 className="fw-bold">{s.n}. {s.title}</h5>
                  <p className="text-muted small mb-0">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features with images */}
      <section className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5 reveal">
            <span className="text-primary text-uppercase fw-bold small">Core Capabilities</span>
            <h2 className="fw-bold mt-1">Platform Features</h2>
          </div>
          <div className="row g-4">
            {FEATURES.map((f, i) => {
              const c = colorStyles[f.color];
              return (
                <div className="col-12 col-sm-6 col-lg-3 reveal" key={f.title} style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="card h-100 p-3 card-hover">
                    <div className="img-wrap">
                      <img
                        className="feature-img" src={f.img} alt={f.title} loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <div className="p-2 rounded-3 d-inline-block mb-2" style={{ background: c.bg, color: c.fg, width: 'fit-content' }}>
                      <i className={`bi ${f.icon} fs-5`}></i>
                    </div>
                    <h5 className="fw-bold mb-2">{f.title}</h5>
                    <p className="text-muted small mb-0">{f.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container reveal">
          <div className="glass glass-strong text-center p-5">
            <h3 className="fw-bold mb-2">Ready to submit or manage complaints?</h3>
            <p className="text-muted mb-4">Sign in with Google or your student / warden credentials.</p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/login" className="btn btn-primary px-4 py-2"><i className="bi bi-box-arrow-in-right me-1"></i> Sign In</Link>
              <Link to="/register" className="btn btn-outline-primary px-4 py-2"><i className="bi bi-person-plus me-1"></i> Register Student</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
