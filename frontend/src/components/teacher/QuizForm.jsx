import { useState } from "react";

const QuizForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    subject: initialData?.subject || "",
    grade: initialData?.grade || "",
    passcode: initialData?.passcode || "",
    duration: initialData?.duration || 30,
    passMarks: initialData?.passMarks || 40,
    settings: {
      shuffleQuestions: initialData?.settings?.shuffleQuestions || false,
      showResultsImmediately:
        initialData?.settings?.showResultsImmediately !== false,
      allowReview: initialData?.settings?.allowReview || false,
      maxAttempts: initialData?.settings?.maxAttempts || 1,
    },
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Quiz title is required";
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.grade.trim()) newErrors.grade = "Grade/Class is required";
    if (!form.passcode.trim()) newErrors.passcode = "Passcode is required";
    if (form.passcode.length < 4)
      newErrors.passcode = "Passcode must be at least 4 characters";
    if (form.duration < 1 || form.duration > 180)
      newErrors.duration = "Duration must be between 1 and 180 minutes";
    if (form.passMarks < 0 || form.passMarks > 100)
      newErrors.passMarks = "Pass marks must be between 0 and 100";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Quiz Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-zinc-900 placeholder:text-zinc-400 ${
              errors.title
                ? "border-rose-300 focus:border-rose-500"
                : "border-zinc-300"
            }`}
            placeholder="e.g., Mathematics Quiz - Chapter 1"
          />
          {errors.title && (
            <p className="text-xs text-rose-500 mt-1.5">{errors.title}</p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Subject <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-zinc-900 placeholder:text-zinc-400 ${
              errors.subject
                ? "border-rose-300 focus:border-rose-500"
                : "border-zinc-300"
            }`}
            placeholder="e.g., Mathematics, Science, English"
          />
          {errors.subject && (
            <p className="text-xs text-rose-500 mt-1.5">{errors.subject}</p>
          )}
        </div>

        {/* Grade */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Grade/Class <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
            className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-zinc-900 placeholder:text-zinc-400 ${
              errors.grade
                ? "border-rose-300 focus:border-rose-500"
                : "border-zinc-300"
            }`}
            placeholder="e.g., Grade 10, Class 8"
          />
          {errors.grade && (
            <p className="text-xs text-rose-500 mt-1.5">{errors.grade}</p>
          )}
        </div>

        {/* Passcode */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Quiz Passcode <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={form.passcode}
            onChange={(e) =>
              setForm({ ...form, passcode: e.target.value.toUpperCase() })
            }
            className={`w-full px-4 py-3 border font-mono rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-zinc-900 placeholder:text-zinc-400 ${
              errors.passcode
                ? "border-rose-300 focus:border-rose-500"
                : "border-zinc-300"
            }`}
            placeholder="e.g., MATH123"
            maxLength={10}
          />
          {errors.passcode && (
            <p className="text-xs text-rose-500 mt-1.5">{errors.passcode}</p>
          )}
          <p className="text-xs text-zinc-500 mt-1.5">
            Students will need this passcode to join the quiz
          </p>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Duration (minutes) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="180"
            value={form.duration}
            onChange={(e) =>
              setForm({ ...form, duration: parseInt(e.target.value) || 30 })
            }
            className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-zinc-900 placeholder:text-zinc-400 ${
              errors.duration
                ? "border-rose-300 focus:border-rose-500"
                : "border-zinc-300"
            }`}
          />
          {errors.duration && (
            <p className="text-xs text-rose-500 mt-1.5">{errors.duration}</p>
          )}
        </div>

        {/* Pass Marks */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Pass Marks (%) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={form.passMarks}
            onChange={(e) =>
              setForm({ ...form, passMarks: parseInt(e.target.value) || 40 })
            }
            className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-zinc-900 placeholder:text-zinc-400 ${
              errors.passMarks
                ? "border-rose-300 focus:border-rose-500"
                : "border-zinc-300"
            }`}
          />
          {errors.passMarks && (
            <p className="text-xs text-rose-500 mt-1.5">{errors.passMarks}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Description
        </label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-4 py-3 border border-zinc-300 rounded-3xl focus:outline-none focus:border-blue-500 transition-colors resize-none text-zinc-900 placeholder:text-zinc-400"
          placeholder="Describe what this quiz covers..."
        />
      </div>

      {/* Settings */}
      <div className="border-t border-zinc-200 pt-8">
        <h3 className="text-lg font-semibold text-zinc-900 mb-6">
          Quiz Settings
        </h3>

        <div className="space-y-5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.settings.shuffleQuestions}
              onChange={(e) =>
                setForm({
                  ...form,
                  settings: {
                    ...form.settings,
                    shuffleQuestions: e.target.checked,
                  },
                })
              }
              className="w-5 h-5 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-zinc-700">
              Shuffle question order
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.settings.showResultsImmediately}
              onChange={(e) =>
                setForm({
                  ...form,
                  settings: {
                    ...form.settings,
                    showResultsImmediately: e.target.checked,
                  },
                })
              }
              className="w-5 h-5 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-zinc-700">
              Show results immediately after completion
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.settings.allowReview}
              onChange={(e) =>
                setForm({
                  ...form,
                  settings: { ...form.settings, allowReview: e.target.checked },
                })
              }
              className="w-5 h-5 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-zinc-700">
              Allow students to review their answers
            </span>
          </label>

          <div className="flex items-center gap-4 pt-2">
            <label className="text-sm font-medium text-zinc-700 whitespace-nowrap">
              Maximum attempts:
            </label>
            <select
              value={form.settings.maxAttempts}
              onChange={(e) =>
                setForm({
                  ...form,
                  settings: {
                    ...form.settings,
                    maxAttempts: parseInt(e.target.value),
                  },
                })
              }
              className="px-4 py-3 border border-zinc-300 rounded-2xl focus:outline-none focus:border-blue-500 bg-white text-zinc-900 w-28"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
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
          {isEditing ? "Save Changes" : "Create Quiz"}
        </button>
      </div>
    </form>
  );
};

export default QuizForm;
