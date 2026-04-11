import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudentQuiz } from "../../hooks/useStudentQuiz";
import LoadingSpinner from "../../components/student/LoadingSpinner";
import QuestionNavigator from "../../components/student/QuestionNavigator";

const QuizExplanations = () => {
  const navigate = useNavigate();
  const { studentQuizId } = useParams();

  const {
    currentQuiz,
    result,
    aiExplanations,
    loadingExplanation,
    fetchQuizResult,
    fetchAllAIExplanations,
    fetchAIExplanation,
    submitExplanationFeedback,
  } = useStudentQuiz();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [localExplanationLoading, setLocalExplanationLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchQuizResult(studentQuizId);
      await fetchAllAIExplanations(studentQuizId);
      setLoading(false);
    };
    if (studentQuizId) {
      loadData();
    }
  }, [studentQuizId]);

  if (loading) {
    return <LoadingSpinner text="Loading explanations..." />;
  }

  if (!result || !result.answers) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8">
          <p className="text-amber-700">No results found for this quiz.</p>
          <button
            onClick={() => navigate("/student/dashboard")}
            className="mt-6 px-6 py-3 bg-zinc-900 hover:bg-black text-white font-medium rounded-2xl transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const questionsWithAnswers = result.answers.map((answer) => ({
    _id: answer.questionId?._id || answer.questionId,
    questionText: answer.questionId?.questionText || "Question",
    options: answer.questionId?.options || [],
    studentAnswer: answer.selectedOption || answer.selectedOptions?.join(", "),
    correctAnswer: answer.questionId?.options?.find((opt) => opt.isCorrect)?.text,
    isCorrect: answer.isCorrect,
    marksObtained: answer.marksObtained,
    totalMarks: answer.questionId?.marks || 0,
  }));

  const currentQuestion = questionsWithAnswers[currentQuestionIndex];
  const explanation = aiExplanations[currentQuestion?._id];

  const handleNext = () => {
    if (currentQuestionIndex < questionsWithAnswers.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFetchExplanation = async () => {
    if (currentQuestion) {
      setLocalExplanationLoading(true);
      await fetchAIExplanation(studentQuizId, currentQuestion._id);
      setLocalExplanationLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">
            {currentQuiz?.title || "Quiz"} - Explanations
          </h1>
          <button
            onClick={() => navigate(`/student/quiz/result/${studentQuizId}`)}
            className="text-sm text-blue-600 hover:text-blue-700 mt-1 inline-flex items-center gap-1 transition-colors"
          >
            ← Back to Results
          </button>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-zinc-900">
            Question {currentQuestionIndex + 1} of {questionsWithAnswers.length}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {currentQuestion && (
            <>
              {/* Question Card */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="px-4 py-1.5 bg-zinc-100 text-zinc-600 rounded-2xl text-xs font-semibold uppercase tracking-wider">
                    Question {currentQuestionIndex + 1}
                  </span>
                  <span
                    className={`px-4 py-1.5 rounded-2xl text-xs font-semibold uppercase tracking-wider ${currentQuestion.isCorrect
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                      }`}
                  >
                    {currentQuestion.isCorrect ? "Correct" : "Incorrect"} •
                    {currentQuestion.marksObtained}/{currentQuestion.totalMarks} marks
                  </span>
                </div>

                <h2 className="text-xl font-medium text-zinc-900 leading-relaxed mb-8">
                  {currentQuestion.questionText}
                </h2>

                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-zinc-500 mb-2">Your Answer</p>
                    <div
                      className={`p-5 rounded-2xl border ${currentQuestion.isCorrect
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : "bg-rose-50 border-rose-200 text-rose-800"
                        }`}
                    >
                      {currentQuestion.studentAnswer || "Not answered"}
                    </div>
                  </div>

                  {!currentQuestion.isCorrect && currentQuestion.correctAnswer && (
                    <div>
                      <p className="text-sm text-zinc-500 mb-2">Correct Answer</p>
                      <div className="p-5 rounded-2xl border bg-emerald-50 border-emerald-200 text-emerald-800">
                        {currentQuestion.correctAnswer}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Explanation Card */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2 2 2 0 01-2-2 2 2 0 012-2 2 2 0 01-2-2 2 2 0 012-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 text-lg">AI Explanation</h3>
                    <p className="text-sm text-zinc-500">Learn why your answer was correct or incorrect</p>
                  </div>
                </div>

                {loadingExplanation || localExplanationLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                    <p className="mt-4 text-zinc-500">Generating explanation...</p>
                  </div>
                ) : explanation ? (
                  <div className="prose prose-zinc max-w-none text-[15px] leading-relaxed">
                    {typeof explanation === 'string'
                      ? explanation.split('\n').map((para, i) => <p key={i}>{para}</p>)
                      : explanation.explanation?.split('\n').map((para, i) => <p key={i}>{para}</p>)
                    }
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-zinc-500 mb-6">No explanation available yet for this question.</p>
                    <button
                      onClick={handleFetchExplanation}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all"
                    >
                      Generate AI Explanation
                    </button>
                  </div>
                )}

                {/* Feedback */}
                {explanation && typeof explanation === 'object' && explanation._id && (
                  <div className="mt-8 pt-6 border-t border-zinc-100">
                    <p className="text-sm text-zinc-600 mb-3">Was this explanation helpful?</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => submitExplanationFeedback(explanation._id, true)}
                        className="flex-1 py-3 border border-emerald-200 hover:bg-emerald-50 text-emerald-700 rounded-2xl transition-all"
                      >
                        Yes, helpful
                      </button>
                      <button
                        onClick={() => submitExplanationFeedback(explanation._id, false)}
                        className="flex-1 py-3 border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-2xl transition-all"
                      >
                        Not helpful
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Question Navigator */}
        <div>
          <QuestionNavigator
            totalQuestions={questionsWithAnswers.length}
            currentIndex={currentQuestionIndex}
            answered={Array.from({ length: questionsWithAnswers.length }, () => true)}
            onSelect={setCurrentQuestionIndex}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizExplanations;