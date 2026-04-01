import { useNavigate } from "react-router-dom";

const statusColors = {
  draft: "bg-zinc-100 text-zinc-600 border border-zinc-200",
  published: "bg-amber-100 text-amber-700 border border-amber-200",
  active: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  completed: "bg-blue-100 text-blue-700 border border-blue-200",
  archived: "bg-zinc-100 text-zinc-500 border border-zinc-200",
};

const statusLabels = {
  draft: "Draft",
  published: "Published",
  active: "Active",
  completed: "Completed",
  archived: "Archived",
};

const QuizCard = ({ quiz, onDelete, onPublish, onEdit }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-lg transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-zinc-900 text-xl tracking-tight mb-2 line-clamp-2">
            {quiz.title}
          </h3>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-zinc-100 text-zinc-600 rounded-full">
              {quiz.subject}
            </span>
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-zinc-100 text-zinc-600 rounded-full">
              {quiz.grade}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${statusColors[quiz.status]}`}
            >
              {statusLabels[quiz.status]}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {quiz.description && (
        <p className="text-zinc-500 text-sm mb-5 line-clamp-2 leading-relaxed">
          {quiz.description}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mb-6">
        <div className="flex items-center gap-2 text-zinc-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 8.944 11.922.42.095.858.143 1.295.143a3 3 0 01.296-.006"
            />
          </svg>
          <span>{quiz.totalQuestions || 0} Questions</span>
        </div>

        <div className="flex items-center gap-2 text-zinc-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 01-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{quiz.duration} min</span>
        </div>

        <div className="flex items-center gap-2 text-zinc-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2"
            />
          </svg>
          <span>{quiz.passMarks}% to pass</span>
        </div>

        <div className="flex items-center gap-2 text-zinc-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-9 9-4-4-6 6"
            />
          </svg>
          <span>{quiz.totalMarks} marks</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
        <button
          onClick={onEdit || (() => navigate(`/teacher/quiz/${quiz._id}/edit`))}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-zinc-700 border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 rounded-2xl transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
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
          Edit
        </button>

        <button
          onClick={() => navigate(`/teacher/quiz/${quiz._id}/questions`)}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-zinc-700 border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 rounded-2xl transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2"
            />
          </svg>
          Questions
        </button>

        {quiz.status === "draft" && (
          <button
            onClick={() => onPublish && onPublish(quiz._id)}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl text-sm transition-all active:scale-[0.985]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7"
              />
            </svg>
            Publish
          </button>
        )}

        {quiz.status === "published" && (
          <button
            onClick={() => navigate(`/teacher/quiz/${quiz._id}/start`)}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl text-sm transition-all active:scale-[0.985]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 4.01V8"
              />
            </svg>
            Start Quiz
          </button>
        )}

        {(quiz.status === "draft" || quiz.status === "archived") && (
          <button
            onClick={() => onDelete && onDelete(quiz._id)}
            className="p-3 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
            title="Delete Quiz"
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
        )}
      </div>

      {/* Quiz Link (if published) */}
      {quiz.status !== "draft" && quiz.quizLink && (
        <div className="mt-6 pt-5 border-t border-zinc-100">
          <p className="text-xs font-medium text-zinc-500 mb-2">Quiz Link</p>
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-2xl p-3">
            <code className="text-xs text-zinc-600 font-mono flex-1 truncate">
              {quiz.quizLink}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/quiz/join/${quiz.quizLink}`,
                );
                // You can replace alert with a better toast notification later
                alert("Link copied to clipboard");
              }}
              className="text-blue-600 hover:text-blue-700 font-medium text-xs px-3 py-1 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Copy
            </button>
          </div>

          {quiz.passcode && (
            <p className="text-xs text-zinc-500 mt-3">
              Passcode:{" "}
              <span className="font-mono font-semibold text-zinc-700">
                {quiz.passcode}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizCard;
