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
    role:            savedAuth?.role            ?? null, // 'athlete' | 'trainer'
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      // Save to localStorage so role persists on page refresh
      try { localStorage.setItem('cl_auth', JSON.stringify({ user: state.user, role: state.role, isAuthenticated: true })); } catch { /* noop */ }
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      try { localStorage.removeItem('cl_auth'); } catch { /* noop */ }
    },
  },
});

// UI slice for global UI state
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    notificationCount: 3,
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

// Requests slice
const requestsSlice = createSlice({
  name: 'requests',
  initialState: {
    items: [
      {
        id: 1,
        name: 'Marcus Johnson',
        sport: 'Football',
        message: "Hi! I'd like to improve my shooting and defensive skills.",
        sentDate: '2025-02-20',
        responseDate: '2025-02-21',
        status: 'accepted',
        contact: { phone: '+1 (555) 123-4567', email: 'marcus@coachlink.com', whatsapp: '+1 (555) 123-4567', instagram: '@marcusjohnson' },
        avatar: null,
      },
      {
        id: 2,
        name: 'Sarah Williams',
        sport: 'Basketball',
        message: "I'm interested in your training programs.",
        sentDate: '2025-02-23',
        responseDate: null,
        status: 'pending',
        contact: null,
        avatar: null,
      },
      {
        id: 3,
        name: 'David Lee',
        sport: 'Tennis',
        message: 'Looking for advanced training.',
        sentDate: '2025-02-18',
        responseDate: '2025-02-19',
        status: 'rejected',
        contact: null,
        avatar: null,
      },
    ],
  },
  reducers: {
    acceptRequest: (state, action) => {
      const req = state.items.find(r => r.id === action.payload);
      if (req) { req.status = 'accepted'; req.responseDate = new Date().toISOString().split('T')[0]; }
    },
    declineRequest: (state, action) => {
      const req = state.items.find(r => r.id === action.payload);
      if (req) { req.status = 'rejected'; req.responseDate = new Date().toISOString().split('T')[0]; }
    },
  },
});

// Athlete outgoing requests slice (athlete → coach)
const athleteRequestsSlice = createSlice({
  name: 'athleteRequests',
  initialState: {
    items: [
      {
        id: 1,
        coachName: 'Tashi Duncan',
        sport: 'Tennis',
        plan: 'Elite Program',
        message: "Hi! I'd love to improve my serve and baseline game.",
        sentDate: '2025-03-10',
        responseDate: '2025-03-11',
        status: 'accepted',
        coachContact: { phone: '+1 (555) 987-0001', email: 'tashi@coachlink.com' },
      },
      {
        id: 2,
        coachName: 'Marcus Johnson',
        sport: 'Football',
        plan: 'Starter Program',
        message: 'Looking to build my defensive positioning and speed.',
        sentDate: '2025-03-18',
        responseDate: null,
        status: 'pending',
        coachContact: null,
      },
      {
        id: 3,
        coachName: 'Elena Williams',
        sport: 'Basketball',
        plan: 'Champion Program',
        message: 'Interested in your full conditioning program.',
        sentDate: '2025-03-05',
        responseDate: '2025-03-06',
        status: 'rejected',
        coachContact: null,
      },
    ],
  },
  reducers: {
    cancelAthleteRequest: (state, action) => {
      state.items = state.items.filter(r => r.id !== action.payload);
    },
  },
});

export const { login, logout } = authSlice.actions;
export const { setNotificationCount, setSidebarOpen, setActiveFilter } = uiSlice.actions;
export const { acceptRequest, declineRequest } = requestsSlice.actions;
export const { cancelAthleteRequest } = athleteRequestsSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    requests: requestsSlice.reducer,
    athleteRequests: athleteRequestsSlice.reducer,
  },
});
