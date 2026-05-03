import api from './axios';

// ── Auth API Service ──────────────────────────────────────────────────────
// Backend routes live at /api/users/...

export const authService = {
  // Athlete login  →  POST /api/users/login  (role: 'athlete')
  athleteLogin: async (email, password) => {
    const res = await api.post('/api/users/login', { email, password, role: 'athlete' });
    return res.data; // { user, token }
  },

  // Trainer login  →  POST /api/users/login  (role: 'trainer')
  trainerLogin: async (email, password) => {
    const res = await api.post('/api/users/login', { email, password, role: 'trainer' });
    return res.data;
  },

  // Verify email → GET /api/users/verify-email?token=...
  verifyEmail: async (token) => {
    const res = await api.get(`/api/users/verify-email?token=${token}`);
    return res.data;
  },

  // Send OTP
  sendOtp: async (email) => {
    const res = await api.post('/api/users/send-otp', { email });
    return res.data;
  },

  // Verify OTP
  verifyOtp: async (email, otp) => {
    const res = await api.post('/api/users/verify-otp', { email, otp });
    return res.data;
  },

  // Admin login  →  POST /api/users/admin/login
  adminLogin: async (email, password) => {
    const res = await api.post('/api/users/admin/login', { email, password });
    return res.data;
  },

  // Athlete signup  →  POST /api/users/register  (role: 'athlete')
  athleteSignup: async (formData) => {
    const res = await api.post('/api/users/register', { ...formData, role: 'athlete' });
    return res.data;
  },

  // Trainer signup  →  POST /api/users/register  (role: 'trainer')
  trainerSignup: async (payload) => {
    const res = await api.post('/api/users/register', { ...payload, role: 'trainer' });
    return res.data;
  },

  // Forgot password  →  POST /api/users/forgot-password  (to be added later)
  forgotPassword: async (email) => {
    const res = await api.post('/api/users/forgot-password', { email });
    return res.data;
  },

  // Get current user  →  GET /api/users/me
  getMe: async () => {
    const res = await api.get('/api/users/me');
    return res.data;
  },

  // Update profile  →  PUT /api/users/:id
  updateProfile: async (id, data) => {
    const res = await api.put(`/api/users/${id}`, data);
    return res.data;
  },

  // Update avatar  →  PUT /api/users/avatar
  updateAvatar: async (formData) => {
    const res = await api.put('/api/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Logout (client-side only — no server session)
  logout: () => {
    localStorage.removeItem('cl_auth');
  },
};

export default authService;
