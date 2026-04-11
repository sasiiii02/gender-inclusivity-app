import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Lock, User as UserIcon, Calendar, MapPin, Tag, FileText, RefreshCw, Download, ShieldAlert, History } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
    getReportById, 
    getReportTimeline, 
    getReportResponses 
} from '../../../services/adminReportService';
import axiosInstance from '../../../api/axiosInstance'; // Assuming access to basic status fetch if needed

import ReportStatusUpdater from '../../../components/admin/reports/ReportStatusUpdater';
import ReportResponsePanel from '../../../components/admin/reports/ReportResponsePanel';
import ReportTimeline from '../../../components/admin/reports/ReportTimeline';
import CloseReportCard from '../../../components/admin/reports/CloseReportCard';

const AdminReportDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [report, setReport] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [responses, setResponses] = useState([]);
    const [availableStatuses, setAvailableStatuses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timelineLoading, setTimelineLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [reportRes, timelineRes, responsesRes] = await Promise.all([
                getReportById(id),
                getReportTimeline(id),
                getReportResponses(id)
            ]);

            setReport(reportRes);
            setTimeline(timelineRes.data?.timeline || timelineRes.data || []);
            setResponses(responsesRes.data?.responses || responsesRes.data || []);

            // Also fetch available statuses for the updater
            const statusRes = await axiosInstance.get('/reports/statuses'); // Fixed to fetch statuses
            setAvailableStatuses(statusRes.data?.statuses || []);
        } catch (error) {
            toast.error("Failed to fetch report details");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const refreshTimeline = async () => {
        setTimelineLoading(true);
        try {
            const res = await getReportTimeline(id);
            setTimeline(res.data?.timeline || res.data || []);
        } finally {
            setTimelineLoading(false);
        }
    };

    const handleUpdate = (updatedReport) => {
        setReport(updatedReport);
        refreshTimeline();
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
                <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">Loading Secure Data...</p>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="text-center py-20">
                <ShieldAlert className="w-16 h-16 text-rose-200 mx-auto mb-4" />
                <h2 className="text-2xl font-serif font-bold text-stone-900">Report Not Found</h2>
                <button onClick={() => navigate('/admin/reports/all')} className="mt-4 text-purple-600 font-bold hover:underline underline-offset-4">
                    Back to all reports
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => navigate('/admin/reports/all')}
                    className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-bold text-xs uppercase tracking-widest transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to inventory
                </button>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-5 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-purple-200/50 transition-all active:scale-95"
                    >
                        <Download className="w-4 h-4" /> Print Case File
                    </button>
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">Case ID:</span>
                    <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-3 py-1 rounded-lg border border-stone-200">{report._id.slice(-8)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: Info + Timeline */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Report Info Card */}
                    <div className="bg-white rounded-[2rem] border border-stone-100 p-8 sm:p-10 shadow-sm shadow-stone-100">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
                            <h1 className="text-3xl sm:text-4xl font-serif font-black text-stone-900 leading-tight">
                                {report.title}
                            </h1>
                            <div className="flex flex-wrap gap-2 flex-shrink-0">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                                    report.statusId?.name?.toLowerCase() === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {report.statusId?.name || 'Pending'}
                                </span>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 ${
                                    report.priority === 'High' ? 'border-red-100 bg-red-50 text-red-700' : 
                                    report.priority === 'Medium' ? 'border-amber-100 bg-amber-50 text-amber-700' : 
                                    'border-green-100 bg-green-50 text-green-700'
                                }`}>
                                    {report.priority} Priority
                                </span>
                                {report.isClosed && (
                                    <span className="bg-stone-900 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                        <Lock className="w-3.5 h-3.5" /> Closed
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-stone-50/50 rounded-3xl p-6 border border-stone-100 mb-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-purple-600 shadow-sm border border-stone-100">
                                        <UserIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest leading-none">Reported By</p>
                                        <p className="text-sm font-bold text-stone-800">{report.isAnonymous ? 'Anonymous Member' : (report.reportedBy?.name || 'Unknown')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-purple-600 shadow-sm border border-stone-100">
                                        <Tag className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest leading-none">Category</p>
                                        <p className="text-sm font-bold text-stone-800">{report.categoryId?.name || 'General Inclusivity'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-purple-600 shadow-sm border border-stone-100">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest leading-none">Incident Date</p>
                                        <p className="text-sm font-bold text-stone-800">{new Date(report.incidentDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-purple-600 shadow-sm border border-stone-100">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest leading-none">Location</p>
                                        <p className="text-sm font-bold text-stone-800">{report.location || 'Remote/Not Specified'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-purple-600" />
                                Detailed Narrative
                            </h3>
                            <p className="text-stone-700 leading-relaxed whitespace-pre-wrap font-medium bg-stone-50 p-6 rounded-2xl border border-stone-100">
                                {report.description}
                            </p>
                        </div>

                        {/* Evidence section */}
                        {report.evidence && report.evidence.length > 0 && (
                            <div className="animate-in slide-in-from-bottom-2">
                                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                                    Evidence Attachments ({report.evidence.length})
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {report.evidence.map((file, index) => {
                                        const backendOrigin = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api")
                                            .replace('/api', '');
                                        const fileUrl = `${backendOrigin}${file}`;
                                        const isImage = /\.(jpg|jpeg|png|webp)$/i.test(file);
                                        
                                        return (
                                            <div key={index} className="group relative bg-stone-50 border border-stone-100 rounded-2xl overflow-hidden hover:border-purple-200 transition-all">
                                                {isImage ? (
                                                    <div className="aspect-video w-full bg-stone-200 overflow-hidden">
                                                        <img 
                                                            src={fileUrl} 
                                                            alt={`Evidence ${index + 1}`} 
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="aspect-video w-full bg-stone-100 flex items-center justify-center">
                                                        <FileText className="w-12 h-12 text-stone-300" />
                                                    </div>
                                                )}
                                                <div className="p-3 flex items-center justify-between bg-white border-t border-stone-100">
                                                    <span className="text-[10px] font-bold text-stone-400 truncate max-w-[150px]">
                                                        {file.split('/').pop()}
                                                    </span>
                                                    <a 
                                                        href={fileUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                                                        title="Open in new tab"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Timeline & Progress */}
                    <div className="bg-white rounded-[2rem] border border-stone-100 p-8 sm:p-10 shadow-sm shadow-stone-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-3">
                                <History className="w-6 h-6 text-purple-600" />
                                Case Timeline
                            </h3>
                            <button 
                                onClick={refreshTimeline}
                                className="p-2 text-stone-400 hover:text-purple-600 transition-colors"
                                title="Refresh data"
                            >
                                <RefreshCw className={`w-5 h-5 ${timelineLoading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                        <ReportTimeline timeline={timeline} isLoading={timelineLoading} />
                    </div>
                </div>

                {/* RIGHT COLUMN: Action center */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="sticky top-8 space-y-6">
                        {!report.isClosed && (
                            <>
                                <ReportStatusUpdater 
                                    reportId={report._id} 
                                    currentStatus={report.statusId}
                                    availableStatuses={availableStatuses}
                                    onUpdate={handleUpdate}
                                />
                                <ReportResponsePanel 
                                    reportId={report._id} 
                                    onResponseSent={refreshTimeline}
                                />
                            </>
                        )}
                        
                        <CloseReportCard 
                            report={report} 
                            onUpdate={handleUpdate} 
                        />

                        {/* Quick Stats sidebar footer */}
                        <div className="bg-stone-900 rounded-3xl p-8 text-white shadow-xl shadow-stone-200">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Official Notice</p>
                            <p className="text-sm font-medium leading-relaxed italic text-stone-300">
                                "All information in this report is confidential and protected by Inclusivity Policy §14. Unauthorized disclosure is strictly prohibited."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReportDetail;
