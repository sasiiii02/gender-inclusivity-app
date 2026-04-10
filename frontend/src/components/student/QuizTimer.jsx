import { useState, useEffect } from "react";

const QuizTimer = ({ initialTime, onTimeUp, isActive = true }) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeRemaining, onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getColorClass = () => {
    if (timeRemaining < 60) return "text-rose-600";
    if (timeRemaining < 300) return "text-amber-600";
    return "text-zinc-700";
  };

  return (
    <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-zinc-200 shadow-sm">
      <div className="text-blue-600">
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

      <span
        className={`font-mono font-semibold text-xl tracking-tighter ${getColorClass()}`}
      >
        {formatTime(timeRemaining)}
      </span>
    </div>
  );
};

export default QuizTimer;
