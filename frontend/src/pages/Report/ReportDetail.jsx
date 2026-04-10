import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, LayoutDashboard } from "lucide-react";
import { toast } from "react-hot-toast";
import { getReportById, getReportTimeline } from "../../services/reportService";
import ReportStatusBadge from "../../components/report/ReportStatusBadge";
import ReportTimeline from "../../components/report/ReportTimeline";

const ReportDetail = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [reportData, timelineData] = await Promise.all([
          getReportById(id),
          getReportTimeline(id)
        ]);
        setReport(reportData);
        setTimeline(timelineData?.timeline || []);
      } catch (error) {
        toast.error(error.message || "Failed to fetch report details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchReportData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="bg-white rounded-xl p-6 h-96 border border-gray-100 shadow-sm"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h2>
        <p className="text-gray-600 mb-6">Could not find the incident report you are looking for.</p>
        <Link to="/student/reports" className="text-purple-600 font-medium hover:underline">Back to My Reports</Link>
      </div>
    );
  }

  const submitDate = new Date(report.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const incidentDate = new Date(report.incidentDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <Link to="/student/reports" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-purple-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to My Reports
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Details */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{report.title}</h1>
              <ReportStatusBadge status={report.statusId?.name || "Pending"} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                <Calendar className="w-5 h-5 mr-3 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Incident Date</p>
                  <p className="font-medium">{incidentDate}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                <MapPin className="w-5 h-5 mr-3 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Location</p>
                  <p className="font-medium">{report.location || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                <LayoutDashboard className="w-5 h-5 mr-3 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Category</p>
                  <p className="font-medium">{report.categoryId?.name || "General"}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                <Calendar className="w-5 h-5 mr-3 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Submitted On</p>
                  <p className="font-medium">{submitDate}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{report.description}</p>
            </div>
            
            {/* If Evidence logic is added later, UI goes here. It was requested, but current backend has no specific evidence path returning. */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Attached Evidence</h3>
              <p className="text-sm text-gray-500 italic">No evidence attached or accessible.</p>
            </div>
          </div>
        </div>

        {/* Right Column - Timeline */}
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Status Timeline</h3>
            <ReportTimeline events={timeline} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
