import axios from 'axios';

const api = axios.create({
  baseURL: "https://dukan-com-peach.vercel.app/api",
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally — clear storage and redirect to login if not already on an auth flow
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if the user is explicitly trying to login/register
      const isAuthRequest = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      
      if (!isAuthRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Let React Router handle redirects instead of forcing a page reload,
        // but if we must force it, redirect to home where they can choose their portal
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
