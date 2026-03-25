'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import RegisterForm from './RegisterForm';

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
    // স্ক্রল লক লজিক
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // ব্যাকড্রপ ক্লিক করলে মোডাল বন্ধ হওয়ার জন্য
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto"
            onClick={handleBackdropClick}
        >

            {/* Modal Container */}
            <div className="relative w-full max-w-[480px] my-auto bg-white dark:bg-[#0a0a0a] rounded-[28px] shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200 overflow-hidden">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 p-2 rounded-full bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors z-20 group"
                >
                    <X size={20} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                </button>

                {/* Content Area */}
                <div className="max-h-[90vh] overflow-y-auto scrollbar-hide">
                    <RegisterForm onClose={onClose} onSwitchToLogin={onSwitchToLogin} />
                </div>

            </div>
        </div>
    );
}