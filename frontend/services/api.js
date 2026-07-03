// services/api.js
const API_BASE_URL = 'https://trustnexus-internship.vercel.app/api';
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

const handleMockResponse = async (endpoint, options) => {
  await new Promise(resolve => setTimeout(resolve, 800));

  if (endpoint.includes('/auth/login')) {
    return { success: true, token: 'mock-jwt-token', user: { role: 'Employee' } };
  }
  if (endpoint.includes('/auth/register')) {
    return { success: true, token: 'mock-jwt-token', user: { role: 'Employee' } };
  }
  if (endpoint.includes('/candidate/submit') || endpoint === '/candidate') {
    return { success: true, message: 'Application submitted successfully' };
  }
  if (endpoint.includes('/document/upload') || endpoint === '/document') {
    return { success: true, message: 'Documents uploaded successfully' };
  }
  if (endpoint.includes('/interview')) {
    return { success: true, interview: mockData.applications[0].interview };
  }
  
  return { success: true, data: mockData };
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
    // Step 1: create the candidate profile (only allowed once per user — backend
    // returns 400 if it already exists, which we can safely ignore here)
    try {
      await apiCall('/candidate/create-profile', {
        method: 'POST',
        body: JSON.stringify({ applied_position: data.position }),
      });
    } catch (err) {
      if (!err.message.includes('already exists')) throw err;
    }

    // Step 2: submit the actual application
    return apiCall('/candidate/submit-application', {
      method: 'POST',
      body: JSON.stringify({ applied_position: data.position }),
    });
  },
  getStatus: (applicationId) => apiCall(`/candidate/${applicationId}/status`),
  getAll: () => apiCall('/candidate/dashboard'),
  // api.js – inside applicationAPI
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
};

