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

export default function AdminVerificationPage() {
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);

    // Toast state
    const [toast, setToast] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        metaName: '',
        content: '',
        order: 0
    });

    // Show toast helper
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

        try {
            if (editing) {
                await updateVerification(editing._id, formData);
                showToast('Verification tag updated successfully!', 'success');
            } else {
                await createVerification(formData);
                showToast('Verification tag created successfully!', 'success');
            }

            setFormData({ name: '', metaName: '', content: '', order: 0 });
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
            metaName: v.metaName,
            content: v.content,
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
        setFormData({ name: '', metaName: '', content: '', order: 0 });
        showToast('Editing cancelled', 'info');
    };

    // Preset templates for common platforms
    const presets = [
        { name: 'Google Search Console', metaName: 'google-site-verification' },
        { name: 'Bing Webmaster', metaName: 'msvalidate.01' },
        { name: 'Facebook Domain', metaName: 'facebook-domain-verification' },
        { name: 'Pinterest', metaName: 'p:domain_verify' },
        { name: 'Yandex', metaName: 'yandex-verification' },
        { name: 'Norton Safe Web', metaName: 'norton-safeweb-site-verification' },
    ];

    const applyPreset = (preset) => {
        setFormData(prev => ({
            ...prev,
            name: preset.name,
            metaName: preset.metaName
        }));
        showToast(`Preset "${preset.name}" applied`, 'info');
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

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}

            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Meta Verification Tags Manager
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Manage your website verification tags for various platforms
                    </p>
                </div>

                {/* Add/Edit Form */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6 mb-8 transition-colors duration-300">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        {editing ? 'Edit Verification Tag' : 'Add New Verification Tag'}
                    </h2>

                    {/* Quick Presets */}
                    {!editing && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Quick Select (Common Platforms):
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {presets.map(preset => (
                                    <button
                                        key={preset.metaName}
                                        onClick={() => applyPreset(preset)}
                                        className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200 border border-blue-200 dark:border-blue-800"
                                    >
                                        {preset.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Display Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Google Search Console"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Meta Name Attribute *
                                </label>
                                <input
                                    type="text"
                                    value={formData.metaName}
                                    onChange={(e) => setFormData({ ...formData, metaName: e.target.value })}
                                    placeholder="e.g., google-site-verification"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    This goes in &lt;meta name="HERE" content="..."&gt;
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Verification Code (Content) *
                            </label>
                            <input
                                type="text"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Paste your verification code here"
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            />
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

                {/* List of Existing Tags */}
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
                                            Meta Name
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                                            Content
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
                                                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm text-gray-700 dark:text-gray-300 font-mono">
                                                    {v.metaName}
                                                </code>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="block max-w-xs truncate text-gray-600 dark:text-gray-400" title={v.content}>
                                                    {v.content}
                                                </span>
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

                {/* HTML Preview Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6 mt-8 transition-colors duration-300">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        HTML Preview
                    </h2>
                    <div className="bg-gray-900 rounded-lg overflow-x-auto">
                        <pre className="p-4 text-green-400 text-sm font-mono leading-relaxed">
                            <code>{`<head>
  <!-- Your other meta tags... />
  
${verifications.map(v => `  <!-- ${v.name} -->
  <meta name="${v.metaName}" content="${v.content}" />`).join('\n\n')}
</head>`}</code>
                        </pre>
                    </div>
                </div>

            </div>
        </div>
    );
}