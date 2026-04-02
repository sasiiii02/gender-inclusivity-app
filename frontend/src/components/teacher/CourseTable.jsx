const CourseTable = ({
  courses = [],
  onEdit,
  onManageLessons,
}) => {
  if (!courses.length) {
    return (
      <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-2xl p-5">
        No courses found.
      </div>
    );
  }

  const getStudentsCount = (course) => {
    const candidates = [
      course?.studentsCount,
      course?.totalStudents,
      course?.enrolledCount,
      course?.enrollmentsCount,
      Array.isArray(course?.students) ? course.students.length : null,
      Array.isArray(course?.enrollments) ? course.enrollments.length : null,
    ];
    const found = candidates.find((value) => Number.isFinite(Number(value)));
    return found ? Number(found) : 0;
  };

  const levelClasses = {
    Beginner: "bg-blue-100 text-blue-700",
    Intermediate: "bg-indigo-100 text-indigo-700",
    Advanced: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-stone-200 rounded-2xl overflow-hidden bg-white">
        <thead className="bg-stone-50">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-stone-600">Title</th>
            <th className="text-left px-4 py-3 font-semibold text-stone-600">Level</th>
            <th className="text-left px-4 py-3 font-semibold text-stone-600">Students</th>
            <th className="text-left px-4 py-3 font-semibold text-stone-600">Status</th>
            <th className="text-left px-4 py-3 font-semibold text-stone-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => {
            const status = c.status || "Active";
            const studentsCount = getStudentsCount(c);
            const normalizedStatus = `${status}`.toLowerCase();
            return (
              <tr key={c._id} className="border-t border-stone-100 hover:bg-stone-50">
                <td className="px-4 py-3">
                  <div className="font-semibold text-stone-900 leading-snug max-w-[260px]">
                    {c.title}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                      levelClasses[c.level] || "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {c.level || "N/A"}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-800 font-semibold">{studentsCount}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                      normalizedStatus === "active"
                        ? "bg-lime-100 text-lime-700"
                        : normalizedStatus === "draft"
                        ? "bg-stone-200 text-stone-700"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit?.(c)}
                      className="text-xs sm:text-sm font-semibold border border-stone-300 text-stone-800 rounded-xl px-4 py-1.5 hover:bg-stone-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onManageLessons?.(c)}
                      className="text-xs sm:text-sm font-semibold border border-stone-300 text-stone-800 rounded-xl px-4 py-1.5 hover:bg-stone-100 transition-colors"
                    >
                      Lessons
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;

