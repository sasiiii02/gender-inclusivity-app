const LoadingSpinner = ({ size = "md", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`animate-spin rounded-full border-2 border-zinc-200 border-b-blue-600 ${sizeClasses[size]}`}
      />
      {text && (
        <p className="mt-4 text-zinc-500 text-sm font-medium tracking-wide">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
