import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getArticleById, updateArticle, deleteArticle } from '../../../services/adminSupportService';
import ArticleForm from '../../../components/admin/support/ArticleForm';
import ConfirmModal from '../../../components/admin/ConfirmModal';

const AdminEditArticle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            setIsLoading(true);
            try {
                const res = await getArticleById(id);
                setArticle(res.data || res);
            } catch (error) {
                toast.error("Failed to load article data");
                navigate('/admin/support');
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticle();
    }, [id, navigate]);

    const handleSubmit = async (data) => {
        setIsSaving(true);
        try {
            await updateArticle(id, data);
            toast.success("Article updated successfully!");
            navigate('/admin/support');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update article");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteArticle(id);
            toast.success("Article deleted permanently");
            navigate('/admin/support');
        } catch (error) {
            toast.error("Failed to delete article");
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">Loading Article Content...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => navigate('/admin/support')}
                    className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-bold text-xs uppercase tracking-widest transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to desk
                </button>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none">Status: Published</span>
                </div>
            </div>

            <div className="border-b border-stone-100 pb-8">
                <h1 className="text-4xl font-serif font-black text-stone-900 tracking-tight leading-tight">
                    Edit Article
                </h1>
                <p className="text-stone-500 font-medium text-lg mt-1">
                    Update the content, category, or PDF attachment for this article.
                </p>
            </div>

            <ArticleForm 
                initialData={article}
                onCancel={() => navigate('/admin/support')}
                onDelete={() => setShowDeleteModal(true)}
                onSubmit={handleSubmit}
                isLoading={isSaving}
            />

            <ConfirmModal 
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Permanently delete article?"
                message="This action cannot be undone. This article will be removed from all support center pages and user bookmarks."
                confirmText="Delete Permanently"
                cancelText="Keep Article"
                isDanger={true}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default AdminEditArticle;
