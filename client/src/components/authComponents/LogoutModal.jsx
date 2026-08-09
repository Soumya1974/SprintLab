import { X } from "lucide-react";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";


export default function LogoutModal({ onCancelClick }) {

    const [submitting, setSubmitting] = useState(false);

    const clearAccessToken = useAuthStore((state) =>
        state.clearAccessToken
    )
    const clearForgotPasswordProgress = useAuthStore((state) => state.clearForgotPasswordProgress);

    const handleLogoutClick = async () => {
        setSubmitting(true);
        try {
            const response = await api.post('/api/logout', {}, {
                withCredentials: true
            });

            clearAccessToken();
            clearForgotPasswordProgress();
            
        }
        catch (err) {
            console.error(err);
            toast.error(err.response?.data.message);
        }
        finally {
            setSubmitting(false);
        }
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            
            <div
                className="absolute inset-0 bg-slate-900/40 animate-fade-in"
            />

            <div className="relative bg-white border border-slate-200 shadow-xl w-full max-w-sm p-6 animate-scale-in bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-size-[24px_24px]">
                <button
                    aria-label="Close"
                    className="absolute top-4 right-4 h-7 w-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-150"
                >
                    <X className="h-4 w-4" onClick={onCancelClick} />
                </button>

                <h2 className="text-base font-semibold text-slate-800 mb-1.5">
                    Log out of SprintLab?
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    You&apos;ll need to sign in again to access your workspaces and
                    tasks.
                </p>

                <div className="flex items-center gap-2.5">
                    <button
                        className="flex-1 text-sm font-medium hover:cursor-pointer text-slate-600 hover:bg-slate-50 border border-slate-200 px-4 py-2.5 transition-colors duration-150"
                        onClick={onCancelClick}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex flex-1 items-center justify-center gap-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 active:scale-[0.98] hover:cursor-pointer px-4 py-2.5 transition-all duration-150"
                        onClick={handleLogoutClick}
                    >
                        {submitting ? (
                            <>
                                <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Logging out...
                            </>
                        ) : (
                            "Log out"
                        )}
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.2s ease-out both; }
        .animate-scale-in { animation: scaleIn 0.2s ease-out both; }
      `}</style>
        </div>
    );
}