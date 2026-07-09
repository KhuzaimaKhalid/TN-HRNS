// services/api.js
const API_BASE_URL = 'http://localhost:5000/api';
const useRealApi = true; // 👈 Forced true to connect to the real cloud backend

// ─── Mock Data ──────────────────────────────────────────────────
const mockData = {
  applications: [
    {
      id: '1',
      status: 'Interview Scheduled',
      appliedDate: '2026-06-02',
      position: 'AI Engineer Intern',
      statuses: [
        { stage: 'Submitted', date: '2026-06-02', description: 'Application received' },
        { stage: 'Under Review', date: '2026-06-06', description: 'Profile under review' },
        { stage: 'Interview Scheduled', date: '2026-06-10', description: 'Interview scheduled for 18 Jun' },
      ],
      interview: {
        date: '2026-06-18',
        day: 'Tuesday',
        time: '04:00 PM',
        meetLink: 'https://meet.google.com/abc-tgibc-nwl',
        interviewer: 'Mr. Ahmad',
        notes: 'Please have your portfolio ready.',
      }
    }
  ],
  candidates: [
    { id: 1, name: 'Ayesha Khan', position: 'AI Engineer', status: 'Interview', applied: '02 Jun 2026' },
    { id: 2, name: 'Bilal Ahmed', position: 'Backend Developer', status: 'Shortlisted', applied: '05 Jun 2026' },
  ]
};

// ─── API Handler ────────────────────────────────────────────────
// ─── Helper: delay for mock ──────────────────────────────────
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Mock Response Handler ────────────────────────────────────
const handleMockResponse = async (endpoint, options) => {
  await delay(600);

  // ─── Mock Login ──────────────────────────────────────────────
  if (endpoint.includes('/auth/login')) {
    const body = JSON.parse(options.body);
    const { email, password, role } = body;

    // Role-based validation
    if (role === 'HR' && !email.toLowerCase().includes('hr')) {
      throw new Error('Invalid credentials for HR role. Please use an HR email.');
    }
    if (role === 'Employee' && email.toLowerCase().includes('hr')) {
      throw new Error('Invalid credentials for Employee role. Please use a valid employee email.');
    }

    // ✅ Password validation – only 'password123' works in mock mode
    if (password !== 'password123') {
      throw new Error('Invalid email or password. Please try again.');
    }

    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    return {
      success: true,
      token: 'mock-jwt-token',
      user: { role, name: email.split('@')[0] }
    };
  }

  // ─── Mock Register ────────────────────────────────────────────
  if (endpoint.includes('/auth/register')) {
    const body = JSON.parse(options.body);
    return {
      success: true,
      token: 'mock-jwt-token',
      user: { role: 'Employee', name: body.fullName || body.name || 'User' }
    };
  }

  // ─── Candidate Submit ────────────────────────────────────────
  if (endpoint.includes('/candidate/submit') && options.method === 'POST') {
    return { success: true, applicationId: 'mock-app-123' };
  }

  // ─── Candidate Status ────────────────────────────────────────
  if (endpoint.includes('/candidate/')) {
    const app = mockData.applications[0];
    return { success: true, data: app };
  }

  // ─── Candidate List ──────────────────────────────────────────
  if (endpoint.includes('/candidate')) {
    return { success: true, data: mockData.applications };
  }

  // ─── Document Upload ─────────────────────────────────────────
  if (endpoint.includes('/document/upload')) {
    return { success: true, message: 'Files uploaded successfully' };
  }

  // ─── Interview Details ───────────────────────────────────────
  if (endpoint.includes('/interview/')) {
    return { success: true, data: mockData.applications[0].interview };
  }

  // ─── Schedule Interview ──────────────────────────────────────
  if (endpoint.includes('/interview/schedule')) {
    return { success: true, message: 'Interview scheduled successfully' };
  }

  return { success: true, data: { message: 'Mock response' } };
};

// ─── API Call Helper ──────────────────────────────────────────
const apiCall = async (endpoint, options = {}) => {
  if (!useRealApi || options._mock) {
    return handleMockResponse(endpoint, options);
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const requestOptions = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (error) {
    console.error('API Error:', error);
    // REMOVED THE IF-STATEMENT MOCK FALLBACK THAT WAS INTERCEPTING REAL ERRORS
    throw error;
  }
};


// ─── AUTH ROUTES ───────────────────────────────────────────────
export const authAPI = {
  login: (email, password, role) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    }),
  register: (userData) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  logout: () => apiCall('/auth/logout', { method: 'POST' }),
  getProfile: () => apiCall('/auth/profile'),
};

// ─── CANDIDATE ROUTES ──────────────────────────────────────────
export const applicationAPI = {
  submit: async (data) => {
    // ... existing submit code
  },
  getStatus: (applicationId) => apiCall(`/candidate/${applicationId}/status`),
  
  // 1. LEAVE THIS EXACTLY AS IT IS FOR THE CANDIDATE DASHBOARD
  getAll: () => apiCall('/candidate/dashboard'),
  
  // 2. ADD THIS NEW METHOD FOR YOUR HR CANDIDATES PAGE
  getAllForHR: () => apiCall('/candidate/hr/all'), 
  
  getStatusByEmail: (email) => apiCall(`/candidate/status-by-email?email=${encodeURIComponent(email)}`, { _mock: false }),
};
// ─── DOCUMENT ROUTES ──────────────────────────────────────────
export const uploadAPI = {
  uploadDocuments: (files) => {
    const formData = new FormData();
    Object.keys(files).forEach(key => {
      if (files[key]) formData.append(key, files[key]);
    });
    return apiCall('/document/', { // 👈 Fixed endpoint path to match Express router base path
      method: 'POST',
      body: formData,
    });
  },
};

// ─── INTERVIEW ROUTES ─────────────────────────────────────────
export const interviewAPI = {
  getDetails: () =>
    apiCall('/interview/details'), // 👈 Fixed path to request /details using the auth token instead of an application ID variable

  // 👇 Used by the HR Calendar page to list all upcoming scheduled interviews
  getUpcoming: () =>
    apiCall('/interview/upcoming'),
};

// ─── HR ROUTES ─────────────────────────────────────────────────
export const hrAPI = {
  getDashboardMetrics: () => apiCall('/hr/metrics'),
};

// ─── MESSAGE ROUTES ────────────────────────────────────────────
export const messageAPI = {
  getInbox: () => apiCall('/messages/inbox'),
  send: (receiverId, subject, body) =>
    apiCall('/messages/sendMessage', { 
      method: 'POST',
      body: JSON.stringify({ receiverId, subject, body }),
    }),
};

// ─── LEAVE ROUTES ──────────────────────────────────────────────
export const leaveAPI = {
  // Used by normal user/employee portal to submit a new leave request
  requestLeave: (leave_type, start_date, end_date) =>
    apiCall('/leaves/request', {
      method: 'POST',
      body: JSON.stringify({ leave_type, start_date, end_date })
    }),

  // Used by HR Admin page to fetch and view leaves
  getAllForHR: () => apiCall('/leaves/hr/all'),
  
  // Used by HR Admin page to approve or reject
  updateStatus: (id, status) => 
    apiCall(`/leaves/status/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
};