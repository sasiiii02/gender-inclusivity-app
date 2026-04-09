import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const AdminReportFilters = ({ 
    searchQuery, 
    setSearchQuery, 
    statusFilter, 
    setStatusFilter, 
    priorityFilter, 
    setPriorityFilter,
    showClosed,
    setShowClosed
}) => {
    const statuses = ["All", "Pending", "Under Review", "Action Taken", "Resolved", "Rejected", "Closed"];
    const priorities = ["All", "Low", "Medium", "High"];

    return (
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm shadow-stone-100 space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-purple-600 transition-colors">
                        <Search className="h-5 w-5" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-3.5 border border-stone-100 bg-stone-50/50 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-sm"
                        placeholder="Search by report title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest whitespace-nowrap">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-semibold text-stone-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer"
                        >
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest whitespace-nowrap">Priority</label>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-semibold text-stone-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer"
                        >
                            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center border-t border-stone-50 pt-4">
                <label className="relative inline-flex items-center cursor-pointer group">
                    <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={showClosed} 
                        onChange={() => setShowClosed(!showClosed)} 
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 group-hover:after:scale-110"></div>
                    <span className="ms-3 text-sm font-bold text-stone-600 select-none">Show closed reports</span>
                </label>
            </div>
        </div>
    );
};

export default AdminReportFilters;
