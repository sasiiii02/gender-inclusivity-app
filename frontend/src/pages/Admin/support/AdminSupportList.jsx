import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAllArticles, deleteArticle } from '../../../services/adminSupportService';
import ArticleTable from '../../../components/admin/support/ArticleTable';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import CategoryChip from '../../../components/support/CategoryChip'; // Reusing the student-side chip for consistency if available, or just build one

const AdminSupportList = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    // Deletion state
    const [articleToDelete, setArticleToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchArticles = async () => {
        setIsLoading(true);
        try {
            const res = await getAllArticles();
            setArticles(res.data || []);
        } catch (error) {
            toast.error("Failed to load support articles");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const categories = useMemo(() => {
        const cats = new Set(['All']);
        articles.forEach(a => {
            if (a.category) cats.add(a.category);
        });
        return Array.from(cats);
    }, [articles]);

    const filteredArticles = useMemo(() => {
        return articles.filter(a => {
            const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [articles, searchQuery, selectedCategory]);

    const handleDeleteClick = (id) => {
        setArticleToDelete(id);
    };

    const confirmDelete = async () => {
        if (!articleToDelete) return;
        setIsDeleting(true);
        try {
            await deleteArticle(articleToDelete);
            setArticles(prev => prev.filter(a => a._id !== articleToDelete));
            toast.success("Article deleted successfully");
            setArticleToDelete(null);
        } catch (error) {
            toast.error("Failed to delete article");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-serif font-black text-stone-900 tracking-tight leading-tight">
                        Support Center Desk
                    </h1>
                    <p className="text-stone-500 font-medium text-lg mt-1">
                        Manage help resources, legal guides, and inclusive policy documentation.
                    </p>
                </div>
                <button 
                    onClick={() => navigate('/admin/support/create')}
                    className="flex items-center gap-2 px-6 py-3.5 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 active:scale-95 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Create New Article
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Categories */}
                <div className="flex flex-wrap items-center gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                                selectedCategory === cat 
                                ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-100' 
                                : 'bg-white text-stone-500 border-stone-200 hover:border-purple-300 hover:text-purple-600'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative group w-full lg:max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-purple-600 transition-colors">
                        <Search className="h-4 w-4" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-4 py-3 border border-stone-100 bg-white rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-medium text-sm shadow-sm shadow-stone-100"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* List Area */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none">
                        Inventory: {filteredArticles.length} Articles
                    </p>
                </div>
                <ArticleTable 
                    articles={filteredArticles} 
                    isLoading={isLoading} 
                    onDelete={handleDeleteClick} 
                />
            </div>

            {/* Deletion Modal */}
            <ConfirmModal 
                isOpen={!!articleToDelete}
                onClose={() => setArticleToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete this article?"
                message="This will permanently remove the article from the support center. Users will no longer be able to access this information."
                confirmText="Yes, Delete Article"
                cancelText="Keep Article"
                isDanger={true}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default AdminSupportList;
