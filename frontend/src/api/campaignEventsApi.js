import axiosInstance from './axiosInstance';

const CAMPAIGN_URL = '/campaigns';
const EVENT_URL = '/events';

export const campaignEventsApi = {
  // ==========================================
  // CAMPAIGN ENDPOINTS
  // ==========================================
  getAllCampaigns: async () => {
    const response = await axiosInstance.get(CAMPAIGN_URL);
    return response.data;
  },

  createCampaign: async (campaignData) => {
    const response = await axiosInstance.post(CAMPAIGN_URL, campaignData);
    return response.data;
  },

  getSystemAnalytics: async () => {
    const response = await axiosInstance.get(`${CAMPAIGN_URL}/analytics/summary`);
    return response.data;
  },

  // ==========================================
  // EVENT ENDPOINTS
  // ==========================================
  getAllEvents: async () => {
    const response = await axiosInstance.get(EVENT_URL);
    return response.data;
  },

  createEvent: async (campaignId, eventData) => {
    const response = await axiosInstance.post(`${EVENT_URL}/campaigns/${campaignId}`, eventData);
    return response.data;
  },

  updateEventStatus: async (eventId, status) => {
    const response = await axiosInstance.put(`${EVENT_URL}/${eventId}/status`, { status });
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await axiosInstance.delete(`${EVENT_URL}/${eventId}`);
    return response.data;
  },

  // ==========================================
  // REGISTRATION ENDPOINTS
  // ==========================================
  registerForEvent: async (eventId, accessibilityNeeds = 'None') => {
    const response = await axiosInstance.post(`/registrations/events/${eventId}/register`, { accessibilityNeeds });
    return response.data;
  },

  getMyRegistrations: async () => {
    const response = await axiosInstance.get('/registrations/my-registrations');
    return response.data;
  },

  cancelRegistration: async (registrationId) => {
    const response = await axiosInstance.delete(`/registrations/${registrationId}`);
    return response.data;
  },

  getEventAttendees: async (eventId) => {
    const response = await axiosInstance.get(`/registrations/events/${eventId}/attendees`);
    return response.data;
  },

  bulkMarkAttendance: async (registrationIds, status) => {
    const response = await axiosInstance.patch('/registrations/bulk-attend', { registrationIds, status });
    return response.data;
  },

  // ==========================================
  // FEEDBACK ENDPOINTS
  // ==========================================
  submitFeedback: async (eventId, feedbackData) => {
    const response = await axiosInstance.post(`/feedbacks/events/${eventId}`, feedbackData);
    return response.data;
  },

  getEventStats: async (eventId) => {
    const response = await axiosInstance.get(`/feedbacks/events/${eventId}/stats`);
    return response.data;
  }
};