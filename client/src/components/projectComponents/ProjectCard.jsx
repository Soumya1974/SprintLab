import { useState } from "react";
import { Calendar, ArrowUpRight, Users, User, ChevronDown, ChevronUp } from "lucide-react";
import useWorkspaceStore from "../../store/workspaceStore";

const STATUS_STYLES = {
  Pending: "bg-slate-100 text-slate-700 border-slate-200",
  pending: "bg-slate-100 text-slate-700 border-slate-200",
  Todo: "bg-slate-100 text-slate-700 border-slate-200",
  todo: "bg-slate-100 text-slate-700 border-slate-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  "in-progress": "bg-blue-50 text-blue-700 border-blue-200",
  Review: "bg-amber-50 text-amber-700 border-amber-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  done: "bg-emerald-50 text-emerald-700 border-emerald-200",
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
  if (date === null || !date) {
    return "No date";
  }
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

function getOwnerInfo(owner, members = []) {
  if (owner && typeof owner === "object" && owner.name) {
    return owner;
  }
  if (typeof owner === "string") {
    const found = members.find(
      (m) => m.user?._id === owner || m.user === owner || m._id === owner
    );
    if (found?.user && typeof found.user === "object") return found.user;
  }
  const ownerMember = members.find(
    (m) => m.role === "owner" || m.role === "admin"
  );
  if (ownerMember?.user && typeof ownerMember.user === "object") {
    return ownerMember.user;
  }
  if (typeof owner === "string") {
    return { name: owner };
  }
  return null;
}

function StackedAvatars({ members = [] }) {
  if (!members || members.length === 0) {
    return <span className="text-xs italic text-slate-400">No members</span>;
  }
  const MAX_VISIBLE = 4;
  const visible = members.slice(0, MAX_VISIBLE);
  const overflow = members.length - visible.length;

  return (
    <div className="flex items-center -space-x-2 py-0.5">
      {visible.map((member, i) => {
        const user = member.user || member;
        const name = user?.name || "Member";
        const avatar = user?.avatar;
        return (
          <div
            key={user._id || user.email || i}
            title={name}
            className="h-6 w-6 shrink-0 overflow-hidden rounded-full ring-2 ring-white"
          >
            {avatar ? (
              <img src={avatar} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div
                className={`flex h-full w-full items-center justify-center text-[10px] font-semibold text-white ${
                  AVATAR_FALLBACK_COLORS[i % AVATAR_FALLBACK_COLORS.length]
                }`}
              >
                {getInitials(name)}
              </div>
            )}
          </div>
        );
      })}
      {overflow > 0 && (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600 ring-2 ring-white">
          +{overflow}
        </div>
      )}
    </div>
  );
}

function ExpandedMemberList({ members = [] }) {
  if (!members || members.length === 0) {
    return <span className="text-xs italic text-slate-400">No members</span>;
  }

  return (
    <div className="flex max-h-32 flex-wrap items-center gap-1.5 overflow-y-auto py-0.5">
      {members.map((member, i) => {
        const user = member.user || member;
        const name = user?.name || "Member";
        const avatar = user?.avatar;
        return (
          <div
            key={user._id || user.email || i}
            className="inline-flex max-w-32 items-center gap-1.5 border border-[#E5E7EB] bg-white px-2 py-1 text-xs font-medium text-slate-700"
            title={name}
          >
            <div className="h-4 w-4 shrink-0 overflow-hidden rounded-full">
              {avatar ? (
                <img src={avatar} alt={name} className="h-full w-full object-cover" />
              ) : (
                <div
                  className={`flex h-full w-full items-center justify-center text-[8px] font-semibold text-white ${
                    AVATAR_FALLBACK_COLORS[i % AVATAR_FALLBACK_COLORS.length]
                  }`}
                >
                  {getInitials(name)}
                </div>
              )}
            </div>
            <span className="truncate">{name}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ProjectCard({ projectData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectWorkspace = useWorkspaceStore((state) => state.selectWorkspace);

  const { _id, title, description, status, dueDate, color, members = [], owner } = projectData;

  const safeColor = /^#[0-9A-Fa-f]{6}$/.test(color) ? color : "#2563eb";
  const ownerObj = getOwnerInfo(owner, members);

  return (
    <div className="flex h-full flex-col border border-[#E5E7EB] bg-white p-4 transition-colors duration-150 hover:border-blue-300">
      {/* Top row: title, status, due date */}
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="truncate text-sm font-semibold text-slate-900">{title}</h3>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${
              STATUS_STYLES[status] || "border-slate-200 bg-slate-100 text-slate-700"
            }`}
          >
            {status}
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            {formatDate(dueDate)}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-slate-500">
        {description || <span className="italic text-slate-400">No description provided</span>}
      </p>

      {/* Owner + members row */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
          <User className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="shrink-0 font-medium text-slate-600">Owner</span>
          <div className="h-4 w-4 shrink-0 overflow-hidden rounded-full">
            {ownerObj?.avatar ? (
              <img src={ownerObj.avatar} alt={ownerObj.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-blue-500 text-[8px] font-semibold text-white">
                {getInitials(ownerObj?.name)}
              </div>
            )}
          </div>
          <span className="truncate font-medium text-slate-700">{ownerObj?.name || "Unassigned"}</span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex shrink-0 items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600"
          title={isExpanded ? "Collapse member list" : "Expand member list"}
        >
          <Users className="h-3.5 w-3.5 text-slate-400" />
          {members.length}
          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {isExpanded ? (
        <div className="mb-3">
          <ExpandedMemberList members={members} />
        </div>
      ) : (
        <div className="mb-3 cursor-pointer" onClick={() => setIsExpanded(true)}>
          <StackedAvatars members={members} />
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-end border-t border-[#E5E7EB] pt-3">
        <button
          className="group flex items-center gap-1.5 border border-[#E5E7EB] px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors duration-150 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          onClick={() => selectWorkspace(_id, projectData, dueDate)}
        >
          Open
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}