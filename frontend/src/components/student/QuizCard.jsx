import { useNavigate } from "react-router-dom";

const QuizCard = ({ quiz, onTakeQuiz }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-lg transition-all duration-200">
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
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100">
              {quiz.totalQuestions} Questions
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
      <div className="grid grid-cols-3 gap-4 text-sm mb-6">
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
              d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2"
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

      {/* Take Quiz Button */}
      <button
        onClick={() => onTakeQuiz(quiz.quizLink, quiz.passcode)}
        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all active:scale-[0.985] flex items-center justify-center gap-2"
      >
        Take Quiz
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
            d="M14 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default QuizCard;
