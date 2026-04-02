import { useMemo, useState } from "react";

const LessonForm = ({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Add Lesson",
  isSubmitting = false,
}) => {
  const empty = useMemo(
    () => ({
      title: "",
      content: "",
      orderNumber: "",
      duration: "",
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
      content: form.content.trim(),
      orderNumber: form.orderNumber === "" ? undefined : Number(form.orderNumber),
      duration:
        form.duration === "" || form.duration === null
          ? undefined
          : Number(form.duration),
    };

    onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Lesson title
        </label>
        <input
          required
          value={form.title}
          onChange={(e) => setField("title", e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200"
          placeholder="e.g. Understanding Identities"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Content
        </label>
        <textarea
          required
          rows={6}
          value={form.content}
          onChange={(e) => setField("content", e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200 resize-none"
          placeholder="Write lesson content…"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Order number
          </label>
          <input
            type="number"
            required
            value={form.orderNumber}
            onChange={(e) => setField("orderNumber", e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200"
            placeholder="e.g. 1"
            min={1}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={form.duration}
            onChange={(e) => setField("duration", e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200"
            placeholder="Optional"
            min={0}
          />
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

export default LessonForm;

