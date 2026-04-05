import { useEffect, useMemo, useState } from "react";

const levelOptions = ["Beginner", "Intermediate", "Advanced"];

const CourseForm = ({ initialData, onSubmit, submitLabel = "Save" }) => {
  const empty = useMemo(
    () => ({
      title: "",
      description: "",
      category: "",
      level: "Beginner",
      duration: "",
      image: null,
    }),
    []
  );

  const [form, setForm] = useState({ ...empty, ...(initialData || {}) });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({ ...empty, ...(initialData || {}) });
    setErrors({});
  }, [empty, initialData]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.title?.trim()) next.title = "Title is required.";
    if (!form.description?.trim()) next.description = "Description is required.";
    if (!form.category?.trim()) next.category = "Category is required.";
    if (!form.level) next.level = "Level is required.";

    const d = form.duration;
    if (d === "" || d === null || d === undefined) {
      next.duration = "Duration is required.";
    } else if (Number.isNaN(Number(d)) || Number(d) < 0) {
      next.duration = "Duration must be a valid number.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("description", form.description.trim());
    formData.append("category", form.category.trim());
    formData.append("level", form.level);
    formData.append("duration", Number(form.duration));
    
    if (form.image) {
      formData.append("image", form.image);
    }

    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Title
        </label>
        <input
          value={form.title}
          onChange={(e) => setField("title", e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200"
          placeholder="Course title"
        />
        {errors.title ? (
          <div className="text-xs text-rose-600 mt-1">{errors.title}</div>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Description
        </label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200 resize-none"
          placeholder="Short description"
        />
        {errors.description ? (
          <div className="text-xs text-rose-600 mt-1">{errors.description}</div>
        ) : null}
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
          {errors.category ? (
            <div className="text-xs text-rose-600 mt-1">{errors.category}</div>
          ) : null}
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
          {errors.level ? (
            <div className="text-xs text-rose-600 mt-1">{errors.level}</div>
          ) : null}
        </div>
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
          placeholder="e.g. 60"
          min={0}
        />
        {errors.duration ? (
          <div className="text-xs text-rose-600 mt-1">{errors.duration}</div>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Course Image (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setField("image", e.target.files[0])}
          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200"
        />
        {form.image && (
          <p className="text-xs text-stone-500 mt-1">
            Selected: {form.image.name}
          </p>
        )}
      </div>

      <div className="flex">
        <button
          type="submit"
          className="w-full rounded-xl px-3 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;

