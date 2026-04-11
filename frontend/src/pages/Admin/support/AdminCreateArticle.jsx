import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createArticle } from '../../../services/adminSupportService';
import ArticleForm from '../../../components/admin/support/ArticleForm';

const AdminCreateArticle = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data) => {
        setIsLoading(true);
        try {
            await createArticle(data);
            toast.success("Article published successfully!");
            navigate('/admin/support');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to publish article");
        } finally {
            setIsLoading(false);
        }
    };

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
            </div>

            <div className="border-b border-stone-100 pb-8">
                <h1 className="text-4xl font-serif font-black text-stone-900 tracking-tight leading-tight">
                    Create New Article
                </h1>
                <p className="text-stone-500 font-medium text-lg mt-1">
                    Fill in the details to publish a new resource to the support center.
                </p>
            </div>

            <ArticleForm 
                onCancel={() => navigate('/admin/support')}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </div>
    );
};

export default AdminCreateArticle;
