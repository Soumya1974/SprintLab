import { Calendar, ArrowUpRight, Folder, FileSpreadsheet, Users, Clock } from "lucide-react";
import useWorkspaceStore from "../../store/workspaceStore";

const STATUS_STYLES = {
  pending: "bg-green-100 text-green-800 border border-green-300",
  "In Progress": "bg-blue-100 text-blue-800 border border-blue-300",
  Review: "bg-amber-100 text-amber-800 border border-amber-300",
  Completed: "bg-emerald-100 text-emerald-800 border border-emerald-300",
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
  if (!date) return "No date";
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

function MemberAvatars({ members = [] }) {
  if (!members || members.length === 0) {
    return <span className="text-xs text-slate-400 italic">No members</span>;
  }
  const visible = members.slice(0, 3);
  const overflow = members.length - visible.length;

  return (
    <div className="flex items-center -space-x-1.5">
      {visible.map((member, i) => (
        <div
          key={member.user?._id ?? member.user?.name ?? i}
          title={member.user?.name}
          className="h-6 w-6 rounded-full ring-1 ring-slate-300 overflow-hidden shrink-0"
        >
          {member.user?.avatar ? (
            <img
              src={member.user.avatar}
              alt={member.user?.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className={`h-full w-full flex items-center justify-center text-[9px] font-bold text-white ${
                AVATAR_FALLBACK_COLORS[i % AVATAR_FALLBACK_COLORS.length]
              }`}
            >
              {getInitials(member.user?.name)}
            </div>
          )}
        </div>
      ))}
      {overflow > 0 && (
        <div className="h-6 w-6 rounded-full ring-1 ring-slate-300 bg-slate-200 flex items-center justify-center text-[9px] font-semibold text-slate-700 shrink-0">
          +{overflow}
        </div>
      )}
    </div>
  );
}

export default function ProjectListView({ projects = [] }) {
  const setWorkspaceData = useWorkspaceStore((state) => state.setWorkspaceData);
  const setProjectDetails = useWorkspaceStore((state) => state.setProjectDetails);
  const setWorkspaceDueDate = useWorkspaceStore((state) => state.setWorkspaceDueDate);

  const handleOpen = (project) => {
    setWorkspaceData(project._id);
    setProjectDetails(project);
    setWorkspaceDueDate(project.dueDate);
  };

  // Dynamic Excel summary stats calculation
  const totalWorkspaces = projects.length;

  const uniqueMemberIds = new Set(
    projects
      .flatMap((p) => (p.members || []).map((m) => m.user?._id || m.user?.name))
      .filter(Boolean)
  );
  const totalMembers =
    uniqueMemberIds.size ||
    projects.reduce((acc, p) => acc + (p.members?.length || 0), 0);

  const nearDueDateCount = projects.filter((p) => {
    if (!p.dueDate) return false;
    const due = new Date(p.dueDate).getTime();
    const now = new Date().getTime();
    const diffDays = (due - now) / (1000 * 60 * 60 * 24);
    return diffDays >= -1 && diffDays <= 7;
  }).length;

  return (
    <div className="w-full px-5">
      {/* Excel Sheet Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Card 1: Total Workspaces */}
        <div className="bg-white border-2 border-slate-300 overflow-hidden shadow-xs">
          <div className="bg-slate-100 border-b border-slate-300 px-3 py-1 flex items-center justify-between text-[11px] font-mono text-slate-600 select-none">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="bg-emerald-600 text-white px-1 rounded text-[9px] font-bold">
                A1
              </span>
              <span>=COUNTA(Workspaces)</span>
            </div>
            <Folder className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <div className="p-3 flex items-center justify-between bg-emerald-50/20">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Workspaces
              </p>
              <p className="text-2xl font-bold text-slate-800">{totalWorkspaces}</p>
            </div>
            <div className="h-9 w-9 rounded bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 font-bold text-sm font-mono">
              {totalWorkspaces}
            </div>
          </div>
        </div>

        {/* Card 2: Total Members */}
        <div className="bg-white border-2 border-slate-300 overflow-hidden shadow-xs">
          <div className="bg-slate-100 border-b border-slate-300 px-3 py-1 flex items-center justify-between text-[11px] font-mono text-slate-600 select-none">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="bg-blue-600 text-white px-1 rounded text-[9px] font-bold">
                B1
              </span>
              <span>=COUNT(Members)</span>
            </div>
            <Users className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <div className="p-3 flex items-center justify-between bg-blue-50/20">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Members
              </p>
              <p className="text-2xl font-bold text-slate-800">{totalMembers}</p>
            </div>
            <div className="h-9 w-9 rounded bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 font-bold text-sm font-mono">
              {totalMembers}
            </div>
          </div>
        </div>

        {/* Card 3: Near Due Date Tasks */}
        <div className="bg-white border-2 border-slate-300 overflow-hidden shadow-xs">
          <div className="bg-slate-100 border-b border-slate-300 px-3 py-1 flex items-center justify-between text-[11px] font-mono text-slate-600 select-none">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="bg-amber-600 text-white px-1 rounded text-[9px] font-bold">
                C1
              </span>
              <span>=COUNTIF(Due &lt;= 7d)</span>
            </div>
            <Clock className="h-3.5 w-3.5 text-amber-600" />
          </div>
          <div className="p-3 flex items-center justify-between bg-amber-50/20">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Near Due Date
              </p>
              <p className="text-2xl font-bold text-slate-800">{nearDueDateCount}</p>
            </div>
            <div className="h-9 w-9 rounded bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 font-bold text-sm font-mono">
              {nearDueDateCount}
            </div>
          </div>
        </div>
      </div>

      {/* Excel Table Grid */}
      <div className="bg-white border-2 border-slate-300 overflow-hidden">
        <div className="bg-slate-100 border-b border-slate-300 px-4 py-2 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span className="text-[13px] font-bold text-slate-800">
              Workspaces Spreadsheet
            </span>
            <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
              Sheet1
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            Total Rows:{" "}
            <span className="font-semibold text-slate-700">{projects.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-195 table-fixed">
            <thead>
              <tr className="bg-slate-200/90 text-slate-600 text-[13px] font-bold select-none">
                <th className="w-12 text-center py-1 border-b border-r border-slate-300 bg-slate-200">
                  #
                </th>
                <th className="py-1 px-3 border-b border-r border-slate-300">
                  Workspace Title
                </th>
                <th className="w-36 py-1 px-3 border-b border-r border-slate-300">
                  Status
                </th>
                <th className="py-1 px-3 border-b border-r border-slate-300">
                  Description
                </th>
                <th className="w-36 py-1 px-3 border-b border-r border-slate-300">
                  Members
                </th>
                <th className="w-36 py-1 px-3 border-b border-r border-slate-300">
                  Due Date
                </th>
                <th className="w-28 text-center py-1 px-3 border-b border-r border-slate-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-0 text-lg">
              {projects.map((project, index) => {
                return (
                  <tr
                    key={project._id}
                    className="hover:bg-blue-50/60 transition-colors duration-75 group"
                  >
                    <td className="w-12 text-center py-2.5 text-[11px] font-semibold text-slate-500 bg-slate-100 border-b border-r border-slate-300 select-none">
                      {index + 1}
                    </td>

                    <td className="py-2.5 px-3 border-b border-r border-slate-200 bg-white group-hover:bg-blue-50/40">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 truncate">
                          {project.title}
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 border-b border-r border-slate-200 bg-white group-hover:bg-blue-50/40">
                      <span
                        className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-sm whitespace-nowrap ${
                          STATUS_STYLES[project.status] ||
                          "bg-slate-100 text-slate-700 border border-slate-300"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 border-b border-r border-slate-200 bg-white group-hover:bg-blue-50/40 text-slate-600 truncate max-w-xs">
                      {project.description || (
                        <span className="text-slate-300 italic">Empty cell</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 border-b border-r border-slate-200 bg-white group-hover:bg-blue-50/40">
                      <MemberAvatars members={project.members} />
                    </td>

                    <td className="py-2.5 px-3 border-b border-r border-slate-200 bg-white group-hover:bg-blue-50/40 text-slate-600 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{formatDate(project.dueDate)}</span>
                      </div>
                    </td>

                    <td className="py-2 px-3 border-b border-r border-slate-200 bg-white group-hover:bg-blue-50/40 text-center">
                      <button
                        onClick={() => handleOpen(project)}
                        className="inline-flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-medium px-3 py-1 rounded transition-all duration-150 hover:cursor-pointer active:scale-95 shadow-xs"
                      >
                        <span>Open</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
