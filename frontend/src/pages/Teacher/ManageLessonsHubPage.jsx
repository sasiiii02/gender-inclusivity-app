import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as trainingApi from "../../api/trainingApi";

const searchInputClass =
  "w-full sm:max-w-xs rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-800 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-violet-200";

const ManageLessonsHubPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await trainingApi.getAllCourses({ page: 1, limit: 100 });
        setCourses(res.data?.data?.courses || []);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load courses.");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openLessons = (courseId) => {
    if (!courseId) return;
    try {
      sessionStorage.setItem("teacherLastLessonsCourseId", courseId);
    } catch {
      /* ignore */
    }
    navigate(`/teacher/courses/${courseId}/lessons`);
  };

  const filteredCourses = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return courses;
    return courses.filter((c) => {
      const haystack = [c.title, c.category, c.level, c.description, c.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(keyword);
    });
  }, [courses, searchTerm]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-serif text-2xl font-bold text-stone-900">Manage Lessons</h1>
        <p className="text-stone-500 text-sm mt-1">
          Choose a course to view, add, edit, or delete its lessons.
        </p>
      </div>

      {error ? (
        <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="border border-stone-200 rounded-2xl p-5 bg-stone-50 animate-pulse h-28"
            />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-sm text-stone-600 bg-stone-50 border border-stone-200 rounded-2xl p-8 text-center">
          <p className="font-medium text-stone-800">No courses available</p>
          <p className="mt-2 text-stone-500">
            Create a course first, then return here to manage its lessons.
          </p>
          <button
            type="button"
            onClick={() => navigate("/teacher/manage-courses")}
            className="mt-4 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
          >
            Go to Manage Courses
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <label className="sr-only" htmlFor="hub-course-search">
              Search courses
            </label>
            <input
              id="hub-course-search"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses…"
              className={searchInputClass}
              autoComplete="off"
            />
            {searchTerm.trim() ? (
              <p className="text-xs text-stone-500">
                {filteredCourses.length} of {courses.length} courses
              </p>
            ) : null}
          </div>
          {filteredCourses.length === 0 ? (
            <div className="text-sm text-stone-600 bg-stone-50 border border-stone-200 rounded-2xl p-8 text-center">
              <p className="font-medium text-stone-800">No courses match your search</p>
              <p className="mt-2 text-stone-500">Try a different title, category, or level.</p>
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="mt-4 text-sm font-semibold text-violet-700 hover:text-violet-800"
              >
                Clear search
              </button>
            </div>
          ) : (
            <ul className="grid sm:grid-cols-2 gap-4">
              {filteredCourses.map((c) => (
                <li
                  key={c._id}
                  className="rounded-2xl border border-stone-200 bg-white p-5 flex flex-col gap-3 shadow-sm"
                >
                  <div className="min-w-0">
                    <h2 className="font-serif font-bold text-stone-900 truncate">{c.title}</h2>
                    {c.category ? (
                      <p className="text-xs text-stone-500 mt-1">{c.category}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => openLessons(c._id)}
                    className="mt-auto w-full sm:w-auto self-start rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
                  >
                    Open lessons
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default ManageLessonsHubPage;
