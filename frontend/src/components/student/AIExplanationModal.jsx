import { useState, useEffect } from "react";

const AIExplanationModal = ({
  isOpen,
  onClose,
  question,
  explanation,
  loading,
  onFeedback,
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFeedbackGiven(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFeedback = (helpful) => {
    onFeedback(helpful);
    setFeedbackGiven(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white px-8 py-5 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2 2 2 0 01-2-2 2 2 0 012-2 2 2 0 01-2-2 2 2 0 012-2 2 2 0 01-2-2 2 2 0 012-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-zinc-900">
              AI Explanation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-2xl transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Question */}
          <div className="mb-8 p-6 bg-zinc-50 border border-zinc-100 rounded-3xl">
            <p className="text-xs font-medium text-zinc-500 mb-2 tracking-widest">
              QUESTION
            </p>
            <p className="text-zinc-900 leading-relaxed">
              {question?.questionText}
            </p>

            {question?.studentAnswer && (
              <div className="mt-6 pt-6 border-t border-zinc-200">
                <p className="text-xs font-medium text-zinc-500 mb-2 tracking-widest">
                  YOUR ANSWER
                </p>
                <p className="text-zinc-700 font-medium">
                  {question.studentAnswer}
                </p>
                {question.correctAnswer && (
                  <p className="text-sm text-emerald-600 mt-3 flex items-center gap-1.5">
                    <span className="inline-block w-4 h-4">✓</span>
                    Correct Answer: {question.correctAnswer}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Explanation */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                💡
              </div>
              <p className="font-semibold text-zinc-900">AI Explanation</p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                <p className="mt-4 text-zinc-500">Generating explanation...</p>
              </div>
            ) : (
              <div className="prose prose-zinc max-w-none text-[15px] leading-relaxed">
                <p className="text-zinc-700 whitespace-pre-wrap">
                  {explanation || "No explanation available at the moment."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Feedback Section */}
        {!loading && explanation && !feedbackGiven && (
          <div className="px-8 py-6 border-t border-zinc-100 bg-zinc-50">
            <p className="text-sm text-zinc-600 mb-4">
              Was this explanation helpful?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleFeedback(true)}
                className="flex-1 py-3 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-2xl font-medium transition-all active:scale-[0.985]"
              >
                Yes, helpful
              </button>
              <button
                onClick={() => handleFeedback(false)}
                className="flex-1 py-3 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-2xl font-medium transition-all active:scale-[0.985]"
              >
                Not helpful
              </button>
            </div>
          </div>
        )}

        {feedbackGiven && (
          <div className="px-8 py-6 border-t border-zinc-100 bg-emerald-50 text-center">
            <p className="text-emerald-600 font-medium">
              Thank you for your feedback!
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-8 py-5 border-t border-zinc-100">
          <button
            onClick={onClose}
            className="w-full py-3.5 border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-medium rounded-2xl transition-all hover:bg-zinc-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIExplanationModal;
