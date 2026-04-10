import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Download, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllReportsForAdmin } from '../../../services/adminReportService';
import AdminReportTable from '../../../components/admin/reports/AdminReportTable';
import AdminReportFilters from '../../../components/admin/reports/AdminReportFilters';

const AdminAllReports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [showClosed, setShowClosed] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const res = await getAllReportsForAdmin();
                const data = res.data?.reports || res.data || [];
                setReports(data);
            } catch (error) {
                console.error("Failed to fetch all reports:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 report.reportedBy?.name?.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus = statusFilter === 'All' || 
                                 (statusFilter === 'Under Review' && report.statusId?.name?.toLowerCase() === 'investigating') ||
                                 report.statusId?.name?.toLowerCase() === statusFilter.toLowerCase();
            
            const matchesPriority = priorityFilter === 'All' || report.priority === priorityFilter;
            
            const matchesClosed = showClosed || !report.isClosed;

            return matchesSearch && matchesStatus && matchesPriority && matchesClosed;
        });
    }, [reports, searchQuery, statusFilter, priorityFilter, showClosed]);

    const handleReset = () => {
        setSearchQuery('');
        setStatusFilter('All');
        setPriorityFilter('All');
        setShowClosed(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Breadcrumbs / Back */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => navigate('/admin/reports')}
                    className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-bold text-sm uppercase tracking-widest transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold transition-all">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-serif font-black text-stone-900 tracking-tight">
                    All Incident Reports
                </h1>
                <p className="text-stone-500 font-medium mt-1">
                    Manage the entire inventory of reports across the platform.
                </p>
            </div>

            {/* Filters */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-sm font-black text-stone-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        Advanced Filtering
                    </h2>
                    <button 
                        onClick={handleReset}
                        className="text-[10px] font-bold text-purple-600 uppercase tracking-widest flex items-center gap-1 hover:text-purple-800 transition-colors"
                    >
                        <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                </div>
                <AdminReportFilters 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    priorityFilter={priorityFilter}
                    setPriorityFilter={setPriorityFilter}
                    showClosed={showClosed}
                    setShowClosed={setShowClosed}
                />
            </div>

            {/* Table Area */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                        Showing {filteredReports.length} of {reports.length} reports
                    </p>
                </div>
                <AdminReportTable reports={filteredReports} isLoading={loading} />
            </div>
        </div>
    );
};

export default AdminAllReports;
