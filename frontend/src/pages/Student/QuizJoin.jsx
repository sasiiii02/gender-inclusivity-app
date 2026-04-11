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
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white border border-zinc-200 rounded-3xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-9 h-9"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4v12M3 8l4 4m0 0l-4 4m4-4v12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
              Join Quiz
            </h1>
            <p className="text-zinc-500 mt-2 text-[15px]">
              Enter the passcode to start your quiz
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 01-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quiz Link */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Quiz Link
              </label>
              <input
                type="text"
                value={quizLink}
                disabled
                className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-zinc-500 font-mono"
              />
            </div>

            {/* Passcode */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Passcode
              </label>
              <input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                className="w-full px-5 py-3.5 border border-zinc-300 rounded-2xl font-mono text-center text-xl tracking-widest focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter passcode"
                required
                autoFocus
              />
            </div>

            {/* Join Button */}
            <button
              type="submit"
              disabled={loading || !passcode.trim()}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 text-white font-medium rounded-2xl transition-all active:scale-[0.985]"
            >
              {loading ? <LoadingSpinner size="sm" text="" /> : "Join Quiz"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizJoin;
