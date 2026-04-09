import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, FileWarning } from "lucide-react";
import { toast } from "react-hot-toast";
import { getMyReports } from "../../services/reportService";
import ReportCard from "../../components/report/ReportCard";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getMyReports();
        setReports(data.reports || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch reports");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Reports</h1>
          <p className="text-gray-500 mt-1">Track and manage your submitted incident reports.</p>
        </div>
        <Link 
          to="/student/reports/submit"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Submit New Report
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-5 h-48 border border-gray-100 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 border-dashed p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileWarning className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">You haven't submitted any reports yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            If you experience or witness an incident, you can report it securely here.
          </p>
          <Link 
            to="/student/reports/submit"
            className="inline-flex items-center justify-center px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 text-sm font-medium rounded-lg transition-colors"
          >
            Submit your first report
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard key={report._id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
