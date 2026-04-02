import { useMemo, useState } from "react";

const levelOptions = ["Beginner", "Intermediate", "Advanced"];
const statusOptions = ["Active", "Inactive"];

const CourseForm = ({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  isSubmitting = false,
}) => {
  const empty = useMemo(
    () => ({
      title: "",
      description: "",
      category: "",
      level: "Beginner",
      duration: "",
      status: "Active",
    }),
    []
  );

  const [form, setForm] = useState({ ...empty, ...(initialValues || {}) });

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim() || undefined,
      level: form.level || undefined,
      duration:
        form.duration === "" || form.duration === null
          ? undefined
          : Number(form.duration),
      status: form.status,
    };

    onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Title
        </label>
        <input
          required
          value={form.title}
          onChange={(e) => setField("title", e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200"
          placeholder="Course title"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Description
        </label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200 resize-none"
          placeholder="Short description"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Category
          </label>
          <input
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200"
            placeholder="e.g. Gender Identity"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Level
          </label>
          <select
            value={form.level}
            onChange={(e) => setField("level", e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200"
          >
            {levelOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={form.duration}
            onChange={(e) => setField("duration", e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200"
            placeholder="e.g. 60"
            min={0}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => setField("status", e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl px-3 py-2 text-sm font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-xl px-3 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-60"
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;

