import axios from 'axios';

const API_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

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

    return user !== "undefined" ? JSON.parse(user) : null;
  },
};

export const movies = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/movies', { params });
    return data.movies;
  },

  getAllWithPagination: async (params = {}) => {
    const { data } = await api.get('/movies', { params });
    return data;
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

export const categories = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/categories', { params });
    return data.categories || data;
  },

  getAllWithPagination: async (params = {}) => {
    const { data } = await api.get('/categories', { params });
    return data;
  },
};

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

export const history = {
  get: async (params = {}) => {
    const { data } = await api.get('/history', { params });
    return data;
  },
};

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

  updateAvatar: async (formData) => {
    const { data } = await api.put('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },
};

export const admin = {

  createMovie: async (movieData) => {

    if (movieData instanceof FormData) {

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

  getAllUsers: async (params = {}) => {
    const { data } = await api.get('/users', { params });
    return data;
  },

  deleteUser: async (userId) => {
    const { data } = await api.delete(`/users/${userId}`);
    return data;
  },

  uploadImage: async (formData) => {
    const { data } = await api.post('/admin/upload', formData);
    return data;
  },
};
