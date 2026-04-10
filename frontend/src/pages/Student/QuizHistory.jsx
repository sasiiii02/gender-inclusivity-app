import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentQuiz } from "../../hooks/useStudentQuiz";
import LoadingSpinner from "../../components/student/LoadingSpinner";

const QuizHistory = () => {
  const navigate = useNavigate();
  const { history, loading, error, fetchQuizHistory } = useStudentQuiz();

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const getStatusBadge = (isPassed, percentage) => {
    if (isPassed) {
      return <span className="badge bg-green-100 text-green-700">Passed</span>;
    }
    return <span className="badge bg-rose-100 text-rose-700">Failed</span>;
  };

  if (loading) {
    return <LoadingSpinner text="Loading history..." />;
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/student/dashboard")}
          className="text-stone-500 hover:text-stone-700 text-sm flex items-center gap-1 mb-4"
        >
          ← Back to Dashboard
        </button>
        <h1 className="font-serif text-2xl font-bold text-stone-900">
          Quiz History
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          View all your completed quizzes and results
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
          ⚠️ {error}
        </div>
      )}

      {history.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-stone-400 mb-2">No quiz attempts yet</p>
          <p className="text-sm text-stone-400">
            Take a quiz from your dashboard to see results here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((attempt) => (
            <div
              key={attempt._id}
              onClick={() => navigate(`/student/quiz/result/${attempt._id}`)}
              className="bg-white rounded-xl border border-stone-200 p-5 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex-1">
                  <h3 className="font-serif font-semibold text-stone-900">
                    {attempt.quizId?.title || "Untitled Quiz"}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="badge bg-stone-100 text-stone-600 text-xs">
                      {attempt.quizId?.subject}
                    </span>
                    <span className="badge bg-stone-100 text-stone-600 text-xs">
                      {attempt.quizId?.grade}
                    </span>
                    <span className="badge bg-stone-100 text-stone-600 text-xs">
                      {attempt.completedAt
                        ? new Date(attempt.completedAt).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-stone-900">
                      {Math.round(attempt.percentage)}%
                    </span>
                    {getStatusBadge(attempt.isPassed, attempt.percentage)}
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    {attempt.totalMarksObtained}/{attempt.totalMarksPossible}{" "}
                    marks
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizHistory;
