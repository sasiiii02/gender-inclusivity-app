const QuestionNavigator = ({
  totalQuestions,
  currentIndex,
  answered,
  onSelect,
  onNext,
  onPrevious,
}) => {
  // Convert answered status to a simple map
  const isQuestionAnswered = (index) => {
    if (Array.isArray(answered)) {
      return answered[index] === true;
    }
    if (typeof answered === "object" && answered !== null) {
      return answered[index] === true || answered[index] !== undefined;
    }
    return false;
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-zinc-900">Question Navigator</h3>
        <span className="text-sm text-zinc-500 font-medium">
          {Object.keys(answered || {}).length} / {totalQuestions} answered
        </span>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 mb-8">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const isAnswered = isQuestionAnswered(i);
          const isCurrent = currentIndex === i;

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`
                aspect-square w-full rounded-2xl font-medium text-sm transition-all duration-200
                flex items-center justify-center border
                ${
                  isCurrent
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-200"
                    : isAnswered
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200"
                      : "bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200 hover:border-zinc-300"
                }
              `}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="flex-1 py-3.5 border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-medium rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 active:scale-[0.985]"
        >
          Previous
        </button>

        <button
          onClick={onNext}
          className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all active:scale-[0.985]"
        >
          {currentIndex === totalQuestions - 1 ? "Finish Quiz" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default QuestionNavigator;
