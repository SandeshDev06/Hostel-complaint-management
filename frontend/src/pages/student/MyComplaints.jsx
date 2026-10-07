import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ComplaintTable from '../../components/ComplaintTable';
import SearchBar from '../../components/SearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useComplaints } from '../../context/ComplaintContext';

const MyComplaints = () => {
  const { studentComplaints, loading, removeComplaint } = useComplaints();

  const [searchTerm, setSearchTerm] = useState('');
  const [params] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(params.get('category') || 'All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState(params.get('status') || 'All');
  const [actionAlert, setActionAlert] = useState(null);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedPriority('All');
    setSelectedStatus('All');
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to cancel complaint ${id}?`)) {
      const res = await removeComplaint(id);
      if (res.success) {
        setActionAlert({ type: 'success', message: `Complaint ${id} was successfully cancelled.` });
        setTimeout(() => setActionAlert(null), 3500);
      } else {
        setActionAlert({ type: 'danger', message: res.error || 'Failed to cancel complaint' });
      }
    }
  };

  const filteredComplaints = useMemo(() => {
    return studentComplaints.filter((c) => {
      // Search matches
      const matchesSearch =
        searchTerm === '' ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;

      // Priority filter
      const matchesPriority = selectedPriority === 'All' || c.priority === selectedPriority;

      // Status filter
      const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [studentComplaints, searchTerm, selectedCategory, selectedPriority, selectedStatus]);

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">My Complaints</h3>
          <p className="text-muted small mb-0">
            View, search, and track all complaints logged from your account
          </p>
        </div>
        <Link to="/student/complaints/new" className="btn btn-primary d-inline-flex align-items-center gap-1.5 shadow-sm">
          <i className="bi bi-plus-circle"></i>
          <span>Submit New Complaint</span>
        </Link>
      </div>

      {actionAlert && (
        <div className={`alert alert-${actionAlert.type} alert-dismissible fade show`} role="alert">
          <i className={`bi ${actionAlert.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
          {actionAlert.message}
          <button type="button" className="btn-close" onClick={() => setActionAlert(null)}></button>
        </div>
      )}

      {/* Search and Filters */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onReset={handleReset}
        placeholder="Search by ID (e.g. CMP001), category, or keyword..."
      />

      {/* Complaints Table */}
      {loading ? (
        <LoadingSpinner message="Loading your complaints..." />
      ) : (
        <div className="card border-0 shadow-sm p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0 text-dark">
              Results ({filteredComplaints.length})
            </h6>
            {(searchTerm || selectedCategory !== 'All' || selectedPriority !== 'All' || selectedStatus !== 'All') && (
              <span className="badge bg-light text-muted border">Filtered View</span>
            )}
          </div>

          <ComplaintTable
            complaints={filteredComplaints}
            role="student"
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
