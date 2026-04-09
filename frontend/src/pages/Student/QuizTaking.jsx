import { useState, useEffect } from "react";
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
        console.log("Fetching questions for studentQuizId:", studentQuizId);
        await fetchQuizQuestions(studentQuizId);
        setInitLoading(false);
      }
    };
    loadQuestions();
  }, [studentQuizId]);

  // Debug logging
  useEffect(() => {
    console.log("Current state:", {
      loading,
      initLoading,
      questionsCount: questions?.length,
      currentQuestionIndex,
      timeRemaining,
      answers,
      currentQuiz,
    });
  }, [
    loading,
    initLoading,
    questions,
    currentQuestionIndex,
    timeRemaining,
    answers,
    currentQuiz,
  ]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSubmit = async (answerData) => {
    if (!currentQuestion) return;

    console.log(
      "Submitting answer for question:",
      currentQuestion._id,
      answerData,
    );
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
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinishQuiz = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    try {
      const result = await finishQuiz(studentQuizId);
      console.log("Quiz finished, result:", result);
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
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6">
          <p className="text-rose-600">⚠️ {error}</p>
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

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-amber-600">No questions found for this quiz.</p>
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

  if (!currentQuestion) {
    return <LoadingSpinner text="Loading question..." />;
  }

  // Build answered map for navigator (by index, not by question ID)
  const answeredMap = {};
  questions.forEach((q, idx) => {
    answeredMap[idx] = answers[q._id] || false;
  });

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6 sticky top-4 z-10 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-serif font-bold text-stone-900">
              {currentQuiz?.title || "Quiz"}
            </h1>
            <p className="text-xs text-stone-500">
              {currentQuiz?.subject || "General"} •{" "}
              {currentQuiz?.grade || "All"}
            </p>
          </div>
          <QuizTimer
            initialTime={timeRemaining}
            onTimeUp={handleTimeUp}
            isActive={true}
          />
          <div className="text-right">
            <p className="text-sm font-medium text-stone-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <p className="text-xs text-stone-500">
              {Object.keys(answers).length} answered
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Question Display */}
        <div className="lg:col-span-2">
          <QuestionDisplay
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
            isAnswered={answers[currentQuestion._id]}
            loading={submitting}
          />
        </div>

        {/* Right: Navigator */}
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-slide-up">
            <div className="p-6">
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                Finish Quiz?
              </h3>
              <p className="text-stone-500 text-sm mb-4">
                You have answered {Object.keys(answers).length} out of{" "}
                {questions.length} questions.
                {Object.keys(answers).length < questions.length &&
                  " You still have unanswered questions. Are you sure you want to submit?"}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinishQuiz}
                  className="btn-primary flex-1"
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTaking;
