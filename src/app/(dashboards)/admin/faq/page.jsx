'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X, Loader2, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2'; // SweetAlert2 ইম্পোর্ট করুন
import { createFaq, deleteFaq, updateFaq, getAllFaqs } from '@/services/faqService';

const AdminFaqPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(null);
    const [viewData, setViewData] = useState(null);

    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category: 'General'
    });

    const categories = [
        { id: 'General', label: 'General' },
        { id: 'Artists', label: 'For Creators and Artists' },
        { id: 'Creators', label: 'For Visitors and Buyers' },
        { id: 'Platform', label: 'Platform Policies' },
        { id: 'Technical', label: 'Technical Questions' },
    ];

    useEffect(() => {
        loadFaqs();
    }, []);

    const loadFaqs = async () => {
        setLoading(true);
        try {
            const res = await getAllFaqs();
            setFaqs(res.data);
        } catch (err) {
            toast.error("Failed to load FAQs");
        } finally {
            setLoading(false);
        }
    };

    // --- ডিলিট হ্যান্ডলার (SweetAlert2 সহ) ---
    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ea580c', // আপনার অরেঞ্জ থিমের সাথে মিল রেখে
            cancelButtonColor: '#3f3f46',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            background: '#18181b', // ডার্ক মোড ব্যাকগ্রাউন্ড
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
                    loadFaqs(); // টেবিল রিফ্রেশ
                } catch (err) {
                    toast.error("Delete failed");
                }
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // অ্যাড বা আপডেট করার আগে কনফার্মেশন অ্যালার্ট
        Swal.fire({
            title: isEditing ? 'Update FAQ?' : 'Add New FAQ?',
            text: isEditing ? "Do you want to save the changes?" : "Do you want to publish this FAQ?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ea580c', // Orange theme
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

                    // সাকসেস হওয়ার পর ফর্ম রিসেট এবং ডাটা রিলোড
                    setFormData({ question: '', answer: '', category: 'General' });
                    setIsEditing(null);
                    loadFaqs();
                } catch (err) {
                    toast.error(err.response?.data?.message || "Operation failed");
                }
            }
        });
    };

    const handleEdit = (faq) => {
        setFormData({ question: faq.question, answer: faq.answer, category: faq.category });
        setIsEditing(faq._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="p-6 bg-white dark:bg-[#0a0a0a] min-h-screen text-gray-900 dark:text-white">
            <h1 className="text-3xl font-bold mb-8 text-orange-600">FAQ Management</h1>

            {/* --- ADD / EDIT FORM --- */}
            <div className="bg-gray-50 dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 mb-10 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    {isEditing ? <Pencil size={20} className="text-blue-500" /> : <Plus size={20} className="text-orange-500" />}
                    {isEditing ? "Edit FAQ" : "Add New FAQ"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Question"
                            className="w-full p-3 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 outline-none focus:border-orange-500 transition-all"
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            required
                        />
                        <select
                            className="w-full p-3 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 outline-none focus:border-orange-500"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                        required
                    />
                    <div className="flex gap-3">
                        <button type="submit" className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg transition-all">
                            <Save size={18} /> {isEditing ? "Update FAQ" : "Save FAQ"}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => { setIsEditing(null); setFormData({ question: '', answer: '', category: 'General' }) }}
                                className="flex items-center gap-2 bg-gray-200 dark:bg-zinc-700 px-6 py-2.5 rounded-lg font-bold transition-all"
                            >
                                <X size={18} /> Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

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
                                                {categories.find(c => c.id === faq.category)?.label || faq.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => setViewData(faq)} className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500 rounded-lg transition-all" title="View Detail"><Eye size={18} /></button>
                                                <button onClick={() => handleEdit(faq)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 rounded-lg transition-all" title="Edit"><Pencil size={18} /></button>
                                                <button onClick={() => handleDelete(faq._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-all" title="Delete"><Trash2 size={18} /></button>
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