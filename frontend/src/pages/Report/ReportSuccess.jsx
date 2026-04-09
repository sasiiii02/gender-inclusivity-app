import { CheckCircle2, ArrowRight, LayoutDashboard } from "lucide-react";
import { Link, useLocation, Navigate } from "react-router-dom";

const ReportSuccess = () => {
  const location = useLocation();
  const reportId = location.state?.reportId;

  if (!reportId) {
    return <Navigate to="/reports" replace />;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-12 max-w-md w-full text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Report Submitted</h1>
        <p className="text-gray-600 mb-6 font-medium">
          Your report has been successfully submitted and securely encrypted. Our dedicated team will review it shortly.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Reference ID</p>
          <p className="text-lg font-mono text-gray-900">{reportId}</p>
        </div>

        <div className="space-y-3">
          <Link 
            to={`/reports/${reportId}`}
            className="w-full flex items-center justify-center px-6 py-3 rounded-lg text-white bg-purple-600 hover:bg-purple-700 font-medium transition-colors"
          >
            Track Report Status
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link 
            to="/dashboard"
            className="w-full flex items-center justify-center px-6 py-3 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Home Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportSuccess;
