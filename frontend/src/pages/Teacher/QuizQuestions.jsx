import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuiz } from "../../hooks/useQuiz";
import QuestionCard from "../../components/teacher/QuestionCard";
import QuestionForm from "../../components/teacher/QuestionForm";
import ConfirmDialog from "../../components/teacher/ConfirmDialog";

const QuizQuestions = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    currentQuiz,
    questions,
    loading,
    fetchQuiz,
    addNewQuestion,
    updateExistingQuestion,
    deleteExistingQuestion,
    publishExistingQuiz,
  } = useQuiz();

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchQuiz(id);
    }
  }, [id]);

  const handleAddQuestion = async (data) => {
    await addNewQuestion(id, data);
    setShowQuestionForm(false);
  };

  const handleUpdateQuestion = async (data) => {
    await updateExistingQuestion(editingQuestion._id, data);
    setEditingQuestion(null);
    setShowQuestionForm(false);
  };

  const handleDeleteQuestion = async () => {
    if (deleteTarget) {
      await deleteExistingQuestion(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    await publishExistingQuiz(id);
    setPublishing(false);
    navigate("/teacher/dashboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!currentQuiz) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">Quiz not found</p>
        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const canPublish = questions.length > 0 && currentQuiz.status === "draft";

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

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">
              {currentQuiz.title}
            </h1>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="inline-flex items-center px-4 py-1.5 text-sm bg-zinc-100 text-zinc-600 rounded-2xl">
                {currentQuiz.subject}
              </span>
              <span className="inline-flex items-center px-4 py-1.5 text-sm bg-zinc-100 text-zinc-600 rounded-2xl">
                {currentQuiz.grade}
              </span>
              <span className="inline-flex items-center px-4 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
                {questions.length} Questions
              </span>
              <span className="inline-flex items-center px-4 py-1.5 text-sm bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                {totalMarks} Total Marks
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {canPublish && (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-2xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {publishing ? (
                  "Publishing..."
                ) : (
                  <>
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
                        d="M5 10l7-7m0 0l7 7"
                      />
                    </svg>
                    Publish Quiz
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => setShowQuestionForm(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all flex items-center gap-2 active:scale-[0.985]"
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
              Add Question
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      {questions.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="text-amber-500 mt-0.5">
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
                  d="M13 16h-1v-4h-1m1-4v1m0-1H21a2 2 0 01-2 2V5a2 2 0 01-2-2H5a2 2 0 01-2-2v14a2 2 0 012-2h14a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-amber-700 text-sm">
              Your quiz has no questions yet. Add at least one question before
              publishing.
            </p>
          </div>
        </div>
      )}

      {/* Questions List */}
      {questions.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-zinc-500">
            <p>{questions.length} questions</p>
            <p>
              Total Marks:{" "}
              <span className="font-medium text-zinc-900">{totalMarks}</span>
            </p>
          </div>

          {questions.map((question, idx) => (
            <QuestionCard
              key={question._id}
              question={question}
              index={idx}
              onEdit={(q) => {
                setEditingQuestion(q);
                setShowQuestionForm(true);
              }}
              onDelete={(id) => setDeleteTarget(id)}
              isDraggable={false}
            />
          ))}
        </div>
      ) : (
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2"
              />
            </svg>
          </div>
          <p className="text-zinc-400 text-lg mb-2">No questions added yet</p>
          <p className="text-zinc-500 text-sm mb-8">
            Start building your quiz by adding questions
          </p>

          <button
            onClick={() => setShowQuestionForm(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all"
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
            Add Your First Question
          </button>
        </div>
      )}

      {/* Question Form Modal */}
      {showQuestionForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-8 py-5 border-b border-zinc-100 flex items-center justify-between z-10">
              <h3 className="text-xl font-semibold text-zinc-900">
                {editingQuestion ? "Edit Question" : "Add New Question"}
              </h3>
              <button
                onClick={() => {
                  setShowQuestionForm(false);
                  setEditingQuestion(null);
                }}
                className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-2xl transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6"
                  />
                </svg>
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <QuestionForm
                initialData={editingQuestion}
                onSubmit={
                  editingQuestion ? handleUpdateQuestion : handleAddQuestion
                }
                onCancel={() => {
                  setShowQuestionForm(false);
                  setEditingQuestion(null);
                }}
                isEditing={!!editingQuestion}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteQuestion}
        title="Delete Question?"
        message="This question will be permanently removed from the quiz."
        confirmText="Delete"
      />
    </div>
  );
};

export default QuizQuestions;
