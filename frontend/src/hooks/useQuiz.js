import { useState, useEffect } from "react";
import {
  getTeacherQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  getQuizQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
} from "../api/quizApi";

export const useQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Fetch all quizzes
  const fetchQuizzes = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTeacherQuizzes(params);
      setQuizzes(res.data.data.quizzes);
      setPagination(res.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  // Fetch single quiz with questions
  const fetchQuiz = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getQuizById(id);
      setCurrentQuiz(res.data.data);
      setQuestions(res.data.data.questions || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch quiz");
    } finally {
      setLoading(false);
    }
  };

  // Create new quiz
  const createNewQuiz = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createQuiz(data);
      setQuizzes([res.data.data, ...quizzes]);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create quiz");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update quiz
  const updateExistingQuiz = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateQuiz(id, data);
      setCurrentQuiz(res.data.data);
      setQuizzes(quizzes.map((q) => (q._id === id ? res.data.data : q)));
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update quiz");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete quiz
  const deleteExistingQuiz = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteQuiz(id);
      setQuizzes(quizzes.filter((q) => q._id !== id));
      if (currentQuiz?._id === id) setCurrentQuiz(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete quiz");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Publish quiz
  const publishExistingQuiz = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await publishQuiz(id);
      setQuizzes(quizzes.map((q) => (q._id === id ? res.data.data : q)));
      if (currentQuiz?._id === id) setCurrentQuiz(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish quiz");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions
  const fetchQuestions = async (quizId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getQuizQuestions(quizId);
      setQuestions(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  // Add question
  const addNewQuestion = async (quizId, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await addQuestion(quizId, data);
      setQuestions([...questions, res.data.data]);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add question");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update question
  const updateExistingQuestion = async (questionId, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateQuestion(questionId, data);
      setQuestions(
        questions.map((q) => (q._id === questionId ? res.data.data : q)),
      );
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update question");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete question
  const deleteExistingQuestion = async (questionId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteQuestion(questionId);
      setQuestions(questions.filter((q) => q._id !== questionId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete question");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reorder questions
  const reorderQuestionsList = async (quizId, orders) => {
    setLoading(true);
    setError(null);
    try {
      const res = await reorderQuestions(quizId, orders);
      setQuestions(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reorder questions");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    quizzes,
    currentQuiz,
    questions,
    loading,
    error,
    pagination,
    // Actions
    fetchQuizzes,
    fetchQuiz,
    createNewQuiz,
    updateExistingQuiz,
    deleteExistingQuiz,
    publishExistingQuiz,
    fetchQuestions,
    addNewQuestion,
    updateExistingQuestion,
    deleteExistingQuestion,
    reorderQuestionsList,
  };
};
