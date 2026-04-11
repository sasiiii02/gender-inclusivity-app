import React, { useState } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { updateReportPriority } from '../../../services/adminReportService';
import { toast } from 'react-hot-toast';

const ReportPriorityUpdater = ({ reportId, currentPriority, onUpdate }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const priorities = [
        { label: 'High', color: 'text-red-600 bg-red-50 border-red-100 hover:bg-red-100' },
        { label: 'Medium', color: 'text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100' },
        { label: 'Low', color: 'text-green-600 bg-green-50 border-green-100 hover:bg-green-100' }
    ];

    const handleUpdate = async (newPriority) => {
        if (newPriority === currentPriority) {
            setShowMenu(false);
            return;
        }

        setIsUpdating(true);
        try {
            const res = await updateReportPriority(reportId, newPriority);
            toast.success(`Priority updated to ${newPriority}`);
            if (onUpdate) onUpdate(res.data.report);
            setShowMenu(false);
        } catch (error) {
            toast.error("Failed to update priority");
        } finally {
            setIsUpdating(false);
        }
    };

    const currentTheme = priorities.find(p => p.label === currentPriority) || priorities[1];

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                disabled={isUpdating}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border-2 transition-all active:scale-95 ${currentTheme.color} ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isUpdating ? (
                    <div className="w-3 h-3 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                    <AlertCircle className="w-3.5 h-3.5" />
                )}
                {currentPriority} Priority
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
            </button>

            {showMenu && (
                <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-stone-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 space-y-1">
                        {priorities.map((p) => (
                            <button
                                key={p.label}
                                onClick={() => handleUpdate(p.label)}
                                className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
                                    currentPriority === p.label 
                                        ? 'bg-stone-50 text-stone-900 border border-stone-200' 
                                        : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800 border border-transparent'
                                }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${
                                    p.label === 'High' ? 'bg-red-500' : p.label === 'Medium' ? 'bg-amber-500' : 'bg-green-500'
                                }`} />
                                {p.label} Priority
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportPriorityUpdater;
