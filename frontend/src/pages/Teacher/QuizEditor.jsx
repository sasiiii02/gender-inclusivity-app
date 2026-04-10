import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuiz } from "../../hooks/useQuiz";
import QuizForm from "../../components/teacher/QuizForm";

const QuizEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id && id !== "new";

  const { currentQuiz, loading, createNewQuiz, updateExistingQuiz, fetchQuiz } =
    useQuiz();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      fetchQuiz(id);
    }
  }, [id]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      let result;
      if (isEditing) {
        result = await updateExistingQuiz(id, data);
      } else {
        result = await createNewQuiz(data);
      }
      navigate(`/teacher/quiz/${result._id}/questions`);
    } catch (err) {
      // Error already handled by hook
    } finally {
      setSaving(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="text-stone-500 hover:text-stone-700 text-sm flex items-center gap-1 mb-4"
        >
          ← Back to Dashboard
        </button>
        <h1 className="font-serif text-2xl font-bold text-stone-900">
          {isEditing ? "Edit Quiz" : "Create New Quiz"}
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          {isEditing
            ? "Update your quiz details and settings"
            : "Fill in the details to create a new quiz"}
        </p>
      </div>

      <div className="card">
        <QuizForm
          initialData={currentQuiz}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/teacher/dashboard")}
          isEditing={isEditing}
        />
      </div>

      {saving && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-violet-600" />
            <span className="text-sm text-stone-600">Saving...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizEditor;
