import { useState } from "react";

const QuizControlPanel = ({ quiz, sessionActive, onStart, onEnd, loading }) => {
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);

  if (!quiz) return null;

  const isPublished = quiz.status === "published";
  const isActive = quiz.status === "active";

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5">
      <h3 className="font-serif font-semibold text-stone-800 mb-4">
        Quiz Controls
      </h3>

      {/* Quiz Info */}
      <div className="space-y-3 mb-5 pb-4 border-b border-stone-100">
        <div className="flex justify-between text-sm">
          <span className="text-stone-500">Status:</span>
          <span
            className={`badge ${isActive ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
          >
            {quiz.status.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-500">Duration:</span>
          <span className="font-medium text-stone-700">
            {quiz.duration} minutes
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-500">Total Questions:</span>
          <span className="font-medium text-stone-700">
            {quiz.totalQuestions}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-500">Total Marks:</span>
          <span className="font-medium text-stone-700">{quiz.totalMarks}</span>
        </div>
        {quiz.quizLink && (
          <div className="mt-2 pt-2 border-t border-stone-100">
            <p className="text-xs text-stone-500 mb-1">Quiz Link:</p>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-stone-50 px-2 py-1 rounded flex-1 truncate">
                {quiz.quizLink}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/quiz/join/${quiz.quizLink}`,
                  );
                  alert("Link copied!");
                }}
                className="text-xs text-violet-600 hover:text-violet-700"
              >
                📋 Copy
              </button>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Passcode:{" "}
              <span className="font-mono font-semibold">{quiz.passcode}</span>
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!sessionActive && isPublished && (
        <button
          onClick={onStart}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-60"
        >
          {loading ? "Starting..." : "🎬 Start Quiz Now"}
        </button>
      )}

      {sessionActive && (
        <button
          onClick={() => setShowConfirmEnd(true)}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 rounded-xl transition-colors"
        >
          ⏹️ End Quiz Session
        </button>
      )}

      {!isPublished && quiz.status !== "active" && (
        <div className="text-center text-sm text-amber-600 bg-amber-50 p-3 rounded-xl">
          ⚠️ Publish this quiz before starting
        </div>
      )}

      {/* Confirm End Modal */}
      {showConfirmEnd && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-slide-up">
            <div className="p-6">
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                End Quiz Session?
              </h3>
              <p className="text-stone-500 text-sm mb-4">
                This will automatically submit all active student attempts.
                Students will no longer be able to answer questions.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmEnd(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={onEnd}
                  className="bg-rose-600 hover:bg-rose-700 text-white flex-1 py-2.5 rounded-xl transition-colors"
                >
                  End Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizControlPanel;
