import api from './api';

const registrationService = {
  registerEvent: async (eventId) => {
    const response = await api.post('/registrations', { eventId });
    return response.data;
  },

  cancelRegistration: async (registrationId) => {
    const response = await api.delete(`/registrations/${registrationId}`);
    return response.data;
  },

  getUserRegistrations: async () => {
    const response = await api.get('/registrations/user/my-registrations');
    return response.data;
  },

  getEventRegistrations: async (eventId) => {
    const response = await api.get(`/registrations/event/${eventId}`);
    return response.data;
  },
};

export default registrationService;
