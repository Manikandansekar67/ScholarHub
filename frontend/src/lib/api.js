import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(response => response.data, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
  }
  return Promise.reject(error.response?.data || error.message);
});

// Auth API
export const authAPI = {
  register: data => api.post('/auth/register', data),
  login: data => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: data => api.put('/auth/profile', data)
};

// Scholarship API
export const scholarshipAPI = {
  getAll: (params) => api.get('/scholarships', {
    params
  }),
  getById: id => api.get(`/scholarships/${id}`),
  create: data => api.post('/scholarships', data),
  update: (id, data) => api.put(`/scholarships/${id}`, data),
  delete: id => api.delete(`/scholarships/${id}`),
  getMySponsoredScholarships: () => api.get('/scholarships/my/created')
};

// Application API
export const applicationAPI = {
  submit: data => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/my'),
  getById: id => api.get(`/applications/${id}`),
  verify: (id, data) => api.put(`/applications/${id}/verify`, data),
  forward: id => api.put(`/applications/${id}/forward`),
  review: (id, data) => api.put(`/applications/${id}/review`, data),
  getForSponsor: () => api.get('/applications/sponsor'),
  getForAdmin: (params) => api.get('/applications/admin', {
    params
  })
};

// Document API
export const documentAPI = {
  upload: file => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  download: id => api.get(`/documents/${id}`, {
    responseType: 'blob'
  }),
  delete: id => api.delete(`/documents/${id}`),
  getMetadata: id => api.get(`/documents/${id}/metadata`)
};

// Notification API
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', {
    params
  }),
  markAsRead: id => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all')
};
export default api;