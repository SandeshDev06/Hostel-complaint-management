import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  getAllComplaints,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint
} from '../services/api';
import { useAuth } from './AuthContext';

const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all complaints from API/mock store
  const refreshComplaints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllComplaints();
      setComplaints(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshComplaints();
  }, [refreshComplaints]);

  // Submit new complaint
  const submitComplaint = async (complaintData) => {
    try {
      const payload = {
        ...complaintData,
        studentId: user?.id || 'STU001',
        studentName: user?.name || 'Rahul Patil',
        studentEmail: user?.email || 'student@hostelcare.com',
        hostelBlock: user?.hostelBlock || 'Block A'
      };
      const response = await createComplaint(payload);
      if (response.data?.complaint) {
        setComplaints((prev) => [response.data.complaint, ...prev]);
      }
      return { success: true, complaint: response.data.complaint };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Failed to submit complaint'
      };
    }
  };

  // Update complaint status and remarks (Admin action)
  const modifyComplaintStatus = async (id, statusData) => {
    try {
      const response = await updateComplaintStatus(id, statusData);
      if (response.data?.complaint) {
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? response.data.complaint : c))
        );
      }
      return { success: true, complaint: response.data?.complaint };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Failed to update complaint'
      };
    }
  };

  // Cancel or delete complaint
  const removeComplaint = async (id) => {
    try {
      await deleteComplaint(id);
      setComplaints((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Failed to delete complaint'
      };
    }
  };

  // Get single complaint by ID
  const getComplaintById = (id) => {
    return complaints.find((c) => c.id === id);
  };

  // Filter complaints for student
  const studentComplaints = useMemo(() => {
    if (!user || user.role !== 'student') return [];
    return complaints.filter(
      (c) => c.studentEmail === user.email || c.studentId === user.id
    );
  }, [complaints, user]);

  // Global Admin stats
  const adminStats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === 'Pending').length;
    const assigned = complaints.filter((c) => c.status === 'Assigned').length;
    const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;
    const rejected = complaints.filter((c) => c.status === 'Rejected').length;

    return { total, pending, assigned, inProgress, resolved, rejected };
  }, [complaints]);

  // Student specific stats
  const studentStats = useMemo(() => {
    const total = studentComplaints.length;
    const pending = studentComplaints.filter((c) => c.status === 'Pending').length;
    const inProgress = studentComplaints.filter((c) => c.status === 'In Progress' || c.status === 'Assigned').length;
    const resolved = studentComplaints.filter((c) => c.status === 'Resolved').length;
    const rejected = studentComplaints.filter((c) => c.status === 'Rejected').length;

    return { total, pending, inProgress, resolved, rejected };
  }, [studentComplaints]);

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        studentComplaints,
        loading,
        error,
        adminStats,
        studentStats,
        refreshComplaints,
        submitComplaint,
        modifyComplaintStatus,
        removeComplaint,
        getComplaintById
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
