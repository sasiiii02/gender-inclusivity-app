import { FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const SupportCard = ({ article }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
            {article.category?.name || "General"}
          </span>
          {article.pdfUrl && (
            <div className="text-gray-400 group-hover:text-red-500 transition-colors" title="PDF format available">
              <FileText className="w-5 h-5" />
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
          {article.title}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
          {article.content}
        </p>
      </div>
      
      <div className="px-6 py-4 border-t border-gray-50 mt-auto bg-gray-50/50 group-hover:bg-purple-50/50 transition-colors">
        <Link 
          to={`/support/${article._id}`}
          className="inline-flex items-center text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors w-full justify-between"
        >
          Read More
          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default SupportCard;
