const ProgressBar = ({ value }) => {
  const n = Number(value);
  const safeValue = Number.isNaN(n) ? 0 : Math.min(100, Math.max(0, n));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-end text-xs">
        <span className="font-semibold text-stone-800">{safeValue}%</span>
      </div>

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

