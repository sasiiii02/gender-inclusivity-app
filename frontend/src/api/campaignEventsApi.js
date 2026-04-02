import axiosInstance from './axiosInstance';

// Base routes matching your backend
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

  createEvent: async (eventData) => {
    const response = await axiosInstance.post(EVENT_URL, eventData);
    return response.data;
  },

  updateEventStatus: async (eventId, status) => {
    const response = await axiosInstance.put(`${EVENT_URL}/${eventId}/status`, { status });
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await axiosInstance.delete(`${EVENT_URL}/${eventId}`);
    return response.data;
  }
};