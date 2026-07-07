import { TriangleAlert } from "lucide-react";
import { createPortal } from "react-dom";

export default function NoteConflictModal({ onOk }) {
    return createPortal(

        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-900/40 animate-fade-in" />

            <div className="relative bg-white border border-slate-200 shadow-xl w-full max-w-sm p-6 animate-scale-in">

                <h2 className="text-base font-semibold text-slate-800 mb-4 flex gap-2 items-center">
                   
                    <TriangleAlert className="h-5 w-5 text-red-500" />
                   
                    <span>This note has been updated</span>
                </h2>

                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    Another team member saved changes while you were editing. Your
                    changes have not been saved.{" "}
                    <span className="font-medium text-slate-700">
                        Make sure you copy the text before refreshing.
                    </span>
                </p>

                <button
                    onClick={onOk}
                    className="w-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] px-4 py-2.5 rounded-lg transition-all duration-150"
                >
                    Ok, got it
                </button>
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
        </div>,
        document.body
    );
}