import { Calendar, ArrowUpRight } from "lucide-react";
import useWorkspaceStore from "../../store/workspaceStore";

const STATUS_STYLES = {
    pending: "bg-green-50 text-gray-600",
    "In Progress": "bg-blue-50 text-blue-600",
    Review: "bg-amber-50 text-amber-600",
    Completed: "bg-emerald-50 text-emerald-600",
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

    if(date === null){
        return "No data"
    }
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
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

const MAX_VISIBLE_AVATARS = 4;

function MemberAvatars({ members = [] }) {
    const visible = members.slice(0, MAX_VISIBLE_AVATARS);
    const overflow = members.length - visible.length;

    if (members.length === 0) return null;

    return (
        <div className="flex items-center -space-x-2">
            {visible.map((member, i) => (
                <div
                    key={member.id ?? member.name ?? i}
                    title={member.name}
                    className="h-7 w-7 rounded-full ring-2 ring-white overflow-hidden shrink-0"
                >
                    {member.avatarUrl ? (
                        <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div
                            className={`h-full w-full flex items-center justify-center text-[10px] font-medium text-white ${AVATAR_FALLBACK_COLORS[i % AVATAR_FALLBACK_COLORS.length]
                                }`}
                        >
                            {getInitials(member.name)}
                        </div>
                    )}
                </div>
            ))}

            {overflow > 0 && (
                <div className="h-7 w-7 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-medium text-slate-500 shrink-0">
                    +{overflow}
                </div>
            )}
        </div>
    );
}

export default function ProjectCard({ projectData, onOpenProjectClick }) {

    const workspaceData = useWorkspaceStore((state) => state.workspaceData);
    
    const {
        _id,
        title,
        description,
        status,
        dueDate,
        color,
        members = [],
    } = projectData;
    
    const safeColor = /^#[0-9A-Fa-f]{6}$/.test(color) ? color : "#64748b";

    return (
        <div className="relative h-full bg-white border border-slate-200 p-5 overflow-hidden hover:border-slate-300 hover:shadow-lg shadow-sm hover:-translate-y-0.5 transition-all duration-200 ease-out">
            
            <span
                className="absolute left-0 top-0 h-full w-1 rounded-l-2xl"
                style={{ backgroundColor: safeColor }}
            />

            <div className="flex items-start justify-between gap-3 mb-1.5">
                <h3 className="text-base font-semibold text-slate-800">{title}</h3>
                <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[status] || "bg-slate-100 text-slate-600"
                        }`}
                >
                    {status}
                </span>
            </div>

            <p className="text-sm text-slate-400 mb-4">{description}</p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <MemberAvatars members={members} />
                <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs">Due: {formatDate(dueDate)}</span>
                </div>
            </div>

            <button
                className="group w-full mt-4 flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-150"
                onClick={onOpenProjectClick}
            >
                Open
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
        </div>
    );
}