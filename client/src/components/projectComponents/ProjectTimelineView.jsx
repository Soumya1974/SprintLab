import { useMemo, useState } from "react";
import { CalendarRange } from "lucide-react";
import useWorkspaceStore from "../../store/workspaceStore";

const STATUS_STYLES = {
  pending: "bg-slate-50 text-slate-700",
  todo: "bg-slate-50 text-slate-700",
  "in-progress": "bg-blue-50 text-blue-700",
  done: "bg-slate-50 text-emerald-700",
};


const FILTERS = [
  { key: "all", label: "All" },
  { key: "todo", label: "Todo" },
  { key: "in-progress", label: "In Progress" },
  { key: "done", label: "Done" },
  { key: "overdue", label: "Overdue" },
];

const DAY_MS = 24 * 60 * 60 * 1000;

function formatDate(date) {
  if (!date) return "No date";
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function startOfDay(dateInput) {
  const date = new Date(dateInput);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getProjectStart(project) {
  return project.createdAt || project.created || project.updatedAt || project.dueDate || new Date().toISOString();
}

function getCompletionPercent(project) {
  if (typeof project.completionRate === "number") return Math.max(0, Math.min(100, project.completionRate));

  const status = (project.status || "pending").toLowerCase();
  if (status === "done" || status === "completed") return 100;
  if (status === "in-progress") return 50;
  if (status === "pending") return 10;
  return 0;
}

function isOverdue(project) {
  const status = (project.status || "").toLowerCase();
  if (status === "done" || status === "completed" || !project.dueDate) return false;
  return startOfDay(project.dueDate).getTime() < startOfDay(new Date()).getTime();
}

export default function ProjectNoteView({ projects = [] }) {
  const selectWorkspace = useWorkspaceStore((state) => state.selectWorkspace);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleOpen = (project) => {
    selectWorkspace(project._id, project, project.dueDate);
  };

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    if (activeFilter === "overdue") return projects.filter((p) => isOverdue(p));
    return projects.filter((p) => (p.status || "").toLowerCase() === activeFilter);
  }, [projects, activeFilter]);

  const timeline = useMemo(() => {
    if (!filteredProjects.length) {
      return { start: startOfDay(new Date()), end: startOfDay(new Date(Date.now() + 7 * DAY_MS)), span: 7 };
    }

    const startValues = filteredProjects.map((p) => startOfDay(getProjectStart(p)).getTime());
    const dueValues = filteredProjects.map((p) => startOfDay(p.dueDate || getProjectStart(p)).getTime());
    const minDate = Math.min(...startValues, ...dueValues) - DAY_MS * 2;
    const maxDate = Math.max(...startValues, ...dueValues) + DAY_MS * 2;
    const span = Math.max(1, (maxDate - minDate) / DAY_MS);

    return { start: new Date(minDate), end: new Date(maxDate), span };
  }, [filteredProjects]);

  const weekTicks = useMemo(() => {
    const ticks = [];
    const weekCount = Math.ceil(timeline.span / 7);
    for (let i = 0; i <= weekCount; i++) {
      const date = new Date(timeline.start.getTime() + i * 7 * DAY_MS);
      ticks.push({ date, left: ((i * 7) / timeline.span) * 100 });
    }
    return ticks;
  }, [timeline]);

  const todayLeft = useMemo(() => {
    const today = startOfDay(new Date()).getTime();
    const offset = (today - timeline.start.getTime()) / DAY_MS;
    return Math.max(0, Math.min(100, (offset / timeline.span) * 100));
  }, [timeline]);

  return (
    <div className="w-full px-5 pb-5">
      {/* Header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center border border-[#E5E7EB] bg-blue-50 text-blue-600">
            <CalendarRange className="h-4 w-4" />
          </div>
          <h2 className="text-sm font-semibold text-slate-900">Project Timeline</h2>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`border px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                activeFilter === f.key
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-[#E5E7EB] bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gantt table */}
      <div className="overflow-x-auto border border-[#E5E7EB] bg-white">
        <div className="min-w-240">
          {/* Date header */}
          <div className="grid grid-cols-[240px_minmax(0,1fr)] border-b border-[#E5E7EB]">
            <div className="border-r border-[#E5E7EB] px-3 py-2 text-xs font-semibold text-slate-900">
              Workspace
            </div>
            <div className="relative h-8">
              {weekTicks.map((tick, i) => (
                <div
                  key={i}
                  className="absolute top-0 h-full border-l border-[#E5E7EB] pl-1.5 text-[11px] text-slate-500"
                  style={{ left: `${tick.left}%` }}
                >
                  <span className="pt-1.5 inline-block">
                    {tick.date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          {filteredProjects.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              No workspaces match this filter.
            </div>
          ) : (
            filteredProjects.map((project) => {
              const startValue = startOfDay(getProjectStart(project)).getTime();
              const dueValue = startOfDay(project.dueDate || getProjectStart(project)).getTime();
              const safeDue = Math.max(dueValue, startValue);
              const left = ((startValue - timeline.start.getTime()) / DAY_MS / timeline.span) * 100;
              const width = Math.max(6, ((safeDue - startValue) / DAY_MS / timeline.span) * 100);
              const status = (project.status || "pending").toLowerCase();
              const statusLabel = status.replace("-", " ");
              const priority = project.priority || "Low";
              const safeColor = /^#[0-9A-Fa-f]{6}$/.test(project.color || "") ? project.color : "#2563eb";
              const percent = getCompletionPercent(project);

              return (
                <button
                  key={project._id}
                  type="button"
                  onClick={() => handleOpen(project)}
                  className="grid w-full grid-cols-[240px_minmax(0,1fr)] items-stretch border-b border-[#E5E7EB] text-left transition-colors last:border-b-0 hover:bg-blue-50/40"
                >
                  <div className="min-w-0 border-r border-[#E5E7EB] px-3 py-3">
                    <div>
                      <span className="truncate text-sm font-medium text-slate-900">{project.title}</span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-medium ${
                          STATUS_STYLES[status] || "bg-slate-50 text-slate-700"
                        }`}
                      >
                        {statusLabel}
                      </span>
                      {isOverdue(project) && (
                        <span className="bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700">
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="relative min-h-14">
                    {weekTicks.map((tick, i) => (
                      <div
                        key={i}
                        className="absolute inset-y-0 border-l border-slate-100"
                        style={{ left: `${tick.left}%` }}
                      />
                    ))}

                    <div
                      className="absolute inset-y-0 z-10 w-px bg-blue-600"
                      style={{ left: `${todayLeft}%` }}
                    />

                    <div
                      className="absolute top-1/2 h-6 -translate-y-1/2 border"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        borderColor: safeColor,
                        backgroundColor: `${safeColor}1a`,
                      }}
                    >
                      <div
                        className="h-full"
                        style={{ width: `${percent}%`, backgroundColor: `${safeColor}4d` }}
                      />
                    </div>

                    <div
                      className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap px-2 text-[11px] font-medium text-slate-700"
                      style={{ left: `calc(${left}% + ${width}% + 8px)` }}
                    >
                      {percent}% · Due {formatDate(project.dueDate)}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}