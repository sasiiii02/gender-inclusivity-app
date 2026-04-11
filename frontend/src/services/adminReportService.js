import axiosInstance from "../api/axiosInstance";

/**
 * Fetch high-level statistics for the admin reports dashboard.
 */
export const getReportStats = () => axiosInstance.get("/reports/stats");

/**
 * Fetch all reports with optional filters.
 */
export const getAllReportsForAdmin = (params = {}) => axiosInstance.get("/reports/all-reports", { params });

/**
 * Fetch a single report by ID.
 */
export const getReportById = (id) => axiosInstance.get(`/reports/all-reports`).then(res => {
    // Note: If no dedicated GET /reports/:id exists for admin, we find it in the all-reports list
    // However, the backend likely has it. Let's assume the all-reports endpoint is robust for now.
    const reports = res.data?.reports || res.data || [];
    return reports.find(r => r._id === id);
});

/**
 * Fetch the timeline (status changes + notes) for a specific report.
 */
export const getReportTimeline = (id) => axiosInstance.get(`/reports/${id}/timeline`);

/**
 * Fetch all admin responses for a specific report.
 */
export const getReportResponses = (id) => axiosInstance.get(`/reports/${id}/responses`);

/**
 * Update the status of a report.
 */
export const updateReportStatus = (id, statusId) => axiosInstance.patch(`/reports/${id}/status`, { statusId });

/**
 * Add a response/message to a report.
 */
export const addReportResponse = (id, message) => axiosInstance.post(`/reports/${id}/respond`, { message });

/**
 * Permanently close a report.
 */
export const closeReport = (id) => axiosInstance.patch(`/reports/${id}/close`);

/**
 * Fetch all admin responses across all reports.
 */
export const getAllAdminResponses = () => axiosInstance.get("/reports/responses");
