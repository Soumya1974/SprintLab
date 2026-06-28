import { LayoutGrid, Plus } from "lucide-react";

export default function Workspaces() {
  return (
    <div className="px-4 sm:px-6 py-5 animate-fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-slate-800">Workspaces</h1>

        <button className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-all duration-150">
          <Plus className="h-4 w-4" />
          New Workspace
        </button>
      </div>

      <div className="flex flex-col items-center justify-center text-center bg-slate-50/60 border border-slate-100 rounded-2xl py-20 px-6 animate-fade-in-up [animation-delay:80ms]">
        <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-5">
          <LayoutGrid className="h-5 w-5 text-slate-400" />
        </div>

        <p className="text-base font-semibold text-slate-700 mb-1">
          No workspaces found
        </p>
        <p className="text-sm text-slate-400 mb-6">
          Create a new workspace to get started
        </p>

        <button className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-150">
          <Plus className="h-4 w-4" />
          Create Workspace
        </button>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out both; }
      `}</style>
    </div>
  );
}