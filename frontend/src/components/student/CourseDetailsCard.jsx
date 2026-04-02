import EnrollmentCard from "./EnrollmentCard";
import LessonList from "./LessonList";

const CourseDetailsCard = ({
  course,
  lessons = [],
  enrollment,
  isEnrolling = false,
  onEnroll,
  onProgressChange,
  onLessonComplete,
  onMarkComplete,
}) => {
  if (!course) return null;

  const status = course?.status || "Active";
  const meta = [
    course.category,
    course.level,
    course.duration ? `${course.duration} min` : null,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="space-y-5">
      <div className="card border border-stone-200 bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-serif text-2xl font-bold text-stone-900 truncate">
              {course.title}
            </h1>
            {meta && <p className="text-sm text-stone-500 mt-1">{meta}</p>}
            <p className="text-stone-600 text-sm mt-3">{course.description}</p>
          </div>
          <span
            className={`text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
              status === "Active"
                ? "bg-violet-100 text-violet-700"
                : "bg-stone-100 text-stone-600"
            }`}
          >
            {status}
          </span>
        </div>

        {!enrollment ? (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => onEnroll?.(course._id)}
              disabled={isEnrolling}
              className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-4 py-2 rounded-xl disabled:opacity-60 transition-colors"
            >
              {isEnrolling ? "Enrolling…" : "Enroll in course"}
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <EnrollmentCard
              enrollment={enrollment}
              onProgressChange={onProgressChange}
              onMarkComplete={onMarkComplete}
            />
          </div>
        )}
      </div>

      <div className="card border border-stone-200 bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Lessons
          </h2>
          {enrollment ? (
            <span className="text-xs font-semibold text-stone-500">
              {enrollment.completionStatus === "Completed"
                ? "Completed"
                : "In Progress"}
            </span>
          ) : (
            <span className="text-xs font-semibold text-stone-500">
              Enroll to start tracking progress
            </span>
          )}
        </div>

        <LessonList
          lessons={lessons}
          currentProgress={enrollment?.progress ?? 0}
          disabled={!enrollment}
          onLessonComplete={onLessonComplete}
        />
      </div>
    </div>
  );
};

export default CourseDetailsCard;

