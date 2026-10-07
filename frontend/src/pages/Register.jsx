import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GoogleSignIn from '../components/GoogleSignIn';
import { useAuth } from '../context/AuthContext';

const BLOCKS = ['Block A', 'Block B', 'Block C', 'Block D', 'PG Block'];

const Register = () => {
  const { register, googleLogin, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roomNumber: '',
    hostelBlock: 'Block A',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleGoogle = async (profile) => {
    setServerError('');
    const result = await googleLogin(profile);
    if (result.success) navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    else setServerError(result.error);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format';
    }

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required (e.g. A-204)';
    }

    if (!formData.hostelBlock) {
      newErrors.hostelBlock = 'Hostel block is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setServerError('');
    setSuccessMessage('');

    const result = await register({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      roomNumber: formData.roomNumber.trim(),
      hostelBlock: formData.hostelBlock,
      phone: formData.phone.trim() || '+91 98000 00000'
    });

    if (result.success) {
      setSuccessMessage('Registration successful! Redirecting to student dashboard...');
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1200);
    } else {
      setServerError(result.error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="container py-5 my-auto">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-7">
            <div className="card border-0 overflow-hidden anim-fade-up" style={{ borderRadius: '1.6rem' }}>
              <div className="p-4 text-white text-center auth-side">
                <div
                  className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-2 bg-white text-primary shadow-sm anim-float"
                  style={{ width: '48px', height: '48px' }}
                >
                  <i className="bi bi-person-plus-fill fs-4"></i>
                </div>
                <h4 className="fw-bold mb-1">Student Registration</h4>
                <p className="small mb-0 opacity-90">Create your account to submit and track hostel complaints</p>
              </div>

              <div className="card-body p-4">
                {serverError && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small" role="alert">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <div>{serverError}</div>
                  </div>
                )}

                {successMessage && (
                  <div className="alert alert-success d-flex align-items-center gap-2 py-2 small" role="alert">
                    <i className="bi bi-check-circle-fill"></i>
                    <div>{successMessage}</div>
                  </div>
                )}

                <GoogleSignIn onSuccess={handleGoogle} onError={setServerError} label="Sign up with Google" />
                <div className="divider">or register with email</div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    {/* Full Name */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-medium text-dark small">Full Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="fullName"
                        className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                        placeholder="e.g. Rahul Patil"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                      {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                    </div>

                    {/* Email */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-medium text-dark small">College Email <span className="text-danger">*</span></label>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="student@college.edu"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    {/* Hostel Block */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-medium text-dark small">Hostel Block <span className="text-danger">*</span></label>
                      <select
                        name="hostelBlock"
                        className={`form-select ${errors.hostelBlock ? 'is-invalid' : ''}`}
                        value={formData.hostelBlock}
                        onChange={handleChange}
                      >
                        {BLOCKS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                      {errors.hostelBlock && <div className="invalid-feedback">{errors.hostelBlock}</div>}
                    </div>

                    {/* Room Number */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-medium text-dark small">Room Number <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="roomNumber"
                        className={`form-control ${errors.roomNumber ? 'is-invalid' : ''}`}
                        placeholder="e.g. A-204"
                        value={formData.roomNumber}
                        onChange={handleChange}
                      />
                      {errors.roomNumber && <div className="invalid-feedback">{errors.roomNumber}</div>}
                    </div>

                    {/* Contact Phone (Optional) */}
                    <div className="col-12">
                      <label className="form-label fw-medium text-dark small">Contact Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Password */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-medium text-dark small">Password <span className="text-danger">*</span></label>
                      <input
                        type="password"
                        name="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="At least 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    {/* Confirm Password */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-medium text-dark small">Confirm Password <span className="text-danger">*</span></label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2.5 fw-semibold shadow-sm"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Registering Account...
                        </>
                      ) : (
                        'Register as Student'
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-3 small text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="fw-semibold text-primary text-decoration-none">
                    Login here
                  </Link>
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

export default Register;
