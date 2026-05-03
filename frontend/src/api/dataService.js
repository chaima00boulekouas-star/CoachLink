import api from './axios';

// ── Trainers / Coaches API Service ────────────────────────────────────────

export const trainerService = {
  // Get all trainers (with optional filters)
  getAll: async (filters = {}) => {
    const params = {};
    if (filters.sport && filters.sport !== 'All') params.sport = filters.sport;
    if (filters.wilaya && filters.wilaya !== 'All') params.wilaya = filters.wilaya;
    if (filters.experience) params.experience = filters.experience;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.search) params.search = filters.search;

    const res = await api.get('/api/trainer-profiles', { params });
    return res.data; // { trainers: [...] }
  },

  // Get a single trainer profile
  getById: async (id) => {
    const res = await api.get(`/api/trainer-profiles/${id}`);
    return res.data;
  },

  // Get trainer's store products
  getProducts: async (trainerId) => {
    const res = await api.get(`/api/trainer-profiles/${trainerId}/products`);
    return res.data;
  },

  // Update trainer profile
  updateProfile: async (data) => {
    const res = await api.put('/api/trainer-profiles', data);
    return res.data;
  },

  // Get trainer dashboard stats
  getDashboardStats: async () => {
    const res = await api.get('/api/dashboard/trainer');
    return res.data;
  },

  // Get trainer earnings
  getEarnings: async () => {
    const res = await api.get('/api/trainer-profiles/earnings'); // Placeholder
    return res.data;
  },
};

// ── Favorites API Service ─────────────────────────────────────────────────

export const favoritesService = {
  // Get trainer's favorite athletes
  getFavorites: async () => {
    const res = await api.get('/api/trainer-profiles/favorites');
    return res.data;
  },

  // Toggle favorite (add/remove)
  toggle: async (athleteId) => {
    const res = await api.post(`/api/trainer-profiles/favorites/${athleteId}`);
    return res.data;
  },
};

// ── Athletes API Service ──────────────────────────────────────────────────

export const athleteService = {
  // Get all athletes (for trainer view)
  getAll: async (filters = {}) => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.sport) params.sport = filters.sport;

    const res = await api.get('/api/athletes', { params });
    return res.data;
  },

  // Get a single athlete profile
  getById: async (id) => {
    const res = await api.get(`/api/athletes/${id}`);
    return res.data;
  },

  // Update athlete profile
  updateProfile: async (data) => {
    const res = await api.put('/api/athletes/profile', data);
    return res.data;
  },

  // Get athlete dashboard data
  getDashboard: async () => {
    const res = await api.get('/api/athletes/dashboard');
    return res.data;
  },
};

// ── Coaching Requests API Service ─────────────────────────────────────────

export const requestService = {
  // Send a coaching request (athlete → trainer)
  send: async (trainerId, data) => {
    const res = await api.post(`/api/requests`, { trainerId, ...data });
    return res.data;
  },

  // Get incoming requests (for trainer)
  getIncoming: async () => {
    const res = await api.get('/api/requests/incoming');
    return res.data;
  },

  // Get outgoing requests (for athlete)
  getOutgoing: async () => {
    const res = await api.get('/api/requests/outgoing');
    return res.data;
  },

  // Accept a request (trainer action)
  accept: async (requestId) => {
    const res = await api.put(`/api/requests/${requestId}/accept`);
    return res.data;
  },

  // Decline a request (trainer action)
  decline: async (requestId) => {
    const res = await api.put(`/api/requests/${requestId}/decline`);
    return res.data;
  },

  // Cancel a request (athlete action)
  cancel: async (requestId) => {
    const res = await api.delete(`/api/requests/${requestId}`);
    return res.data;
  },
};

// ── Sessions API Service ──────────────────────────────────────────────────

export const sessionService = {
  // Get sessions for current trainer
  getTrainerSessions: async () => {
    const res = await api.get('/api/sessions/trainer');
    return res.data;
  },

  // Get sessions for current athlete
  getAthleteSessions: async () => {
    const res = await api.get('/api/sessions/athlete');
    return res.data;
  },

  // Update session status
  updateStatus: async (sessionId, status) => {
    const res = await api.put(`/api/sessions/${sessionId}/status`, { status });
    return res.data;
  },
};

// ── Store / Products API Service ──────────────────────────────────────────

