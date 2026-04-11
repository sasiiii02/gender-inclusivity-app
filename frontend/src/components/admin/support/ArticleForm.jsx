import React, { useState, useEffect } from 'react';
import { Upload, X, FileText, Loader2, Save, Trash2 } from 'lucide-react';

const ArticleForm = ({ initialData, onSubmit, onCancel, onDelete, isLoading }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        content: '',
    });
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfPreview, setPdfPreview] = useState(null);
    const [removeExistingPdf, setRemoveExistingPdf] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                category: initialData.category || '',
                content: initialData.content || '',
            });
            if (initialData.pdfUrl) {
                setPdfPreview(initialData.pdfUrl);
            }
        }
    }, [initialData]);

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.category.trim()) newErrors.category = "Category is required";
        if (!formData.content.trim()) newErrors.content = "Content is required";
        else if (formData.content.length < 100) newErrors.content = "Content must be at least 100 characters";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
            setPdfPreview(file.name);
            setRemoveExistingPdf(false);
        } else if (file) {
            alert("Only PDF files are allowed");
        }
    };

    const handleRemovePdf = () => {
        setPdfFile(null);
        setPdfPreview(null);
        setRemoveExistingPdf(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate() || isLoading) return;

        // Prepare data. If we have a file, use FormData.
        if (pdfFile || removeExistingPdf) {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('category', formData.category);
            data.append('content', formData.content);
            if (pdfFile) data.append('pdf', pdfFile);
            if (removeExistingPdf) data.append('removePdf', 'true');
            onSubmit(data);
        } else {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-stone-100 p-8 shadow-sm">
                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-bold text-stone-900 uppercase tracking-widest mb-1.5">Article Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g. Workplace Diversity Guidelines"
                                    className={`w-full bg-stone-50 border-2 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:bg-white transition-all ${
                                        errors.title ? 'border-red-200 focus:border-red-500' : 'border-transparent focus:border-purple-500'
                                    }`}
                                />
                                {errors.title && <p className="mt-1.5 text-xs text-red-500 font-bold">{errors.title}</p>}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-bold text-stone-900 uppercase tracking-widest mb-1.5">Category</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    placeholder="e.g. Legal, Mental Health, Workplace Policy"
                                    className={`w-full bg-stone-50 border-2 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:bg-white transition-all ${
                                        errors.category ? 'border-red-200 focus:border-red-500' : 'border-transparent focus:border-purple-500'
                                    }`}
                                />
                                {errors.category && <p className="mt-1.5 text-xs text-red-500 font-bold">{errors.category}</p>}
                            </div>

                            {/* Content */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-sm font-bold text-stone-900 uppercase tracking-widest">Main Content</label>
                                    <span className={`text-[10px] font-bold uppercase ${formData.content.length < 100 ? 'text-amber-500' : 'text-stone-400'}`}>
                                        {formData.content.length} characters (min 100)
                                    </span>
                                </div>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                                    rows={12}
                                    placeholder="Write the full content of the article here..."
                                    className={`w-full bg-stone-50 border-2 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:bg-white transition-all resize-none ${
                                        errors.content ? 'border-red-200 focus:border-red-500' : 'border-transparent focus:border-purple-500'
                                    }`}
                                />
                                {errors.content && <p className="mt-1.5 text-xs text-red-500 font-bold">{errors.content}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    {/* PDF Upload */}
                    <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Upload className="w-4 h-4 text-purple-600" />
                            PDF Attachment
                        </h3>
                        
                        {!pdfPreview ? (
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center group-hover:border-purple-300 group-hover:bg-purple-50/50 transition-all">
                                    <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-stone-100 group-hover:bg-white transition-colors">
                                        <FileText className="w-6 h-6 text-stone-300 group-hover:text-purple-500" />
                                    </div>
                                    <p className="text-xs font-bold text-stone-500 group-hover:text-purple-700">Click to upload PDF</p>
                                    <p className="text-[10px] text-stone-400 mt-1 uppercase">Max 5MB</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between gap-3 animate-in zoom-in-95 duration-200">
                                <div className="flex items-center gap-2 min-w-0">
                                    <FileText className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                    <span className="text-xs font-bold text-purple-700 truncate">
                                        {pdfFile ? pdfFile.name : (initialData?.pdfUrl ? 'Existing PDF' : 'Selected File')}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemovePdf}
                                    className="p-1.5 hover:bg-white rounded-lg text-purple-400 hover:text-red-500 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Submit Actions */}
                    <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm sticky top-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-4 flex items-center justify-center gap-2 mb-3 shadow-lg shadow-purple-100"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {initialData ? 'Save Changes' : 'Publish Article'}
                        </button>
                        
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="w-full py-3.5 border-2 border-stone-100 text-stone-600 font-bold rounded-xl hover:bg-stone-50 hover:border-stone-200 transition-all text-sm"
                        >
                            Cancel
                        </button>

                        {initialData && onDelete && (
                            <div className="mt-8 pt-6 border-t border-stone-100">
                                <button
                                    type="button"
                                    onClick={onDelete}
                                    className="w-full py-3 border-2 border-rose-50 text-rose-500 font-bold rounded-xl hover:bg-rose-50 hover:border-rose-100 transition-all text-sm flex items-center justify-center gap-2 overflow-hidden relative group"
                                >
                                    <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                                    Delete Article
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ArticleForm;
