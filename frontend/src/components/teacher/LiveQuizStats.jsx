const LiveQuizStats = ({ stats }) => {
  if (!stats) return null;

  const attendanceRate =
    stats.totalAttendance > 0
      ? Math.round((stats.completedCount / stats.totalAttendance) * 100)
      : 0;

  const inProgress = (stats.totalAttendance || 0) - (stats.completedCount || 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Students Joined */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
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
                d="M17 20h5v-2a3 3 0 01-5.356-1.857M17 20H7m5-2v-2c0-.656-.126-1.284-.356-1.852M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.284.356-1.852"
              />
            </svg>
          </div>
          <span className="text-xs font-medium text-zinc-500">LIVE</span>
        </div>
        <p className="text-3xl font-semibold text-zinc-900">
          {stats.totalAttendance || 0}
        </p>
        <p className="text-sm text-zinc-500 mt-1">Students Joined</p>
      </div>

      {/* Completed */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
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
                d="M5 10l7-7m0 0l7 7"
              />
            </svg>
          </div>
        </div>
        <p className="text-3xl font-semibold text-emerald-600">
          {stats.completedCount || 0}
        </p>
        <p className="text-sm text-zinc-500 mt-1">Completed</p>
      </div>

      {/* In Progress */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
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
                d="M12 8v4l3 3m6-3a9 9 0 01-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <p className="text-3xl font-semibold text-amber-600">{inProgress}</p>
        <p className="text-sm text-zinc-500 mt-1">In Progress</p>
      </div>

      {/* Completion Rate */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
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
                d="M13 7h8m0 0v8m0-8l-9 9-4-4-6 6"
              />
            </svg>
          </div>
        </div>
        <p className="text-3xl font-semibold text-blue-600">
          {attendanceRate}%
        </p>
        <p className="text-sm text-zinc-500 mt-1">Completion Rate</p>
      </div>
    </div>
  );
};

export default LiveQuizStats;
