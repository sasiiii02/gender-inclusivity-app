import { useEffect, useMemo, useState } from "react";
import EnrolledStudentsTable from "../../components/teacher/EnrolledStudentsTable";
import * as trainingApi from "../../api/trainingApi";

const EnrolledStudentsPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const [students, setStudents] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState("");

  const selectedCourseTitle = useMemo(
    () => courses.find((c) => c._id === selectedCourseId)?.title,
    [courses, selectedCourseId]
  );

  const fetchCourses = async () => {
    setLoadingCourses(true);
    setError("");
    try {
      const res = await trainingApi.getAllCourses({
        page: 1,
        limit: 100,
      });
      const list = res.data?.data?.courses || [];
      setCourses(list);
      setSelectedCourseId((prev) => prev || list[0]?._id || "");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load courses.");
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchStudents = async (courseId) => {
    if (!courseId) return;
    setLoadingStudents(true);
    setError("");
    try {
      const res = await trainingApi.getStudentsByCourse(courseId);
      setStudents(res.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load enrolled students.");
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchStudents(selectedCourseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourseId]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-serif text-2xl font-bold text-stone-900">
          Enrolled Students
        </h1>
        <p className="text-stone-500 text-sm mt-0.5">
          View progress for learners enrolled in each course.
        </p>
      </div>

      {error ? (
        <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
          ⚠️ {error}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-stone-700">Course</label>
        {loadingCourses ? (
          <div className="text-sm text-stone-500">Loading courses…</div>
        ) : (
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200"
          >
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="border border-stone-200 rounded-2xl bg-white p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="font-serif text-lg font-bold text-stone-900">
            {selectedCourseTitle ? `Students • ${selectedCourseTitle}` : "Students"}
          </h2>
          {loadingStudents ? (
            <span className="text-xs text-stone-500">Loading…</span>
          ) : (
            <span className="text-xs font-semibold text-stone-500">
              {students.length} students
            </span>
          )}
        </div>

        {loadingStudents ? (
          <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-2xl p-5">
            Fetching students…
          </div>
        ) : (
          <EnrolledStudentsTable
            students={students}
            courseTitle={selectedCourseTitle}
          />
        )}
      </div>
    </div>
  );
};

export default EnrolledStudentsPage;

