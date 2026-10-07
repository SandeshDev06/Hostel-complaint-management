import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ComplaintTable from '../../components/ComplaintTable';
import SearchBar from '../../components/SearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useComplaints } from '../../context/ComplaintContext';

const Complaints = () => {
  const { complaints, loading } = useComplaints();

  const [searchTerm, setSearchTerm] = useState('');
  const [params] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(params.get('category') || 'All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState(params.get('status') || 'All');

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedPriority('All');
    setSelectedStatus('All');
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Search matches
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === '' ||
        c.id.toLowerCase().includes(term) ||
        c.studentName.toLowerCase().includes(term) ||
        c.roomNumber.toLowerCase().includes(term) ||
        c.category.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        (c.hostelBlock && c.hostelBlock.toLowerCase().includes(term));

      // Category filter
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;

      // Priority filter
      const matchesPriority = selectedPriority === 'All' || c.priority === selectedPriority;

      // Status filter
      const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [complaints, searchTerm, selectedCategory, selectedPriority, selectedStatus]);

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">All Hostel Complaints</h3>
          <p className="text-muted small mb-0">
            Monitor, assign maintenance personnel, and resolve resident grievances
          </p>
        </div>
      </div>

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
        placeholder="Search by student name, ID, room, or issue description..."
      />

      {/* Complaints Table */}
      {loading ? (
        <LoadingSpinner message="Loading all complaints..." />
      ) : (
        <div className="card border-0 shadow-sm p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0 text-dark">
              Total Records ({filteredComplaints.length})
            </h6>
            {(searchTerm || selectedCategory !== 'All' || selectedPriority !== 'All' || selectedStatus !== 'All') && (
              <span className="badge bg-light text-muted border">Filtered View</span>
            )}
          </div>

          <ComplaintTable
            complaints={filteredComplaints}
            role="admin"
          />
        </div>
      )}
    </div>
  );
};

export default Complaints;
