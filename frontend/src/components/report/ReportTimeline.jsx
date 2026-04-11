import { CheckCircle, Clock, MessageSquare, AlertCircle } from "lucide-react";

const getEventStyles = (type, isLast) => {
  if (type === "report_created") return { icon: <CheckCircle className="w-4 h-4 text-white" />, bg: "bg-purple-600" };
  if (type === "response") return { icon: <MessageSquare className="w-4 h-4 text-white" />, bg: "bg-blue-500" };
  if (type === "status_update") {
     return { icon: <Clock className="w-4 h-4 text-white" />, bg: isLast ? "bg-green-500" : "bg-yellow-500" };
  }
  return { icon: <AlertCircle className="w-4 h-4 text-white" />, bg: "bg-gray-400" };
};

const ReportTimeline = ({ events }) => {
  if (!events || events.length === 0) return null;

  return (
    <div className="relative border-l border-gray-200 ml-3 md:ml-4 my-6 space-y-8">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const styles = getEventStyles(event.type, isLast);
        const dateStr = new Date(event.date).toLocaleDateString(undefined, {
          month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
        });

        return (
          <div key={index} className="relative pl-6 md:pl-8">
            <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white ${styles.bg}`}>
              {styles.icon}
            </span>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {event.type === 'report_created' && "Report Submitted"}
                  {event.type === 'response' && "Admin Response"}
                  {event.type === 'status_update' && `Status Changed: ${event.status}`}
                </h4>
                <p className="text-xs text-gray-500 mb-1 mt-0.5">
                  by {event.user || event.updatedBy || event.respondedBy || "System"}
                </p>
              </div>
              <time className="block text-xs font-medium text-gray-400 sm:text-right mt-1 sm:mt-0">
                {dateStr}
              </time>
            </div>
            {event.message && (
              <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100">
                {event.message}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReportTimeline;
