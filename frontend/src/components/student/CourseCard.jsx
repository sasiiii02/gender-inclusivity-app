import React from "react";

const resolveCourseImage = (course) => {
  if (!course) return "";
  if (typeof course.imageUrl === "string") return course.imageUrl;
  if (course.image && typeof course.image === "object" && typeof course.image.url === "string")
    return course.image.url;
  if (typeof course.coverImage === "string") return course.coverImage;
  if (typeof course.thumbnail === "string") return course.thumbnail;
  if (typeof course?.courseImage?.url === "string") return course.courseImage.url;
  return "";
};

const CourseCard = ({ course, onViewDetails }) => {
  if (!course) return null;

  const title = course?.title || "Untitled course";
  const category = course?.category || "Untagged";
  const level = course?.level || "Beginner";
  const image =
    resolveCourseImage(course) ||
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1000&auto=format&fit=crop";
  const instructor = course?.instructor?.name || "Expert Instructor";
  const duration = course?.duration ? `${course.duration} mins` : "Self-paced";

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-xl hover:border-violet-200 transition-all duration-300 group flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-white/90 backdrop-blur-sm text-stone-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
            {category}
          </span>
          {level && (
            <span className="bg-violet-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
              {level}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-violet-700 transition-colors line-clamp-2">
            {title}
          </h3>
        </div>

        <p className="text-sm text-stone-500 mb-6 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[10px]">
            👩‍🏫
          </span>
          {instructor} • {duration}
        </p>

        <div className="mt-auto">
          <button
            type="button"
            onClick={() => onViewDetails?.(course?._id)}
            className="w-full py-3 rounded-xl font-bold text-sm bg-stone-900 text-white hover:bg-stone-800 transition-all focus:ring-4 focus:ring-stone-200"
          >
            View Course Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

