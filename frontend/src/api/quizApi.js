import axiosInstance from "./axiosInstance";

// Quiz endpoints
export const getTeacherQuizzes = (params) =>
  axiosInstance.get("/quizzes", { params });

export const getQuizById = (id) => axiosInstance.get(`/quizzes/${id}`);

export const createQuiz = (data) => axiosInstance.post("/quizzes", data);

export const updateQuiz = (id, data) =>
  axiosInstance.put(`/quizzes/${id}`, data);

export const deleteQuiz = (id) => axiosInstance.delete(`/quizzes/${id}`);

export const publishQuiz = (id) => axiosInstance.put(`/quizzes/${id}/publish`);

export const startQuiz = (id) => axiosInstance.post(`/quizzes/${id}/start`);

export const endQuiz = (id) => axiosInstance.post(`/quizzes/${id}/end`);

// Question endpoints
export const getQuizQuestions = (quizId) =>
  axiosInstance.get(`/quizzes/${quizId}/questions`);

export const addQuestion = (quizId, data) =>
  axiosInstance.post(`/quizzes/${quizId}/questions`, data);

export const updateQuestion = (questionId, data) =>
  axiosInstance.put(`/questions/${questionId}`, data);

export const deleteQuestion = (questionId) =>
  axiosInstance.delete(`/questions/${questionId}`);

export const reorderQuestions = (quizId, orders) =>
  axiosInstance.put(`/quizzes/${quizId}/questions/reorder`, { orders });

export const addBulkQuestions = (quizId, questions) =>
  axiosInstance.post(`/quizzes/${quizId}/questions/bulk`, { questions });
