import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CourseCard from "../../components/student/CourseCard";
import * as trainingApi from "../../api/trainingApi";

const CoursesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [category, setCategory] = useState("");

  const [enrollments, setEnrollments] = useState([]);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  const enrolledCourseIds = useMemo(() => {
    const set = new Set();
    for (const e of enrollments || []) {
      if (e?.course?._id) set.add(e.course._id);
    }
    return set;
  }, [enrollments]);

  const isStudent = user?.role === "student";

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await trainingApi.getAllCourses({
        status: "Active",
        search: search || undefined,
        level: level || undefined,
        category: category || undefined,
        page: 1,
        limit: 50,
      });
      // { success: true, data: { courses, pagination } }
      setCourses(res.data?.data?.courses || []);
    } catch {
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEnrollments = async () => {
    if (!isStudent) return;
    try {
      const res = await trainingApi.getMyEnrollments();
      // backend returns array directly
      setEnrollments(res.data || []);
    } catch {
      // ignore if user isn't a student for this API
      setEnrollments([]);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search, level, category]);

  useEffect(() => {
    fetchMyEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isStudent]);

  const handleEnroll = async (courseId) => {
    setEnrollingCourseId(courseId);
    try {
      await trainingApi.enrollInCourse(courseId);
      await fetchMyEnrollments();
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to enroll.";
      setError(msg);
    } finally {
      setEnrollingCourseId(null);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Courses
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            {courses.length} available courses
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title/description…"
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200"
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200"
        >
          <option value="">All levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (optional)…"
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200"
        />
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
          No courses match your filters.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onViewDetails={(id) => navigate(`/student/courses/${id}`)}
              onEnroll={isStudent && !enrolledCourseIds.has(course._id) ? handleEnroll : null}
              isEnrolling={enrollingCourseId === course._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;

