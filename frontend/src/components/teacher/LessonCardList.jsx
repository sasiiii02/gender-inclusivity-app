const previewText = (content, maxLen = 140) => {
  if (!content || typeof content !== "string") return "—";
  const plain = content.replace(/\s+/g, " ").trim();
  if (!plain) return "—";
  return plain.length <= maxLen ? plain : `${plain.slice(0, maxLen)}…`;
};

const LessonCardList = ({ lessons = [], onEdit, onDelete, deletingId = null }) => {
  if (!lessons.length) return null;

  return (
    <ul className="space-y-3">
      {lessons.map((l, idx) => {
        const order = l.orderNumber ?? idx + 1;
        return (
          <li
            key={l._id}
            className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-stone-200 bg-white px-4 py-4 shadow-sm"
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700"
                aria-hidden
              >
                {order}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif font-bold text-stone-900 truncate">{l.title}</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Order: {order}
                  {typeof l.duration === "number" ? ` • ${l.duration} min` : ""}
                  <span className="text-stone-400"> • </span>
                  <span className="text-stone-600">{previewText(l.content)}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0 sm:ml-auto">
              <button
                type="button"
                onClick={() => onEdit?.(l)}
                className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-50 transition-colors"
              >
                Edit
              </button>
              <button
                type="button"
                disabled={deletingId === l._id}
                onClick={() => onDelete?.(l)}
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors disabled:opacity-60"
              >
                {deletingId === l._id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default LessonCardList;
