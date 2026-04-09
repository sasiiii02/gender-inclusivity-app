import React from 'react';
import { User, RefreshCw, MessageSquare, Clock, FileText } from 'lucide-react';

const ReportTimeline = ({ timeline, isLoading }) => {
    if (isLoading) {
        return (
            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-stone-100 rounded w-3/4" />
                            <div className="h-3 bg-stone-50 rounded w-1/4" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!timeline || timeline.length === 0) {
        return (
            <div className="text-center py-10 grayscale opacity-50">
                <Clock className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest">No activity log yet</p>
            </div>
        );
    }

    // Sort oldest to newest as per request
    const sortedTimeline = [...timeline].sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="relative pl-8 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-100">
            {sortedTimeline.map((item, idx) => {
                const isResponse = item.type === 'response';
                const isStatusChange = item.type === 'status_update';
                const isCreation = item.type === 'report_created';
                
                return (
                    <div key={idx} className="relative group animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                        {/* Milestone dot */}
                        <div className={`absolute -left-[27px] w-4 h-4 rounded-full border-4 border-white shadow-sm ring-4 ring-transparent group-hover:ring-purple-50 transition-all ${
                            isResponse ? 'bg-blue-500' : isCreation ? 'bg-green-500' : 'bg-purple-600'
                        }`} />

                        <div className="flex flex-col">
                            <div className="flex items-center gap-3 mb-1">
                                {isResponse ? (
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold border border-blue-100">
                                        {(item.respondedBy || 'A').charAt(0).toUpperCase()}
                                    </div>
                                ) : isCreation ? (
                                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                                        <RefreshCw className="w-4 h-4" />
                                    </div>
                                )}
                                
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-stone-800 leading-tight truncate">
                                        {isResponse ? (
                                            <>Admin Response from <span className="text-blue-600">{item.respondedBy || 'Admin'}</span></>
                                        ) : isCreation ? (
                                            <>Report Submitted by <span className="text-green-600">{item.user || 'User'}</span></>
                                        ) : (
                                            <>Status updated to <span className="text-purple-700 font-extrabold capitalize">{item.status || 'Updated'}</span></>
                                        )}
                                    </p>
                                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tight">
                                        {new Date(item.date).toLocaleString(undefined, { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </p>
                                </div>
                            </div>

                            {item.message && (
                                <div className="ml-0 mt-2 p-4 bg-stone-50 rounded-2xl border border-stone-100 shadow-inner">
                                    <p className="text-sm text-stone-700 leading-relaxed font-medium italic">
                                        "{item.message}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ReportTimeline;
