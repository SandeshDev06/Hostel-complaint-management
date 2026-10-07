import axios from 'axios';
import { INITIAL_COMPLAINTS, INITIAL_STUDENTS, DEMO_USERS } from '../data/mockData';

// Configure Axios instance
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor to attach JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common error responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on unauthorized token if desired
      console.warn('Session expired or unauthorized request');
    }
    return Promise.reject(error);
  }
);

// ==========================================
// Mock Storage Helpers (Active until Backend is connected)
// ==========================================
const getStoredComplaints = () => {
  const stored = localStorage.getItem('hostel_complaints');
  if (!stored) {
    localStorage.setItem('hostel_complaints', JSON.stringify(INITIAL_COMPLAINTS));
    return INITIAL_COMPLAINTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_COMPLAINTS;
  }
};

const saveStoredComplaints = (complaints) => {
  localStorage.setItem('hostel_complaints', JSON.stringify(complaints));
};

const getStoredStudents = () => {
  const stored = localStorage.getItem('hostel_students');
  if (!stored) {
    localStorage.setItem('hostel_students', JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_STUDENTS;
  }
};

// ==========================================
// Authentication APIs
// ==========================================

export const registerUser = async (userData) => {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 400));
    const students = getStoredStudents();
    const newStudent = {
      id: `STU00${students.length + 1}`,
      name: userData.fullName || userData.name,
      email: userData.email,
      roomNumber: userData.roomNumber,
      hostelBlock: userData.hostelBlock,
      phone: userData.phone || '+91 98000 00000',
      complaintsCount: 0,
      enrolledCourse: 'Hostel Resident'
    };
    students.push(newStudent);
    localStorage.setItem('hostel_students', JSON.stringify(students));

    const token = 'mock_jwt_token_' + Date.now();
    const user = {
      id: newStudent.id,
      name: newStudent.name,
      email: newStudent.email,
      role: 'student',
      roomNumber: newStudent.roomNumber,
      hostelBlock: newStudent.hostelBlock
    };
    return { data: { success: true, token, user, message: 'Registration successful!' } };
  }

  // Real backend call: POST /api/auth/register
  return apiClient.post('/auth/register', userData);
};

export const loginUser = async (credentials) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 400));
    const { email } = credentials;

    // Check if admin login
    if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('warden')) {
      const user = DEMO_USERS.admin;
      const token = 'mock_admin_jwt_' + Date.now();
      return { data: { success: true, token, user, role: 'admin' } };
    }

    // Default to student login
    const students = getStoredStudents();
    const matched = students.find((s) => s.email.toLowerCase() === email.toLowerCase());
    const user = matched
      ? {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          role: 'student',
          roomNumber: matched.roomNumber,
          hostelBlock: matched.hostelBlock
        }
      : DEMO_USERS.student;

    const token = 'mock_student_jwt_' + Date.now();
    return { data: { success: true, token, user, role: 'student' } };
  }

  // Real backend call: POST /api/auth/login
  return apiClient.post('/auth/login', credentials);
};

export const loginWithGoogle = async (profile) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 400));
    const email = profile.email.toLowerCase();
    const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
      .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
    const isAdmin = adminEmails.includes(email) || email.includes('admin') || email.includes('warden');

    if (isAdmin) {
      const user = { ...DEMO_USERS.admin, name: profile.name || DEMO_USERS.admin.name, email, picture: profile.picture || null, provider: 'google' };
      return { data: { success: true, token: 'mock_google_admin_' + Date.now(), user, role: 'admin' } };
    }

    const students = getStoredStudents();
    let student = students.find((s) => s.email.toLowerCase() === email);
    if (!student) {
      student = {
        id: `STU00${students.length + 1}`,
        name: profile.name,
        email,
        roomNumber: 'Not set',
        hostelBlock: 'Block A',
        phone: '',
        complaintsCount: 0,
        enrolledCourse: 'Hostel Resident'
      };
      students.push(student);
      localStorage.setItem('hostel_students', JSON.stringify(students));
    }
    const user = {
      id: student.id, name: student.name, email: student.email, role: 'student',
      roomNumber: student.roomNumber, hostelBlock: student.hostelBlock,
      picture: profile.picture || null, provider: 'google'
    };
    return { data: { success: true, token: 'mock_google_student_' + Date.now(), user, role: 'student' } };
  }

  // Real backend: POST /api/auth/google  { credential }  (verify ID token server-side)
  return apiClient.post('/auth/google', { credential: profile.credential });
};

