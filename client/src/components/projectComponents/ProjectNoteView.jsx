import { ArrowUpRight, Pin } from "lucide-react";
import useWorkspaceStore from "../../store/workspaceStore";

const STATUS_STYLES = {
  pending: "bg-slate-100 text-slate-700 border border-slate-300",
  Todo: "bg-slate-100 text-slate-700 border border-slate-300",
  todo: "bg-slate-100 text-slate-700 border border-slate-300",
  "In Progress": "bg-blue-100 text-blue-800 border border-blue-300",
  "in-progress": "bg-blue-100 text-blue-800 border border-blue-300",
  Review: "bg-amber-100 text-amber-900 border border-amber-300",
  Completed: "bg-emerald-100 text-emerald-900 border border-emerald-300",
  Done: "bg-emerald-100 text-emerald-900 border border-emerald-300",
  done: "bg-emerald-100 text-emerald-900 border border-emerald-300",
};

const STATUS_LABELS = {
  pending: "TO DO",
  Todo: "TO DO",
  todo: "TO DO",
  "In Progress": "IN PROGRESS",
  "in-progress": "IN PROGRESS",
  Review: "IN REVIEW",
  Completed: "DONE",
  Done: "DONE",
  done: "DONE",
};

const AVATAR_FALLBACK_COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

function formatDate(date) {
  if (!date) return "No date set";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function ProjectNoteView({ projects = [] }) {
  const setWorkspaceData = useWorkspaceStore((state) => state.setWorkspaceData);
  const setProjectDetails = useWorkspaceStore((state) => state.setProjectDetails);
  const setWorkspaceDueDate = useWorkspaceStore((state) => state.setWorkspaceDueDate);

  const handleOpen = (project) => {
    setWorkspaceData(project._id);
    setProjectDetails(project);
    setWorkspaceDueDate(project.dueDate);
  };

  return (
    /* Bento Grid Masonry Container - Card heights expand independently based on content */
    <div className="w-full px-5 columns-1 md:columns-2 xl:columns-3 gap-5 space-y-5">
      {projects.map((project, idx) => {
        const safeColor = /^#[0-9A-Fa-f]{6}$/.test(project.color)
          ? project.color
          : "#3b82f6";
        const statusLabel =
          STATUS_LABELS[project.status] || project.status?.toUpperCase() || "TO DO";

        return (
          <div
            key={project._id}
            className="break-inside-avoid inline-block w-full"
          >
            <div
              className="relative border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 p-5 overflow-hidden group animate-fade-in-up"
              style={{
                backgroundImage: `linear-gradient(to bottom, transparent, transparent 27px, rgba(148, 163, 184, 0.25) 28px)`,
                backgroundSize: "100% 28px",
                backgroundAttachment: "local",
              }}
            >
              {/* Left Rolling Paper Margin Line */}
              <div className="absolute top-0 bottom-0 left-8 border-r border-rose-300/60" />

              {/* Note Content */}
              <div className="pl-5 pt-1">
                {/* Note Top Bar: Pin, Workspace Tag, Color dot, Status */}
                <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: safeColor }}
                    />
                    <span className="text-[11px] font-bold tracking-wider text-slate-600">
                      Workspace: {idx + 1}
                    </span>
                  </div>

                  {/* Jira Status Badge */}
                  <span
                    className={`text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded uppercase whitespace-nowrap shadow-2xs ${STATUS_STYLES[project.status] || "bg-slate-200 text-slate-700"
                      }`}
                  >
                    {statusLabel}
                  </span>
                </div>

                {/* 1. Title */}
                <div className="mb-2">
                  <span className="text-xs font-bold text-slate-500">Title: </span>
                  <span className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </span>
                </div>

                {/* 2. Description */}
                <div className="text-xs text-slate-700 leading-7 whitespace-pre-line mb-3">
                  <span className="font-bold text-slate-500">description: </span>
                  {project.description ? (
                    <span>{project.description}</span>
                  ) : (
                    <span className="text-slate-400 italic">No description</span>
                  )}
                </div>

                {/* 3. Members List */}
                <div className="mb-3 text-xs text-slate-700">
                  <div className="font-bold text-slate-500 mb-1">
                    Members: ({project.members?.length || 0})
                  </div>
                  {project.members && project.members.length > 0 ? (
                    <div className="pl-2 space-y-1">
                      {project.members.map((member, i) => (
                        <div
                          key={member.user?._id || member.user?.name || i}
                          className="flex items-center gap-1.5 text-xs text-slate-700 font-medium"
                        >
                          <span className="text-slate-400 text-[11px]">{i + 1}.</span>
                          <div className="h-4 w-4 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-[8px] font-bold text-white bg-slate-400">
                            {member.user?.avatar ? (
                              <img
                                src={member.user.avatar}
                                alt={member.user?.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className={`h-full w-full flex items-center justify-center ${AVATAR_FALLBACK_COLORS[i % AVATAR_FALLBACK_COLORS.length]}`}>
                                {getInitials(member.user?.name)}
                              </div>
                            )}
                          </div>
                          <span>{member.user?.name || "Unnamed Member"}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-[11px] pl-2">No members assigned</span>
                  )}
                </div>

                {/* 4. Due Date */}
                <div className="mb-4 text-xs text-slate-700">
                  <span className="font-bold text-slate-500">Duedate: </span>
                  <span className="font-medium">{formatDate(project.dueDate)}</span>
                </div>

                {/* 5. Action Button */}
                <div className="pt-3 border-t border-slate-300/70">
                  <button
                    className="group w-full mt-4 flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-150"
                    onClick={() => handleOpen(project)}
                  >
                    Open
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
