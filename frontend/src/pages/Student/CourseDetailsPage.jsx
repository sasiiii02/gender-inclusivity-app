import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CourseDetailsCard from "../../components/student/CourseDetailsCard";
import * as trainingApi from "../../api/trainingApi";

const CourseDetailsPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [enrolling, setEnrolling] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [completing, setCompleting] = useState(false);

  const fetchEnrollment = async () => {
    if (!isStudent) return;
    try {
      const res = await trainingApi.getMyEnrollments();
      const list = res.data || [];
      const found = list.find((e) => e?.course?._id === courseId) || null;
      setEnrollment(found);
    } catch {
      setEnrollment(null);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const courseRes = await trainingApi.getCourseById(courseId);
      setCourse(courseRes.data || null);

      if (!courseRes.data) {
        setError("Course not found.");
        setLessons([]);
        setEnrollment(null);
        return;
      }

      const lessonsRes = await trainingApi.getLessonsByCourse(courseId);
      setLessons(lessonsRes.data?.data || []);

      await fetchEnrollment();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load course.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, isStudent, user?.id]);

  const enrolledProgress = useMemo(() => enrollment?.progress ?? 0, [enrollment]);

  const handleEnroll = async () => {
    setEnrolling(true);
    setError("");
    try {
      await trainingApi.enrollInCourse(courseId);
      await fetchEnrollment();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to enroll.");
    } finally {
      setEnrolling(false);
    }
  };

  const handleProgressChange = async (enrollmentId, newProgress) => {
    if (!enrollmentId) return;
    setUpdatingProgress(true);
    setError("");
    try {
      await trainingApi.updateProgress(enrollmentId, newProgress);
      await fetchEnrollment();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to update progress.");
    } finally {
      setUpdatingProgress(false);
    }
  };

  const handleLessonComplete = async (_lesson, computedProgress) => {
    if (!enrollment?._id) return;
    // Avoid spamming updates when progress isn't changing.
    if (computedProgress <= enrolledProgress) return;
    await handleProgressChange(enrollment._id, computedProgress);
  };

  const handleMarkComplete = async (enrollmentId) => {
    setCompleting(true);
    setError("");
    try {
      await trainingApi.markCourseComplete(enrollmentId);
      await fetchEnrollment();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to mark complete.");
    } finally {
      setCompleting(false);
    }
  };

  const isReady = !loading && course;

  if (loading) {
    return (
      <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-2xl p-6">
        Loading…
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="space-y-4">
        {error ? (
          <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
            ⚠️ {error}
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => navigate("/student/courses")}
          className="text-sm bg-stone-900 hover:bg-stone-800 text-white font-medium px-4 py-2 rounded-xl transition-colors"
        >
          Back to courses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {error ? (
        <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
          ⚠️ {error}
        </div>
      ) : null}

      <CourseDetailsCard
        course={course}
        lessons={lessons}
        enrollment={enrollment}
        isEnrolling={enrolling || updatingProgress}
        onEnroll={isStudent ? handleEnroll : null}
        onProgressChange={isStudent ? handleProgressChange : null}
        onLessonComplete={isStudent ? handleLessonComplete : null}
        onMarkComplete={isStudent ? handleMarkComplete : null}
      />

      {(updatingProgress || completing) && (
        <div className="text-xs text-stone-500">
          Updating… please wait.
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;

