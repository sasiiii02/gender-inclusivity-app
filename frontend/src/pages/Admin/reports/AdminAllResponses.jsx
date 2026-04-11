import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Search, MessageSquare, ExternalLink, Calendar, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllAdminResponses } from '../../../services/adminReportService';

const AdminAllResponses = () => {
    const navigate = useNavigate();
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchResponses = async () => {
            setLoading(true);
            try {
                const res = await getAllAdminResponses();
                const data = res.data?.responses || res.data || [];
                setResponses(data);
            } catch (error) {
                console.error("Failed to fetch responses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResponses();
    }, []);

    const filteredResponses = useMemo(() => {
        return responses.filter(resp => {
            const matchesSearch = 
                (resp.reportId?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (resp.respondedBy?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (resp.message || '').toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [responses, searchQuery]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => navigate('/admin/reports')}
                    className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-bold text-xs uppercase tracking-widest transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to reports
                </button>
            </div>

            <div>
                <h1 className="text-3xl font-serif font-black text-stone-900 tracking-tight">
                    Admin Response Log
                </h1>
                <p className="text-stone-500 font-medium mt-1">
                    Auditable history of all communications sent to reporters.
                </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm shadow-stone-100">
                <div className="relative group max-w-xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-purple-600 transition-colors">
                        <Search className="h-5 w-5" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-3.5 border border-stone-100 bg-stone-50/50 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-sm"
                        placeholder="Search by report title, admin name, or message content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Responses List/Table */}
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm shadow-stone-100">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">Fetching logs...</p>
                    </div>
                ) : filteredResponses.length === 0 ? (
                    <div className="p-20 text-center grayscale opacity-50">
                        <MessageSquare className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-stone-800 font-serif">No responses found</h3>
                        <p className="text-stone-400 text-sm">Try a different search term or check back later.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-stone-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Report Title</th>
                                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Response Message</th>
                                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Admin</th>
                                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Date & Time</th>
                                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {filteredResponses.map((resp) => (
                                    <tr key={resp._id} className="hover:bg-stone-50/50 transition-colors group">
                                        <td className="px-6 py-5 min-w-[250px]">
                                            <Link 
                                                to={`/admin/reports/${resp.reportId?._id}`}
                                                className="text-sm font-bold text-stone-900 hover:text-purple-600 transition-colors line-clamp-1"
                                            >
                                                {resp.reportId?.title || 'Unknown Report'}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-5 min-w-[300px]">
                                            <p className="text-sm text-stone-600 line-clamp-2 italic font-medium">
                                                "{resp.message}"
                                            </p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 bg-purple-50 rounded-full flex items-center justify-center text-[10px] font-bold text-purple-600 border border-purple-100">
                                                    {resp.respondedBy?.name?.charAt(0).toUpperCase() || 'A'}
                                                </div>
                                                <span className="text-xs font-bold text-stone-700">{resp.respondedBy?.name || 'Admin'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                                                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                                                    {new Date(resp.createdAt).toLocaleDateString()}
                                                </div>
                                                <span className="text-[10px] font-bold text-stone-400 ml-5 uppercase">
                                                    {new Date(resp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Link 
                                                to={`/admin/reports/${resp.reportId?._id}`}
                                                className="inline-flex items-center gap-1 p-2 text-stone-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                                                title="View Report Details"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAllResponses;
