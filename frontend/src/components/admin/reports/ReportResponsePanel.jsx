import React, { useState } from 'react';
import { Send, MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { addReportResponse } from '../../../services/adminReportService';

const ReportResponsePanel = ({ reportId, onResponseSent }) => {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || message.length < 10 || isSending) return;

        setIsSending(true);
        try {
            await addReportResponse(reportId, message);
            toast.success("Response sent successfully!");
            setMessage('');
            if (onResponseSent) onResponseSent();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send response");
        } finally {
            setIsSending(false);
        }
    };

    const charCount = message.length;
    const isInvalid = charCount < 10 || charCount > 1000;

    return (
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm shadow-stone-100 mt-6 animate-in slide-in-from-bottom-5 duration-500">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                Add Response
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your response to this report... The reporter will be notified."
                        className={`w-full bg-stone-50 border-2 rounded-xl px-5 py-4 text-sm font-medium focus:outline-none focus:bg-white transition-all resize-none min-h-[120px] ${
                            message.length > 0 && isInvalid ? 'border-red-200 focus:border-red-500' : 'border-transparent focus:border-purple-500'
                        }`}
                    />
                    <div className={`absolute bottom-3 right-4 text-[10px] font-bold uppercase tracking-tighter ${charCount > 1000 ? 'text-red-500' : 'text-stone-400'}`}>
                        {charCount} / 1000
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <p className="text-[10px] text-stone-400 font-semibold leading-tight max-w-[200px]">
                        Min 10 characters required. Your response will be visible to the reporter on their dashboard.
                    </p>
                    <button
                        type="submit"
                        disabled={isSending || isInvalid}
                        className="btn-primary py-3 px-8 flex items-center gap-2 group disabled:opacity-50 disabled:scale-100"
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                Send Response
                                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReportResponsePanel;
