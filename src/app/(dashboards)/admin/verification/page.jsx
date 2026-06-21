'use client';

import { useState, useEffect } from 'react';
import {
    getVerifications,
    createVerification,
    updateVerification,
    deleteVerification
} from '@/lib/api';

// Toast Component
function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success'
        ? 'bg-green-500'
        : type === 'error'
            ? 'bg-red-500'
            : 'bg-blue-500';

    const icon = type === 'success'
        ? '✓'
        : type === 'error'
            ? '✕'
            : 'ℹ';

    return (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg text-white ${bgColor} animate-slide-in`}>
            <span className="text-xl font-bold">{icon}</span>
            <p className="font-medium">{message}</p>
            <button
                onClick={onClose}
                className="ml-2 text-white/80 hover:text-white text-xl leading-none"
            >
                ×
            </button>
        </div>
    );
}

const isLikelyValidTag = (raw) => {
    const trimmed = raw.trim();
    return trimmed.startsWith('<meta') || trimmed.startsWith('<script');
};

export default function AdminVerificationPage() {
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);

    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        rawHtml: '',
        order: 0
    });

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const hideToast = () => {
        setToast(null);
    };

    useEffect(() => {
        loadVerifications();
    }, []);

    const loadVerifications = async () => {
        try {
            const data = await getVerifications();
            setVerifications(data);
        } catch (error) {
            showToast('Failed to load verifications', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLikelyValidTag(formData.rawHtml)) {
            showToast('Code "<meta" ba "<script" diye shuru hote hobe', 'error');
            return;
        }

        const payload = {
            name: formData.name,
            rawHtml: formData.rawHtml,
            order: formData.order
        };

        try {
            if (editing) {
                await updateVerification(editing._id, payload);
                showToast('Verification tag updated successfully!', 'success');
            } else {
                await createVerification(payload);
                showToast('Verification tag created successfully!', 'success');
            }

            setFormData({ name: '', rawHtml: '', order: 0 });
            setEditing(null);
            loadVerifications();
        } catch (error) {
            showToast('Operation failed. Please try again.', 'error');
        }
    };

    const handleEdit = (v) => {
        setEditing(v);
        setFormData({
            name: v.name,
            rawHtml: v.rawHtml,
            order: v.order
        });
        showToast('Editing mode enabled', 'info');
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this?')) return;

        try {
            await deleteVerification(id);
            showToast('Verification tag deleted successfully!', 'success');
            loadVerifications();
        } catch (error) {
            showToast('Delete failed. Please try again.', 'error');
        }
    };

    const handleCancel = () => {
        setEditing(null);
        setFormData({ name: '', rawHtml: '', order: 0 });
        showToast('Editing cancelled', 'info');
    };

    const presets = [
        { name: 'Google Search Console', sample: '<meta name="google-site-verification" content="PASTE_CODE_HERE" />' },
        { name: 'Bing Webmaster', sample: '<meta name="msvalidate.01" content="PASTE_CODE_HERE" />' },
        { name: 'Facebook Domain', sample: '<meta name="facebook-domain-verification" content="PASTE_CODE_HERE" />' },
        { name: 'Pinterest', sample: '<meta name="p:domain_verify" content="PASTE_CODE_HERE" />' },
        { name: 'Yandex', sample: '<meta name="yandex-verification" content="PASTE_CODE_HERE" />' },
        { name: 'Norton Safe Web', sample: '<meta name="norton-safeweb-site-verification" content="PASTE_CODE_HERE" />' },
        { name: 'Custom Script', sample: '<script>\n  // paste your script code here\n</script>' },
    ];

    const applyPreset = (preset) => {
        setFormData(prev => ({
            ...prev,
            name: preset.name,
            rawHtml: preset.sample
        }));
        showToast(`"${preset.name}" template bosano hoyeche - code ta replace koro`, 'info');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}

            <div className="max-w-6xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Meta Verification Tags Manager
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Jekono &lt;meta&gt; ba &lt;script&gt; tag paste koro - eta direct &lt;head&gt; e bose jabe
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6 mb-8 transition-colors duration-300">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        {editing ? 'Edit Verification Tag' : 'Add New Verification Tag'}
                    </h2>

                    {!editing && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Quick Select (Common Platforms):
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {presets.map(preset => (
                                    <button
                                        key={preset.name}
                                        onClick={() => applyPreset(preset)}
                                        type="button"
                                        className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200 border border-blue-200 dark:border-blue-800"
                                    >
                                        {preset.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Display Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Bing Webmaster"
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Paste &lt;meta&gt; or &lt;script&gt; Code *
                            </label>
                            <textarea
                                value={formData.rawHtml}
                                onChange={(e) => setFormData({ ...formData, rawHtml: e.target.value })}
                                placeholder='<meta name="msvalidate.01" content="A76F240F1906D79C8F6B095D8E5B5E0D" />'
                                required
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Eta exact jevabe likhbe, sevabei &lt;head&gt; e bose jabe.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Order (Display Priority)
                            </label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                className="w-full md:w-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 shadow-sm"
                            >
                                {editing ? 'Update Tag' : 'Add Tag'}
                            </button>

                            {editing && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2.5 bg-gray-500 dark:bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors duration-200 shadow-sm"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6 transition-colors duration-300">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        Existing Verification Tags
                    </h2>

                    {verifications.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg">No verification tags added yet.</p>
                            <p className="text-gray-400 dark:text-gray-500">Add your first tag using the form above</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                                            Code
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                                            Order
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {verifications.map((v) => (
                                        <tr key={v._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                                {v.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                <code className="block max-w-md truncate bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs text-gray-700 dark:text-gray-300 font-mono" title={v.rawHtml}>
                                                    {v.rawHtml}
                                                </code>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                                {v.order}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(v)}
                                                        className="px-3 py-1.5 bg-amber-500 dark:bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-600 dark:hover:bg-amber-500 transition-colors duration-200"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(v._id)}
                                                        className="px-3 py-1.5 bg-red-500 dark:bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-600 dark:hover:bg-red-500 transition-colors duration-200"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6 mt-8 transition-colors duration-300">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        HTML Preview
                    </h2>
                    <div className="bg-gray-900 rounded-lg overflow-x-auto">
                        <pre className="p-4 text-green-400 text-sm font-mono leading-relaxed">
                            <code>{`<head>
  <!-- Your other meta tags... -->

${verifications.map(v => `  <!-- ${v.name} -->
  ${v.rawHtml}`).join('\n\n')}
</head>`}</code>
                        </pre>
                    </div>
                </div>

            </div>
        </div>
    );
}