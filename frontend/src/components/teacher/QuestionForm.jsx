import { useState, useEffect } from "react";

const questionTypes = [
  { value: "mcq", label: "Multiple Choice" },
  { value: "true-false", label: "True / False" },
  { value: "multiple-answer", label: "Multiple Answer" },
];

const difficultyLevels = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const QuestionForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [form, setForm] = useState({
    questionText: "",
    questionType: "mcq",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
    marks: 10,
    negativeMarks: 0,
    explanation: "",
    difficultyLevel: "medium",
    orderIndex: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        options: initialData.options || [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};

    if (!form.questionText.trim()) {
      newErrors.questionText = "Question text is required";
    }

    if (form.questionType !== "true-false" && form.options.length < 2) {
      newErrors.options = "At least 2 options are required";
    }

    if (form.questionType === "true-false" && form.options.length !== 2) {
      newErrors.options = "True/False questions must have exactly 2 options";
    }

    const hasCorrectOption = form.options.some((opt) => opt.isCorrect);
    if (!hasCorrectOption) {
      newErrors.options = "At least one option must be marked as correct";
    }

    if (form.marks < 1 || form.marks > 100) {
      newErrors.marks = "Marks must be between 1 and 100";
    }

    if (form.negativeMarks < 0) {
      newErrors.negativeMarks = "Negative marks cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...form.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setForm({ ...form, options: newOptions });
  };

  const addOption = () => {
    setForm({
      ...form,
      options: [...form.options, { text: "", isCorrect: false }],
    });
  };

  const removeOption = (index) => {
    if (form.options.length <= 2) return;
    setForm({
      ...form,
      options: form.options.filter((_, i) => i !== index),
    });
  };

  const handleTypeChange = (type) => {
    let newOptions = form.options;
    if (type === "true-false") {
      newOptions = [
        { text: "True", isCorrect: false },
        { text: "False", isCorrect: false },
      ];
    }
    setForm({ ...form, questionType: type, options: newOptions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Question Text */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Question Text <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={4}
          value={form.questionText}
          onChange={(e) => setForm({ ...form, questionText: e.target.value })}
          className={`w-full px-4 py-3 border rounded-3xl focus:outline-none focus:border-blue-500 transition-colors resize-none text-zinc-900 placeholder:text-zinc-400 ${
            errors.questionText ? "border-rose-300" : "border-zinc-300"
          }`}
          placeholder="Enter your question here..."
        />
        {errors.questionText && (
          <p className="text-xs text-rose-500 mt-1.5">{errors.questionText}</p>
        )}
      </div>

      {/* Question Type */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-3">
          Question Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {questionTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handleTypeChange(type.value)}
              className={`p-4 rounded-2xl border-2 text-center transition-all font-medium ${
                form.questionType === type.value
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-zinc-200 hover:border-zinc-300 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              <span className="text-sm block">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-zinc-700">
            Options <span className="text-rose-500">*</span>
          </label>
          {form.questionType !== "true-false" && (
            <button
              type="button"
              onClick={addOption}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
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
              Add Option
            </button>
          )}
        </div>

        <div className="space-y-3">
          {form.options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input
                type={
                  form.questionType === "multiple-answer" ? "checkbox" : "radio"
                }
                checked={opt.isCorrect}
                onChange={(e) =>
                  updateOption(idx, "isCorrect", e.target.checked)
                }
                className="w-5 h-5 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
              />
              <input
                type="text"
                value={opt.text}
                onChange={(e) => updateOption(idx, "text", e.target.value)}
                className="flex-1 px-4 py-3 border border-zinc-300 rounded-2xl focus:outline-none focus:border-blue-500 text-sm text-zinc-900 placeholder:text-zinc-400"
                placeholder={`Option ${idx + 1}`}
                required
              />
              {form.questionType !== "true-false" &&
                form.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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
                        d="M6 18L18 6M6 6h12v12"
                      />
                    </svg>
                  </button>
                )}
            </div>
          ))}
        </div>

        {errors.options && (
          <p className="text-xs text-rose-500 mt-2">{errors.options}</p>
        )}

        <p className="text-xs text-zinc-500 mt-3">
          {form.questionType === "multiple-answer"
            ? "Check all correct answers"
            : "Select the correct answer"}
        </p>
      </div>

      {/* Marks & Negative Marks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Marks <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={form.marks}
            onChange={(e) =>
              setForm({ ...form, marks: parseInt(e.target.value) || 0 })
            }
            className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-blue-500 text-zinc-900 ${
              errors.marks ? "border-rose-300" : "border-zinc-300"
            }`}
          />
          {errors.marks && (
            <p className="text-xs text-rose-500 mt-1.5">{errors.marks}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Negative Marks
          </label>
          <input
            type="number"
            min="0"
            value={form.negativeMarks}
            onChange={(e) =>
              setForm({ ...form, negativeMarks: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-3 border border-zinc-300 rounded-2xl focus:outline-none focus:border-blue-500 text-zinc-900"
          />
          <p className="text-xs text-zinc-500 mt-1.5">
            Points deducted for incorrect answers
          </p>
        </div>
      </div>

      {/* Difficulty Level */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-3">
          Difficulty Level
        </label>
        <div className="flex gap-3">
          {difficultyLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setForm({ ...form, difficultyLevel: level.value })}
              className={`flex-1 py-3 rounded-2xl font-medium text-sm transition-all ${
                form.difficultyLevel === level.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Explanation (Optional)
        </label>
        <textarea
          rows={3}
          value={form.explanation}
          onChange={(e) => setForm({ ...form, explanation: e.target.value })}
          className="w-full px-4 py-3 border border-zinc-300 rounded-3xl focus:outline-none focus:border-blue-500 resize-none text-zinc-900 placeholder:text-zinc-400"
          placeholder="Provide an explanation for students to learn from..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3.5 border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-medium rounded-2xl transition-all hover:bg-zinc-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all active:scale-[0.985]"
        >
          {isEditing ? "Update Question" : "Add Question"}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;
