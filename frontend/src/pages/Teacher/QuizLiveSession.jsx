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
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
          <div className="text-red-600 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 01-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => navigate("/teacher/dashboard")}
            className="mt-6 px-6 py-3 bg-zinc-900 text-white font-medium rounded-2xl hover:bg-black transition-all"
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-700 text-sm font-medium mb-6 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">
          {quiz?.title}
        </h1>
        <p className="text-zinc-500 mt-2 text-[15px]">
          {sessionActive
            ? "Live Session - Students are currently taking the quiz"
            : "Ready to start the live quiz session"}
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
          <div className="border-b border-zinc-200">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("students")}
                className={`pb-4 text-sm font-medium transition-all relative ${
                  activeTab === "students"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                Students ({students.length})
              </button>
              <button
                onClick={() => setActiveTab("performance")}
                className={`pb-4 text-sm font-medium transition-all relative ${
                  activeTab === "performance"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                Question Performance
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6">
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
            <div className="bg-white border border-zinc-200 rounded-3xl p-8 text-center">
              <p className="text-sm font-medium text-zinc-600 mb-4">
                QR Code for Students
              </p>
              <img
                src={quiz.qrCode}
                alt="Quiz QR Code"
                className="mx-auto w-56 h-56 border border-zinc-100 rounded-2xl"
              />
              <p className="text-xs text-zinc-500 mt-5">
                Students can scan this QR code to join the quiz
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizLiveSession;
