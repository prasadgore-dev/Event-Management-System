import api from './api';

const hostEventRequestService = {
  createRequest: async (requestData) => {
    const response = await api.post('/host-event-requests', requestData);
    return response.data;
  },

  getRequests: async () => {
    const response = await api.get('/host-event-requests');
    return response.data;
  },

  getMyRequests: async () => {
    const response = await api.get('/host-event-requests/my-requests');
    return response.data;
  },

  updateStatus: async (id, status, eventData = null) => {
    const response = await api.patch(`/host-event-requests/${id}/status`, { status, eventData });
    return response.data;
  },
};

export default hostEventRequestService;
