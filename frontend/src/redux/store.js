import { configureStore, createSlice } from '@reduxjs/toolkit';

const savedAuth = (() => {
  try {
    const raw = localStorage.getItem('cl_auth');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
})();

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:            savedAuth?.user            ?? null,
    isAuthenticated: savedAuth?.isAuthenticated ?? false,
    role:            savedAuth?.role            ?? null, // 'athlete' | 'trainer' | 'admin'
    token:           savedAuth?.token           ?? null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.token = action.payload.token || null;
      state.isAuthenticated = true;
      try {
        localStorage.setItem('cl_auth', JSON.stringify({
          user: state.user,
          role: state.role,
          token: state.token,
          isAuthenticated: true,
        }));
      } catch { /* noop */ }
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;
      try { localStorage.removeItem('cl_auth'); } catch { /* noop */ }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      try {
        localStorage.setItem('cl_auth', JSON.stringify({
          user: state.user,
          role: state.role,
          token: state.token,
          isAuthenticated: true,
        }));
      } catch { /* noop */ }
    },
  },
});

// UI slice for global UI state
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    notificationCount: 0,
    sidebarOpen: true,
    activeFilter: 'All',
  },
  reducers: {
    setNotificationCount: (state, action) => {
      state.notificationCount = action.payload;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
  },
});

// Requests slice – stores items fetched from API
const requestsSlice = createSlice({
  name: 'requests',
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    setRequests: (state, action) => {
      state.items = action.payload;
    },
    setRequestsLoading: (state, action) => {
      state.loading = action.payload;
    },
    acceptRequest: (state, action) => {
      const req = state.items.find(r => r._id === action.payload || r.id === action.payload);
      if (req) { req.status = 'accepted'; req.responseDate = new Date().toISOString().split('T')[0]; }
    },
    declineRequest: (state, action) => {
      const req = state.items.find(r => r._id === action.payload || r.id === action.payload);
      if (req) { req.status = 'rejected'; req.responseDate = new Date().toISOString().split('T')[0]; }
    },
  },
});

// Athlete outgoing requests slice (athlete → coach)
const athleteRequestsSlice = createSlice({
  name: 'athleteRequests',
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    setAthleteRequests: (state, action) => {
      state.items = action.payload;
    },
    setAthleteRequestsLoading: (state, action) => {
      state.loading = action.payload;
    },
    cancelAthleteRequest: (state, action) => {
      state.items = state.items.filter(r => (r._id || r.id) !== action.payload);
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export const { setNotificationCount, setSidebarOpen, setActiveFilter } = uiSlice.actions;
export const { setRequests, setRequestsLoading, acceptRequest, declineRequest } = requestsSlice.actions;
export const { setAthleteRequests, setAthleteRequestsLoading, cancelAthleteRequest } = athleteRequestsSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    requests: requestsSlice.reducer,
    athleteRequests: athleteRequestsSlice.reducer,
  },
});
