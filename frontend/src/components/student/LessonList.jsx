import { useMemo, useState } from "react";

const LessonList = ({
  lessons = [],
  currentProgress = 0,
  disabled = false,
  onLessonComplete,
}) => {
  const [expandedId, setExpandedId] = useState(null);

  const total = lessons.length;
  const current = useMemo(() => {
    const n = Number(currentProgress);
    return Number.isNaN(n) ? 0 : n;
  }, [currentProgress]);

  if (!lessons || lessons.length === 0) {
    return (
      <div className="text-sm text-stone-500">
        No lessons available for this course.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {lessons.map((lesson, idx) => {
        const computedProgress = Math.round(((idx + 1) / total) * 100);
        const buttonDisabled = disabled;

        const isExpanded = expandedId === lesson._id;

        return (
          <div
            key={lesson._id}
            className="border border-stone-200 rounded-2xl p-4 bg-stone-50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-500">
                  Lesson {idx + 1} • Order {lesson.orderNumber}
                </p>
                <h3 className="font-semibold text-stone-900 truncate">
                  {lesson.title}
                </h3>
                {lesson.duration ? (
                  <p className="text-xs text-stone-500 mt-0.5">
                    {lesson.duration} min
                  </p>
                ) : null}
              </div>

              {onLessonComplete && (
                <button
                  type="button"
                  disabled={buttonDisabled}
                  onClick={() => {
                    // Only allow increasing progress.
                    const next = Math.max(current, computedProgress);
                    onLessonComplete?.(lesson, next);
                    setExpandedId(lesson._id);
                  }}
                  className="text-xs font-semibold bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-xl px-3 py-2 transition-colors"
                >
                  {disabled
                    ? "Enroll to track"
                    : `Mark done (+${computedProgress - current}%)`}
                </button>
              )}
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : lesson._id)}
                className="text-xs text-violet-700 hover:underline font-semibold"
              >
                {isExpanded ? "Hide content" : "View content"}
              </button>
              {isExpanded ? (
                <div className="mt-2 text-sm text-stone-700 whitespace-pre-wrap">
                  {lesson.content}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LessonList;

