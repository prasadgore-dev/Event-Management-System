import api from './api';

const authService = {
  register: async (email, fullName, password) => {
    const response = await api.post('/auth/register', { email, fullName, password });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  refresh: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};

export default authService;
