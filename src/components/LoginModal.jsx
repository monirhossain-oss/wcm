'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    // handleBackdropClick 

    return createPortal(
        <div
            // এখানে onClick={handleBackdropClick}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto"
        >
            <div className="relative w-full max-w-[440px] my-auto bg-white dark:bg-[#0a0a0a] rounded-[28px] shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200 overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 p-2 rounded-full bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors z-20 group"
                    aria-label="Close modal"
                >
                    <X size={20} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                </button>

                <div className="max-h-[90vh] overflow-y-auto scrollbar-hide">
                    <LoginForm onClose={onClose} onSwitchToRegister={onSwitchToRegister} />
                </div>
            </div>
        </div>,
        document.body
    );
}