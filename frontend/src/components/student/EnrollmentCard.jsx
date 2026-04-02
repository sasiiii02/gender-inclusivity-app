import { useEffect, useMemo, useState } from "react";
import ProgressBar from "./ProgressBar";

const EnrollmentCard = ({
  enrollment,
  onProgressChange,
  onMarkComplete,
}) => {
  const enrollmentId = enrollment?._id;

  const progress = useMemo(() => {
    const n = Number(enrollment?.progress);
    return Number.isNaN(n) ? 0 : n;
  }, [enrollment?.progress]);

  const completionStatus = enrollment?.completionStatus || "In Progress";
  const isCompleted = completionStatus === "Completed";

  const [draftProgress, setDraftProgress] = useState(progress);

  useEffect(() => {
    setDraftProgress(progress);
  }, [progress]);

  if (!enrollment) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-serif text-lg font-bold text-stone-900 truncate">
            {enrollment.course?.title || "Course"}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Status:{" "}
            <span className="font-semibold">
              {isCompleted ? "Completed" : "In Progress"}
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

      <ProgressBar value={progress} label="Overall progress" />

      {!isCompleted && onProgressChange ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-600">Update progress</span>
            <span className="font-semibold text-stone-800">{draftProgress}%</span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={draftProgress}
            onChange={(e) => setDraftProgress(Number(e.target.value))}
            className="w-full"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                onProgressChange?.(enrollmentId, draftProgress);
              }}
              className="flex-1 text-sm bg-violet-600 hover:bg-violet-700 text-white font-medium px-3 py-2 rounded-xl transition-colors"
            >
              Save progress
            </button>

            {onMarkComplete && (
              <button
                type="button"
                onClick={() => onMarkComplete?.(enrollmentId)}
                className="flex-1 text-sm bg-stone-900 hover:bg-stone-800 text-white font-medium px-3 py-2 rounded-xl transition-colors"
              >
                Mark complete
              </button>
            )}
          </div>
        </div>
      ) : null}

      {isCompleted ? (
        <div className="text-sm text-green-700 font-medium">
          Great work! You have completed this course.
        </div>
      ) : null}
    </div>
  );
};

export default EnrollmentCard;

