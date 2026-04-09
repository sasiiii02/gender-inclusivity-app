import { Calendar, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import ReportStatusBadge from "./ReportStatusBadge";

const ReportCard = ({ report }) => {
  const dateStr = new Date(report.incidentDate).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3 border-b border-gray-50 pb-3">
          <div className="flex-1 pr-3">
            <h3 className="font-semibold text-gray-900 line-clamp-1">{report.title}</h3>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{dateStr}</span>
            </div>
          </div>
          <ReportStatusBadge status={report.statusId?.name || "Pending"} />
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mt-2 h-10">
          {report.description}
        </p>

        <div className="mt-4 pt-3 border-t border-gray-50 flex justify-end">
          <Link
            to={`/reports/${report._id}`}
            className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
          >
            View Details
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
