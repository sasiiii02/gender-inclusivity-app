import { CheckCircle, Clock, AlertCircle, XCircle, Slash } from 'lucide-react';

const ReportStatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase() || '';

  let config = {
    color: 'bg-gray-100 text-gray-600',
    icon: <Slash className="w-3 h-3 mr-1" />,
    label: status
  };

  if (normalizedStatus.includes('pending')) {
    config = {
      color: 'bg-yellow-100 text-yellow-700',
      icon: <Clock className="w-3 h-3 mr-1" />,
      label: 'Pending'
    };
  } else if (normalizedStatus.includes('review')) {
    config = {
      color: 'bg-blue-100 text-blue-700',
      icon: <AlertCircle className="w-3 h-3 mr-1" />,
      label: 'Under Review'
    };
  } else if (normalizedStatus.includes('resolv')) { // resolved
    config = {
      color: 'bg-green-100 text-green-700',
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
      label: 'Resolved'
    };
  } else if (normalizedStatus.includes('reject')) {
    config = {
      color: 'bg-red-100 text-red-700',
      icon: <XCircle className="w-3 h-3 mr-1" />,
      label: 'Rejected'
    };
  } else if (normalizedStatus.includes('clos')) {
    config = {
      color: 'bg-gray-100 text-gray-600',
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
      label: 'Closed'
    };
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

export default ReportStatusBadge;
