import { useState, useEffect } from "react";

const QuestionDisplay = ({ question, onSubmit, isAnswered, loading }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  // Reset when question changes
  useEffect(() => {
    setSelectedOption(null);
    setSelectedOptions([]);
    setSubmitted(false);
  }, [question?._id]);

  const handleOptionSelect = (optionText) => {
    if (submitted || isAnswered) return;

    if (question.questionType === "multiple-answer") {
      setSelectedOptions((prev) =>
        prev.includes(optionText)
          ? prev.filter((opt) => opt !== optionText)
          : [...prev, optionText],
      );
    } else {
      setSelectedOption(optionText);
    }
  };

  const handleSubmit = () => {
    if (question.questionType === "multiple-answer") {
      if (selectedOptions.length === 0) {
        alert("Please select at least one answer");
        return;
      }
      onSubmit({ selectedOptions, timeSpent: 0 });
    } else {
      if (!selectedOption) {
        alert("Please select an answer");
        return;
      }
      onSubmit({ selectedOption, timeSpent: 0 });
    }
    setSubmitted(true);
  };

  const isSelected = (optionText) => {
    if (question.questionType === "multiple-answer") {
      return selectedOptions.includes(optionText);
    }
    return selectedOption === optionText;
  };

  if (!question) {
    return (
      <div className="bg-white border border-zinc-200 rounded-3xl p-8 text-center">
        <p className="text-zinc-500">Loading question...</p>
      </div>
    );
  }

  const getQuestionTypeLabel = () => {
    switch (question.questionType) {
      case "mcq":
        return "Select one correct answer";
      case "true-false":
        return "Choose True or False";
      case "multiple-answer":
        return "Select all that apply";
      default:
        return "Select your answer";
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-8">
      {/* Question Header */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-100">
        <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-2xl flex-shrink-0">
          ?
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="inline-flex items-center px-4 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
              {question.marks} marks
            </span>
            {question.negativeMarks > 0 && (
              <span className="inline-flex items-center px-4 py-1 text-xs font-medium bg-rose-50 text-rose-700 rounded-2xl border border-rose-100">
                -{question.negativeMarks} marks
              </span>
            )}
            <span className="inline-flex items-center px-4 py-1 text-xs font-medium bg-zinc-100 text-zinc-600 rounded-2xl border border-zinc-200 capitalize">
              {question.questionType?.replace("-", " ")}
            </span>
          </div>
          <p className="text-sm text-zinc-500">{getQuestionTypeLabel()}</p>
        </div>
      </div>

      {/* Question Text */}
      <h2 className="text-xl font-semibold text-zinc-900 leading-relaxed mb-8">
        {question.questionText}
      </h2>

      {/* Image if present */}
      {question.imageUrl && (
        <div className="mb-8">
          <img
            src={question.imageUrl}
            alt="Question illustration"
            className="max-w-full rounded-2xl border border-zinc-200"
          />
        </div>
      )}

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options?.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionSelect(option.text)}
            disabled={submitted || isAnswered || loading}
            className={`
              w-full text-left p-5 rounded-2xl border-2 transition-all duration-200
              ${
                isSelected(option.text)
                  ? "border-blue-600 bg-blue-50"
                  : "border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50"
              }
              ${submitted || isAnswered ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <div className="flex items-start gap-4">
              <div
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-colors
                  ${
                    isSelected(option.text)
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-zinc-300 bg-white"
                  }
                `}
              >
                {question.questionType === "multiple-answer" ? (
                  isSelected(option.text) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={4}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : null
                ) : isSelected(option.text) ? (
                  <div className="w-3 h-3 bg-white rounded-full" />
                ) : null}
              </div>
              <span className="text-zinc-800 text-[15px] leading-relaxed pt-0.5">
                {option.text}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Submit Button */}
      {!submitted && !isAnswered && (
        <button
          onClick={handleSubmit}
          disabled={
            loading ||
            (question.questionType === "multiple-answer"
              ? selectedOptions.length === 0
              : !selectedOption)
          }
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 text-white font-medium rounded-2xl transition-all active:scale-[0.985]"
        >
          {loading ? "Saving Answer..." : "Submit Answer"}
        </button>
      )}

      {/* Answer Saved Indicator */}
      {(submitted || isAnswered) && (
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
          <span className="text-emerald-700 font-medium flex items-center justify-center gap-2">
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
            Answer Saved
          </span>
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
