import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Loader2, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAllCategories, createCategory, deleteCategory } from '../../../services/adminCategoryService';

const CategoryManager = ({ isOpen, onClose }) => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await getAllCategories();
            setCategories(res.data?.categories || res.data || []);
        } catch (error) {
            toast.error("Failed to load categories");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        setIsSaving(true);
        try {
            await createCategory(newCategory.trim());
            setNewCategory('');
            toast.success("Category added successfully");
            fetchCategories();
        } catch (error) {
            toast.error("Failed to add category");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category? Students will no longer be able to select it for new reports.")) return;

        try {
            await deleteCategory(id);
            toast.success("Category removed");
            setCategories(categories.filter(c => c._id !== id));
        } catch (error) {
            toast.error("Failed to delete category");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                {/* Header */}
                <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                    <div>
                        <h2 className="text-xl font-serif font-black text-stone-900 leading-tight">Manage Categories</h2>
                        <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mt-1">Incident Classification</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-stone-100">
                        <X className="w-5 h-5 text-stone-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* Add Form */}
                    <form onSubmit={handleAdd} className="flex gap-2">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="e.g. Bullying, Harassment"
                            className="flex-1 bg-stone-50 border border-stone-100 rounded-2xl px-5 py-3 text-sm font-bold text-stone-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-200 transition-all placeholder:text-stone-300"
                        />
                        <button 
                            type="submit" 
                            disabled={isSaving || !newCategory.trim()}
                            className="bg-purple-600 text-white p-3 rounded-2xl hover:bg-purple-700 disabled:opacity-50 transition-all shadow-lg active:scale-95 flex-shrink-0"
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        </button>
                    </form>

                    {/* List */}
                    <div className="space-y-3">
                        {isLoading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="w-8 h-8 text-stone-200 animate-spin" />
                            </div>
                        ) : categories.length === 0 ? (
                            <p className="text-center py-10 text-stone-400 text-sm font-medium italic">No categories defined yet.</p>
                        ) : (
                            categories.map((category) => (
                                <div key={category._id} className="group flex items-center justify-between p-4 bg-stone-50/50 rounded-2xl border border-stone-100 hover:border-purple-100 hover:bg-white transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-purple-600 shadow-sm">
                                            <Tag className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold text-stone-700">{category.name}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(category._id)}
                                        className="p-2 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 bg-stone-50/50 border-t border-stone-100 text-center">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tight">
                        These categories appear in the report submission form.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CategoryManager;
