import React from 'react';

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

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const STATUSES = ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];

const SearchBar = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange,
  onReset,
  placeholder = 'Search by Complaint ID, description, room...'
}) => {
  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'All' ||
    selectedPriority !== 'All' ||
    selectedStatus !== 'All';

  return (
    <div className="card shadow-sm border-0 p-3 mb-4 bg-white">
      <div className="row g-2 align-items-center">
        {/* Search input */}
        <div className="col-12 col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary border-start-0"
                type="button"
                onClick={() => onSearchChange('')}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>

        {/* Category filter */}
        <div className="col-6 col-md-2">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Priority filter */}
        <div className="col-6 col-md-2">
          <select
            className="form-select"
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
          >
            <option value="All">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p} Priority
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="col-6 col-md-2">
          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Reset button */}
        <div className="col-6 col-md-2 d-flex">
          <button
            type="button"
            className={`btn w-100 ${
              hasActiveFilters ? 'btn-outline-danger' : 'btn-outline-secondary'
            }`}
            onClick={onReset}
            disabled={!hasActiveFilters}
          >
            <i className="bi bi-arrow-counterclockwise me-1"></i> Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