export const productService = {
  // Get all products (for store pages)
  getAll: async (filters = {}) => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    if (filters.trainerId) params.trainerId = filters.trainerId;
    const res = await api.get('/api/products', { params });
    return res.data;
  },

  // Get a single product
  getById: async (id) => {
    const res = await api.get(`/api/products/${id}`);
    return res.data;
  },

  // Create a product (trainer action)
  create: async (formData) => {
    const res = await api.post('/api/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Update a product
  update: async (id, data) => {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const res = await api.put(`/api/products/${id}`, data, config);
    return res.data;
  },

  // Delete a product
  delete: async (id) => {
    const res = await api.delete(`/api/products/${id}`);
    return res.data;
  },

  // Get my store products (trainer)
  getMyProducts: async () => {
    const res = await api.get('/api/products/my-store');
    return res.data;
  },
};

// ── Store API Service ───────────────────────────────────────────────────
export const storeService = {
  // Get current trainer's store
  getMyStore: async () => {
    const res = await api.get('/api/stores/me');
    return res.data;
  },

  // Cancel current trainer's subscription
  cancelSubscription: async () => {
    const res = await api.post('/api/stores/cancel-subscription');
    return res.data;
  },
};

// ── Orders API Service ────────────────────────────────────────────────────

export const orderService = {
  // Get all orders
  getAll: async () => {
    const res = await api.get('/api/orders');
    return res.data;
  },

  // Get recent orders
  getRecent: async (limit = 5) => {
    const res = await api.get('/api/orders/recent', { params: { limit } });
    return res.data;
  },
};

// ── Cart API Service ──────────────────────────────────────────────────────

export const cartService = {
  // Get cart items
  getCart: async () => {
    const res = await api.get('/api/cart');
    return res.data;
  },

  // Add item to cart
  addItem: async (productId, quantity = 1) => {
    const res = await api.post('/api/cart', { productId, quantity });
    return res.data;
  },

  // Update item quantity
  updateQuantity: async (itemId, quantity) => {
    const res = await api.put(`/api/cart/${itemId}`, { quantity });
    return res.data;
  },

  // Remove item from cart
  removeItem: async (itemId) => {
    const res = await api.delete(`/api/cart/${itemId}`);
    return res.data;
  },
};

// ── Notifications API Service ─────────────────────────────────────────────

export const notificationService = {
  // Get all notifications
  getAll: async () => {
    const res = await api.get('/api/notifications');
    return res.data;
  },

  // Mark as read
  markRead: async (notifId) => {
    const res = await api.put(`/api/notifications/${notifId}/read`);
    return res.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const res = await api.get('/api/notifications/unread-count');
    return res.data;
  },
};

// ── Favorites API Service ─────────────────────────────────────────────────

export const favoriteService = {
  // Get favorites
  getAll: async () => {
    const res = await api.get('/api/favorites');
    return res.data;
  },

  // Toggle favorite
  toggle: async (trainerId) => {
    const res = await api.post(`/api/favorites/${trainerId}`);
    return res.data;
  },
};

// ── Settings API Service ──────────────────────────────────────────────────

export const settingsService = {
  // Get user settings
  get: async () => {
    const res = await api.get('/api/settings');
    return res.data;
  },

  // Update settings
  update: async (data) => {
    const res = await api.put('/api/settings', data);
    return res.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const res = await api.put('/api/settings/password', { currentPassword, newPassword });
    return res.data;
  },

  // Update avatar
  updateAvatar: async (formData) => {
    const res = await api.put('/api/settings/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

// ── Admin API Service ─────────────────────────────────────────────────────

export const adminService = {
  // Get dashboard stats
  getDashboard: async () => {
    const res = await api.get('/api/admin/dashboard');
    return res.data;
  },

  // Get all users
  getUsers: async (filters = {}) => {
    const res = await api.get('/api/admin/users', { params: filters });
    return res.data;
  },

  // Ban/unban user
  toggleBan: async (userId) => {
    const res = await api.put(`/api/admin/users/${userId}/toggle-ban`);
    return res.data;
  },

  // Get reports
  getReports: async () => {
    const res = await api.get('/api/admin/reports');
    return res.data;
  },
};

// ── Chat API Service ──────────────────────────────────────────────────────

export const chatService = {
  // Get all conversations
  getConversations: async () => {
    const res = await api.get('/api/chat/conversations');
    return res.data;
  },

  // Get or create conversation with a user
  getOrCreateConversation: async (recipientId) => {
    const res = await api.post('/api/chat/conversation', { recipientId });
    return res.data;
  },

  // Get messages for a conversation
  getMessages: async (conversationId) => {
    const res = await api.get(`/api/chat/conversation/${conversationId}/messages`);
    return res.data;
  },

  // Send a message
  sendMessage: async (conversationId, text) => {
    const res = await api.post(`/api/chat/conversation/${conversationId}/message`, { text });
    return res.data;
  },
};
