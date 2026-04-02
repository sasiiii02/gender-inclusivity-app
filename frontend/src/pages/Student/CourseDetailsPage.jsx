import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseDetailsCard from "../../components/student/CourseDetailsCard";
import LessonList from "../../components/student/LessonList";
import * as trainingApi from "../../api/trainingApi";

const CourseDetailsPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

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
        return;
      }

      const lessonsRes = await trainingApi.getLessonsByCourse(courseId);
      setLessons(lessonsRes.data?.data || []);
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
      setIsEnrolled(true);
      const msg = "Enrollment successful!";
      setSuccess(msg);
      // Temporary notification fallback (no toast system detected)
      // eslint-disable-next-line no-alert
      alert(msg);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to enroll.");
    } finally {
      setEnrolling(false);
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
      </div>

      <CourseDetailsCard
        course={course}
        isEnrolled={isEnrolled}
        onEnroll={enrolling || isEnrolled ? null : handleEnroll}
      />

      <div className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-stone-900">Lessons</h2>
        <LessonList lessons={lessons} />
      </div>
    </div>
  );
};

export default CourseDetailsPage;

