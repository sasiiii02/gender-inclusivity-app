import React, { useState } from 'react';
import { Lock, Unlock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { closeReport } from '../../../services/adminReportService';
import ConfirmModal from '../ConfirmModal';

const CloseReportCard = ({ report, onUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const handleCloseReport = async () => {
        setIsClosing(true);
        try {
            const res = await closeReport(report._id);
            toast.success("Report closed permanently");
            if (onUpdate) onUpdate(res.data.report);
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to close report");
        } finally {
            setIsClosing(false);
        }
    };

    if (report.isClosed) {
        return (
            <div className="bg-stone-50 rounded-2xl border-2 border-stone-200 p-6 shadow-inner mt-6 animate-in fade-in duration-500">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-stone-200 shadow-sm text-stone-400">
                        <Lock className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-stone-600 uppercase tracking-widest leading-none mb-1">Report Closed</h3>
                        <p className="text-xs text-stone-400 font-medium">
                            Closed on {new Date(report.closedAt).toLocaleDateString()} by {report.closedBy?.name || 'Admin'}
                        </p>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-stone-200 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                    Investigation concluded
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm shadow-stone-100 mt-6 animate-in slide-in-from-right-4 duration-500">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Unlock className="w-4 h-4 text-rose-500" />
                    Finalize Case
                </h3>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-6">
                    <div className="flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <p className="text-xs text-amber-700 font-medium leading-relaxed">
                            Closing this report is <strong>permanent</strong>. No further status changes or responses can be added. The reporter will be notified of the conclusion.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-3.5 border-2 border-rose-100 text-rose-600 font-bold rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <Lock className="w-4 h-4" />
                    Close Report
                </button>
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleCloseReport}
                title="Close this report?"
                message="This action is permanent and signifies that the investigation or support process has concluded. You will not be able to reopen this case."
                confirmText="Yes, Close Report"
                cancelText="Cancel"
                isDanger={true}
                isLoading={isClosing}
            />
        </>
    );
};

export default CloseReportCard;
