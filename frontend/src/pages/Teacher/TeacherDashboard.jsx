import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../../hooks/useQuiz";
import QuizCard from "../../components/teacher/QuizCard";
import ConfirmDialog from "../../components/teacher/ConfirmDialog";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const {
    quizzes,
    loading,
    error,
    fetchQuizzes,
    deleteExistingQuiz,
    publishExistingQuiz,
  } = useQuiz();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [publishTarget, setPublishTarget] = useState(null);

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteExistingQuiz(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const handlePublish = async () => {
    if (publishTarget) {
      await publishExistingQuiz(publishTarget);
      setPublishTarget(null);
    }
  };

  const stats = {
    total: quizzes.length,
    draft: quizzes.filter((q) => q.status === "draft").length,
    published: quizzes.filter((q) => q.status === "published").length,
    active: quizzes.filter((q) => q.status === "active").length,
    completed: quizzes.filter((q) => q.status === "completed").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">
            My Quizzes
          </h1>
          <p className="text-zinc-500 mt-1 text-base">
            Create, manage, and publish quizzes for your students
          </p>
        </div>

        <button
          onClick={() => navigate("/teacher/quiz/new")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-black 
                     text-white font-medium rounded-xl transition-all duration-200 
                     shadow-sm hover:shadow-md active:scale-[0.985]"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Quiz
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          {
            label: "Total Quizzes",
            value: stats.total,
            color: "border-zinc-300",
          },
          { label: "Draft", value: stats.draft, color: "border-amber-500" },
          {
            label: "Published",
            value: stats.published,
            color: "border-emerald-500",
          },
          { label: "Active", value: stats.active, color: "border-blue-600" },
          {
            label: "Completed",
            value: stats.completed,
            color: "border-zinc-300",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow transition-shadow
                        border-l-4 ${s.color}`}
          >
            <p className="text-sm font-medium text-zinc-500 tracking-wide">
              {s.label}
            </p>
            <p className="mt-3 text-4xl font-semibold text-zinc-900 font-mono tracking-tighter">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-5 py-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-start gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mt-0.5 flex-shrink-0"
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
          <span>{error}</span>
        </div>
      )}

      {/* Quiz List */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-zinc-200 rounded-3xl h-64 animate-pulse"
            />
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-3xl py-20 text-center">
          <div className="mx-auto w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2"
              />
            </svg>
          </div>
          <p className="text-zinc-400 text-lg mb-2">No quizzes yet</p>
          <p className="text-zinc-500 text-sm mb-8">
            Get started by creating your first quiz
          </p>

          <button
            onClick={() => navigate("/teacher/quiz/new")}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-900 hover:bg-black text-white font-medium rounded-2xl transition-all"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Your First Quiz
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              onDelete={() => setDeleteTarget(quiz._id)}
              onPublish={() => setPublishTarget(quiz._id)}
              onEdit={() => navigate(`/teacher/quiz/${quiz._id}/edit`)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Quiz?"
        message="This quiz and all its questions will be permanently deleted. This action cannot be undone."
        confirmText="Delete"
      />

      {/* Publish Confirmation */}
      <ConfirmDialog
        isOpen={!!publishTarget}
        onClose={() => setPublishTarget(null)}
        onConfirm={handlePublish}
        title="Publish Quiz?"
        message="Once published, students will be able to view and join this quiz. You can still edit the quiz before starting it."
        confirmText="Publish"
      />
    </div>
  );
};

export default TeacherDashboard;
