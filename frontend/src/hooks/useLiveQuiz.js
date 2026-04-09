import { useState, useEffect } from "react";
import {
  getLiveQuizStats,
  getQuizResults,
  startQuizSession,
  endQuizSession,
  getQuizById,
} from "../api/quizApi";

export const useLiveQuiz = (quizId) => {
  const [quiz, setQuiz] = useState(null);
  const [liveStats, setLiveStats] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [polling, setPolling] = useState(true);

  // Fetch quiz details
  const fetchQuiz = async () => {
    try {
      const res = await getQuizById(quizId);
      setQuiz(res.data.data);
      setSessionActive(res.data.data.status === "active");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch quiz");
    }
  };

  // Fetch live stats
  const fetchLiveStats = async () => {
    if (!sessionActive) return;
    try {
      const res = await getLiveQuizStats(quizId);
      setLiveStats(res.data.data);
    } catch (err) {
      // Silent fail - stats might not be available yet
      console.error("Failed to fetch live stats:", err);
    }
  };

  // Fetch results
  const fetchResults = async () => {
    try {
      const res = await getQuizResults(quizId);
      setResults(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch results");
    }
  };

  // Start quiz session
  const startQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await startQuizSession(quizId);
      setQuiz(res.data.data.quiz);
      setLiveStats(res.data.data.session);
      setSessionActive(true);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start quiz");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // End quiz session
  const endQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await endQuizSession(quizId);
      setSessionActive(false);
      await fetchResults();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to end quiz");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Poll for live stats
  useEffect(() => {
    if (sessionActive && polling) {
      fetchLiveStats();
      const interval = setInterval(fetchLiveStats, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [sessionActive, polling]);

  // Initial fetch
  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  return {
    quiz,
    liveStats,
    results,
    loading,
    error,
    sessionActive,
    startQuiz,
    endQuiz,
    fetchResults,
    refreshStats: fetchLiveStats,
    setPolling,
  };
};
