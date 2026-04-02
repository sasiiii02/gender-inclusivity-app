import { useMemo } from "react";

const CourseCard = ({
  course,
  onViewDetails,
  onEnroll,
  isEnrolling = false,
}) => {
  const status = course?.status || "Active";

  const meta = useMemo(() => {
    const parts = [];
    if (course?.category) parts.push(course.category);
    if (course?.level) parts.push(course.level);
    if (course?.duration) parts.push(`${course.duration} min`);
    return parts.join(" • ");
  }, [course]);

  if (!course) return null;

  return (
    <div className="card border border-stone-200 rounded-2xl p-4 bg-white shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-700 text-white flex items-center justify-center flex-shrink-0">
          📘
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-serif font-semibold text-stone-900 truncate">
              {course.title}
            </h3>
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                status === "Active"
                  ? "bg-violet-100 text-violet-700"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              {status}
            </span>
          </div>

          {meta && <p className="text-xs text-stone-500 mt-1">{meta}</p>}
          <p className="text-sm text-stone-600 mt-2 line-clamp-2">
            {course.description}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => onViewDetails?.(course._id)}
          className="flex-1 text-sm bg-stone-900 text-white rounded-xl px-3 py-2 hover:bg-stone-800 transition-colors"
        >
          View
        </button>
        {onEnroll && (
          <button
            type="button"
            disabled={isEnrolling}
            onClick={() => onEnroll(course._id)}
            className="flex-1 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-3 py-2 disabled:opacity-60 transition-colors"
          >
            {isEnrolling ? "Enrolling…" : "Enroll"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;

