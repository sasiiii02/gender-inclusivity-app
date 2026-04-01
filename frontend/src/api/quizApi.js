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

//student api
export const getAvailableQuizzes = () =>
  axiosInstance.get("/student/quiz/available");

export const getQuizByLink = (quizLink) =>
  axiosInstance.get(`/student/quiz/by-link/${quizLink}`);

export const joinQuiz = (data) =>
  axiosInstance.post("/student/quiz/join", data);

export const getStudentQuizQuestions = (studentQuizId) =>
  axiosInstance.get(`/student/quiz/${studentQuizId}/questions`);

export const submitAnswer = (studentQuizId, data) =>
  axiosInstance.post(`/student/quiz/${studentQuizId}/answer`, data);

export const completeQuiz = (studentQuizId) =>
  axiosInstance.post(`/student/quiz/${studentQuizId}/complete`);

export const getQuizHistory = () => axiosInstance.get("/student/quiz/history");

export const getQuizResult = (studentQuizId) =>
  axiosInstance.get(`/student/quiz/${studentQuizId}/result`);

// AI Explanation Endpoints
export const getAIExplanation = (studentQuizId, questionId) =>
  axiosInstance.post(`/ai/explain/${studentQuizId}/${questionId}`);

export const getAllAIExplanations = (studentQuizId) =>
  axiosInstance.post(`/ai/explain-all/${studentQuizId}`);

export const getAIExplanationsForQuiz = (studentQuizId) =>
  axiosInstance.get(`/ai/explanations/${studentQuizId}`);

export const submitExplanationFeedback = (explanationId, helpful) =>
  axiosInstance.post(`/ai/feedback/${explanationId}`, { helpful });

//teacher api after publishing quiz
export const getLiveQuizStats = (quizId) =>
  axiosInstance.get(`/quizzes/${quizId}/live`);

export const getQuizResults = (quizId) =>
  axiosInstance.get(`/quizzes/${quizId}/results`);

export const startQuizSession = (quizId) =>
  axiosInstance.post(`/quizzes/${quizId}/start`);

export const endQuizSession = (quizId) =>
  axiosInstance.post(`/quizzes/${quizId}/end`);
