import React, { useState } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateReportStatus } from '../../../services/adminReportService';

const ReportStatusUpdater = ({ reportId, currentStatus, availableStatuses, onUpdate }) => {
    const [selectedStatusId, setSelectedStatusId] = useState(currentStatus?._id || '');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async () => {
        if (!selectedStatusId || selectedStatusId === currentStatus?._id) return;

        setIsUpdating(true);
        try {
            const res = await updateReportStatus(reportId, selectedStatusId);
            toast.success("Report status updated successfully");
            if (onUpdate) onUpdate(res.data.report);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm shadow-stone-100">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-purple-600" />
                Update Status
            </h3>
            
            <div className="space-y-4">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <p className="text-[10px] text-stone-400 font-bold uppercase mb-1">Current Status</p>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-bold text-stone-800">{currentStatus?.name || 'Pending'}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-stone-500">Select New Status</label>
                    <select
                        value={selectedStatusId}
                        onChange={(e) => setSelectedStatusId(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold text-stone-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer"
                    >
                        <option value="" disabled>Select a status...</option>
                        {availableStatuses.map(status => (
                            <option key={status._id} value={status._id}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleUpdate}
                    disabled={isUpdating || !selectedStatusId || selectedStatusId === currentStatus?._id}
                    className="w-full py-3.5 bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-100 hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50 disabled:bg-stone-300 disabled:shadow-none flex items-center justify-center gap-2"
                >
                    {isUpdating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Updating...
                        </>
                    ) : (
                        "Update Status"
                    )}
                </button>
            </div>
        </div>
    );
};

export default ReportStatusUpdater;
