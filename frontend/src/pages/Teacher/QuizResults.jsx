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
    if (percentage >= 90) return { letter: "A+", color: "text-green-700" };
    if (percentage >= 80) return { letter: "A", color: "text-green-700" };
    if (percentage >= 70) return { letter: "B", color: "text-blue-700" };
    if (percentage >= 60) return { letter: "C", color: "text-amber-700" };
    if (percentage >= 50) return { letter: "D", color: "text-orange-700" };
    return { letter: "F", color: "text-rose-700" };
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
    a.download = `${quiz?.title}_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && !results) {
    return <LoadingSpinner text="Loading results..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="text-stone-500 hover:text-stone-700 text-sm flex items-center gap-1 mb-4"
        >
          ← Back to Dashboard
        </button>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-900">
              {quiz?.title} - Results
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              {results?.totalAttempts || 0} students completed this quiz
            </p>
          </div>
          <button
            onClick={exportResults}
            className="btn-primary flex items-center gap-2"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {results && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <p className="text-2xl font-bold text-stone-900">
              {results.totalAttempts}
            </p>
            <p className="text-xs text-stone-500 mt-1">Total Attempts</p>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <p className="text-2xl font-bold text-green-600">
              {results.passedCount}
            </p>
            <p className="text-xs text-stone-500 mt-1">Passed</p>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <p className="text-2xl font-bold text-rose-600">
              {results.failedCount}
            </p>
            <p className="text-xs text-stone-500 mt-1">Failed</p>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <p className="text-2xl font-bold text-violet-600">
              {Math.round(results.averageScore)}%
            </p>
            <p className="text-xs text-stone-500 mt-1">Average Score</p>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50">
                <th className="text-left px-4 py-3 font-semibold text-stone-600">
                  Student
                </th>
                <th className="text-left px-4 py-3 font-semibold text-stone-600">
                  Marks
                </th>
                <th className="text-left px-4 py-3 font-semibold text-stone-600">
                  Percentage
                </th>
                <th className="text-left px-4 py-3 font-semibold text-stone-600">
                  Grade
                </th>
                <th className="text-left px-4 py-3 font-semibold text-stone-600">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-semibold text-stone-600">
                  Completed
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedResults().map((result, idx) => {
                const grade = getGrade(result.percentage);
                return (
                  <tr
                    key={result._id}
                    className="border-b border-stone-100 hover:bg-stone-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-medium">
                          {result.studentId?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-stone-800">
                            {result.studentId?.name || "Anonymous"}
                          </p>
                          <p className="text-xs text-stone-400">
                            {result.studentId?.email || "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-stone-700">
                        {result.totalMarksObtained}/{result.totalMarksPossible}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">
                        {Math.round(result.percentage)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${grade.color}`}>
                        {grade.letter}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge text-xs ${result.isPassed ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"}`}
                      >
                        {result.isPassed ? "Passed" : "Failed"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-500">
                      {new Date(result.completedAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedResults().length === 0 && (
          <div className="text-center py-12 text-stone-400">
            No students have completed this quiz yet
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/teacher/quiz/${quizId}/edit`)}
          className="btn-outline flex-1"
        >
          ✏️ Edit Quiz
        </button>
        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="btn-primary flex-1"
        >
          🏠 Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default QuizResults;
