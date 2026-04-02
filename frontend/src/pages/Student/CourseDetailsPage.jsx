import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseDetailsCard from "../../components/student/CourseDetailsCard";
import LessonList from "../../components/student/LessonList";
import * as trainingApi from "../../api/trainingApi";

const CourseDetailsPage = () => {
  console.log("[Training] CourseDetailsPage rendered");
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [enrollment, setEnrollment] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
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

      // Enrollment status (student only endpoint; if unauthorized, treat as not enrolled)
      try {
        const enrollRes = await trainingApi.getMyEnrollments();
        const list = enrollRes.data || [];
        const match = list.find((e) => e?.course?._id === courseId);
        setEnrollment(match || null);
      } catch {
        setEnrollment(null);
      }
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load course.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [courseId]);

  const handleEnroll = async () => {
    setEnrolling(true);
    setError("");
    setSuccess("");
    try {
      await trainingApi.enrollInCourse(courseId);
      const msg = "Enrollment successful!";
      setSuccess(msg);
      // Temporary notification fallback (no toast system detected)
      // eslint-disable-next-line no-alert
      alert(msg);
      await fetchAll();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to enroll.");
    } finally {
      setEnrolling(false);
    }
  };

  const handleUpdateProgress = async () => {
    if (!enrollment?._id) return;
    setUpdatingProgress(true);
    setError("");
    setSuccess("");
    try {
      const current = Number(enrollment?.progress);
      const safeCurrent = Number.isNaN(current) ? 0 : Math.min(100, Math.max(0, current));
      const newValue = Math.min(100, safeCurrent + 10);
      await trainingApi.updateEnrollmentProgress(enrollment._id, {
        progressPercentage: newValue,
      });
      await fetchAll();
      setSuccess(`Progress updated to ${newValue}%.`);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to update progress.");
    } finally {
      setUpdatingProgress(false);
    }
  };

  const isReady = !loading && course;
  const isEnrolled = !!enrollment?._id;
  const progress = (() => {
    const n = Number(enrollment?.progress);
    return Number.isNaN(n) ? 0 : Math.min(100, Math.max(0, n));
  })();
  const canComplete = isEnrolled && progress >= 100;

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
      <h1 className="text-xs font-semibold uppercase tracking-wider text-violet-600">
        Training Module - Course Details Page
      </h1>
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

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate("/student/courses")}
          className="text-sm bg-stone-900 hover:bg-stone-800 text-white font-medium px-4 py-2 rounded-xl transition-colors"
        >
          Back to courses
        </button>

        {isEnrolled ? (
          <button
            type="button"
            disabled={updatingProgress}
            onClick={handleUpdateProgress}
            className="text-sm bg-violet-600 hover:bg-violet-700 text-white font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
          >
            {updatingProgress ? "Updating…" : "Update Progress"}
          </button>
        ) : (
          <div className="text-xs text-stone-500">
            Not enrolled — enroll to track progress.
          </div>
        )}
      </div>

      <CourseDetailsCard
        course={course}
        isEnrolled={isEnrolled}
        onEnroll={enrolling || isEnrolled ? null : handleEnroll}
      />

      {canComplete ? (
        <div className="px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl text-violet-700 text-sm">
          You’ve reached 100% progress — this course can now be completed.
        </div>
      ) : null}

      <div className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-stone-900">Lessons</h2>
        <LessonList lessons={lessons} />
      </div>
    </div>
  );
};

export default CourseDetailsPage;

