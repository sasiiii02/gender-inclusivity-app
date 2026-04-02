import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import EnrollmentCard from "../../components/student/EnrollmentCard";
import * as trainingApi from "../../api/trainingApi";

const MyEnrollmentsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updating, setUpdating] = useState(false);
  const [completing, setCompleting] = useState(false);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await trainingApi.getMyEnrollments();
      setEnrollments(res.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load enrollments.");
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isStudent) return;
    fetchEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isStudent]);

  const handleProgressChange = async (enrollmentId, progressPercentage) => {
    setUpdating(true);
    setError("");
    try {
      await trainingApi.updateProgress(enrollmentId, progressPercentage);
      await fetchEnrollments();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to update progress.");
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkComplete = async (enrollmentId) => {
    setCompleting(true);
    setError("");
    try {
      await trainingApi.markCourseComplete(enrollmentId);
      await fetchEnrollments();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to mark complete.");
    } finally {
      setCompleting(false);
    }
  };

  if (!isStudent) {
    return (
      <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-2xl p-6">
        My Enrollments is only available for students.
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="font-serif text-2xl font-bold text-stone-900">
          My Enrollments
        </h1>
        <p className="text-stone-500 text-sm mt-0.5">
          Track progress and mark courses complete.
        </p>
      </div>

      {error ? (
        <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
          ⚠️ {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="border border-stone-200 rounded-2xl p-5 bg-white animate-pulse"
            />
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center">
          You aren’t enrolled in any courses yet.
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((e) => (
            <div
              key={e._id}
              className="border border-stone-200 rounded-2xl bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <EnrollmentCard
                    enrollment={e}
                    onProgressChange={handleProgressChange}
                    onMarkComplete={handleMarkComplete}
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={updating || completing}
                    onClick={() =>
                      navigate(`/student/courses/${e.course?._id || ""}`)
                    }
                    className="text-sm bg-stone-900 hover:bg-stone-800 text-white font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEnrollmentsPage;

