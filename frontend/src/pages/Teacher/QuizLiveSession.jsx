import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLiveQuiz } from "../../hooks/useLiveQuiz";
import LiveQuizStats from "../../components/teacher/LiveQuizStats";
import StudentList from "../../components/teacher/StudentList";
import QuestionPerformance from "../../components/teacher/QuestionPerformance";
import QuizControlPanel from "../../components/teacher/QuizControlPanel";
import LoadingSpinner from "../../components/student/LoadingSpinner";

const QuizLiveSession = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const {
    quiz,
    liveStats,
    results,
    loading,
    error,
    sessionActive,
    startQuiz,
    endQuiz,
    refreshStats,
  } = useLiveQuiz(quizId);

  const [activeTab, setActiveTab] = useState("students");

  useEffect(() => {
    // Auto-refresh stats every 5 seconds when active
    if (sessionActive) {
      const interval = setInterval(refreshStats, 5000);
      return () => clearInterval(interval);
    }
  }, [sessionActive]);

  const handleEndQuiz = async () => {
    await endQuiz();
    navigate(`/teacher/quiz/${quizId}/results`);
  };

  if (loading && !quiz) {
    return <LoadingSpinner text="Loading quiz session..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6">
          <p className="text-rose-600">⚠️ {error}</p>
          <button
            onClick={() => navigate("/teacher/dashboard")}
            className="btn-primary mt-4"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const students = liveStats?.activeStudents || [];
  const performance = liveStats?.liveStats?.questionWisePerformance || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="text-stone-500 hover:text-stone-700 text-sm flex items-center gap-1 mb-4"
        >
          ← Back to Dashboard
        </button>
        <h1 className="font-serif text-2xl font-bold text-stone-900">
          {quiz?.title}
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          {sessionActive
            ? "🟢 Live Session - Students are taking the quiz"
            : "📋 Ready to start"}
        </p>
      </div>

      {/* Live Stats */}
      {sessionActive && <LiveQuizStats stats={liveStats} />}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Control Panel */}
        <div className="lg:col-span-1">
          <QuizControlPanel
            quiz={quiz}
            sessionActive={sessionActive}
            onStart={startQuiz}
            onEnd={handleEndQuiz}
            loading={loading}
          />
        </div>

        {/* Right Column - Live Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-stone-200">
            <button
              onClick={() => setActiveTab("students")}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                activeTab === "students"
                  ? "text-violet-600 border-b-2 border-violet-600"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              👥 Students ({students.length})
            </button>
            <button
              onClick={() => setActiveTab("performance")}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                activeTab === "performance"
                  ? "text-violet-600 border-b-2 border-violet-600"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              📊 Question Performance
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            {activeTab === "students" && <StudentList students={students} />}
            {activeTab === "performance" && (
              <QuestionPerformance
                performance={performance}
                questions={quiz?.questions}
              />
            )}
          </div>

          {/* QR Code Display */}
          {quiz?.qrCode && !sessionActive && (
            <div className="bg-white rounded-xl border border-stone-200 p-5 text-center">
              <p className="text-sm text-stone-500 mb-3">
                QR Code for Students
              </p>
              <img
                src={quiz.qrCode}
                alt="Quiz QR Code"
                className="mx-auto w-48 h-48"
              />
              <p className="text-xs text-stone-400 mt-3">
                Students can scan this to join the quiz
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizLiveSession;