// ==========================================
// Complaint APIs
// ==========================================

export const createComplaint = async (complaintData) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 350));
    const complaints = getStoredComplaints();
    const newId = `CMP${String(complaints.length + 1).padStart(3, '0')}`;
    const newComplaint = {
      id: newId,
      studentId: complaintData.studentId || 'STU001',
      studentName: complaintData.studentName || 'Rahul Patil',
      studentEmail: complaintData.studentEmail || 'student@hostelcare.com',
      category: complaintData.category,
      roomNumber: complaintData.roomNumber,
      hostelBlock: complaintData.hostelBlock || 'Block A',
      priority: complaintData.priority || 'Medium',
      status: 'Pending',
      description: complaintData.description,
      imageUrl: complaintData.imageUrl || null,
      date: new Date().toISOString().split('T')[0],
      assignedTo: null,
      adminRemarks: '',
      resolutionDate: null
    };

    complaints.unshift(newComplaint);
    saveStoredComplaints(complaints);
    return { data: { success: true, complaint: newComplaint, message: 'Complaint submitted successfully' } };
  }

  // Real backend call: POST /api/complaints
  return apiClient.post('/complaints', complaintData);
};

export const getMyComplaints = async (studentEmail = 'student@hostelcare.com') => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 250));
    const complaints = getStoredComplaints();
    // In mock mode, if filtering by student, return those matching email or STU001
    const studentComplaints = complaints.filter(
      (c) => c.studentEmail === studentEmail || c.studentId === 'STU001'
    );
    return { data: studentComplaints };
  }

  // Real backend call: GET /api/complaints/my
  return apiClient.get('/complaints/my');
};

export const getComplaintById = async (id) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 200));
    const complaints = getStoredComplaints();
    const complaint = complaints.find((c) => c.id === id);
    if (!complaint) {
      throw new Error('Complaint not found');
    }
    return { data: complaint };
  }

  // Real backend call: GET /api/complaints/:id
  return apiClient.get(`/complaints/${id}`);
};

export const updateComplaint = async (id, updatedFields) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 300));
    const complaints = getStoredComplaints();
    const index = complaints.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error('Complaint not found');
    }
    complaints[index] = { ...complaints[index], ...updatedFields };
    saveStoredComplaints(complaints);
    return { data: { success: true, complaint: complaints[index] } };
  }

  // Real backend call: PUT /api/complaints/:id
  return apiClient.put(`/complaints/${id}`, updatedFields);
};

export const deleteComplaint = async (id) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 250));
    const complaints = getStoredComplaints();
    const filtered = complaints.filter((c) => c.id !== id);
    saveStoredComplaints(filtered);
    return { data: { success: true, message: 'Complaint deleted or cancelled successfully' } };
  }

  // Real backend call: DELETE /api/complaints/:id
  return apiClient.delete(`/complaints/${id}`);
};

export const getAllComplaints = async () => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 250));
    const complaints = getStoredComplaints();
    return { data: complaints };
  }

  // Real backend call: GET /api/complaints
  return apiClient.get('/complaints');
};

export const updateComplaintStatus = async (id, { status, adminRemarks, assignedTo }) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 300));
    const complaints = getStoredComplaints();
    const index = complaints.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error('Complaint not found');
    }
    complaints[index].status = status;
    if (adminRemarks !== undefined) {
      complaints[index].adminRemarks = adminRemarks;
    }
    if (assignedTo !== undefined) {
      complaints[index].assignedTo = assignedTo;
    }
    if (status === 'Resolved' && !complaints[index].resolutionDate) {
      complaints[index].resolutionDate = new Date().toISOString().split('T')[0];
    }
    saveStoredComplaints(complaints);
    return { data: { success: true, complaint: complaints[index] } };
  }

  // Real backend call: PUT /api/complaints/:id/status
  return apiClient.put(`/complaints/${id}/status`, { status, adminRemarks, assignedTo });
};

export const getStudents = async () => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 250));
    const students = getStoredStudents();
    return { data: students };
  }

  // Real backend call: GET /api/students
  return apiClient.get('/students');
};

export default apiClient;
