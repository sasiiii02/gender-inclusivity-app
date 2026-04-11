import axiosInstance from '../api/axiosInstance';

export const getMyNotifications = () => axiosInstance.get('/reports/user/notifications');
export const markNotificationAsRead = (id) => axiosInstance.patch(`/reports/user/notifications/${id}/read`);
