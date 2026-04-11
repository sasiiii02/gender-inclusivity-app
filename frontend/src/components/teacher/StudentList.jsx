import { useState } from "react";

const StudentList = ({ students }) => {
  const [search, setSearch] = useState("");

  if (!students || students.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400">
        No students have joined yet
      </div>
    );
  }

  const filtered = students.filter((s) =>
    s.studentId?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "active":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "disconnected":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 py-3 border border-zinc-300 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-zinc-900 placeholder:text-zinc-400"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Student List */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {filtered.map((student, idx) => (
          <div
            key={student.studentId?._id || idx}
            className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-2xl hover:border-zinc-300 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-2xl bg-zinc-100 text-zinc-700 flex items-center justify-center font-semibold text-base">
                {student.studentId?.name?.charAt(0) || "?"}
              </div>
              <div>
                <p className="font-medium text-zinc-900">
                  {student.studentId?.name || "Anonymous Student"}
                </p>
                <p className="text-xs text-zinc-500">
                  Joined{" "}
                  {new Date(student.joinedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div
              className={`px-4 py-1.5 text-xs font-medium rounded-2xl border capitalize ${getStatusColor(student.status)}`}
            >
              {student.status}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Count */}
      <div className="text-center text-xs text-zinc-500 pt-2">
        Showing {filtered.length} of {students.length} students
      </div>
    </div>
  );
};

export default StudentList;
