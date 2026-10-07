import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GoogleSignIn from '../components/GoogleSignIn';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, googleLogin, quickLogin, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const goHome = (user) => navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');

  const validate = () => {
    const e = {};
    if (!formData.email.trim()) e.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) e.email = 'Please enter a valid email address';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setServerError('');
    const result = await login(formData.email.trim(), formData.password);
    if (result.success) goHome(result.user);
    else setServerError(result.error);
  };

  const handleGoogle = async (profile) => {
    setServerError('');
    const result = await googleLogin(profile);
    if (result.success) goHome(result.user);
    else setServerError(result.error);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="container py-5 my-auto">
        <div className="auth-wrap anim-fade-up">
          <div className="card auth-card border-0">
            <div className="row g-0">
              {/* Illustration side */}
              <div className="col-lg-5 d-none d-lg-flex auth-side flex-column align-items-center justify-content-center text-center p-4">
                <img src="/images/login-art.svg" alt="Complaint tracking illustration" className="mb-3" />
                <h4 className="fw-bold">Welcome back 👋</h4>
                <p className="small mb-0 opacity-90">Report problems, track progress and get your hostel issues resolved faster.</p>
              </div>

              {/* Form side */}
              <div className="col-12 col-lg-7">
                <div className="p-4 p-md-5">
                  <div className="text-center text-lg-start mb-4">
                    <h3 className="fw-bold mb-1">Sign in to HostelCare</h3>
                    <p className="text-muted small mb-0">Use your account or continue with Google</p>
                  </div>

                  {serverError && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small anim-pop" role="alert">
                      <i className="bi bi-exclamation-triangle-fill"></i>
                      <div>{serverError}</div>
                    </div>
                  )}

                  <GoogleSignIn onSuccess={handleGoogle} onError={setServerError} />

                  <div className="divider">or sign in with email</div>

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                      <label className="form-label fw-medium small">Email Address</label>
                      <div className="input-group has-validation">
                        <span className="input-group-text text-muted"><i className="bi bi-envelope"></i></span>
                        <input
                          type="email" name="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          placeholder="e.g. student@hostelcare.com"
                          value={formData.email} onChange={handleChange}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-medium small">Password</label>
                      <div className="input-group has-validation">
                        <span className="input-group-text text-muted"><i className="bi bi-lock"></i></span>
                        <input
                          type={showPw ? 'text' : 'password'} name="password"
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                          placeholder="••••••••"
                          value={formData.password} onChange={handleChange}
                        />
                        <button type="button" className="input-group-text text-muted" onClick={() => setShowPw((s) => !s)} aria-label="Toggle password visibility">
                          <i className={`bi ${showPw ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-2 mb-3" disabled={loading}>
                      {loading ? (<><span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Signing in...</>) : 'Login to Portal'}
                    </button>
                  </form>

                  <div className="p-3 rounded-3 mb-3 glass-strong glass">
                    <div className="text-center text-muted fw-bold text-uppercase mb-2" style={{ fontSize: '0.7rem', letterSpacing: '.08em' }}>
                      1-Click Demo Access
                    </div>
                    <div className="row g-2">
                      <div className="col-6">
                        <button type="button" className="btn btn-sm btn-outline-primary w-100" onClick={() => goHome(quickLogin('student'))}>
                          <i className="bi bi-person me-1"></i> Student
                        </button>
                      </div>
                      <div className="col-6">
                        <button type="button" className="btn btn-sm btn-outline-danger w-100" onClick={() => goHome(quickLogin('admin'))}>
                          <i className="bi bi-shield-lock me-1"></i> Admin
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-center small text-muted">
                    Don't have an account?{' '}
                    <Link to="/register" className="fw-semibold text-primary text-decoration-none">Register here</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
