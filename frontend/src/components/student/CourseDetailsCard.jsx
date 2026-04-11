const CourseDetailsCard = ({ course, onEnroll, isEnrolled }) => {
  if (!course) return null;

  const title = course?.title || "Untitled course";
  const description = course?.description || "No description provided.";
  const category = course?.category || "—";
  const level = course?.level || "—";
  const duration =
    course?.duration !== undefined && course?.duration !== null && course?.duration !== ""
      ? `${course.duration} min`
      : "—";
  const status = course?.status;
  const image =
    course?.image?.url ||
    course?.imageUrl ||
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="border border-stone-200 bg-white rounded-2xl p-5 shadow-sm overflow-hidden">
      <div className="-mx-5 -mt-5 mb-5 relative">
        <img src={image} alt={title} className="w-full h-48 md:h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-2xl font-bold text-stone-900 truncate">
            {title}
          </h1>
          <p className="text-stone-600 text-sm mt-3">{description}</p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="text-stone-600">
              <span className="font-semibold text-stone-800">Category:</span>{" "}
              {category}
            </div>
            <div className="text-stone-600">
              <span className="font-semibold text-stone-800">Level:</span>{" "}
              {level}
            </div>
            <div className="text-stone-600">
              <span className="font-semibold text-stone-800">Duration:</span>{" "}
              {duration}
            </div>
            {status ? (
              <div className="text-stone-600">
                <span className="font-semibold text-stone-800">Status:</span>{" "}
                {status}
              </div>
            ) : null}
          </div>
        </div>

        {status ? (
          <span className="text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap bg-stone-100 text-stone-600">
            {status}
          </span>
        ) : null}
      </div>

      <div className="mt-5 flex justify-end">
        {isEnrolled ? (
          <button
            type="button"
            disabled
            className="bg-stone-200 text-stone-700 font-medium px-4 py-2 rounded-xl cursor-not-allowed"
          >
            Already Enrolled
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onEnroll?.(course?._id)}
            className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-4 py-2 rounded-xl transition-colors"
          >
            Enroll Now
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsCard;

