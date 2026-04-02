import { useMemo } from "react";

const ProgressBar = ({ value = 0, label }) => {
  const safeValue = useMemo(() => {
    const n = Number(value);
    if (Number.isNaN(n)) return 0;
    return Math.min(100, Math.max(0, n));
  }, [value]);

  return (
    <div className="space-y-1">
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-600">{label}</span>
          <span className="font-semibold text-stone-800">{safeValue}%</span>
        </div>
      )}

      <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
        <div
          className="h-full bg-violet-600 rounded-full transition-all duration-300"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

