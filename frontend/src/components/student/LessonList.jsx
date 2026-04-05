const LessonList = ({ lessons = [], onSelectLesson, selectedLessonId }) => {
  if (!lessons || lessons.length === 0) {
    return (
      <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-2xl p-5">
        No lessons available for this course.
      </div>
    );
  }

  return (
    <div className="border border-stone-200 bg-white rounded-2xl overflow-hidden shadow-sm">
      <ul className="divide-y divide-stone-100">
        {lessons.map((lesson, idx) => {
          const orderNumber = lesson?.orderNumber ?? idx + 1;
          const isClickable = Boolean(onSelectLesson);

          return (
            <li key={lesson?._id || `${idx}`}>
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => onSelectLesson?.(lesson)}
                className={`w-full text-left px-4 py-3 flex items-start justify-between gap-4 transition-colors ${
                  isClickable
                    ? lesson?._id === selectedLessonId
                      ? "bg-violet-50 border-l-4 border-violet-600 pl-3" // adjust padding for border
                      : "hover:bg-stone-50"
                    : "cursor-default"
                }`}
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-stone-500">
                    Lesson {orderNumber}
                  </p>
                  <p className="text-sm font-semibold text-stone-900 truncate">
                    {lesson?.title || "Untitled lesson"}
                  </p>
                </div>

                {lesson?.duration ? (
                  <span className="text-xs font-semibold text-stone-600 whitespace-nowrap">
                    {lesson.duration} min
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LessonList;

