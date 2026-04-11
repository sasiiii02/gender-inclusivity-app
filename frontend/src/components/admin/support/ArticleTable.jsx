import React from 'react';
import { Edit2, Trash2, Paperclip, User, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const ArticleTable = ({ articles, isLoading, onDelete }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
                <div className="space-y-4 p-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-stone-50 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (!articles || articles.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-stone-100 p-16 text-center shadow-sm">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-stone-100 shadow-inner">
                    <Paperclip className="w-10 h-10 text-stone-200" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">No articles found</h3>
                <p className="text-stone-500 max-w-sm mx-auto mb-8">
                    Start by creating your first support article to help users find the information they need.
                </p>
                <Link to="/admin/support/create" className="btn-primary px-8 py-3">
                    Create New Article
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm shadow-stone-100">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-stone-50/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Article Title</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">PDF</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Author</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                        {articles.map((article) => (
                            <tr key={article._id} className="hover:bg-stone-50/50 transition-colors group">
                                <td className="px-6 py-5 min-w-[300px]">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-stone-900 group-hover:text-purple-700 transition-colors">
                                            {article.title}
                                        </span>
                                        <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-400 font-bold uppercase tracking-tight">
                                            <Calendar className="w-3 h-3" />
                                            Created {new Date(article.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider border border-purple-100 shadow-sm shadow-purple-50">
                                        {article.category || 'General'}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    {article.pdfUrl ? (
                                        <div className="flex items-center justify-center w-8 h-8 bg-red-50 text-red-600 rounded-lg border border-red-100 shadow-sm" title="PDF attachment available">
                                            <Paperclip className="w-4 h-4" />
                                        </div>
                                    ) : (
                                        <span className="text-stone-300 text-xs">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-sm text-stone-600 font-medium">
                                        <div className="w-7 h-7 bg-stone-100 rounded-full flex items-center justify-center text-[10px] font-bold text-stone-500">
                                            {article.createdBy?.name?.charAt(0).toUpperCase() || 'A'}
                                        </div>
                                        {article.createdBy?.name || 'Admin'}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            to={`/admin/support/${article._id}/edit`}
                                            className="p-2 text-stone-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                                            title="Edit article"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(article._id)}
                                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            title="Delete article"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ArticleTable;
