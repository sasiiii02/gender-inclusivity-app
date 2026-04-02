const CourseCard = ({ course, onViewDetails }) => {
  if (!course) return null;

  const title = course?.title || "Untitled course";
  const description = course?.description || "No description provided.";
  const category = course?.category || "—";
  const level = course?.level || "—";
  const duration =
    course?.duration !== undefined && course?.duration !== null && course?.duration !== ""
      ? `${course.duration} min`
      : "—";

  return (
    <div className="border border-stone-200 rounded-2xl p-4 bg-white shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-700 text-white flex items-center justify-center flex-shrink-0">
          📘
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-serif font-semibold text-stone-900 truncate">
            {title}
          </h3>
          <p className="text-sm text-stone-600 mt-2 line-clamp-2">
            {description}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div className="text-stone-500">
              <span className="font-semibold text-stone-700">Category:</span>{" "}
              {category}
            </div>
            <div className="text-stone-500">
              <span className="font-semibold text-stone-700">Level:</span>{" "}
              {level}
            </div>
            <div className="text-stone-500 col-span-2">
              <span className="font-semibold text-stone-700">Duration:</span>{" "}
              {duration}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => onViewDetails?.(course?._id)}
          className="w-full text-sm bg-stone-900 text-white rounded-xl px-3 py-2 hover:bg-stone-800 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default CourseCard;

