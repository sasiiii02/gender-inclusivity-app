import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudentQuiz } from "../../hooks/useStudentQuiz";
import LoadingSpinner from "../../components/student/LoadingSpinner";

const QuizJoin = () => {
  const navigate = useNavigate();
  const { quizLink } = useParams();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { joinQuizByLink } = useStudentQuiz();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passcode) return;

    setLoading(true);
    setError(null);
    try {
      const result = await joinQuizByLink(quizLink, passcode);
      if (result.studentQuiz) {
        navigate(`/student/quiz/take/${result.studentQuiz._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="font-serif text-2xl font-bold text-stone-900">
              Join Quiz
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              Enter the passcode to start your quiz
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Quiz Link
              </label>
              <input
                type="text"
                value={quizLink}
                disabled
                className="input-field bg-stone-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Passcode
              </label>
              <input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                className="input-field font-mono text-center text-lg tracking-widest"
                placeholder="Enter passcode"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || !passcode}
              className="w-full btn-primary py-3 disabled:opacity-60"
            >
              {loading ? <LoadingSpinner size="sm" text="" /> : "Join Quiz →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizJoin;
