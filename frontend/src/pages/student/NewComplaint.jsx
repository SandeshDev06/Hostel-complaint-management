import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';

const CATEGORIES = [
  'Electrical',
  'Plumbing',
  'Cleaning',
  'Wi-Fi',
  'Furniture',
  'Room Maintenance',
  'Water',
  'Other'
];

const PRIORITIES = [
  { value: 'Low', label: 'Low (Within 3-4 days)' },
  { value: 'Medium', label: 'Medium (Within 2 days)' },
  { value: 'High', label: 'High (Within 24 hours)' },
  { value: 'Urgent', label: 'Urgent (Immediate attention required)' }
];

const NewComplaint = () => {
  const { user } = useAuth();
  const { submitComplaint } = useComplaints();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: '',
    roomNumber: user?.roomNumber || 'A-204',
    priority: 'Medium',
    description: '',
    imagePreview: null
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successComplaint, setSuccessComplaint] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.category) {
      newErrors.category = 'Please select a complaint category';
    }
    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    }
    if (!formData.priority) {
      newErrors.priority = 'Please select a priority level';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Please describe the problem in detail';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description should be at least 10 characters long';
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
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create local object URL for preview
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imagePreview: previewUrl }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const result = await submitComplaint({
      category: formData.category,
      roomNumber: formData.roomNumber.trim(),
      priority: formData.priority,
      description: formData.description.trim(),
      imageUrl: formData.imagePreview,
      hostelBlock: user?.hostelBlock || 'Block A'
    });

    setSubmitting(false);

    if (result.success) {
      setSuccessComplaint(result.complaint);
    } else {
      setErrors({ form: result.error });
    }
  };

  return (
    <div className="container-fluid px-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Submit New Complaint</h3>
          <p className="text-muted small mb-0">Fill in the details below to report an issue in your hostel room or floor</p>
        </div>
        <Link to="/student/complaints" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1"></i> Back to My Complaints
        </Link>
      </div>

      {successComplaint ? (
        <div className="card border-0 shadow-sm p-4 p-md-5 text-center bg-white rounded-3">
          <div
            className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3 bg-success-subtle text-success"
            style={{ width: '72px', height: '72px' }}
          >
            <i className="bi bi-check-circle-fill display-5"></i>
          </div>
          <h4 className="fw-bold text-dark">Complaint Submitted Successfully!</h4>
          <p className="text-muted mb-2">
            Your complaint reference ID is <strong className="text-primary font-monospace">{successComplaint.id}</strong>.
          </p>
          <p className="small text-muted mb-4 mx-auto" style={{ maxWidth: '500px' }}>
            The hostel warden and maintenance team have been notified. You can track live status updates directly on your dashboard.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to={`/student/complaints/${successComplaint.id}`} className="btn btn-primary px-4">
              <i className="bi bi-eye me-1"></i> View Complaint Status
            </Link>
            <button
              onClick={() => {
                setSuccessComplaint(null);
                setFormData({
                  category: '',
                  roomNumber: user?.roomNumber || 'A-204',
                  priority: 'Medium',
                  description: '',
                  imagePreview: null
                });
              }}
              className="btn btn-outline-secondary px-4"
            >
              <i className="bi bi-plus-lg me-1"></i> Submit Another
            </button>
          </div>
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
              {errors.form && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                  <i className="bi bi-exclamation-circle-fill"></i>
                  <div>{errors.form}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  {/* Category Dropdown */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark small">
                      Complaint Category <span className="text-danger">*</span>
                    </label>
                    <select
                      name="category"
                      className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">-- Select Category --</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                  </div>

                  {/* Room Number */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark small">
                      Room Number <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted">
                        <i className="bi bi-door-closed"></i>
                      </span>
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
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Hostel Block: {user?.hostelBlock || 'Block A'}
                    </small>
                  </div>

                  {/* Priority Dropdown */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark small">
                      Priority Level <span className="text-danger">*</span>
                    </label>
                    <select
                      name="priority"
                      className={`form-select ${errors.priority ? 'is-invalid' : ''}`}
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      {PRIORITIES.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    {errors.priority && <div className="invalid-feedback">{errors.priority}</div>}
                  </div>

                  {/* Optional Image Upload */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark small">
                      Optional Image / Photo of Problem
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Supports JPG, PNG, WEBP (Max 5MB)
                    </small>
                  </div>

                  {/* Image Preview if selected */}
                  {formData.imagePreview && (
                    <div className="col-12">
                      <div className="p-2 border rounded bg-light d-inline-block position-relative">
                        <img
                          src={formData.imagePreview}
                          alt="Problem preview"
                          style={{ maxHeight: '140px', objectFit: 'cover' }}
                          className="rounded"
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-1"
                          onClick={() => setFormData((prev) => ({ ...prev, imagePreview: null }))}
                          title="Remove image"
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark small">
                      Problem Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="description"
                      rows="4"
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      placeholder="Please explain the issue clearly (e.g. Ceiling fan switch is not responding, sparking observed in switchboard...)"
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top">
                  <Link to="/student/complaints" className="btn btn-light px-3">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-semibold"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-1"></i> Submit Complaint
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewComplaint;
