import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLiveQuiz } from "../../hooks/useLiveQuiz";
import LoadingSpinner from "../../components/student/LoadingSpinner";

const QuizResults = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const { quiz, results, loading, error, fetchResults } = useLiveQuiz(quizId);
  const [sortBy, setSortBy] = useState("percentage");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchResults();
  }, [quizId]);

  const sortedResults = () => {
    if (!results?.results) return [];

    return [...results.results].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "studentId") {
        aVal = a.studentId?.name || "";
        bVal = b.studentId?.name || "";
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  };

  const getGrade = (percentage) => {
    if (percentage >= 90)
      return { letter: "A+", color: "text-emerald-700", bg: "bg-emerald-100" };
    if (percentage >= 80)
      return { letter: "A", color: "text-emerald-700", bg: "bg-emerald-100" };
    if (percentage >= 70)
      return { letter: "B", color: "text-blue-700", bg: "bg-blue-100" };
    if (percentage >= 60)
      return { letter: "C", color: "text-amber-700", bg: "bg-amber-100" };
    if (percentage >= 50)
      return { letter: "D", color: "text-orange-700", bg: "bg-orange-100" };
    return { letter: "F", color: "text-rose-700", bg: "bg-rose-100" };
  };

  const exportResults = () => {
    const csvData = sortedResults().map((s) => ({
      Name: s.studentId?.name || "Anonymous",
      Email: s.studentId?.email || "-",
      "Marks Obtained": s.totalMarksObtained,
      "Total Marks": s.totalMarksPossible,
      Percentage: s.percentage,
      "Pass/Fail": s.isPassed ? "Pass" : "Fail",
      "Completed At": new Date(s.completedAt).toLocaleString(),
    }));

    const headers = Object.keys(csvData[0]);
    const csvRows = [
      headers.join(","),
      ...csvData.map((row) =>
        headers.map((header) => JSON.stringify(row[header] || "")).join(","),
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${quiz?.title || "quiz"}_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && !results) {
    return <LoadingSpinner text="Loading results..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-700 text-sm font-medium mb-6 transition-colors"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">
              {quiz?.title} - Results
            </h1>
            <p className="text-zinc-500 mt-1">
              {results?.totalAttempts || 0} students completed this quiz
            </p>
          </div>

          <button
            onClick={exportResults}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-black text-white font-medium rounded-2xl transition-all active:scale-[0.985]"
          >
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
                d="M4 16v-4m0 0l4 4m-4-4l4-4m12 4v4m0 0l-4-4m4 4l-4 4"
              />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {results && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6">
            <p className="text-3xl font-semibold text-zinc-900">
              {results.totalAttempts || 0}
            </p>
            <p className="text-sm text-zinc-500 mt-1">Total Attempts</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-3xl p-6">
            <p className="text-3xl font-semibold text-emerald-600">
              {results.passedCount || 0}
            </p>
            <p className="text-sm text-zinc-500 mt-1">Passed</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-3xl p-6">
            <p className="text-3xl font-semibold text-rose-600">
              {results.failedCount || 0}
            </p>
            <p className="text-sm text-zinc-500 mt-1">Failed</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-3xl p-6">
            <p className="text-3xl font-semibold text-blue-600">
              {Math.round(results.averageScore || 0)}%
            </p>
            <p className="text-sm text-zinc-500 mt-1">Average Score</p>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-6 py-4 font-medium text-zinc-600">
                  Student
                </th>
                <th className="text-left px-6 py-4 font-medium text-zinc-600">
                  Marks
                </th>
                <th className="text-left px-6 py-4 font-medium text-zinc-600">
                  Percentage
                </th>
                <th className="text-left px-6 py-4 font-medium text-zinc-600">
                  Grade
                </th>
                <th className="text-left px-6 py-4 font-medium text-zinc-600">
                  Status
                </th>
                <th className="text-left px-6 py-4 font-medium text-zinc-600">
                  Completed
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedResults().map((result) => {
                const grade = getGrade(result.percentage);
                return (
                  <tr
                    key={result._id}
                    className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-zinc-100 flex items-center justify-center font-medium text-zinc-700">
                          {result.studentId?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900">
                            {result.studentId?.name || "Anonymous"}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {result.studentId?.email || "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-zinc-900">
                        {result.totalMarksObtained} /{" "}
                        {result.totalMarksPossible}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-zinc-900">
                        {Math.round(result.percentage)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${grade.color}`}>
                        {grade.letter}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-4 py-1 text-xs font-medium rounded-2xl ${
                          result.isPassed
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {result.isPassed ? "Passed" : "Failed"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {new Date(result.completedAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedResults().length === 0 && (
          <div className="text-center py-16 text-zinc-400">
            No students have completed this quiz yet
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/teacher/quiz/${quizId}/edit`)}
          className="flex-1 py-4 border border-zinc-300 hover:border-zinc-400 text-zinc-700 font-medium rounded-2xl transition-all hover:bg-zinc-50"
        >
          Edit Quiz
        </button>
        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="flex-1 py-4 bg-zinc-900 hover:bg-black text-white font-medium rounded-2xl transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default QuizResults;
