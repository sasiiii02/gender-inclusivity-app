import { useState } from "react";

const QuizJoinForm = ({ onSubmit, loading, error }) => {
  const [form, setForm] = useState({
    quizLink: "",
    passcode: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.quizLink && form.passcode) {
      onSubmit(form.quizLink, form.passcode);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-8 max-w-md mx-auto">
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
        <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">
          Join a Quiz
        </h2>
        <p className="text-zinc-500 mt-2 text-[15px]">
          Enter the quiz link and passcode provided by your teacher
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
            value={form.quizLink}
            onChange={(e) =>
              setForm({ ...form, quizLink: e.target.value.trim() })
            }
            className="w-full px-5 py-3.5 border border-zinc-300 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-zinc-900 placeholder:text-zinc-400"
            placeholder="e.g., quiz-abc123-xyz789"
            required
          />
          <p className="text-xs text-zinc-500 mt-2">
            Or scan the QR code from your teacher
          </p>
        </div>

        {/* Passcode */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Passcode
          </label>
          <input
            type="text"
            value={form.passcode}
            onChange={(e) =>
              setForm({ ...form, passcode: e.target.value.toUpperCase() })
            }
            className="w-full px-5 py-3.5 border border-zinc-300 rounded-2xl font-mono focus:outline-none focus:border-blue-500 transition-colors text-zinc-900 placeholder:text-zinc-400"
            placeholder="Enter passcode"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 text-white font-medium rounded-2xl transition-all active:scale-[0.985]"
        >
          {loading ? "Joining Quiz..." : "Join Quiz"}
        </button>
      </form>

      {/* Footer Note */}
      <div className="mt-8 pt-6 border-t border-zinc-100">
        <p className="text-xs text-zinc-500 text-center">
          Don't have a quiz link? Ask your teacher for the details.
        </p>
      </div>
    </div>
  );
};

export default QuizJoinForm;
