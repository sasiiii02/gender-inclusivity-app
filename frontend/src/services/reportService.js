import axiosInstance from "../api/axiosInstance";

export const getMyReports = async () => {
    const response = await axiosInstance.get("/reports/my-reports");
    return response.data;
};

export const submitReport = async (payload) => {
    const isFormData = payload instanceof FormData;
    const response = await axiosInstance.post("/reports/create", payload, {
        headers: {
            "Content-Type": isFormData ? "multipart/form-data" : "application/json"
        }
    });
    return response.data;
};

export const getReportCategories = async () => {
    const response = await axiosInstance.get("/reports/categories");
    return response.data;
};

export const getReportById = async (id) => {
    // There isn't an exact GET /:id in the router right now, but assuming we can filter my-reports
    // Or we will just use getReportTimeline or getAllReports and filter
    // Let's create an endpoint call, if not available on backend we can handle fetching all and filtering.
    // Looking at backend router, we don't have getReportById. So let's fetch my-reports and find it or just use timeline
    const response = await axiosInstance.get("/reports/my-reports");
    const reports = response.data.reports || [];
    const report = reports.find(r => r._id === id);
    if (!report) throw new Error("Report not found");
    return report;
};

export const getReportTimeline = async (id) => {
    const response = await axiosInstance.get(`/reports/${id}/timeline`);
    return response.data;
};
