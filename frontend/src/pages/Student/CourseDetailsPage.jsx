import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as trainingApi from "../../api/trainingApi";

const getVideoEmbedConfig = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { embedUrl: "", openUrl: "" };
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { embedUrl: "", openUrl: "" };
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname;

    // YouTube normal links and short links
    if (host.includes("youtube.com") || host.includes("youtu.be")) {
      if (host.includes("youtu.be")) {
        const videoId = path.split("/").filter(Boolean)[0];
        if (videoId) {
          return { embedUrl: `https://www.youtube.com/embed/${videoId}`, openUrl: trimmed };
        }
      }

      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return { embedUrl: `https://www.youtube.com/embed/${videoId}`, openUrl: trimmed };
      }

      if (path.includes("/embed/")) {
        return { embedUrl: trimmed, openUrl: trimmed };
      }
    }

    // Google Drive share links
    if (host.includes("drive.google.com")) {
      const filePathMatch = path.match(/\/file\/d\/([^/]+)/);
      const fileIdFromPath = filePathMatch?.[1];
      const fileIdFromQuery = parsed.searchParams.get("id");
      const fileId = fileIdFromPath || fileIdFromQuery;

      if (fileId) {
        return { embedUrl: `https://drive.google.com/file/d/${fileId}/preview`, openUrl: trimmed };
      }
    }

    // OneDrive links
    if (host.includes("onedrive.live.com") || host.includes("1drv.ms")) {
      if (path.includes("/embed")) {
        return { embedUrl: trimmed, openUrl: trimmed };
      }

      if (host.includes("onedrive.live.com")) {
        const resid = parsed.searchParams.get("resid");
        if (resid) {
          const authKey = parsed.searchParams.get("authkey");
          const embed = new URL("https://onedrive.live.com/embed");
          embed.searchParams.set("resid", resid);
          if (authKey) embed.searchParams.set("authkey", authKey);
          return { embedUrl: embed.toString(), openUrl: trimmed };
        }
      }

      return { embedUrl: "", openUrl: trimmed };
    }

    // Generic URL fallback
    return { embedUrl: trimmed, openUrl: trimmed };
  } catch {
    return { embedUrl: "", openUrl: "" };
  }
};

const CourseDetailsPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [enrollment, setEnrollment] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const courseRes = await trainingApi.getCourseById(courseId);
      setCourse(courseRes.data || null);

      if (!courseRes.data) {
        setError("Course not found.");
        return;
      }

      const lessonsRes = await trainingApi.getLessonsByCourse(courseId);
      setLessons(lessonsRes.data?.data || []);

      try {
        const enrollRes = await trainingApi.getMyEnrollments();
        const list = enrollRes.data || [];
        const match = list.find((e) => e?.course?._id === courseId);
        setEnrollment(match || null);
      } catch {
        setEnrollment(null);
      }
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [courseId]);

  // Auto-select first lesson if available and nothing selected
  useEffect(() => {
    if (!selectedLesson && lessons.length > 0) {
      setSelectedLesson(lessons[0]);
    }
  }, [lessons]);

  const handleEnroll = async () => {
    setEnrolling(true);
    setError("");
    try {
      await trainingApi.enrollInCourse(courseId);
      setSuccess("Successfully enrolled in the course!");
      setTimeout(() => setSuccess(""), 3000);
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
    try {
      const current = Number(enrollment?.progress) || 0;
      const increment = lessons.length > 0 ? Math.ceil(100 / lessons.length) : 100;
      const newValue = Math.min(100, current + increment);
      await trainingApi.updateEnrollmentProgress(enrollment._id, {
        progressPercentage: newValue,
      });
      await fetchAll();
      setSuccess(`Progress updated!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError("Failed to update progress.");
    } finally {
      setUpdatingProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-stone-100">
        <p className="text-stone-500 mb-4">{error || "Course not found"}</p>
        <button
          onClick={() => navigate("/student/courses")}
          className="bg-stone-900 text-white px-6 py-2 rounded-xl"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const isEnrolled = !!enrollment?._id;
  const progress = Number(enrollment?.progress) || 0;
  const canComplete = isEnrolled && progress >= 100;
  const isCompleted = String(enrollment?.completionStatus).toLowerCase() === "completed" || canComplete;

  const image =
    course?.image?.url ||
    course?.imageUrl ||
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1000&auto=format&fit=crop";
  const videoConfig = getVideoEmbedConfig(selectedLesson?.videoUrl || "");

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toast Notifications */}
      {success && (
        <div className="fixed top-20 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg border border-green-400 animate-slide-in">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="fixed top-20 right-6 z-50 bg-rose-500 text-white px-6 py-3 rounded-2xl shadow-lg border border-rose-400 animate-slide-in">
          ⚠️ {error}
        </div>
      )}

      {/* Breadcrumb & Navigation */}
      <button
        onClick={() => navigate("/student/courses")}
        className="flex items-center gap-2 text-stone-500 hover:text-violet-600 transition-colors font-medium text-sm"
      >
        <span>←</span> Back to Courses
      </button>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 shadow-xl border border-stone-200 group">
        <div className="absolute inset-0">
          <img src={image} className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-700" alt={course.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>
        
        <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-8 items-end justify-between">
          <div className="max-w-2xl text-white">
            <div className="flex gap-3 mb-4">
              <span className="bg-violet-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                {course.category || "General"}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                {course.level || "Beginner"}
              </span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-4 text-white">
              {course.title}
            </h1>
            <p className="text-stone-300 text-sm md:text-base line-clamp-3">
              {course.description || "Dive into this engaging course and master new concepts. Join our expert instructors to expand your knowledge."}
            </p>
            
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-stone-300 text-sm">
                <span className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white">👩‍🏫</span>
                <span className="font-medium text-white">{course.instructor?.name || "Expert Instructor"}</span>
              </div>
              <div className="text-stone-400 text-sm">
                ⏱ {course.duration ? `${course.duration} mins` : "Self-paced"}
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl text-center shadow-2xl">
            {isEnrolled ? (
              <div className="space-y-4 min-w-[200px]">
                <div className="flex justify-between text-white text-sm font-semibold mb-1">
                  <span>My Progress</span>
                  <span className={isCompleted ? "text-emerald-400" : "text-violet-300"}>
                    {isCompleted ? "Completed" : `${progress}%`}
                  </span>
                </div>
                <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? "bg-emerald-500" : "bg-gradient-to-r from-violet-500 to-indigo-400"}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                {!isCompleted && (
                  <div className="w-full py-2 rounded-xl bg-white/10 text-white/80 font-medium text-sm border border-white/10 mt-2">
                    Keep up the good work!
                  </div>
                )}
                {isCompleted && (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-sm border border-emerald-500/30">
                    Course Certified
                  </div>
                )}
              </div>
            ) : (
              <div className="min-w-[200px] py-2 text-white">
                <p className="font-semibold mb-4 text-emerald-300 border-b border-white/10 pb-3">Available Now</p>
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/40 transition-all active:scale-95 disabled:opacity-70"
                >
                  {enrolling ? "Enrolling..." : "Enroll for Free"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Lesson List Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-200 pb-3">Course Content</h2>
          {lessons.length === 0 ? (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center text-stone-500 text-sm">
              No lessons have been uploaded for this course yet.
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <ul className="divide-y divide-stone-100">
                {lessons.map((lesson, idx) => (
                   <li key={lesson._id}>
                     <button
                       onClick={() => setSelectedLesson(lesson)}
                       className={`w-full text-left px-5 py-4 transition-colors flex items-center justify-between ${
                         selectedLesson?._id === lesson._id
                           ? "bg-violet-50 border-l-4 border-violet-600"
                           : "hover:bg-stone-50 border-l-4 border-transparent"
                       }`}
                     >
                       <div>
                         <p className="text-[10px] font-bold tracking-widest text-violet-600 uppercase mb-1">
                           Module {idx + 1}
                         </p>
                         <p className={`font-semibold ${selectedLesson?._id === lesson._id ? "text-violet-900" : "text-stone-800"}`}>
                           {lesson.title}
                         </p>
                       </div>
                       {lesson.duration && (
                         <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-md">{lesson.duration}m</span>
                       )}
                     </button>
                   </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Lesson View Area */}
        <div className="lg:col-span-2">
          {!isEnrolled ? (
            <div className="h-full flex flex-col items-center justify-center bg-stone-50 rounded-3xl border border-stone-200 p-10 text-center min-h-[400px]">
              <span className="text-6xl mb-4 opacity-50">🔒</span>
              <h3 className="font-serif text-2xl font-bold text-stone-700 mb-2">Content Locked</h3>
              <p className="text-stone-500 max-w-sm">Please enroll in this course to access the videos, materials, and lessons created by the instructor.</p>
            </div>
          ) : selectedLesson ? (
            <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm flex flex-col min-h-[500px]">
              <div className="mb-6">
                <span className="text-violet-600 font-bold text-xs uppercase tracking-wider mb-2 block">
                  Current Lesson
                </span>
                <h2 className="font-serif text-3xl font-bold text-stone-900">{selectedLesson.title}</h2>
              </div>
              
              {selectedLesson.videoUrl ? (
                videoConfig.embedUrl ? (
                  <div className="w-full aspect-video bg-stone-900 rounded-2xl overflow-hidden mb-8 shadow-lg ring-1 ring-stone-900/5">
                    <iframe
                      className="w-full h-full"
                      src={videoConfig.embedUrl}
                      title={selectedLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="w-full bg-stone-50 rounded-2xl p-5 mb-8 border border-stone-200">
                    <p className="text-sm text-stone-600 mb-3">
                      This video provider does not support in-page embed for this link format.
                    </p>
                    <a
                      href={videoConfig.openUrl || selectedLesson.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
                    >
                      Open Video
                    </a>
                  </div>
                )
              ) : (
                <div className="w-full h-48 bg-stone-100 rounded-2xl flex items-center justify-center mb-8 border border-stone-200">
                  <span className="text-stone-400 font-medium">No video provided for this lesson.</span>
                </div>
              )}

              <div className="prose prose-stone prose-sm max-w-none mb-8 text-stone-600">
                <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-2">Overview</h3>
                <p className="whitespace-pre-wrap mt-4">{selectedLesson.content || "No overview available."}</p>
              </div>

              {selectedLesson.pdf && selectedLesson.pdf.url && (
                <div className="mt-auto pt-6 border-t border-stone-100">
                   <h3 className="text-sm font-bold text-stone-900 mb-3">Resource Files</h3>
                   <a
                     href={selectedLesson.pdf.url}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-flex items-center gap-3 bg-rose-50 hover:bg-rose-100 text-rose-700 p-4 rounded-xl transition-colors border border-rose-100"
                   >
                     <span className="text-2xl text-rose-500">📄</span>
                     <div>
                      <p className="font-bold text-sm">
                        {selectedLesson.pdf.originalFilename || "Lesson Reference PDF"}
                      </p>
                       <p className="text-xs text-rose-600 opacity-80">Click to View/Download</p>
                     </div>
                   </a>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-stone-900">Finished this lesson?</h4>
                  <p className="text-stone-500 text-sm">Mark as complete to update your overall course progress.</p>
                </div>
                <button
                  onClick={handleUpdateProgress}
                  disabled={updatingProgress || isCompleted}
                  className={`px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 min-w-[200px] ${
                    isCompleted 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                      : "bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
                  }`}
                >
                  {updatingProgress ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Logging...
                    </>
                  ) : isCompleted ? (
                    <>
                      <span className="text-lg">🏆</span>
                      Course Completed
                    </>
                  ) : (
                    <>
                      <span className="text-lg leading-none">✨</span>
                      Mark Lesson Complete
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-stone-50 rounded-3xl border border-stone-200 p-10 text-center min-h-[400px]">
              <h3 className="font-serif text-xl font-bold text-stone-400 mb-2">Select a Lesson</h3>
              <p className="text-stone-400 max-w-sm">Choose a lesson from the left sidebar to start learning.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;

