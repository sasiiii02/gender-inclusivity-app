import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useStudentQuiz } from "../../hooks/useStudentQuiz";
import ResultCard from "../../components/student/ResultCard";
import AIExplanationModal from "../../components/student/AIExplanationModal";
import LoadingSpinner from "../../components/student/LoadingSpinner";

const QuizResult = () => {
  const navigate = useNavigate();
  const { studentQuizId } = useParams();
  const location = useLocation();

  const {
    currentQuiz,
    result,
    aiExplanations,
    loadingExplanation,
    fetchQuizResult,
    fetchAllAIExplanations,
    fetchAIExplanation,
    submitExplanationFeedback,
    resetQuiz,
  } = useStudentQuiz();

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedExplanation, setSelectedExplanation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResult = async () => {
      setLoading(true);
      await fetchQuizResult(studentQuizId);
      await fetchAllAIExplanations(studentQuizId);
      setLoading(false);
    };
    loadResult();

    return () => resetQuiz();
  }, [studentQuizId]);

  const handleViewExplanation = async (question) => {
    setSelectedQuestion(question);

    // Check if explanation already loaded
    if (aiExplanations[question._id]) {
      setSelectedExplanation(aiExplanations[question._id]);
    } else {
      const explanation = await fetchAIExplanation(studentQuizId, question._id);
      setSelectedExplanation(explanation);
    }

    setShowModal(true);
  };

  if (loading) {
    return <LoadingSpinner text="Loading results..." />;
  }

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-amber-600">Result not found</p>
          <button
            onClick={() => navigate("/student/dashboard")}
            className="btn-primary mt-4"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Get questions with answers from result
  const questionsWithAnswers =
    result.answers?.map((answer) => ({
      _id: answer.questionId?._id || answer.questionId,
      questionText: answer.questionId?.questionText || "Question",
      studentAnswer:
        answer.selectedOption || answer.selectedOptions?.join(", "),
      correctAnswer: answer.questionId?.options?.find((opt) => opt.isCorrect)
        ?.text,
      isCorrect: answer.isCorrect,
      marksObtained: answer.marksObtained,
      totalMarks: answer.questionId?.marks || 0,
    })) || [];

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <ResultCard
        result={result}
        quizTitle={currentQuiz?.title}
        onViewExplanations={() =>
          navigate(`/student/quiz/${studentQuizId}/explanations`)
        }
      />

      {/* Question Review Section */}
      {questionsWithAnswers.length > 0 && (
        <div className="mt-6">
          <h2 className="font-serif text-lg font-semibold text-stone-800 mb-4">
            Question Review
          </h2>
          <div className="space-y-3">
            {questionsWithAnswers.map((q, idx) => (
              <div
                key={q._id}
                className="bg-white rounded-xl border border-stone-200 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-mono text-stone-400">
                        Q{idx + 1}
                      </span>
                      <span
                        className={`badge text-xs ${q.isCorrect ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"}`}
                      >
                        {q.isCorrect
                          ? `${q.marksObtained}/${q.totalMarks} marks`
                          : `${q.marksObtained}/${q.totalMarks} marks`}
                      </span>
                    </div>
                    <p className="text-stone-800 font-medium mb-2">
                      {q.questionText}
                    </p>
                    <div className="text-sm space-y-1">
                      <p className="text-stone-600">
                        Your answer:{" "}
                        <span
                          className={
                            q.isCorrect ? "text-green-600" : "text-rose-600"
                          }
                        >
                          {q.studentAnswer || "Not answered"}
                        </span>
                      </p>
                      {!q.isCorrect && q.correctAnswer && (
                        <p className="text-green-600">
                          Correct: {q.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewExplanation(q)}
                    className="ml-4 px-3 py-1.5 text-sm text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                  >
                    🤖 Explain
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Explanation Modal */}
      <AIExplanationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedQuestion(null);
          setSelectedExplanation(null);
        }}
        question={selectedQuestion}
        explanation={selectedExplanation}
        loading={loadingExplanation}
        onFeedback={(helpful) => {
          // Submit feedback (you'd need to store explanation ID)
          console.log("Feedback:", helpful);
        }}
      />
    </div>
  );
};

export default QuizResult;
