import { Layers, UserPlus, Share2, Settings, ChevronDown, LogOutIcon } from "lucide-react";

export default function ProjectHeader() {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
      <div>
        <div className="flex items-center gap-3 mb-1.5">
          <div className="h-9 w-9 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
            <Layers className="h-4.5 w-4.5 text-violet-600" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Website Redesign
          </h1>
          <span className="text-xs font-medium bg-violet-50 text-violet-600 px-2.5 py-1 rounded-full">
            Active
          </span>
        </div>
        <p className="text-sm text-slate-500 ml-12">
          Redesign and improve better user
          experience.
        </p>
      </div>

      <div className="flex gap-2">

        <button className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg transition-colors duration-150">
          <UserPlus className="h-4 w-4" />
          Invite
        </button>
        <button className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg transition-colors duration-150">
          <LogOutIcon className="h-4 w-4" />
          Back
        </button>
        <button className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 px-3.5 py-2 rounded-lg transition-all duration-150">
          <Settings className="h-4 w-4" />
          Settings
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}