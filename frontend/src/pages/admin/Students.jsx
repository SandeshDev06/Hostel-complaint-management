import React, { useState, useEffect, useMemo } from 'react';
import { getStudents } from '../../services/api';
import { useComplaints } from '../../context/ComplaintContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { Link } from 'react-router-dom';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { complaints } = useComplaints();

  useEffect(() => {
    const fetchStudentsList = async () => {
      setLoading(true);
      try {
        const response = await getStudents();
        setStudents(response.data || []);
      } catch (err) {
        console.error('Failed to load students:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentsList();
  }, []);

  const filteredStudents = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.roomNumber.toLowerCase().includes(term) ||
        (s.hostelBlock && s.hostelBlock.toLowerCase().includes(term))
    );
  }, [students, searchTerm]);

  // Complaints for currently selected student
  const studentComplaints = useMemo(() => {
    if (!selectedStudent) return [];
    return complaints.filter(
      (c) =>
        c.studentEmail === selectedStudent.email ||
        c.studentId === selectedStudent.id ||
        c.studentName === selectedStudent.name
    );
  }, [complaints, selectedStudent]);

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Registered Hostel Students</h3>
          <p className="text-muted small mb-0">
            View student residents, room allotments, and logged complaint histories
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="card shadow-sm border-0 p-3 mb-4 bg-white">
        <div className="input-group">
          <span className="input-group-text bg-light text-muted">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search student by name, email, room, or hostel block..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner message="Loading student records..." />
      ) : (
        <div className="card border-0 shadow-sm p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0 text-dark">
              Students Enrolled ({filteredStudents.length})
            </h6>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3 py-3">Student</th>
                  <th>Email</th>
                  <th>Room</th>
                  <th>Hostel Block</th>
                  <th>Complaints Logged</th>
                  <th className="text-end pe-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No students found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => {
                    const studentComplaintCount = complaints.filter(
                      (c) => c.studentEmail === s.email || c.studentId === s.id
                    ).length;

                    return (
                      <tr key={s.id}>
                        <td className="ps-3">
                          <div className="d-flex align-items-center gap-2.5">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                              style={{ width: '38px', height: '38px', backgroundColor: '#4f46e5' }}
                            >
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <div className="fw-semibold text-dark">{s.name}</div>
                              <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                {s.enrolledCourse || 'Undergraduate Resident'}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="text-muted">{s.email}</td>
                        <td>
                          <span className="badge bg-light text-dark border px-2 py-1">
                            <i className="bi bi-door-closed me-1 text-muted"></i>
                            {s.roomNumber}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border px-2 py-1">
                            {s.hostelBlock || 'Block A'}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1">
                            {studentComplaintCount} {studentComplaintCount === 1 ? 'ticket' : 'tickets'}
                          </span>
                        </td>
                        <td className="text-end pe-3">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setSelectedStudent(s)}
                          >
                            <i className="bi bi-eye me-1"></i> View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Details & Complaints Modal */}
      {selectedStudent && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-light border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{ width: '36px', height: '36px', backgroundColor: '#4f46e5' }}
                  >
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold text-dark mb-0">{selectedStudent.name}</h5>
                    <small className="text-muted">{selectedStudent.email} &bull; Room {selectedStudent.roomNumber}</small>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedStudent(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-3 p-3 bg-light rounded-3 border mb-4">
                  <div className="col-6 col-md-3">
                    <span className="text-muted small d-block">Room Number</span>
                    <span className="fw-semibold text-dark">{selectedStudent.roomNumber}</span>
                  </div>
                  <div className="col-6 col-md-3">
                    <span className="text-muted small d-block">Hostel Block</span>
                    <span className="fw-semibold text-dark">{selectedStudent.hostelBlock || 'Block A'}</span>
                  </div>
                  <div className="col-6 col-md-3">
                    <span className="text-muted small d-block">Contact Phone</span>
                    <span className="fw-semibold text-dark">{selectedStudent.phone || 'N/A'}</span>
                  </div>
                  <div className="col-6 col-md-3">
                    <span className="text-muted small d-block">Total Tickets</span>
                    <span className="badge bg-primary text-white fs-6">{studentComplaints.length}</span>
                  </div>
                </div>

                <h6 className="fw-bold text-dark mb-3">Complaint History</h6>

                {studentComplaints.length === 0 ? (
                  <p className="text-muted text-center py-4">No complaints submitted by this student.</p>
                ) : (
                  <div className="table-responsive border rounded">
                    <table className="table table-hover align-middle mb-0 small">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Category</th>
                          <th>Priority</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentComplaints.map((c) => (
                          <tr key={c.id}>
                            <td className="fw-bold font-monospace text-primary">{c.id}</td>
                            <td>{c.category}</td>
                            <td><PriorityBadge priority={c.priority} /></td>
                            <td><StatusBadge status={c.status} /></td>
                            <td className="text-muted">{c.date}</td>
                            <td className="text-end">
                              <Link
                                to={`/admin/complaints/${c.id}`}
                                className="btn btn-xs btn-outline-primary py-0.5 px-2"
                                onClick={() => setSelectedStudent(null)}
                              >
                                Manage
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="modal-footer bg-light border-top">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedStudent(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
