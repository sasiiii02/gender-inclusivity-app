import { useState } from "react";

const QuestionCard = ({
  question,
  index,
  onEdit,
  onDelete,
  isDraggable = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  const getDifficultyColor = (level) => {
    switch (level) {
      case "easy":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "hard":
        return "bg-rose-100 text-rose-700 border border-rose-200";
      default:
        return "bg-zinc-100 text-zinc-600 border border-zinc-200";
    }
  };

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case "mcq":
        return "Multiple Choice";
      case "true-false":
        return "True / False";
      case "multiple-answer":
        return "Multiple Answer";
      default:
        return type;
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="flex items-start p-6 gap-4">
        {/* Drag Handle */}
        {isDraggable && (
          <div className="drag-handle cursor-grab text-zinc-400 hover:text-zinc-600 pt-1 flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          </div>
        )}

        {/* Question Number */}
        <div className="flex-shrink-0 w-9 h-9 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-semibold text-base border border-blue-100">
          {index + 1}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-2xl ${getDifficultyColor(
                question.difficultyLevel,
              )}`}
            >
              {question.difficultyLevel.charAt(0).toUpperCase() +
                question.difficultyLevel.slice(1)}
            </span>

            <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-zinc-100 text-zinc-600 rounded-2xl border border-zinc-200">
              {getQuestionTypeLabel(question.questionType)}
            </span>

            <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
              {question.marks} marks
            </span>

            {question.negativeMarks > 0 && (
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-rose-50 text-rose-700 rounded-2xl border border-rose-100">
                -{question.negativeMarks} marks
              </span>
            )}
          </div>

          {/* Question Text */}
          <h4 className="font-medium text-zinc-900 leading-relaxed mb-5 text-[15px]">
            {question.questionText}
          </h4>

          {/* Options Preview */}
          <div className="space-y-2 mb-5">
            {question.options?.map((opt, optIdx) => (
              <div
                key={optIdx}
                className={`text-sm px-4 py-3 rounded-2xl border ${
                  opt.isCorrect
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-zinc-50 border-zinc-200 text-zinc-700"
                }`}
              >
                <span className="inline-block w-6 font-mono text-zinc-400">
                  {String.fromCharCode(65 + optIdx)}.
                </span>
                {opt.text}
                {opt.isCorrect && (
                  <span className="ml-3 text-emerald-600 text-xs font-medium">
                    ✓ Correct
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Explanation */}
          {question.explanation && (
            <div className="mt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {expanded ? "Hide explanation" : "Show explanation"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {expanded && (
                <div className="mt-3 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm text-zinc-700">
                  {question.explanation}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1 flex-shrink-0 pt-1">
          <button
            onClick={() => onEdit(question)}
            className="p-2.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
            title="Edit Question"
          >
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
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>

          <button
            onClick={() => onDelete(question._id)}
            className="p-2.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
            title="Delete Question"
          >
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
                d="M19 7l-.595 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.595-1.858L5 7m5-4v6m4-6v6m1-10V9a1 1 0 00-1 1v1M12 4v6m2-3V9"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
