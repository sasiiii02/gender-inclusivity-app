import React from "react";

const EnrollmentCard = ({
  enrollment,
  onContinue,
  onComplete,
}) => {
  const course = enrollment?.course;
  if (!enrollment || !course) return null;

  const title = course?.title || "Course";
  const category = course?.category || "Trained Skill";
  const image = course?.imageUrl || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop";
  const instructor = course?.instructor?.name || "Expert Instructor";
  const duration = course?.duration ? `${course.duration} mins` : "Self-paced";

  const rawProgress = Number(enrollment?.progress);
  const progress = Number.isNaN(rawProgress)
    ? 0
    : Math.min(100, Math.max(0, rawProgress));

  const completionStatus = enrollment?.completionStatus || "In Progress";
  const isCompleted = String(completionStatus).toLowerCase() === "completed" || progress === 100;
  const canMarkComplete = progress === 100 && !isCompleted;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-xl hover:border-violet-200 transition-all duration-300 group flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-stone-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
            {category}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-violet-700 transition-colors line-clamp-2">
            {title}
          </h3>
        </div>

        <p className="text-sm text-stone-500 mb-6 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center text-[10px]">👩‍🏫</span>
          {instructor} • {duration}
        </p>

        <div className="mt-auto">
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className={isCompleted ? "text-emerald-600" : "text-stone-700"}>
              {isCompleted ? "Completed" : `${progress}% Completed`}
            </span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2 mb-6 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isCompleted ? "bg-emerald-500" : "bg-violet-600"
                }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-col gap-2">
            {!isCompleted && (
              <button
                type="button"
                onClick={() => onContinue?.(enrollment)}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all focus:ring-4 focus:outline-none bg-violet-100 text-violet-700 hover:bg-violet-200 focus:ring-violet-100"
              >
                Continue Learning
              </button>
            )}

            {isCompleted && !canMarkComplete && (
              <button
                type="button"
                onClick={() => onContinue?.(enrollment)}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all focus:ring-4 focus:outline-none bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-100"
              >
                Review Course
              </button>
            )}

            {canMarkComplete && (
              <button
                type="button"
                onClick={() => onComplete?.(enrollment)}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all focus:ring-4 focus:outline-none bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-200"
              >
                Mark Complete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentCard;

