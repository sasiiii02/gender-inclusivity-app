import { useState, useRef, useEffect } from "react";

const ActionsDropdown = ({ c, onEdit, onManageLessons, onDeactivate, onActivate, onDelete, normalizedStatus }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors"
        aria-label="Options"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden divide-y divide-stone-100 border border-stone-100">
          <div className="py-1">
            <button
              onClick={() => { setOpen(false); onEdit?.(c); }}
              className="block w-full px-4 py-2 text-left text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Edit Course
            </button>
            <button
              onClick={() => { setOpen(false); onManageLessons?.(c); }}
              className="block w-full px-4 py-2 text-left text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Manage Lessons
            </button>
          </div>
          <div className="py-1">
            {normalizedStatus === "active" ? (
              <button
                onClick={() => { setOpen(false); onDeactivate?.(c); }}
                className="block w-full px-4 py-2 text-left text-sm font-semibold text-amber-600 hover:bg-amber-50 transition-colors"
              >
                Deactivate
              </button>
            ) : (
              <button
                onClick={() => { setOpen(false); onActivate?.(c); }}
                className="block w-full px-4 py-2 text-left text-sm font-semibold text-lime-600 hover:bg-lime-50 transition-colors"
              >
                Activate
              </button>
            )}
          </div>
          <div className="py-1">
            <button
              onClick={() => { setOpen(false); onDelete?.(c); }}
              className="block w-full px-4 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CourseTable = ({
  courses = [],
  onEdit,
  onManageLessons,
  onDeactivate,
  onActivate,
  onDelete,
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
    <div className="overflow-x-auto min-h-[300px]">
      <table className="w-full text-sm border border-stone-200 rounded-2xl bg-white overflow-visible">
        <thead className="bg-stone-50 rounded-t-2xl">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-stone-600 rounded-tl-2xl">Title</th>
            <th className="text-left px-4 py-3 font-semibold text-stone-600">Level</th>
            <th className="text-left px-4 py-3 font-semibold text-stone-600">Students</th>
            <th className="text-left px-4 py-3 font-semibold text-stone-600">Status</th>
            <th className="text-right px-4 py-3 font-semibold text-stone-600 rounded-tr-2xl">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {courses.map((c) => {
            const status = c.status || "Active";
            const studentsCount = getStudentsCount(c);
            const normalizedStatus = `${status}`.toLowerCase();
            return (
              <tr key={c._id} className="hover:bg-stone-50">
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
                        : normalizedStatus === "inactive"
                        ? "bg-rose-50 text-rose-700"
                        : normalizedStatus === "draft"
                        ? "bg-stone-200 text-stone-700"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <ActionsDropdown
                    c={c}
                    onEdit={onEdit}
                    onManageLessons={onManageLessons}
                    onDeactivate={onDeactivate}
                    onActivate={onActivate}
                    onDelete={onDelete}
                    normalizedStatus={normalizedStatus}
                  />
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

