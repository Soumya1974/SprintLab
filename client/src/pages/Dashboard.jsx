import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  CircleDashed,
  Clock3,
  ListTodo,
  Loader2,
  Target,
  Users,
} from "lucide-react";
import Sidebar from "../components/kanbanComponents/Sidebar";
import Topbar from "../components/kanbanComponents/Topbar";
import LogoutModal from "../components/authComponents/LogoutModal";
import Workspaces from "../components/kanbanComponents/Workspaces";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import useWorkspaceStore from "../store/workspaceStore";
import { socket } from "../socket";

const CARD = "border border-[#E5E7EB] bg-white";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "total", label: "Total Tasks" },
  { key: "todo", label: "Todo" },
  { key: "in-progress", label: "In Progress" },
  { key: "done", label: "Done" },
  { key: "overdue", label: "Overdue" },
  { key: "completion", label: "Completion" },
];

function SectionLabel({ title, right }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {right}
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, hint, active }) {
  return (
    <div
      className={`${CARD} p-4 ${active ? "border-blue-600 ring-1 ring-blue-600" : ""}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <div className="flex h-7 w-7 items-center justify-center border border-[#E5E7EB] bg-blue-50 text-blue-600">
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

// Groups activity records into day buckets for the last `days` days.
// Stand-in for real velocity data — swap for a backend `dailyCompleted`
// series if/when one exists, using the same {label, value} shape.
function buildActivityTrend(activities, days = 7) {
  const buckets = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(now.getDate() - i);
    day.setHours(0, 0, 0, 0);
    buckets.push({
      date: day,
      label: day.toLocaleDateString("en-US", { weekday: "short" }),
      value: 0,
    });
  }

  (activities || []).forEach((item) => {
    const created = new Date(item.createdAt);
    created.setHours(0, 0, 0, 0);
    const bucket = buckets.find((b) => b.date.getTime() === created.getTime());
    if (bucket) bucket.value += 1;
  });

  return buckets;
}

function AreaTrendChart({ data }) {
  const width = 700;
  const height = 220;
  const padding = { top: 16, right: 12, bottom: 24, left: 12 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = padding.left + stepX * i;
    const y = padding.top + innerH - (d.value / maxValue) * innerH;
    return { x, y };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath =
    `${linePath} ` +
    `L ${points[points.length - 1].x.toFixed(1)} ${padding.top + innerH} ` +
    `L ${points[0].x.toFixed(1)} ${padding.top + innerH} Z`;

  const gridLines = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>

      {gridLines.map((g) => (
        <line
          key={g}
          x1={padding.left}
          x2={width - padding.right}
          y1={padding.top + innerH * (1 - g)}
          y2={padding.top + innerH * (1 - g)}
          stroke="#F1F5F9"
          strokeWidth="1"
        />
      ))}

      <path d={areaPath} fill="url(#trendFill)" stroke="none" />
      <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#2563eb" />
      ))}

      {data.map((d, i) => (
        <text key={d.label + i} x={points[i].x} y={height - 4} textAnchor="middle" fontSize="10" fill="#94a3b8">
          {d.label}
        </text>
      ))}
    </svg>
  );
}

function ProgressRow({ label, value, color = "bg-blue-600" }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
        <span>{label}</span>
        <span className="font-medium text-slate-900">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden bg-slate-100">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function formatTimestamp(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatActivityLabel(action) {
  return action?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function initialOf(name) {
  return name?.charAt(0)?.toUpperCase() || "U";
}

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const workspaceData = useWorkspaceStore((state) => state.workspaceData);
  const allWorkspaces = useWorkspaceStore((state) => state.allWorkspaces);
  const projectDetails = useWorkspaceStore((state) => state.projectDetails);
  const selectWorkspace = useWorkspaceStore((state) => state.selectWorkspace);
  const accessToken = useAuthStore((state) => state.accessToken);
  const cacheRef = useRef(new Map());
  const didInitDefaultWorkspace = useRef(false);

  const fetchDashboard = useCallback(
    async (showSpinner = true) => {
      if (!workspaceData) {
        setDashboardData(null);
        return;
      }

      if (cacheRef.current.has(workspaceData)) {
        setDashboardData(cacheRef.current.get(workspaceData));
        if (showSpinner) {
          setLoading(false);
        }
        return;
      }

      try {
        if (showSpinner) {
          setLoading(true);
        }
        setError("");
        const response = await api.get(`/api/workspaces/dashboard/${workspaceData}`);
        const payload = response.data;
        cacheRef.current.set(workspaceData, payload);
        setDashboardData(payload);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load workspace analytics");
      } finally {
        if (showSpinner) {
          setLoading(false);
        }
      }
    },
    [workspaceData]
  );

  useEffect(() => {
    if (!didInitDefaultWorkspace.current && !workspaceData && allWorkspaces.length > 0) {
      const firstWorkspace = allWorkspaces[0];
      didInitDefaultWorkspace.current = true;
      selectWorkspace(firstWorkspace._id, firstWorkspace, firstWorkspace.dueDate);
      return;
    }

    if (!workspaceData) return;

    fetchDashboard();
  }, [workspaceData, allWorkspaces, fetchDashboard, selectWorkspace]);

  useEffect(() => {
    if (!workspaceData || !accessToken) return undefined;

    socket.auth = { token: accessToken };

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-workspace", { workspaceId: workspaceData });

    const handleRealtimeRefresh = async () => {
      cacheRef.current.delete(workspaceData);
      setLoading(true);
      setError("");
      await fetchDashboard(false);
      setLoading(false);
    };

    socket.on("task:created", handleRealtimeRefresh);
    socket.on("task:updated", handleRealtimeRefresh);
    socket.on("task:status-changed", handleRealtimeRefresh);
    socket.on("activity:new", handleRealtimeRefresh);

    return () => {
      socket.emit("leave-workspace", { workspaceId: workspaceData });
      socket.off("task:created", handleRealtimeRefresh);
      socket.off("task:updated", handleRealtimeRefresh);
      socket.off("task:status-changed", handleRealtimeRefresh);
      socket.off("activity:new", handleRealtimeRefresh);
      socket.disconnect();
    };
  }, [workspaceData, accessToken, fetchDashboard]);

  const metrics = dashboardData?.metrics || {};
  const workspace = dashboardData?.workspace || projectDetails;
  const activities = dashboardData?.activities || [];
  const memberTaskCounts = dashboardData?.memberTaskCounts || [];
  const upcomingDeadlines = dashboardData?.upcomingDeadlines || [];

  const trend = useMemo(() => buildActivityTrend(activities), [activities]);

  const distribution = [
    { key: "todo", label: "Todo", value: metrics.todo || 0, color: "bg-slate-400" },
    { key: "in-progress", label: "In Progress", value: metrics.inProgress || 0, color: "bg-blue-600" },
    { key: "done", label: "Done", value: metrics.done || 0, color: "bg-emerald-500" },
  ];
  const distributionTotal = Math.max(distribution.reduce((sum, d) => sum + d.value, 0), 1);

  const roleCounts = memberTaskCounts.reduce(
    (acc, member) => {
      const role = (member.role || "").toLowerCase();
      if (role === "viewer") acc.viewers += 1;
      else acc.members += 1;
      return acc;
    },
    { viewers: 0, members: 0 }
  );

  const remainingTasks = Math.max((metrics.totalTasks || 0) - (metrics.done || 0), 0);

  // Filter bar only narrows what's shown client-side — see note above the component.
  const visibleDistribution =
    activeFilter === "all" || activeFilter === "total" || activeFilter === "completion"
      ? distribution
      : distribution.filter((d) => d.key === activeFilter || (activeFilter === "overdue" && d.key === "todo"));

  const components = {
    dashboard: (
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">SprintLab</p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
              {workspace?.title || "Workspace analytics"}
            </h1>
          </div>
          <span className="px-3 py-1 text-xs font-medium text-slate-700">
            {workspace?.status || "Active"} : {metrics.totalTasks || 0} tasks
          </span>
        </div>

        {/* Filter bar */}
        <div className="mb-5 flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`border px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${activeFilter === f.key
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-[#E5E7EB] bg-white text-slate-700 hover:bg-slate-50"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className={`${CARD} p-6 text-sm text-slate-500 flex items-center gap-2`}>
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span>Loading workspace analytics…</span>
          </div>
        ) : !workspaceData ? (
          <div className={`${CARD} p-6 text-sm text-slate-500`}>
            Select a workspace from the topbar to view its analytics dashboard.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* KPI row — consolidated to 4 cards */}
            <div className="lg:col-span-3">
              <KpiCard
                title="Total Tasks"
                value={metrics.totalTasks || 0}
                icon={BarChart3}
                hint={`${metrics.overdueTasks || 0} overdue`}
                active={activeFilter === "total" || activeFilter === "overdue"}
              />
            </div>

            <div className="lg:col-span-3">
              <div
                className={`${CARD} p-4 ${["todo", "in-progress", "done", "pending"].includes(activeFilter)
                  ? "border-blue-600 ring-1 ring-blue-600"
                  : ""
                  }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900">Status Breakdown</p>
                  <div className="flex h-7 w-7 items-center justify-center border border-[#E5E7EB] bg-blue-50 text-blue-600">
                    <ListTodo className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="mt-2 space-y-1 text-xs">
                  {distribution.map((d) => (
                    <div key={d.key} className="flex items-center justify-between">
                      <span className="text-slate-600">{d.label}</span>
                      <span className="font-semibold text-slate-900">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <KpiCard
                title="Completion"
                value={`${metrics.completionRate || 0}%`}
                icon={Target}
                hint={`${remainingTasks} remaining`}
                active={activeFilter === "completion"}
              />
            </div>

            <div className="lg:col-span-3">
              <div className={`${CARD} p-4`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900">Team Members</p>
                  <div className="flex h-7 w-7 items-center justify-center border border-[#E5E7EB] bg-blue-50 text-blue-600">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                  {metrics.teamMembers || 0}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                  <span>{roleCounts.members} members</span>
                  <span>{roleCounts.viewers} viewers</span>
                </div>
              </div>
            </div>

            {/* Trend chart */}
            <div className="lg:col-span-8">
              <div className={`${CARD} p-4`}>
                <SectionLabel
                  title="Team activity, last 7 days"
                  right={
                    <span className="text-xs text-slate-500">
                      {trend.reduce((s, d) => s + d.value, 0)} events
                    </span>
                  }
                />
                <div className="h-60">
                  <AreaTrendChart data={trend} />
                </div>
              </div>
            </div>

            {/* Recent activity — fixed height, scrollable */}
            <div className="lg:col-span-4">
              <div className={`${CARD} p-4`}>
                <SectionLabel title="Recent activity" />
                <div className="h-60 overflow-y-auto pr-1">
                  <div className="space-y-2">
                    {activities.length > 0 ? (
                      activities.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-start gap-2.5 border border-gray-50 bg-slate-50/60 px-3 py-2"
                        >
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-semibold text-blue-700">
                            {initialOf(item.userId?.name)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs text-slate-700">
                              <span className="font-medium text-slate-900">
                                {item.userId?.name || "Team member"}
                              </span>{" "}
                              {formatActivityLabel(item.action)}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-500">
                              {formatTimestamp(item.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No recent activity to show.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Member workload */}
            <div className="lg:col-span-4">
              <div className={`${CARD} h-full p-4`}>
                <SectionLabel title="Member workload" />
                <div className="space-y-2">
                  {memberTaskCounts.length > 0 ? (
                    memberTaskCounts.map((member) => (
                      <div
                        key={member.user?._id || member.user?.email || member.role}
                        className="flex items-center justify-between border border-[#E5E7EB] px-3 py-2"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                            {initialOf(member.user?.name)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {member.user?.name || "Member"}
                            </div>
                            <div className="text-[11px] text-slate-500">{member.role}</div>
                          </div>
                        </div>
                        <span className="border border-[#E5E7EB] bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {member.assignedTasks || 0}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No members in this workspace.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Task distribution */}
            <div className="lg:col-span-4">
              <div className={`${CARD} h-full p-4`}>
                <SectionLabel title="Task distribution" />
                <div className="space-y-3">
                  {visibleDistribution.map((d) => (
                    <ProgressRow
                      key={d.key}
                      label={d.label}
                      value={Math.round((d.value / distributionTotal) * 100)}
                      color={d.color}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming deadlines */}
            <div className="lg:col-span-4">
              <div className={`${CARD} h-full p-4`}>
                <SectionLabel title="Upcoming deadlines" />
                {upcomingDeadlines.length > 0 ? (
                  <div className="space-y-2">
                    {upcomingDeadlines.map((task) => (
                      <div
                        key={task._id}
                        className="flex items-center justify-between border border-[#E5E7EB] px-3 py-2"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <CalendarClock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span className="truncate text-sm text-slate-700">{task.title}</span>
                        </div>
                        <span className="shrink-0 text-xs text-slate-500">
                          {formatTimestamp(task.dueDate)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center py-6 text-center">
                    <Clock3 className="h-5 w-5 text-slate-300" />
                    <p className="mt-2 text-sm text-slate-500">No upcoming deadlines</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    ),
    workspaces: <Workspaces onOpenClick={() => undefined} />,
  };

  return (
    <div className="h-screen w-full flex bg-slate-50 overflow-hidden font-sans">
      {isOpen && (
        <LogoutModal
          onCancelClick={() => {
            setIsOpen(false);
            setCollapsed(false);
          }}
        />
      )}

      <Sidebar
        collapsed={collapsed}
        onLogoutClick={() => {
          setIsOpen(true);
          setCollapsed(true);
        }}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        active={active}
        setActive={setActive}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-slate-50">{components[active]}</main>
      </div>
    </div>
  );
}