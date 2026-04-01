const QuestionPerformance = ({ performance, questions }) => {
  if (!performance || performance.length === 0) {
    return (
      <div className="text-center py-8 text-stone-400">
        No performance data available yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {performance.map((item, idx) => {
        const question = questions?.find((q) => q._id === item.questionId);
        const correctRate =
          item.totalAttempts > 0
            ? Math.round((item.correctCount / item.totalAttempts) * 100)
            : 0;

        const getColor = () => {
          if (correctRate >= 80) return "bg-green-500";
          if (correctRate >= 60) return "bg-amber-500";
          return "bg-rose-500";
        };

        return (
          <div
            key={item.questionId}
            className="bg-white rounded-xl border border-stone-200 p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-xs text-stone-400 font-mono mb-1">
                  Q{idx + 1}
                </p>
                <p className="text-sm font-medium text-stone-800">
                  {question?.questionText || "Loading..."}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="text-lg font-bold text-stone-900">
                  {correctRate}%
                </p>
                <p className="text-xs text-stone-400">Correct</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-stone-500 mb-1">
                <span>Correct: {item.correctCount}</span>
                <span>Total: {item.totalAttempts}</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getColor()}`}
                  style={{ width: `${correctRate}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionPerformance;
