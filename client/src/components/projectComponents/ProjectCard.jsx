import { useState } from "react";
import { Calendar, ArrowUpRight, Crown, Users, User, ChevronDown, ChevronUp } from "lucide-react";
import useWorkspaceStore from "../../store/workspaceStore";

const STATUS_TEXT_STYLES = {
    Pending: "text-slate-600 border-slate-300",
    pending: "text-slate-600 border-slate-300",
    Todo: "text-blue-600 border-blue-300",
    todo: "text-blue-600 border-blue-300",
    "In Progress": "text-amber-600 border-amber-300",
    "in-progress": "text-amber-600 border-amber-300",
    Review: "text-purple-600 border-purple-300",
    Completed: "text-emerald-600 border-emerald-300",
    Done: "text-emerald-600 border-emerald-300",
    done: "text-emerald-600 border-emerald-300",
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
        return <span className="text-xs text-slate-400 italic">No members</span>;
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
                        className="h-7 w-7 rounded-full ring-2 ring-white overflow-hidden shrink-0 shadow-xs"
                    >
                        {avatar ? (
                            <img
                                src={avatar}
                                alt={name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div
                                className={`h-full w-full flex items-center justify-center text-[10px] font-bold text-white ${AVATAR_FALLBACK_COLORS[i % AVATAR_FALLBACK_COLORS.length]
                                    }`}
                            >
                                {getInitials(name)}
                            </div>
                        )}
                    </div>
                );
            })}
            {overflow > 0 && (
                <div className="h-7 w-7 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0 shadow-xs">
                    +{overflow}
                </div>
            )}
        </div>
    );
}

function ExpandedMemberList({ members = [] }) {
    if (!members || members.length === 0) {
        return <span className="text-xs text-slate-400 italic">No members</span>;
    }

    return (
        <div className="flex flex-wrap gap-1.5 items-center max-h-40 overflow-y-auto py-0.5">
            {members.map((member, i) => {
                const user = member.user || member;
                const name = user?.name || "Member";
                const avatar = user?.avatar;
                return (
                    <div
                        key={user._id || user.email || i}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/90 border border-slate-200 text-xs text-slate-700 font-medium shadow-2xs max-w-35"
                        title={name}
                    >
                        <div className="h-4 w-4 rounded-full overflow-hidden shrink-0">
                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt={name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div
                                    className={`h-full w-full flex items-center justify-center text-[8px] font-bold text-white ${AVATAR_FALLBACK_COLORS[i % AVATAR_FALLBACK_COLORS.length]
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

    const setWorkspaceData = useWorkspaceStore((state) => state.setWorkspaceData);
    const setProjectDetails = useWorkspaceStore((state) => state.setProjectDetails);
    const setWorkspaceDueDate = useWorkspaceStore((state) => state.setWorkspaceDueDate);

    const {
        _id,
        title,
        description,
        status,
        dueDate,
        color,
        members = [],
        owner,
    } = projectData;

    const safeColor = /^#[0-9A-Fa-f]{6}$/.test(color) ? color : "#64748b";
    const ownerObj = getOwnerInfo(owner, members);

    return (
        <div className="relative animate-fade-in-up h-full bg-white border border-slate-200 p-4 overflow-hidden hover:border-slate-300 hover:shadow-lg shadow-sm hover:-translate-y-0.5 transition-all duration-200 ease-out flex flex-col">

            <div className="pl-3 flex-1">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                        {title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                        <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded border whitespace-nowrap ${
                                STATUS_TEXT_STYLES[status] || "text-slate-600 border-slate-300"
                            }`}
                        >
                            {status}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-500 whitespace-nowrap">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {formatDate(dueDate)}
                        </span>
                    </div>
                </div>

                <p className="text-sm text-slate-500 mb-3 line-clamp-3 leading-relaxed">
                    {description || <span className="italic text-slate-400">No description provided</span>}
                </p>

                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                    <div className="flex items-center gap-1.5 truncate">
                        <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-600 shrink-0">Owner:</span>
                        <div className="flex items-center gap-1 truncate">
                            <div className="h-4 w-4 rounded-full overflow-hidden shrink-0">
                                {ownerObj?.avatar ? (
                                    <img
                                        src={ownerObj.avatar}
                                        alt={ownerObj.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-blue-500 flex items-center justify-center text-[8px] font-bold text-white">
                                        {getInitials(ownerObj?.name)}
                                    </div>
                                )}
                            </div>
                            <span className="font-semibold text-slate-700 truncate">
                                {ownerObj?.name || "Unassigned"}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between gap-1.5 text-slate-500 hover:text-slate-800 focus:outline-hidden group cursor-pointer py-1"
                    title={isExpanded ? "Collapse member list" : "Expand member list"}
                >
                    <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">
                            Members ({members.length})
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 group-hover:text-blue-600 transition-colors">
                        <span>{isExpanded ? "Hide" : "Show"}</span>
                        {isExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                        )}
                    </div>
                </button>

                {isExpanded && (
                    <div className="mt-1.5">
                        <ExpandedMemberList members={members} />
                    </div>
                )}
                {!isExpanded && (
                    <div
                        onClick={() => setIsExpanded(true)}
                        className="cursor-pointer mt-1"
                        title="Click to show all member names"
                    >
                        <StackedAvatars members={members} />
                    </div>
                )}
            </div>

            <div className="pl-3 pt-3 mt-3 border-t border-slate-200/80">
                <button
                    className="group w-full flex items-center justify-center gap-1.5 text-sm font-semibold py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-150 shadow-2xs hover:cursor-pointer active:scale-98"
                    onClick={() => {
                        setWorkspaceData(_id);
                        setProjectDetails(projectData);
                        setWorkspaceDueDate(dueDate);
                    }}
                >
                    Open
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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