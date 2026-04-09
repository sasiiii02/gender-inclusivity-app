import { useState } from "react";

const StudentList = ({ students }) => {
  const [search, setSearch] = useState("");

  if (!students || students.length === 0) {
    return (
      <div className="text-center py-8 text-stone-400">
        No students have joined yet
      </div>
    );
  }

  const filtered = students.filter((s) =>
    s.studentId?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✅";
      case "active":
        return "🟢";
      case "disconnected":
        return "🔴";
      default:
        return "⏳";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "active":
        return "text-blue-600 bg-blue-50";
      case "disconnected":
        return "text-rose-600 bg-rose-50";
      default:
        return "text-amber-600 bg-amber-50";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
          🔍
        </span>
      </div>

      {/* Student List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filtered.map((student, idx) => (
          <div
            key={student.studentId?._id || idx}
            className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-medium text-sm">
                {student.studentId?.name?.charAt(0) || "?"}
              </div>
              <div>
                <p className="font-medium text-stone-800 text-sm">
                  {student.studentId?.name || "Anonymous"}
                </p>
                <p className="text-xs text-stone-400">
                  Joined: {new Date(student.joinedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <span className={`badge text-xs ${getStatusColor(student.status)}`}>
              {getStatusIcon(student.status)} {student.status}
            </span>
          </div>
        ))}
      </div>

      <div className="text-xs text-stone-400 text-center pt-2">
        {filtered.length} of {students.length} students
      </div>
    </div>
  );
};

export default StudentList;
