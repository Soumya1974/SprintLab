import { Layers, UserPlus, Share2, Settings, ChevronDown, LogOutIcon } from "lucide-react";
import useWorkspaceStore from "../../store/workspaceStore";

export default function ProjectHeader() {

  const clearWorkspaceData = useWorkspaceStore((state) => state.clearWorkspaceData);
  const projectDetails = useWorkspaceStore((state) => state.projectDetails);

  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
      <div>
        <div className="flex items-center gap-3 mb-1.5">
          <h1 className="text-2xl font-semibold text-slate-800">
            {projectDetails.title}
          </h1>
          <span style={{color: projectDetails.color}}  className="text-xs font-medium bg-violet-50 px-2.5 py-1 rounded-full">
            {projectDetails.status}
          </span>
        </div>
        <p className="text-sm text-slate-500">
          { projectDetails.description}
        </p>
      </div>

      <div className="flex gap-2">

        <button className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 border border-slate-200 px-3.5 py-2 rounded-lg hover:cursor-pointer transition-colors duration-150">
          <UserPlus className="h-4 w-4" />
          Invite
        </button>
        <button className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 border border-slate-200 px-3.5 py-2 rounded-lg hover:cursor-pointer transition-colors duration-150"
          onClick={clearWorkspaceData}
        >
          <LogOutIcon className="h-4 w-4" />
          Back
        </button>
        <button className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 px-3.5 py-2 rounded-lg hover:cursor-pointer transition-all duration-150">
          <Settings className="h-4 w-4" />
          Settings
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}