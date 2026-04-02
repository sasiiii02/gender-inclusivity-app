import ProgressBar from "./ProgressBar";

const EnrollmentCard = ({
  enrollment,
  onContinue,
  onComplete,
}) => {
  const course = enrollment?.course;
  const title = course?.title || "Course";
  const description = course?.description;

  const rawProgress = Number(enrollment?.progress);
  const progress = Number.isNaN(rawProgress)
    ? 0
    : Math.min(100, Math.max(0, rawProgress));

  const completionStatus = enrollment?.completionStatus || "In Progress";
  const isCompleted = String(completionStatus).toLowerCase() === "completed";
  const canMarkComplete = progress === 100 && !isCompleted;

  if (!enrollment) return null;

  return (
    <div className="border border-stone-200 bg-white rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-serif text-lg font-bold text-stone-900 truncate">
            {title}
          </h2>
          {description ? (
            <p className="text-sm text-stone-600 mt-1 line-clamp-2">
              {description}
            </p>
          ) : null}
          <p className="text-xs text-stone-500 mt-0.5">
            Status:{" "}
            <span className="font-semibold">
              {isCompleted ? "Completed" : completionStatus}
            </span>
          </p>
        </div>

        <span
          className={`text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
            isCompleted ? "bg-green-100 text-green-700" : "bg-violet-100 text-violet-700"
          }`}
        >
          {isCompleted ? "Completed" : "In Progress"}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-600">Progress</span>
          <span className="font-semibold text-stone-800">{progress}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => onContinue?.(enrollment)}
          className="flex-1 text-sm bg-stone-900 hover:bg-stone-800 text-white font-medium px-3 py-2 rounded-xl transition-colors"
        >
          Continue Learning
        </button>

        {canMarkComplete ? (
          <button
            type="button"
            onClick={() => onComplete?.(enrollment)}
            className="flex-1 text-sm bg-violet-600 hover:bg-violet-700 text-white font-medium px-3 py-2 rounded-xl transition-colors"
          >
            Mark Complete
          </button>
        ) : null}
      </div>

      {isCompleted ? (
        <div className="text-sm text-green-700 font-medium">
          Great work! You have completed this course.
        </div>
      ) : null}
    </div>
  );
};

export default EnrollmentCard;

