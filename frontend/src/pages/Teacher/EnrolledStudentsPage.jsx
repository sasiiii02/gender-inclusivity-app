import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EnrolledStudentsTable from "../../components/teacher/EnrolledStudentsTable";
import * as trainingApi from "../../api/trainingApi";

const EnrolledStudentsPage = () => {
  console.log("[Training] EnrolledStudentsPage rendered");
  const { courseId: routeCourseId } = useParams();

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState(routeCourseId || "");

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    setLoadingCourses(true);
    setError("");
    try {
      const res = await trainingApi.getAllCourses({ page: 1, limit: 100 });
      const fetchedCourses = res.data?.data?.courses || [];
      setCourses(fetchedCourses);

      if (!selectedCourseId && fetchedCourses.length > 0) {
        setSelectedCourseId(fetchedCourses[0]._id);
      }
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load courses.");
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchStudents = async (id) => {
    if (!id) {
      setStudents([]);
      return;
    }
    setLoadingStudents(true);
    setError("");
    try {
      const res = await trainingApi.getStudentsByCourse(id);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchStudents(selectedCourseId);
    } else {
      setStudents([]);
    }
  }, [selectedCourseId]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xs font-semibold uppercase tracking-wider text-amber-600">
          Training Module
        </h1>
        <h1 className="font-serif text-2xl font-bold text-stone-900">
          Enrolled Students
        </h1>
        <p className="text-stone-500 text-sm mt-0.5">
          View progress for learners enrolled in your courses.
        </p>
      </div>

      {error ? (
        <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
          ⚠️ {error}
        </div>
      ) : null}

      <div className="border border-stone-200 rounded-2xl bg-white p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="font-serif text-lg font-bold text-stone-900">
            Students
          </h2>

          <div className="flex items-center gap-3">
            {loadingCourses ? (
              <span className="text-sm text-stone-500">Loading courses...</span>
            ) : (
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="" disabled>Select a course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            )}

            {!loadingCourses && !loadingStudents && (
              <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">
                {students.length} students
              </span>
            )}
          </div>
        </div>

        {!selectedCourseId && !loadingCourses ? (
          <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-2xl p-5 text-center">
            Please select a course to view enrolled students.
          </div>
        ) : loadingStudents ? (
          <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-2xl p-5 text-center">
            Fetching students…
          </div>
        ) : (
          <EnrolledStudentsTable students={students} />
        )}
      </div>
    </div>
  );
};

export default EnrolledStudentsPage;

