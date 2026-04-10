import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as trainingApi from "../../api/trainingApi";
import CourseCard from "../../components/student/CourseCard";
import EnrollmentCard from "../../components/student/EnrollmentCard";

const StudentCourses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState("enrolled"); // "enrolled" or "available"
  
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    let fetchedEnrollments = [];
    let fetchedCourses = [];
    try {
      // Fetch Enrollments
      try {
        const enrollRes = await trainingApi.getMyEnrollments();
        fetchedEnrollments = Array.isArray(enrollRes?.data) ? enrollRes.data : [];
      } catch (err) {
        console.error("Failed to load enrollments", err);
      }

      // Fetch Available Courses
      try {
        const res = await trainingApi.getAllCourses();
        const raw = res?.data?.data?.courses ?? res?.data?.courses ?? res?.data?.data ?? res?.data ?? [];
        const list = Array.isArray(raw) ? raw : [];
        const activeOnly = list.filter((c) => !c?.status || String(c.status).toLowerCase() === "active");
        fetchedCourses = activeOnly;
      } catch (err) {
        console.error("Failed to load courses", err);
      }

      const courseById = new Map(
        fetchedCourses
          .filter((course) => course?._id)
          .map((course) => [String(course._id), course])
      );

      const mergedEnrollments = fetchedEnrollments.map((enrollment) => {
        const enrollmentCourse = enrollment?.course || {};
        const matchedCourse = courseById.get(String(enrollmentCourse?._id || ""));
        if (!matchedCourse) return enrollment;
        return {
          ...enrollment,
          course: {
            ...matchedCourse,
            ...enrollmentCourse,
          },
        };
      });

      setCourses(fetchedCourses);
      setEnrollments(mergedEnrollments);
    } catch (err) {
      setError("An unexpected error occurred while loading courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueLearning = (enrollment) => {
    const courseId = enrollment?.course?._id;
    if (!courseId) return;
    navigate(`/student/courses/${courseId}`);
  };

  const handleMarkComplete = async (enrollment) => {
    const enrollmentId = enrollment?._id;
    if (!enrollmentId) return;
    setCompleting(true);
    try {
      await trainingApi.markCourseComplete(enrollmentId);
      await fetchAll();
    } catch (e) {
      console.error(e);
      alert("Failed to mark complete.");
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-br from-violet-50 to-stone-50 p-8 rounded-3xl border border-violet-100 shadow-sm">
        <div>
          <span className="text-violet-600 font-bold tracking-widest text-sm uppercase mb-2 block">Learning Hub</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
            {activeTab === "enrolled" ? "My Enrolled Courses" : "Browse Courses"}
          </h1>
          <p className="text-stone-500 mt-2 max-w-lg">
            {activeTab === "enrolled" 
              ? "Stay on track with your curriculum. Dive into interactive modules and complete your certifications."
              : "Discover new skills and expand your knowledge. Enroll in our interactive courses today."}
          </p>
        </div>
        <div className="relative flex bg-white/80 backdrop-blur-md rounded-full p-1.5 shadow-sm border border-stone-200 self-start md:self-end">
          {/* Sliding Background */}
          <div
            className={`absolute top-1.5 bottom-1.5 left-1.5 w-[140px] bg-violet-600 rounded-full shadow-md transition-transform duration-300 ease-out ${
              activeTab === "enrolled" ? "translate-x-0" : "translate-x-[140px]"
            }`}
          />
          
          <button 
            onClick={() => setActiveTab("enrolled")}
            className={`relative z-10 w-[140px] flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
              activeTab === "enrolled" ? "text-white" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            My Learning
          </button>
          
          <button 
            onClick={() => setActiveTab("available")}
            className={`relative z-10 w-[140px] flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
              activeTab === "available" ? "text-white" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse All
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-stone-200 rounded-3xl h-80 bg-white animate-pulse p-4">
               <div className="h-40 bg-stone-200 rounded-2xl w-full mb-4" />
               <div className="h-4 bg-stone-200 rounded w-2/3 mb-2" />
               <div className="h-3 bg-stone-200 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : activeTab === "enrolled" ? (
        enrollments.length === 0 ? (
          <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-3xl p-10 text-center">
            <div className="text-4xl mb-4">📚</div>
            <p className="font-semibold text-lg text-stone-900">You haven't enrolled in any courses yet</p>
            <p className="mt-1 mb-4">Head over to the Browse All tab to find your first course!</p>
            <button 
              onClick={() => setActiveTab("available")}
              className="bg-violet-600 text-white px-6 py-2 rounded-full font-medium shadow-md shadow-violet-200 hover:bg-violet-700 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {enrollments.map((e) => (
              <EnrollmentCard
                key={e._id}
                enrollment={e}
                onContinue={handleContinueLearning}
                onComplete={completing ? null : handleMarkComplete}
              />
            ))}
          </div>
        )
      ) : (
        courses.length === 0 ? (
          <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="font-semibold text-xl text-stone-900 mb-2">More Courses Coming Soon</h3>
            <p className="text-stone-500 max-w-md">
               We are currently curating new and exciting content for you. Please check back later to discover more courses!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                onViewDetails={(id) => navigate(`/student/courses/${id}`)}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default StudentCourses;
