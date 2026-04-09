import { useState } from "react";

const QuizControlPanel = ({ quiz, sessionActive, onStart, onEnd, loading }) => {
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);

  if (!quiz) return null;

  const isPublished = quiz.status === "published";
  const isActive = quiz.status === "active";

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6">
      <h3 className="text-lg font-semibold text-zinc-900 mb-5">
        Quiz Controls
      </h3>

      {/* Quiz Info */}
      <div className="space-y-4 mb-6 pb-6 border-b border-zinc-100">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Status</span>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              isActive
                ? "bg-emerald-100 text-emerald-700"
                : isPublished
                  ? "bg-blue-100 text-blue-700"
                  : "bg-amber-100 text-amber-700"
            }`}
          >
            {quiz.status.toUpperCase()}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Duration</span>
          <span className="font-medium text-zinc-900">
            {quiz.duration} minutes
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Total Questions</span>
          <span className="font-medium text-zinc-900">
            {quiz.totalQuestions}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Total Marks</span>
          <span className="font-medium text-zinc-900">{quiz.totalMarks}</span>
        </div>

        {quiz.quizLink && (
          <div className="pt-4 border-t border-zinc-100">
            <p className="text-xs text-zinc-500 mb-2">Quiz Link</p>
            <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-2xl p-3">
              <code className="text-xs font-mono text-zinc-600 flex-1 truncate">
                {quiz.quizLink}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/quiz/join/${quiz.quizLink}`,
                  );
                  alert("Link copied to clipboard");
                }}
                className="text-blue-600 hover:text-blue-700 text-xs font-medium px-3 py-1 rounded-xl hover:bg-blue-50 transition-colors"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-3">
              Passcode:{" "}
              <span className="font-mono font-semibold text-zinc-700">
                {quiz.passcode}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!sessionActive && isPublished && (
        <button
          onClick={onStart}
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 text-white font-medium rounded-2xl transition-all active:scale-[0.985]"
        >
          {loading ? "Starting Quiz..." : "Start Quiz Now"}
        </button>
      )}

      {sessionActive && (
        <button
          onClick={() => setShowConfirmEnd(true)}
          className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-2xl transition-all active:scale-[0.985]"
        >
          End Quiz Session
        </button>
      )}

      {!isPublished && quiz.status !== "active" && (
        <div className="text-center text-sm text-amber-700 bg-amber-50 border border-amber-100 p-4 rounded-2xl">
          Please publish this quiz before starting the live session
        </div>
      )}

      {/* Confirm End Modal */}
      {showConfirmEnd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-8">
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                End Quiz Session?
              </h3>
              <p className="text-zinc-600 text-[15px] leading-relaxed">
                This will automatically submit all active student attempts.
                Students will no longer be able to answer questions.
              </p>
            </div>

            <div className="flex gap-3 px-8 pb-8">
              <button
                onClick={() => setShowConfirmEnd(false)}
                className="flex-1 py-3.5 border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-medium rounded-2xl transition-all hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={onEnd}
                className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-2xl transition-all"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizControlPanel;
