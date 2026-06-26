'use client';

// src/components/navbar/AuthButtons.jsx
// Owns: Sign In / Sign Up buttons (desktop + the visible-everywhere version)
// and the Login/Register modals. Renders nothing if a user is logged in.
// Also listens for 'open-auth-modal' events fired from MobileDrawer's
// fallback buttons, so both entry points share one modal instance.

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '../LoginModal';
import RegisterModal from '../RegistationModal';

const AuthButtons = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const { user } = useAuth();

    const openLogin = () => { setIsRegisterOpen(false); setIsLoginOpen(true); };
    const openRegister = () => { setIsLoginOpen(false); setIsRegisterOpen(true); };

    // Bridge for MobileDrawer's fallback Sign In/Sign Up buttons —
    // keeps the two client islands decoupled (no direct import needed).
    useEffect(() => {
        const handler = (e) => {
            if (e.detail === 'login') openLogin();
            if (e.detail === 'register') openRegister();
        };
        window.addEventListener('open-auth-modal', handler);
        return () => window.removeEventListener('open-auth-modal', handler);
    }, []);

    if (user) return null;

    return (
        <>
            <div className="flex items-center gap-1.5 md:gap-2">
                <button
                    onClick={() => setIsLoginOpen(true)}
                    className="px-3 py-1.5 md:px-5 md:py-2 border-2 border-[#F57C00] text-[#F57C00] font-bold text-xs md:text-sm rounded-xl hover:bg-[#F57C00] hover:text-white transition-all duration-300 whitespace-nowrap"
                >
                    Sign In
                </button>
                <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="px-3 py-1.5 md:px-5 md:py-2 rounded-lg bg-[#F57C00] text-white text-xs md:text-sm font-bold hover:bg-[#e67600] transition-all shadow-md active:scale-95 whitespace-nowrap"
                >
                    Sign Up
                </button>
            </div>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onSwitchToRegister={openRegister} />
            <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} onSwitchToLogin={openLogin} />
        </>
    );
};

export default AuthButtons;