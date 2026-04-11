import { useState, useEffect } from "react";
import {
  getAvailableQuizzes,
  getQuizByLink,
  joinQuiz,
  getStudentQuizQuestions,
  submitAnswer,
  completeQuiz,
  getQuizHistory,
  getQuizResult,
  getAIExplanation,
  getAllAIExplanations,
  getAIExplanationsForQuiz,
  submitExplanationFeedback as submitExplanationFeedbackApi,
} from "../api/quizApi";

export const useStudentQuiz = () => {
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [studentQuiz, setStudentQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [aiExplanations, setAiExplanations] = useState({});
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  // Fetch available quizzes
  const fetchAvailableQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAvailableQuizzes();
      console.log("Available quizzes response:", res.data);
      setAvailableQuizzes(res.data.data || []);
    } catch (err) {
      console.error("Fetch available quizzes error:", err);
      setError(err.response?.data?.message || "Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  // Join quiz by link/passcode
  const joinQuizByLink = async (quizLink, passcode) => {
    setLoading(true);
    setError(null);
    try {
      const res = await joinQuiz({ quizLink, passcode });
      console.log("Join quiz response:", res.data);
      setCurrentQuiz(res.data.data.quiz);
      setStudentQuiz(res.data.data.studentQuiz);
      setTimeRemaining(res.data.data.studentQuiz.timeRemaining);
      return res.data.data;
    } catch (err) {
      console.error("Join quiz error:", err);
      setError(err.response?.data?.message || "Failed to join quiz");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get quiz questions - FIXED VERSION
  const fetchQuizQuestions = async (studentQuizId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStudentQuizQuestions(studentQuizId);
      console.log("Fetch questions response:", res.data);

      const data = res.data.data;

      // Set questions
      setQuestions(data.questions || []);

      // Set current quiz info from the response
      setCurrentQuiz({
        title: data.quizTitle,
        duration: data.duration,
        subject: data.subject || "General",
        grade: data.grade || "All",
        totalQuestions: data.totalQuestions,
        totalMarks: data.questions?.reduce((sum, q) => sum + q.marks, 0) || 0,
      });

      // Build answers map from answeredQuestionIds
      const answersMap = {};
      if (data.answeredQuestionIds) {
        data.answeredQuestionIds.forEach((id) => {
          answersMap[id] = true;
        });
      }
      setAnswers(answersMap);

      setTimeRemaining(data.timeRemaining);
      setCurrentQuestionIndex(0);

      return data;
    } catch (err) {
      console.error("Fetch questions error:", err);
      setError(err.response?.data?.message || "Failed to fetch questions");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Submit answer for current question - FIXED VERSION
  const submitCurrentAnswer = async (studentQuizId, questionId, answerData) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Submitting answer:", {
        studentQuizId,
        questionId,
        answerData,
      });
      const res = await submitAnswer(studentQuizId, {
        questionId,
        ...answerData,
      });
      console.log("Submit answer response:", res.data);
      setAnswers((prev) => ({ ...prev, [questionId]: true }));
      return res.data.data;
    } catch (err) {
      console.error("Submit answer error:", err);
      setError(err.response?.data?.message || "Failed to submit answer");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Complete quiz - FIXED VERSION
  const finishQuiz = async (studentQuizId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await completeQuiz(studentQuizId);
      console.log("Complete quiz response:", res.data);
      setResult(res.data.data);
      return res.data.data;
    } catch (err) {
      console.error("Complete quiz error:", err);
      setError(err.response?.data?.message || "Failed to complete quiz");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get quiz result
  const fetchQuizResult = async (studentQuizId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getQuizResult(studentQuizId);
      console.log("Quiz result response:", res.data);
      setResult(res.data.data);
      setCurrentQuiz(res.data.data.quizId);
      return res.data.data;
    } catch (err) {
      console.error("Fetch result error:", err);
      setError(err.response?.data?.message || "Failed to fetch result");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get quiz history
  const fetchQuizHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getQuizHistory();
      console.log("Quiz history response:", res.data);
      setHistory(res.data.data.history || []);
      return res.data.data;
    } catch (err) {
      console.error("Fetch history error:", err);
      setError(err.response?.data?.message || "Failed to fetch history");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get AI explanation for a question
  const fetchAIExplanation = async (studentQuizId, questionId) => {
    setLoadingExplanation(true);
    try {
      // Check if already cached
      if (aiExplanations[questionId]) {
        return aiExplanations[questionId];
      }

      const res = await getAIExplanation(studentQuizId, questionId);
      console.log("AI explanation response:", res.data);
      const explanation = res.data.data.explanation;
      setAiExplanations((prev) => ({ ...prev, [questionId]: explanation }));
      return explanation;
    } catch (err) {
      console.error("Failed to fetch AI explanation:", err);
      return null;
    } finally {
      setLoadingExplanation(false);
    }
  };

  // Get all AI explanations for a quiz
  const fetchAllAIExplanations = async (studentQuizId) => {
    setLoading(true);
    try {
      const res = await getAllAIExplanations(studentQuizId);
      console.log("All AI explanations response:", res.data);
      const explanations = res.data.data.explanations || [];
      const explanationsMap = {};
      explanations.forEach((exp) => {
        explanationsMap[exp.questionId] = exp.explanation;
      });
      setAiExplanations(explanationsMap);
      return explanationsMap;
    } catch (err) {
      console.error("Failed to fetch AI explanations:", err);
      return {};
    } finally {
      setLoading(false);
    }
  };

  // Submit explanation feedback
  const submitExplanationFeedback = async (explanationId, helpful) => {
    try {
      await submitExplanationFeedbackApi(explanationId, helpful);
    } catch (err) {
      console.error("Failed to submit explanation feedback:", err);
    }
  };

  // Reset quiz state
  const resetQuiz = () => {
    setCurrentQuiz(null);
    setStudentQuiz(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(null);
    setResult(null);
    setAiExplanations({});
  };

  return {
    // State
    availableQuizzes,
    currentQuiz,
    studentQuiz,
    questions,
    currentQuestionIndex,
    answers,
    timeRemaining,
    loading,
    error,
    result,
    history,
    aiExplanations,
    loadingExplanation,
    // Actions
    fetchAvailableQuizzes,
    joinQuizByLink,
    fetchQuizQuestions,
    submitCurrentAnswer,
    finishQuiz,
    fetchQuizResult,
    fetchQuizHistory,
    fetchAIExplanation,
    fetchAllAIExplanations,
    submitExplanationFeedback,
    setCurrentQuestionIndex,
    resetQuiz,
  };
};
