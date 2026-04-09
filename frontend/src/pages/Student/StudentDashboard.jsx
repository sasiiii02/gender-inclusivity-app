import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentQuiz } from "../../hooks/useStudentQuiz";
import QuizCard from "../../components/student/QuizCard";
import QuizJoinForm from "../../components/student/QuizJoinForm";
import LoadingSpinner from "../../components/student/LoadingSpinner";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const {
    availableQuizzes,
    loading,
    error,
    fetchAvailableQuizzes,
    joinQuizByLink,
    resetQuiz,
  } = useStudentQuiz();

  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState(null);

  useEffect(() => {
    fetchAvailableQuizzes();
    resetQuiz();
  }, []);

  const handleTakeQuiz = async (quizLink, passcode) => {
    setJoinLoading(true);
    setJoinError(null);
    try {
      const result = await joinQuizByLink(quizLink, passcode);
      if (result.studentQuiz) {
        navigate(`/student/quiz/take/${result.studentQuiz._id}`);
      }
    } catch (err) {
      setJoinError(err.response?.data?.message || "Failed to join quiz");
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            My Dashboard
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Welcome back! Ready to learn?
          </p>
        </div>
        <button
          onClick={() => setShowJoinForm(!showJoinForm)}
          className="btn-primary flex items-center gap-2"
        >
          <span className="text-xl">+</span> Join Quiz
        </button>
      </div>

      {/* Join Form */}
      {showJoinForm && (
        <div className="mb-6">
          <QuizJoinForm
            onSubmit={handleTakeQuiz}
            loading={joinLoading}
            error={joinError}
          />
        </div>
      )}

      {/* Available Quizzes */}
      <div>
        <h2 className="font-serif text-lg font-semibold text-stone-800 mb-4">
          Available Quizzes
        </h2>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
            ⚠️ {error}
          </div>
        ) : availableQuizzes.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-stone-400">No quizzes available at the moment</p>
            <p className="text-sm text-stone-400 mt-1">
              Check back later or ask your teacher for a quiz link
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {availableQuizzes.map((quiz) => (
              <QuizCard
                key={quiz._id}
                quiz={quiz}
                onTakeQuiz={handleTakeQuiz}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-violet-600">
            {availableQuizzes.length}
          </p>
          <p className="text-xs text-stone-500">Available Quizzes</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-green-600">—</p>
          <p className="text-xs text-stone-500">Completed</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-amber-600">—</p>
          <p className="text-xs text-stone-500">Average Score</p>
        </div>
      </div>

      {/* History Link */}
      <div className="text-center">
        <button
          onClick={() => navigate("/student/quiz/history")}
          className="text-violet-600 hover:text-violet-700 text-sm font-medium"
        >
          View Quiz History →
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
