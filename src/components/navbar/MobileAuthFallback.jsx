'use client';

const MobileAuthFallback = ({ onClose }) => {
    return (
        <div className="flex flex-col gap-3 pt-2 px-1">
            <button
                onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'login' }));
                }}
                className="px-6 py-3 border-2 border-[#F57C00] text-[#F57C00] font-bold rounded-xl text-center"
            >
                Sign In
            </button>
            <button
                onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: 'register' }));
                }}
                className="bg-[#F57C00] text-white px-6 py-3 rounded-xl text-center font-bold shadow-md"
            >
                Sign Up
            </button>
        </div>
    );
};

export default MobileAuthFallback;