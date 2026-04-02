import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../components/student/CourseCard";
import * as trainingApi from "../../api/trainingApi";

const CoursesPage = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await trainingApi.getAllCourses();

      // Backend responses may vary by endpoint implementation:
      // - { success: true, data: { courses: [...] } }
      // - { data: { courses: [...] } }
      // - [ ... ]
      const raw =
        res?.data?.data?.courses ??
        res?.data?.courses ??
        res?.data?.data ??
        res?.data ??
        [];

      const list = Array.isArray(raw) ? raw : [];
      const activeOnly = list.filter(
        (c) => !c?.status || String(c.status).toLowerCase() === "active",
      );
      setCourses(activeOnly);
    } catch {
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Available Courses
          </h1>
        </div>
      </div>

      {error ? (
        <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
          ⚠️ {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border border-stone-200 rounded-2xl p-4 bg-white animate-pulse"
            >
              <div className="h-4 bg-stone-200 rounded w-2/3" />
              <div className="h-3 bg-stone-200 rounded w-5/6 mt-3" />
              <div className="h-3 bg-stone-200 rounded w-4/6 mt-2" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center">
          No courses available right now.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onViewDetails={(id) => navigate(`/student/courses/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;

