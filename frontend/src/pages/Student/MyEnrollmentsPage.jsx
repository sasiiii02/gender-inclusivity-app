import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import EnrollmentCard from "../../components/student/EnrollmentCard";
import * as trainingApi from "../../api/trainingApi";

const MyEnrollmentsPage = () => {
  console.log("[Training] MyEnrollmentsPage rendered");
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [completing, setCompleting] = useState(false);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
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

  const handleContinueLearning = (enrollment) => {
    const courseId = enrollment?.course?._id;
    if (!courseId) return;
    navigate(`/student/courses/${courseId}`);
  };

  const handleMarkComplete = async (enrollment) => {
    const enrollmentId = enrollment?._id;
    if (!enrollmentId) return;
    setCompleting(true);
    setError("");
    setSuccess("");
    try {
      await trainingApi.markCourseComplete(enrollmentId);
      await fetchEnrollments();
      const msg = "Course marked as completed successfully.";
      setSuccess(msg);
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
        <h1 className="text-xs font-semibold uppercase tracking-wider text-violet-600">
          Training Module - My Enrollments Page
        </h1>
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

      {success ? (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          {success}
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
            <EnrollmentCard
              key={e._id}
              enrollment={e}
              onContinue={handleContinueLearning}
              onComplete={completing ? null : handleMarkComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEnrollmentsPage;

