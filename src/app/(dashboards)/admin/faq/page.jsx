'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Save, X, Loader2, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { createFaq, deleteFaq, updateFaq, getAllFaqs, getFaqFrenchTranslation, updateFaqFrenchTranslation } from '@/services/faqService';

const AdminFaqPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(null);
    const [viewData, setViewData] = useState(null);
    const [language, setLanguage] = useState('en');
    const [sourceFaq, setSourceFaq] = useState(null);
    const [translationVersion, setTranslationVersion] = useState(0);

    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category: 'General'
    });

    // ক্যাটাগরি আইডি এবং লেবেল ফ্রন্টএন্ডের সাথে মিল রেখে ফিক্স করা হয়েছে
    const categories = [
        { id: 'General', label: 'General' },
        { id: 'Artists', label: 'For Creators and Artists' },
        { id: 'Visitors', label: 'For Visitors and Buyers' },
        { id: 'Platform', label: 'Platform Policies' },
        { id: 'Technical', label: 'Technical Questions' },
    ];

    const loadFaqs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllFaqs(language === 'fr' ? 'fr' : undefined);
            setFaqs(res.data);
        } catch (err) {
            toast.error("Failed to load FAQs");
        } finally {
            setLoading(false);
        }
    }, [language]);

    useEffect(() => {
        loadFaqs();
    }, [loadFaqs]);

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ea580c',
            cancelButtonColor: '#3f3f46',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            background: '#18181b',
            color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteFaq(id);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Your FAQ has been deleted.',
                        icon: 'success',
                        background: '#18181b',
                        color: '#fff',
                        confirmButtonColor: '#ea580c',
                    });
                    loadFaqs();
                } catch (err) {
                    toast.error("Delete failed");
                }
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (language === 'fr') {
            try {
                const res = await updateFaqFrenchTranslation(isEditing, {
                    question: formData.question,
                    answer: formData.answer,
                    expectedVersion: translationVersion,
                });
                setTranslationVersion(res.data.data.versionNumber);
                toast.success('French FAQ Published Successfully!');
                loadFaqs();
            } catch (err) {
                toast.error(err.response?.data?.message || 'French publish failed');
            }
            return;
        }

        Swal.fire({
            title: isEditing ? 'Update FAQ?' : 'Add New FAQ?',
            text: isEditing ? "Do you want to save the changes?" : "Do you want to publish this FAQ?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ea580c',
            cancelButtonColor: '#3f3f46',
            confirmButtonText: isEditing ? 'Yes, Update' : 'Yes, Save it!',
            cancelButtonText: 'Cancel',
            background: '#18181b',
            color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    if (isEditing) {
                        await updateFaq(isEditing, formData);
                        toast.success("FAQ Updated Successfully!");
                    } else {
                        await createFaq(formData);
                        toast.success("New FAQ Added!");
                    }
                    setFormData({ question: '', answer: '', category: 'General' });
                    setIsEditing(null);
                    loadFaqs();
                } catch (err) {
                    toast.error(err.response?.data?.message || "Operation failed");
                }
            }
        });
    };

    const handleEdit = async (faq) => {
        if (language === 'fr') {
            try {
                const res = await getFaqFrenchTranslation(faq._id);
                const editor = res.data.data;
                setSourceFaq(editor.sourceFaq);
                setTranslationVersion(editor.versionNumber);
                setFormData({
                    question: editor.translatedContent.question,
                    answer: editor.translatedContent.answer,
                    category: editor.sourceFaq.category,
                });
                setIsEditing(faq._id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to load French FAQ');
            }
            return;
        }
        setFormData({ question: faq.question, answer: faq.answer, category: faq.category });
        setIsEditing(faq._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="p-6 bg-white dark:bg-[#0a0a0a] min-h-screen text-gray-900 dark:text-white">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold text-orange-600">FAQ Management</h1>
                <div className="flex rounded-lg border border-gray-200 dark:border-zinc-700 p-1">
                    {['en', 'fr'].map((code) => (
                        <button key={code} type="button" onClick={() => {
                            setLanguage(code);
                            setIsEditing(null);
                            setSourceFaq(null);
                            setTranslationVersion(0);
                            setFormData({ question: '', answer: '', category: 'General' });
                        }} className={`px-4 py-2 rounded-md font-bold uppercase ${language === code ? 'bg-orange-600 text-white' : 'text-gray-500'}`}>
                            {code}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- ADD / EDIT FORM --- */}
            {(language === 'en' || isEditing) ? <div className="bg-gray-50 dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 mb-10 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    {isEditing ? <Pencil size={20} className="text-blue-500" /> : <Plus size={20} className="text-orange-500" />}
                    {language === 'fr' ? 'Edit French FAQ' : (isEditing ? "Edit FAQ" : "Add New FAQ")}
                </h2>
                {language === 'fr' && sourceFaq && (
                    <div className="mb-5 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-4 text-sm">
                        <p className="font-semibold mb-1">English question: {sourceFaq.question}</p>
                        <div className="text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: sourceFaq.answer }} />
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Question"
                            className="w-full p-3 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 outline-none focus:border-orange-500 transition-all"
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            required={language === 'en'}
                        />
                        <select
                            className="w-full p-3 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 outline-none focus:border-orange-500"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            disabled={language === 'fr'}
                        >
                            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                    </div>
                    <textarea
                        placeholder="Answer (HTML allowed)"
                        rows="5"
                        className="w-full p-3 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 outline-none focus:border-orange-500 transition-all"
                        value={formData.answer}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        required={language === 'en'}
                    />
                    <div className="flex gap-3">
                        <button type="submit" className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg transition-all">
                            <Save size={18} /> {language === 'fr' ? 'Publish French' : (isEditing ? "Update FAQ" : "Save FAQ")}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => { setIsEditing(null); setSourceFaq(null); setFormData({ question: '', answer: '', category: 'General' }) }}
                                className="flex items-center gap-2 bg-gray-200 dark:bg-zinc-700 px-6 py-2.5 rounded-lg font-bold transition-all"
                            >
                                <X size={18} /> Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div> : (
                <div className="mb-10 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 p-6 text-center text-gray-500">
                    Select an FAQ below to add or edit its French question and answer.
                </div>
            )}

            {/* --- FAQ LIST TABLE --- */}
            <div className="overflow-x-auto bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20 gap-3">
                        <Loader2 className="animate-spin text-orange-500" size={32} />
                        <p className="text-gray-400 text-sm italic">Syncing FAQs...</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50">
                            <tr className="text-gray-500 text-xs uppercase tracking-wider">
                                <th className="py-4 px-6">Question</th>
                                <th className="py-4 px-6">Category</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {faqs.length > 0 ? (
                                faqs.map((faq) => (
                                    <tr key={faq._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-all">
                                        <td className="py-4 px-6 font-medium max-w-md truncate">{faq.question}</td>
                                        <td className="py-4 px-6">
                                            <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase tracking-wider">
                                                {/* ID থেকে Label খুঁজে দেখাচ্ছে */}
                                                {categories.find(c => c.id === faq.category)?.label || faq.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => setViewData(faq)} className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500 rounded-lg transition-all" title="View Detail"><Eye size={18} /></button>
                                                <button onClick={() => handleEdit(faq)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 rounded-lg transition-all" title="Edit"><Pencil size={18} /></button>
                                                {language === 'en' && <button onClick={() => handleDelete(faq._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-all" title="Delete"><Trash2 size={18} /></button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-10 text-center text-gray-400">No FAQs available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* --- VIEW MODAL --- */}
            {viewData && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-zinc-800">
                        <div className="flex justify-between items-start mb-4 border-b dark:border-zinc-800 pb-3">
                            <h3 className="text-xl font-bold pr-6">{viewData.question}</h3>
                            <button onClick={() => setViewData(null)} className="text-gray-400 hover:text-white transition-colors"><X /></button>
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 prose dark:prose-invert max-h-96 overflow-y-auto px-2 custom-scrollbar"
                            dangerouslySetInnerHTML={{ __html: viewData.answer }}
                        />
                        <button onClick={() => setViewData(null)} className="mt-6 w-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 py-2.5 rounded-lg font-bold transition-colors">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFaqPage;
