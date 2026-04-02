import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EnrolledStudentsTable from "../../components/teacher/EnrolledStudentsTable";
import * as trainingApi from "../../api/trainingApi";

const EnrolledStudentsPage = () => {
  const { courseId } = useParams();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const fetchStudents = async () => {
    if (!courseId) {
      setError("Missing courseId in route.");
      setStudents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await trainingApi.getStudentsByCourse(courseId);
      setStudents(res.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load enrolled students.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

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

      <div className="border border-stone-200 rounded-2xl bg-white p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="font-serif text-lg font-bold text-stone-900">
            Students
          </h2>
          {loading ? (
            <span className="text-xs text-stone-500">Loading…</span>
          ) : (
            <span className="text-xs font-semibold text-stone-500">
              {students.length} students
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-2xl p-5">
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

