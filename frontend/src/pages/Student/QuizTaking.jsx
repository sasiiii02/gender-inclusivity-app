import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudentQuiz } from "../../hooks/useStudentQuiz";
import QuizTimer from "../../components/student/QuizTimer";
import QuestionDisplay from "../../components/student/QuestionDisplay";
import QuestionNavigator from "../../components/student/QuestionNavigator";
import LoadingSpinner from "../../components/student/LoadingSpinner";

const QuizTaking = () => {
  const navigate = useNavigate();
  const { studentQuizId } = useParams();

  const {
    currentQuiz,
    questions,
    currentQuestionIndex,
    answers,
    timeRemaining,
    loading,
    error,
    fetchQuizQuestions,
    submitCurrentAnswer,
    finishQuiz,
    setCurrentQuestionIndex,
  } = useStudentQuiz();

  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      if (studentQuizId) {
        setInitLoading(true);
        await fetchQuizQuestions(studentQuizId);
        setInitLoading(false);
      }
    };
    loadQuestions();
  }, [studentQuizId]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSubmit = async (answerData) => {
    if (!currentQuestion) return;

    setSubmitting(true);
    try {
      await submitCurrentAnswer(studentQuizId, currentQuestion._id, answerData);
      if (isLastQuestion) {
        setShowConfirm(true);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } catch (err) {
      console.error("Submit error:", err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinishQuiz = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    try {
      const result = await finishQuiz(studentQuizId);
      navigate(`/student/quiz/result/${studentQuizId}`, { state: { result } });
    } catch (err) {
      console.error("Finish error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    alert("Time's up! Your quiz will be submitted automatically.");
    finishQuiz(studentQuizId).then(() => {
      navigate(`/student/quiz/result/${studentQuizId}`);
    });
  };

  if (initLoading || (loading && questions.length === 0)) {
    return <LoadingSpinner text="Loading quiz questions..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8">
          <div className="text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 01-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-700">{error}</p>
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

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8">
          <p className="text-amber-700">No questions found for this quiz.</p>
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

  if (!currentQuestion) {
    return <LoadingSpinner text="Loading question..." />;
  }

  // Build answered map for navigator
  const answeredMap = {};
  questions.forEach((q, idx) => {
    answeredMap[idx] = !!answers[q._id];
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-5 mb-6 sticky top-4 z-10 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
              {currentQuiz?.title || "Live Quiz"}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {currentQuiz?.subject} • {currentQuiz?.grade}
            </p>
          </div>

          <QuizTimer
            initialTime={timeRemaining}
            onTimeUp={handleTimeUp}
            isActive={true}
          />

          <div className="text-right">
            <p className="text-sm font-medium text-zinc-900">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <p className="text-xs text-zinc-500">
              {Object.keys(answers).length} answered
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Question Area */}
        <div className="lg:col-span-2">
          <QuestionDisplay
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
            isAnswered={!!answers[currentQuestion._id]}
            loading={submitting}
          />
        </div>

        {/* Navigator */}
        <div>
          <QuestionNavigator
            totalQuestions={questions.length}
            currentIndex={currentQuestionIndex}
            answered={answeredMap}
            onSelect={setCurrentQuestionIndex}
            onNext={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            onPrevious={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          />
        </div>
      </div>

      {/* Confirm Finish Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="p-8">
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                Finish Quiz?
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                You have answered {Object.keys(answers).length} out of{" "}
                {questions.length} questions.
                {Object.keys(answers).length < questions.length &&
                  " Some questions are still unanswered."}
              </p>
              <p className="text-sm text-zinc-500 mt-4">
                Are you sure you want to submit your answers?
              </p>
            </div>

            <div className="flex gap-3 px-8 pb-8">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3.5 border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-medium rounded-2xl transition-all hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={handleFinishQuiz}
                className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTaking;