import { useEffect, useMemo, useState, useRef } from "react";

const normalizeInitial = (data) => {
  if (!data) {
    return {
      title: "",
      content: "",
      orderNumber: "",
      duration: "",
      videoUrl: "",
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
    videoUrl: data.videoUrl ?? "",
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
      videoUrl: "",
    }),
    []
  );

  const fileInputRef = useRef(null);
  const [form, setForm] = useState(() => ({
    ...empty,
    ...normalizeInitial(initialData),
  }));
  const [pdfFile, setPdfFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({ ...empty, ...normalizeInitial(initialData) });
    setPdfFile(null);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [empty, initialData]);

  const setField = (key, value) => {
    if (disabled) return;
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleFileChange = (e) => {
    if (disabled) return;
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({ ...prev, pdf: "Only PDF files are allowed." }));
        setPdfFile(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; // reset input cleanly
      } else {
        setPdfFile(file);
        setErrors((prev) => ({ ...prev, pdf: "" }));
      }
    } else {
      setPdfFile(null);
      setErrors((prev) => ({ ...prev, pdf: "" }));
    }
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

    // Additional PDF type safety prior to processing
    if (pdfFile && pdfFile.type !== "application/pdf") {
      next.pdf = "Strictly PDF files are permitted.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;
    if (!validate()) return;

    // Utilize FormData payload enabling strictly multi-part processing
    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("content", form.content.trim());
    fd.append("orderNumber", Number(form.orderNumber));
    
    if (form.duration !== "" && form.duration !== null && form.duration !== undefined) {
      fd.append("duration", Number(form.duration));
    }
    if (form.videoUrl?.trim()) {
      fd.append("videoUrl", form.videoUrl.trim());
    }
    
    // Append binary file
    if (pdfFile) {
      fd.append("pdf", pdfFile);
    }

    // Return fd precisely to onSubmit callback 
    onSubmit?.(fd);
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
        {errors.title && (
          <div className="text-xs text-rose-600 mt-1">{errors.title}</div>
        )}
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
        {errors.content && (
          <div className="text-xs text-rose-600 mt-1">{errors.content}</div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Lesson Materials (PDF) <span className="text-stone-400 font-normal">(Optional)</span>
        </label>
        {initialData?.pdf?.url && !pdfFile && (
          <div className="mb-3 p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm flex items-center gap-2 relative">
             <svg className="w-5 h-5 text-violet-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
             <div className="flex flex-col min-w-0">
               <span className="font-semibold text-stone-700 truncate">{initialData.pdf.originalFilename || "Existing PDF attachment"}</span>
               <a 
                 href={initialData.pdf.url} 
                 target="_blank" 
                 rel="noreferrer" 
                 className="text-violet-600 hover:text-violet-800 underline text-xs"
               >
                 Open current file
               </a>
             </div>
          </div>
        )}
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className={`${fieldClass} file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer`}
          disabled={disabled}
        />
        {initialData?.pdf?.url && (
            <p className="mt-1 text-xs text-stone-500">Choosing a new file will securely replace the current one.</p>
        )}
        {errors.pdf && (
          <div className="text-xs text-rose-600 mt-1">{errors.pdf}</div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Video URL <span className="text-stone-400 font-normal">(Optional)</span>
        </label>
        <input
          type="url"
          value={form.videoUrl}
          onChange={(e) => setField("videoUrl", e.target.value)}
          className={fieldClass}
          placeholder="e.g. https://youtube.com/watch?v=..."
          disabled={disabled}
        />
        {errors.videoUrl && (
          <div className="text-xs text-rose-600 mt-1">{errors.videoUrl}</div>
        )}
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
          {errors.orderNumber && (
            <div className="text-xs text-rose-600 mt-1">{errors.orderNumber}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Duration (minutes) <span className="text-stone-400 font-normal">(Optional)</span>
          </label>
          <input
            type="number"
            value={form.duration}
            onChange={(e) => setField("duration", e.target.value)}
            className={fieldClass}
            placeholder="0"
            min={0}
            disabled={disabled}
          />
          {errors.duration && (
            <div className="text-xs text-rose-600 mt-1">{errors.duration}</div>
          )}
        </div>
      </div>

      <div className="flex pt-2">
        <button
          type="submit"
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-all disabled:opacity-60 disabled:pointer-events-none"
        >
          {disabled ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Upload...
            </>
          ) : (
             submitLabel
          )}
        </button>
      </div>
    </form>
  );
};

export default LessonForm;
