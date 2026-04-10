import ProgressBar from "../student/ProgressBar";

const EnrolledStudentsTable = ({ students = [] }) => {
  if (!students.length) {
    return (
      <div className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-2xl p-5">
        No students are enrolled in this course yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-stone-200 rounded-2xl overflow-hidden bg-white">
        <thead className="bg-stone-50">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-stone-600">
              Student
            </th>
            <th className="text-left px-4 py-3 font-semibold text-stone-600">
              Email
            </th>
            <th className="text-left px-4 py-3 font-semibold text-stone-600">
              Progress
            </th>
            <th className="text-left px-4 py-3 font-semibold text-stone-600">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => {
            const isCompleted = s.completionStatus === "Completed";
            return (
              <tr key={s._id} className="border-t border-stone-100 hover:bg-stone-50">
                <td className="px-4 py-3 text-stone-900 font-semibold truncate max-w-[220px]">
                  {s.student?.name || "Unknown"}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {s.student?.email || "—"}
                </td>
                <td className="px-4 py-3" style={{ minWidth: 220 }}>
                  <ProgressBar value={s.progress ?? 0} />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${isCompleted ? "bg-green-100 text-green-700" : "bg-violet-100 text-violet-700"
                      }`}
                  >
                    {s.completionStatus || (isCompleted ? "Completed" : "In Progress")}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EnrolledStudentsTable;

