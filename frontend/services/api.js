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
}; //

// ─── API Handler ────────────────────────────────────────────────
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

const handleMockResponse = async (endpoint, options) => {
  await delay(600);

  if (endpoint.includes('/auth/login')) {
    const body = JSON.parse(options.body);
    const { email, password, role } = body;

    if (role === 'HR' && !email.toLowerCase().includes('hr')) {
      throw new Error('Invalid credentials for HR role. Please use an HR email.');
    }
    if (role === 'Employee' && email.toLowerCase().includes('hr')) {
      throw new Error('Invalid credentials for Employee role. Please use a valid employee email.');
    }

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

  if (endpoint.includes('/auth/register')) {
    const body = JSON.parse(options.body);
    return {
      success: true,
      token: 'mock-jwt-token',
      user: { role: 'Employee', name: body.fullName || body.name || 'User' }
    };
  }

  if (endpoint.includes('/candidate/submit') && options.method === 'POST') {
    return { success: true, applicationId: 'mock-app-123' };
  }

  if (endpoint.includes('/candidate/')) {
    const app = mockData.applications[0];
    return { success: true, data: app };
  }

  if (endpoint.includes('/candidate')) {
    return { success: true, data: mockData.applications };
  }

  if (endpoint.includes('/document/upload')) {
    return { success: true, message: 'Files uploaded successfully' };
  }

  if (endpoint.includes('/interview/')) {
    return { success: true, data: mockData.applications[0].interview };
  }

  if (endpoint.includes('/interview/schedule')) {
    return { success: true, message: 'Interview scheduled successfully' };
  }

  return { success: true, data: { message: 'Mock response' } };
}; //

export const apiCall = async (endpoint, options = {}) => {
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
    throw error;
  }
}; //[cite: 1]

// ─── AUTH ROUTES ─────────────────────────────────────────────────
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
}; //[cite: 1]

// ─── CANDIDATE ROUTES ────────────────────────────────────────────
export const applicationAPI = {
  submit: (applied_position) =>
    apiCall('/candidate/submit-application', {
      method: 'POST',
      body: JSON.stringify({ applied_position }),
    }),
  getStatus: (applicationId) => apiCall(`/candidate/${applicationId}/status`),
  getAll: () => apiCall('/candidate/dashboard'),
  getAllForHR: () => apiCall('/candidate/hr/all'), 
  getStatusByEmail: (email) => apiCall(`/candidate/status-by-email?email=${encodeURIComponent(email)}`, { _mock: false }),
  updateStatus: (candidateId, status) =>
    apiCall(`/candidate/${candidateId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
}; //[cite: 1]

// ─── DOCUMENT ROUTES ────────────────────────────────────────────
export const uploadAPI = {
  uploadDocuments: (files) => {
    const formData = new FormData();
    Object.keys(files).forEach(key => {
      if (files[key]) formData.append(key, files[key]);
    });
    return apiCall('/document/', { 
      method: 'POST',
      body: formData,
    });
  },
}; //[cite: 1]

// ─── INTERVIEW ROUTES ───────────────────────────────────────────
export const interviewAPI = {
  getDetails: () => apiCall('/interview/details'), 
  getUpcoming: () => apiCall('/interview/upcoming'),
  getCandidates: () => apiCall('/interview/candidates'),
  schedule: (payload) =>
    apiCall('/interview/schedule', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}; //[cite: 1]

// ─── HR ROUTES ───────────────────────────────────────────────────
export const hrAPI = {
  getDashboardMetrics: () => apiCall('/hr/metrics'),
}; //[cite: 1]

// ─── MESSAGE ROUTES ──────────────────────────────────────────────
export const messageAPI = {
  getInbox: () => apiCall('/messages/inbox'),
  send: (receiverId, subject, body) =>
    apiCall('/messages/sendMessage', { 
      method: 'POST',
      body: JSON.stringify({ receiverId, subject, body }),
    }),
}; //[cite: 1]

// ─── LEAVE ROUTES ────────────────────────────────────────────────
export const leaveAPI = {
  requestLeave: (leave_type, start_date, end_date) =>
    apiCall('/leaves/request', { method: 'POST', body: JSON.stringify({ leave_type, start_date, end_date }) }),

  getAllForHR: () => apiCall('/leaves/hr/all'),
  updateStatus: (id, status) => apiCall(`/leaves/status/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  getForTeamLead: () => apiCall('/leaves/team-lead/all'),
  teamLeadUpdateStatus: (id, status) => apiCall(`/leaves/team-lead/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  getForCFO: () => apiCall('/leaves/cfo/all'),
  cfoUpdateStatus: (id, status) => apiCall(`/leaves/cfo/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};
// ─── TASK ROUTES ─────────────────────────────────────────────────
export const taskAPI = {
  submit: (formData) =>
    apiCall('/tasks/submit', { method: 'POST', body: formData }),

  getSubmission: (candidateId) =>
    apiCall(`/tasks/submission/${candidateId}`),

  create: (formData) =>
    apiCall('/tasks/createTask', { method: 'POST', body: formData }),

  getAll: () =>
    apiCall('/tasks/getTask'),

  updateStatus: (id, status) =>
    apiCall(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  assign: (id, assigned_to) =>
    apiCall(`/tasks/${id}/assign`, { method: 'PATCH', body: JSON.stringify({ assigned_to }) }),

  delete: (id) =>
    apiCall(`/tasks/${id}`, { method: 'DELETE' }),

  bulkDelete: (ids) =>
    apiCall('/tasks/bulk-delete', { method: 'POST', body: JSON.stringify({ ids }) }),
};

// ─── EXPORT ALL AS A FLAT DEFAULT OBJECT FOR PREVENTS IMPORTS BREAKING ──────
const api = {
  // We spread the inner APIs so their functions are available directly on the root object
  ...authAPI,
  ...applicationAPI,
  ...uploadAPI,
  ...interviewAPI,
  ...hrAPI,
  ...messageAPI,
  ...leaveAPI,
  ...taskAPI,
  
  // Also keeping the original nested properties intact to avoid breaking other files
  authAPI,
  applicationAPI,
  uploadAPI,
  interviewAPI,
  hrAPI,
  messageAPI,
  leaveAPI,
  taskAPI,
};

export default api; //[cite: 1]