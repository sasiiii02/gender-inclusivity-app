const CategoryChip = ({ category, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
        isSelected
          ? "bg-purple-600 text-white shadow-md shadow-purple-200"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-transparent"
      }`}
    >
      {category}
    </button>
  );
};

export default CategoryChip;
