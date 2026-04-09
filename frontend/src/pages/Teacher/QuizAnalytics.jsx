import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLiveQuiz } from "../../hooks/useLiveQuiz";
import LoadingSpinner from "../../components/student/LoadingSpinner";

const QuizAnalytics = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const { quiz, results, loading, error, fetchResults } = useLiveQuiz(quizId);

  useEffect(() => {
    fetchResults();
  }, [quizId]);

  if (loading) return <LoadingSpinner text="Loading analytics..." />;

  // Calculate statistics
  const scores = results?.results?.map((r) => r.percentage) || [];
  const avgScore = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
  const median = [...scores].sort((a, b) => a - b)[
    Math.floor(scores.length / 2)
  ];
  const highest = Math.max(...scores, 0);
  const lowest = Math.min(...scores, 100);

  // Score distribution
  const distribution = {
    "90-100": scores.filter((s) => s >= 90).length,
    "80-89": scores.filter((s) => s >= 80 && s < 90).length,
    "70-79": scores.filter((s) => s >= 70 && s < 80).length,
    "60-69": scores.filter((s) => s >= 60 && s < 70).length,
    "50-59": scores.filter((s) => s >= 50 && s < 60).length,
    "0-49": scores.filter((s) => s < 50).length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(`/teacher/quiz/${quizId}/results`)}
          className="text-stone-500 hover:text-stone-700 text-sm flex items-center gap-1 mb-4"
        >
          ← Back to Results
        </button>
        <h1 className="font-serif text-2xl font-bold text-stone-900">
          {quiz?.title} - Analytics
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Detailed performance insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-xs text-stone-500">Average Score</p>
          <p className="text-2xl font-bold text-stone-900">
            {Math.round(avgScore)}%
          </p>
        </div>
        <div className="card">
          <p className="text-xs text-stone-500">Median Score</p>
          <p className="text-2xl font-bold text-stone-900">
            {Math.round(median)}%
          </p>
        </div>
        <div className="card">
          <p className="text-xs text-stone-500">Highest Score</p>
          <p className="text-2xl font-bold text-green-600">
            {Math.round(highest)}%
          </p>
        </div>
        <div className="card">
          <p className="text-xs text-stone-500">Lowest Score</p>
          <p className="text-2xl font-bold text-rose-600">
            {Math.round(lowest)}%
          </p>
        </div>
      </div>

      {/* Score Distribution */}
      <div className="card">
        <h3 className="font-semibold text-stone-800 mb-4">
          Score Distribution
        </h3>
        <div className="space-y-2">
          {Object.entries(distribution).map(([range, count]) => (
            <div key={range}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-stone-600">{range}%</span>
                <span className="text-stone-500">{count} students</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-600 rounded-full"
                  style={{ width: `${(count / scores.length) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizAnalytics;
