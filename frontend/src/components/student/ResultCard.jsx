const ResultCard = ({ result, quizTitle, onViewExplanations }) => {
  const percentage = result.percentage || 0;
  const isPassed = result.isPassed;
  const passMarks = result.passMarks || 40;

  const getGrade = () => {
    if (percentage >= 90)
      return { letter: "A+", color: "text-emerald-700", bg: "bg-emerald-100" };
    if (percentage >= 80)
      return { letter: "A", color: "text-emerald-700", bg: "bg-emerald-100" };
    if (percentage >= 70)
      return { letter: "B", color: "text-blue-700", bg: "bg-blue-100" };
    if (percentage >= 60)
      return { letter: "C", color: "text-amber-700", bg: "bg-amber-100" };
    if (percentage >= 50)
      return { letter: "D", color: "text-orange-700", bg: "bg-orange-100" };
    return { letter: "F", color: "text-rose-700", bg: "bg-rose-100" };
  };

  const grade = getGrade();

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden">
      {/* Header */}
      <div
        className={`${
          isPassed ? "bg-emerald-50" : "bg-rose-50"
        } p-8 text-center border-b border-zinc-100`}
      >
        <div className="mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-5">
          {isPassed ? (
            <div className="text-6xl"></div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-rose-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v12m-3-9h6m-6 6h6"
              />
            </svg>
          )}
        </div>

        <h2 className="text-3xl font-semibold text-zinc-900 tracking-tight">
          {isPassed ? "Congratulations!" : "Keep Learning!"}
        </h2>
        <p className="text-zinc-600 mt-2 text-lg">{quizTitle}</p>

        <div
          className={`inline-block mt-5 px-6 py-2 rounded-2xl text-sm font-semibold tracking-wide ${
            isPassed
              ? "bg-emerald-100 text-emerald-800"
              : "bg-rose-100 text-rose-800"
          }`}
        >
          {isPassed ? "PASSED" : "NOT PASSED"}
        </div>
      </div>

      {/* Score Circle */}
      <div className="p-8 text-center border-b border-zinc-100">
        <div className="relative w-44 h-44 mx-auto mb-6">
          <svg className="w-44 h-44 -rotate-90" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="68"
              stroke="#e5e7eb"
              strokeWidth="14"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r="68"
              stroke={isPassed ? "#10b981" : "#ef4444"}
              strokeWidth="14"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 68 * (percentage / 100)} ${2 * Math.PI * 68}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-semibold text-5xl text-zinc-900">
              {Math.round(percentage)}%
            </span>
            <span className="text-sm text-zinc-500 mt-1">Score</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-xs mx-auto">
          <div className="text-center">
            <p className="text-3xl font-semibold text-zinc-900">
              {result.totalMarksObtained}
            </p>
            <p className="text-xs text-zinc-500 mt-1">Marks Obtained</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-semibold text-zinc-900">
              {result.totalMarksPossible}
            </p>
            <p className="text-xs text-zinc-500 mt-1">Total Marks</p>
          </div>
        </div>
      </div>

      {/* Grade & Pass Marks */}
      <div className="p-8 grid grid-cols-2 gap-8 border-b border-zinc-100">
        <div className="text-center">
          <div
            className={`w-20 h-20 mx-auto mb-3 rounded-2xl ${grade.bg} flex items-center justify-center`}
          >
            <span className={`text-4xl font-bold ${grade.color}`}>
              {grade.letter}
            </span>
          </div>
          <p className="text-sm text-zinc-500">Your Grade</p>
        </div>

        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-zinc-100 flex items-center justify-center">
            <span className="text-3xl font-semibold text-zinc-700">
              {passMarks}%
            </span>
          </div>
          <p className="text-sm text-zinc-500">Pass Marks</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-8 flex gap-4">
        <button
          onClick={onViewExplanations}
          className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all active:scale-[0.985]"
        >
          View Explanations
        </button>

        <button
          onClick={() => (window.location.href = "/student/dashboard")}
          className="flex-1 py-4 border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-medium rounded-2xl transition-all hover:bg-zinc-50"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
