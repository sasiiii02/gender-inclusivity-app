import { useEffect, useMemo, useState } from "react";

const normalizeInitial = (data) => {
  if (!data) {
    return {
      title: "",
      content: "",
      orderNumber: "",
      duration: "",
    };
  }
  return {
    title: data.title ?? "",
    content: data.content ?? "",
    orderNumber:
      data.orderNumber !== null && data.orderNumber !== undefined && data.orderNumber !== ""
        ? String(data.orderNumber)
        : "",
    duration:
      data.duration !== null && data.duration !== undefined && data.duration !== ""
        ? String(data.duration)
        : "",
  };
};

const LessonForm = ({
  initialData,
  onSubmit,
  submitLabel = "Save Lesson",
  disabled = false,
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

  const [form, setForm] = useState(() => ({
    ...empty,
    ...normalizeInitial(initialData),
  }));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({ ...empty, ...normalizeInitial(initialData) });
    setErrors({});
  }, [empty, initialData]);

  const setField = (key, value) => {
    if (disabled) return;
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.title?.trim()) next.title = "Title is required.";
    if (!form.content?.trim()) next.content = "Content is required.";

    const order = Number(form.orderNumber);
    if (form.orderNumber === "" || form.orderNumber === null || form.orderNumber === undefined) {
      next.orderNumber = "Order number is required.";
    } else if (Number.isNaN(order) || order < 1) {
      next.orderNumber = "Order number must be 1 or greater.";
    }

    if (form.duration !== "" && form.duration !== null && form.duration !== undefined) {
      const d = Number(form.duration);
      if (Number.isNaN(d) || d < 0) next.duration = "Duration must be a valid number.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;
    if (!validate()) return;

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      orderNumber: Number(form.orderNumber),
      duration:
        form.duration === "" || form.duration === null || form.duration === undefined
          ? undefined
          : Number(form.duration),
    };

    onSubmit?.(payload);
  };

  const fieldClass =
    "w-full rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200 disabled:bg-stone-100 disabled:text-stone-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Lesson title
        </label>
        <input
          value={form.title}
          onChange={(e) => setField("title", e.target.value)}
          className={fieldClass}
          placeholder="e.g. Understanding identities"
          disabled={disabled}
        />
        {errors.title ? (
          <div className="text-xs text-rose-600 mt-1">{errors.title}</div>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Content
        </label>
        <textarea
          rows={6}
          value={form.content}
          onChange={(e) => setField("content", e.target.value)}
          className={`${fieldClass} resize-none`}
          placeholder="Write lesson content…"
          disabled={disabled}
        />
        {errors.content ? (
          <div className="text-xs text-rose-600 mt-1">{errors.content}</div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Order number
          </label>
          <input
            type="number"
            value={form.orderNumber}
            onChange={(e) => setField("orderNumber", e.target.value)}
            className={fieldClass}
            placeholder="e.g. 1"
            min={1}
            disabled={disabled}
          />
          {errors.orderNumber ? (
            <div className="text-xs text-rose-600 mt-1">{errors.orderNumber}</div>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={form.duration}
            onChange={(e) => setField("duration", e.target.value)}
            className={fieldClass}
            placeholder="Optional"
            min={0}
            disabled={disabled}
          />
          {errors.duration ? (
            <div className="text-xs text-rose-600 mt-1">{errors.duration}</div>
          ) : null}
        </div>
      </div>

      <div className="flex">
        <button
          type="submit"
          disabled={disabled}
          className="w-full rounded-xl px-3 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-60 disabled:pointer-events-none"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default LessonForm;
