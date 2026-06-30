// services/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.vercel.app';

// Mock data (used when backend is not available)
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
    { id: 2, name: 'Bilal Ahmed', position: 'Frontend Developer', status: 'Submitted', applied: '10 Jun 2026' },
  ]
};

// Helper: simulate delay for realistic UX
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// ─── API Call Helper ────────────────────────────────────────────
const apiCall = async (endpoint, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // If backend is not available, use mock responses
  if (!process.env.NEXT_PUBLIC_USE_REAL_API) {
    await delay(600);
    
    // ─── Mock Login with Role Validation ──────────────────────────
    if (endpoint.includes('/auth/login')) {
      const body = JSON.parse(options.body);
      const { email, password, role } = body;

      // Validate role-based login
      if (role === 'HR' && !email.toLowerCase().includes('hr')) {
        throw new Error('Invalid credentials for HR role. Please use an HR email.');
      }
      if (role === 'Employee' && email.toLowerCase().includes('hr')) {
        throw new Error('Invalid credentials for Employee role. Please use a valid employee email.');
      }
      // For demo, any password works if email passes role check
      if (!email || !password) {
        throw new Error('Email and password are required.');
      }
      // Mock success
      return { success: true, token: 'mock-jwt-token', user: { role } };
    }

    // ─── Other mock endpoints ─────────────────────────────────────
    if (endpoint.includes('/auth/register')) {
      return { success: true, token: 'mock-jwt-token', user: { role: 'Employee' } };
    }
    if (endpoint.includes('/applications') && options.method === 'POST') {
      return { success: true, applicationId: 'mock-app-123' };
    }
    if (endpoint.includes('/applications/')) {
      const appId = endpoint.split('/').pop();
      const app = mockData.applications.find(a => a.id === appId) || mockData.applications[0];
      return { success: true, data: app };
    }
    if (endpoint.includes('/upload')) {
      return { success: true, message: 'Files uploaded successfully' };
    }
    if (endpoint.includes('/candidates')) {
      return { success: true, data: mockData.candidates };
    }
    return { success: true, data: { message: 'Mock response' } };
  }

  // Real API call (if backend is enabled)
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'API request failed');
  return data;
};

// ─── Auth APIs ──────────────────────────────────────────────────
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

// ─── Application APIs ──────────────────────────────────────────
export const applicationAPI = {
  submit: (data) =>
    apiCall('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getStatus: (applicationId) =>
    apiCall(`/applications/${applicationId}/status`),
  getAll: () => apiCall('/applications'),
};

// ─── Upload API ─────────────────────────────────────────────────
export const uploadAPI = {
  uploadDocuments: (files) => {
    const formData = new FormData();
    Object.keys(files).forEach(key => {
      if (files[key]) formData.append(key, files[key]);
    });
    return apiCall('/upload', {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ─── Interview API ──────────────────────────────────────────────
export const interviewAPI = {
  getDetails: (applicationId) =>
    apiCall(`/applications/${applicationId}/interview`),
};