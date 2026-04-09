import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, ShieldCheck, AlertCircle, BarChart3, ChevronRight, ListChecks, Tag } from 'lucide-react';
import { getReportStats, getAllReportsForAdmin } from '../../../services/adminReportService';
import AdminReportCard from '../../../components/admin/reports/AdminReportCard';
import AdminReportTable from '../../../components/admin/reports/AdminReportTable';
import CategoryManager from '../../../components/admin/reports/CategoryManager';

const AdminReportsDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [recentReports, setRecentReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [statsRes, reportsRes] = await Promise.all([
                    getReportStats(),
                    getAllReportsForAdmin({ limit: 10 }) // Backend might not support limit, but we'll slice
                ]);
                
                setStats(statsRes.data || statsRes); // Handle possible data wrappers
                
                const reports = reportsRes.data?.reports || reportsRes.data || [];
                setRecentReports(reports.slice(0, 10));
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getCountByStatus = (name) => {
        if (!stats?.reportsByStatus) return 0;
        const entry = stats.reportsByStatus.find(s => s._id?.toLowerCase() === name.toLowerCase());
        return entry ? entry.count : 0;
    };

    const getCountByPriority = (name) => {
        if (!stats?.reportsByPriority) return 0;
        const entry = stats.reportsByPriority.find(p => p._id?.toLowerCase() === name.toLowerCase());
        return entry ? entry.count : 0;
    };

    const priorityBreakdown = [
        { label: 'Low', count: getCountByPriority('Low'), color: 'bg-green-500' },
        { label: 'Medium', count: getCountByPriority('Medium'), color: 'bg-amber-500' },
        { label: 'High', count: getCountByPriority('High'), color: 'bg-red-500' }
    ];

    const totalStats = [
        { label: "Total Reports", value: stats?.totalReports || 0, color: "purple", icon: FileText },
        { label: "Pending", value: getCountByStatus('Pending'), color: "amber", icon: Clock },
        { label: "Under Review", value: getCountByStatus('Under Review') + getCountByStatus('In Progress') + getCountByStatus('investigating'), color: "blue", icon: AlertCircle },
        { label: "Resolved", value: getCountByStatus('Resolved'), color: "green", icon: ShieldCheck }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-black text-stone-900 tracking-tight leading-tight">
                        Report Management
                    </h1>
                    <p className="text-stone-500 font-medium text-lg mt-1">
                        Monitor and investigate workplace inclusivity incidents.
                    </p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => setIsCategoryManagerOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-lg active:scale-95 group"
                    >
                        <Tag className="w-5 h-5 text-purple-400" />
                        Manage Categories
                    </button>
                    <button 
                        onClick={() => navigate('/admin/reports/all')}
                        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-stone-100 rounded-2xl text-stone-700 font-bold hover:bg-stone-50 hover:border-stone-200 transition-all shadow-sm active:scale-95 group"
                    >
                        <ListChecks className="w-5 h-5 text-purple-600" />
                        View All Reports
                        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            <CategoryManager 
                isOpen={isCategoryManagerOpen} 
                onClose={() => setIsCategoryManagerOpen(false)} 
            />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    [...Array(4)].map((_, i) => <div key={i} className="card h-32 animate-pulse bg-stone-100/50" />)
                ) : (
                    totalStats.map((stat, idx) => <AdminReportCard key={idx} {...stat} />)
                )}
            </div>

            {/* Priority Breakdown */}
            <div className="bg-white rounded-3xl border border-stone-100 p-8 shadow-sm">
                <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    Priority Breakdown
                </h3>
                <div className="flex items-center gap-4 flex-wrap">
                    {priorityBreakdown.map((p, i) => (
                        <div key={i} className="flex items-center bg-stone-50/80 rounded-full pl-2 pr-5 py-2 border border-stone-100 shadow-inner group hover:bg-white transition-colors duration-300">
                            <span className={`w-3.5 h-3.5 rounded-full ${p.color} shadow-sm mr-3 transition-transform group-hover:scale-125`} />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-stone-400 font-black uppercase tracking-widest leading-none">{p.label}</span>
                                <span className="text-sm font-bold text-stone-900 leading-tight">{p.count} Reports</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Reports */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-serif font-bold text-stone-800">Recent Incident Reports</h2>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{recentReports.length} Shown</span>
                </div>
                <AdminReportTable reports={recentReports} isLoading={loading} />
            </div>
        </div>
    );
};

export default AdminReportsDashboard;
