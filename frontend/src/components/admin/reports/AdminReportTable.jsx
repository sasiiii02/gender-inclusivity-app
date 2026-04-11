import React from 'react';
import { Eye, Clock, AlertCircle, CheckCircle2, XCircle, Lock, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminReportTable = ({ reports, isLoading, rowNumberStart = 1 }) => {
    const statusConfig = {
        pending: { label: 'Pending', classes: 'bg-amber-100 text-amber-700' },
        'under review': { label: 'Under Review', classes: 'bg-blue-100 text-blue-700' },
        'in progress': { label: 'In Progress', classes: 'bg-blue-100 text-blue-700' },
        investigating: { label: 'Under Review', classes: 'bg-blue-100 text-blue-700' },
        resolved: { label: 'Resolved', classes: 'bg-green-100 text-green-700' },
        rejected: { label: 'Rejected', classes: 'bg-rose-100 text-rose-700' },
        closed: { label: 'Closed', classes: 'bg-stone-100 text-stone-500' }
    };

    const priorityConfig = {
        Low: { icon: Clock, classes: 'bg-green-100 text-green-700' },
        Medium: { icon: AlertCircle, classes: 'bg-amber-100 text-amber-700' },
        High: { icon: AlertCircle, classes: 'bg-red-100 text-red-700' }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-stone-50/50">
                            <tr>
                                {[...Array(7)].map((_, i) => (
                                    <th key={i} className="px-6 py-4"><div className="h-4 bg-stone-200 rounded w-16 animate-pulse" /></th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {[...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    {[...Array(7)].map((_, j) => (
                                        <td key={j} className="px-6 py-5"><div className="h-4 bg-stone-100 rounded w-full animate-pulse" /></td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (!reports || reports.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-100">
                    <AlertCircle className="w-8 h-8 text-stone-300" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-1 font-serif">No reports found</h3>
                <p className="text-stone-500 text-sm">Either there are no reports yet or no results match your filters.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm shadow-stone-100">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-stone-50/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider w-16">#</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Reported By</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                        {reports.map((report, idx) => {
                            const status = statusConfig[report.statusId?.name?.toLowerCase()] || statusConfig.pending;
                            const priority = priorityConfig[report.priority] || priorityConfig.Low;
                            const PriorityIcon = priority.icon;
                            
                            return (
                                <tr key={report._id} className="hover:bg-stone-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-medium text-stone-400">{rowNumberStart + idx}</td>
                                    <td className="px-6 py-4 min-w-[200px]">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-stone-900 group-hover:text-purple-700 transition-colors line-clamp-1 truncate max-w-[250px]">
                                                {report.title}
                                            </span>
                                            {report.isClosed && <Lock className="w-3.5 h-3.5 text-stone-400" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {report.isAnonymous ? (
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-1 rounded-md">
                                                    <UserIcon className="w-3 h-3" /> Anonymous
                                                </div>
                                            ) : (
                                                <span className="text-sm text-stone-700 font-medium">
                                                    {report.reportedBy?.name || 'Unknown User'}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${priority.classes}`}>
                                            <PriorityIcon className="w-3 h-3" />
                                            {report.priority}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${status.classes}`}>
                                            {status.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-stone-700 font-medium">
                                            {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        <p className="text-[10px] text-stone-400 font-bold uppercase">Submitted</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            to={`/admin/reports/${report._id}`}
                                            className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 font-bold text-xs uppercase tracking-widest transition-colors py-2 px-3 hover:bg-purple-50 rounded-xl"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReportTable;
