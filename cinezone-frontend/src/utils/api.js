import axios from 'axios';

// Configuration API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Instance Axios configurée
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===================== AUTH =====================
export const auth = {
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    // fixme: a reverifier avec plus de test
    return user !== "undefined" ? JSON.parse(user) : null;
  },
};

// ===================== MOVIES =====================
export const movies = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/movies', { params });
    return data.movies;
  },

  getAllWithPagination: async (params = {}) => {
    const { data } = await api.get('/movies', { params });
    return data; // Returns { movies, pagination }
  },

  getById: async (id) => {
    const { data } = await api.get(`/movies/${id}`);
    return data;
  },

  search: async (query, params = {}) => {
    const { data } = await api.get('/movies', { params: { search: query, ...params } });
    return data;
  },
};

// ===================== CATEGORIES =====================
export const categories = {
  getAll: async () => {
    const { data } = await api.get('/categories');
    return data;
  },
};

// ===================== WATCHLIST =====================
export const watchlist = {
  get: async () => {
    const { data } = await api.get('/watchlist');
    return data;
  },

  add: async (movieId) => {
    const { data } = await api.post('/watchlist', { movieId });
    return data;
  },

  remove: async (movieId) => {
    const { data } = await api.delete(`/watchlist/${movieId}`);
    return data;
  },
};

// ===================== NOTES =====================
export const notes = {
  get: async () => {
    const { data } = await api.get('/notes');
    return data;
  },

  createOrUpdate: async (movieId, rating, comment) => {
    const { data } = await api.post('/notes', { movieId, rating, comment });
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/notes/${id}`);
    return data;
  },
};

// ===================== HISTORY =====================
export const history = {
  get: async (params = {}) => {
    const { data } = await api.get('/history', { params });
    return data;
  },
};

// ===================== USER =====================
export const user = {
  getProfile: async () => {
    const { data } = await api.get('/users/profile');
    return data;
  },

  updateProfile: async (userData) => {
    const { data } = await api.put('/users/profile', userData);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  updatePassword: async (passwordData) => {
    const { data } = await api.put('/users/password', passwordData);
    return data;
  },
};

// ===================== ADMIN =====================
export const admin = {
  // Movies
  createMovie: async (movieData) => {
    // movieData can be FormData (with poster) or plain object
    if (movieData instanceof FormData) {
      // Let axios set the Content-Type (with proper boundary) when sending FormData
      const { data } = await api.post('/movies', movieData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    }
    const { data } = await api.post('/movies', movieData);
    return data;
  },

  updateMovie: async (movieId, movieData) => {
    if (movieData instanceof FormData) {
      // Let axios set the Content-Type (with proper boundary) when sending FormData
      const { data } = await api.put(`/movies/${movieId}`, movieData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    }
    const { data } = await api.put(`/movies/${movieId}`, movieData);
    return data;
  },

  deleteMovie: async (movieId) => {
    const { data } = await api.delete(`/movies/${movieId}`);
    return data;
  },

  // Categories
  createCategory: async (categoryData) => {
    const { data } = await api.post('/categories', categoryData);
    return data;
  },

  updateCategory: async (categoryId, categoryData) => {
    const { data} = await api.put(`/categories/${categoryId}`, categoryData);
    return data;
  },

  deleteCategory: async (categoryId) => {
    const { data } = await api.delete(`/categories/${categoryId}`);
    return data;
  },

  // Users
  getAllUsers: async (params = {}) => {
    const { data } = await api.get('/users', { params });
    return data;
  },

  deleteUser: async (userId) => {
    const { data } = await api.delete(`/users/${userId}`);
    return data;
  },

  // Media upload (si nécessaire pour les images de films)
  uploadImage: async (formData) => {
    const { data } = await api.post('/admin/upload', formData);
    return data;
  },
};
