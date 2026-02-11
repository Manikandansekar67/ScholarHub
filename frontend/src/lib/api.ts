import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/auth';
        }
        return Promise.reject(error.response?.data || error.message);
    }
);

// Auth API
export const authAPI = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data: any) => api.put('/auth/profile', data),
};

// Scholarship API
export const scholarshipAPI = {
    getAll: (params?: any) => api.get('/scholarships', { params }),
    getById: (id: string) => api.get(`/scholarships/${id}`),
    create: (data: any) => api.post('/scholarships', data),
    update: (id: string, data: any) => api.put(`/scholarships/${id}`, data),
    delete: (id: string) => api.delete(`/scholarships/${id}`),
    getMySponsoredScholarships: () => api.get('/scholarships/my/created'),
};

// Application API
export const applicationAPI = {
    submit: (data: any) => api.post('/applications', data),
    getMyApplications: () => api.get('/applications/my'),
    getById: (id: string) => api.get(`/applications/${id}`),
    verify: (id: string, data: any) => api.put(`/applications/${id}/verify`, data),
    forward: (id: string) => api.put(`/applications/${id}/forward`),
    review: (id: string, data: any) => api.put(`/applications/${id}/review`, data),
    getForSponsor: () => api.get('/applications/sponsor'),
    getForAdmin: (params?: any) => api.get('/applications/admin', { params }),
};

// Document API
export const documentAPI = {
    upload: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/documents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    download: (id: string) => api.get(`/documents/${id}`, { responseType: 'blob' }),
    delete: (id: string) => api.delete(`/documents/${id}`),
    getMetadata: (id: string) => api.get(`/documents/${id}/metadata`),
};

// Notification API
export const notificationAPI = {
    getAll: (params?: any) => api.get('/notifications', { params }),
    markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
};

export default api;
