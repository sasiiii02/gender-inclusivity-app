import axiosInstance from "./axiosInstance";

// ── Users ──────────────────────────────────────
export const getAllUsers = () => axiosInstance.get("/admin/users");
export const updateUserRole = (id, role) => axiosInstance.put(`/admin/users/${id}/role`, { role });
export const deleteUser = (id) => axiosInstance.delete(`/admin/users/${id}`);

// ── Reports ────────────────────────────────────
export const getAllReports = () => axiosInstance.get("/reports/all-reports");
export const updateReportStatus = (id, status) => axiosInstance.patch(`/reports/${id}/status`, { status });
export const addReportResponse = (id, data) => axiosInstance.post(`/reports/${id}/respond`, data);
export const getAllResponses = () => axiosInstance.get("/reports/responses");
export const getReportTimeline = (id) => axiosInstance.get(`/reports/${id}/timeline`);
export const closeReport = (id) => axiosInstance.patch(`/reports/${id}/close`);
export const getReportStats = () => axiosInstance.get("/reports/stats");

// ── Learning ───────────────────────────────────
export const getAllLearning = () => axiosInstance.get("/learning");
export const createLearning = (data) => axiosInstance.post("/learning", data);
export const updateLearning = (id, data) => axiosInstance.put(`/learning/${id}`, data);
export const deleteLearning = (id) => axiosInstance.delete(`/learning/${id}`);

// ── Quiz ───────────────────────────────────────
export const getAllQuizzes = () => axiosInstance.get("/quiz");
export const createQuiz = (data) => axiosInstance.post("/quiz", data);
export const deleteQuiz = (id) => axiosInstance.delete(`/quiz/${id}`);

// ── Events ─────────────────────────────────────
export const getAllEvents = () => axiosInstance.get("/events");
export const createEvent = (data) => axiosInstance.post("/events", data);
export const updateEvent = (id, data) => axiosInstance.put(`/events/${id}`, data);
export const deleteEvent = (id) => axiosInstance.delete(`/events/${id}`);

// ── Support Articles ───────────────────────────
export const getAllSupport = () => axiosInstance.get("/support");
export const getSingleSupport = (id) => axiosInstance.get(`/support/${id}`);
export const createSupport = (data) => axiosInstance.post("/support", data);
export const updateSupport = (id, data) => axiosInstance.put(`/support/${id}`, data);
export const deleteSupport = (id) => axiosInstance.delete(`/support/${id}`);

// ── Support Chat (Gemini AI) ───────────────────
export const sendChatMessage = (message) => axiosInstance.post("/support/chat", { message });