const LessonTable = ({
  lessons = [],
  onEdit,
  onDelete,
  deletingId = null,
}) => {
  if (!lessons.length) {
    return (
      <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-2xl p-5">
        No lessons found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-stone-200 rounded-2xl overflow-hidden bg-white">
        <thead className="bg-stone-50">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-stone-600">
              Order
            </th>
            <th className="text-left px-4 py-3 font-semibold text-stone-600">
              Title
            </th>
            <th className="text-left px-4 py-3 font-semibold text-stone-600">
              Duration
            </th>
            <th className="text-left px-4 py-3 font-semibold text-stone-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((l) => (
            <tr key={l._id} className="border-t border-stone-100 hover:bg-stone-50">
              <td className="px-4 py-3 text-stone-600">{l.orderNumber}</td>
              <td className="px-4 py-3">
                <div className="font-semibold text-stone-900 truncate max-w-[340px]">
                  {l.title}
                </div>
              </td>
              <td className="px-4 py-3 text-stone-600">
                {typeof l.duration === "number" ? `${l.duration} min` : "—"}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit?.(l)}
                    className="text-xs font-semibold bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl px-3 py-2 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === l._id}
                    onClick={() => onDelete?.(l._id)}
                    className="text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl px-3 py-2 transition-colors disabled:opacity-60"
                  >
                    {deletingId === l._id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LessonTable;

