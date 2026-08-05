import {
  LayoutGrid,
  Users,
  ListChecks,
  UserRound,
  CircleCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Layers,
  Kanban,
  Map,
  BarChart2,
  Folder,
  Plus,
  Wrench
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import useWorkspaceStore from "../../store/workspaceStore";

function getWorkspaceInitial(title = "") {
  return title.trim().charAt(0).toUpperCase() || "W";
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  active,
  setActive,
  onLogoutClick
}) {
  const [workspaces, setWorkspaces] = useState([]);
  const [workspacesOpen, setWorkspacesOpen] = useState(true);
  const [tasksState, setTasksState] = useState({});

  const selectWorkspace = useWorkspaceStore((state) => state.selectWorkspace);
  const setWorkspaceDueDate = useWorkspaceStore((state) => state.setWorkspaceDueDate);
  const setAllWorkspaces = useWorkspaceStore((state) => state.setAllWorkspaces);
  const workspaceRefreshKey = useWorkspaceStore((state) => state.workspaceRefreshKey);

  useEffect(() => {
    let isMounted = true;

    const loadWorkspaces = async () => {
      try {
        const response = await api.get("/api/workspaces/get-projects");
        if (isMounted) {
          const payload = response.data.userProjects || [];
          setWorkspaces(payload);
          setAllWorkspaces(payload);
        }
      } catch (error) {
        if (isMounted && error.response?.status !== 401) {
          toast.error("Unable to load workspaces");
        }
      }
    };

    loadWorkspaces();

    return () => {
      isMounted = false;
    };
  }, [workspaceRefreshKey, setAllWorkspaces]);

  const openWorkspace = (workspace) => {
    selectWorkspace(workspace._id, workspace, workspace.dueDate);
    setWorkspaceDueDate(workspace.dueDate);
    setActive("workspaces");
    setMobileOpen(false);
  };

  const toggleTasksFor = async (workspaceId) => {
    setTasksState((s) => ({
      ...s,
      [workspaceId]: { ...(s[workspaceId] || {}), open: !s[workspaceId]?.open }
    }));

    if (tasksState[workspaceId]?.tasks && tasksState[workspaceId]?.tasks.length) return;

    try {
      setTasksState((s) => ({
        ...s,
        [workspaceId]: { ...(s[workspaceId] || {}), loading: true }
      }));
      const resp = await api.get(`/api/workspaces/get-task/${workspaceId}`);
      const tasks = resp.data.projectData || [];
      setTasksState((s) => ({
        ...s,
        [workspaceId]: { ...(s[workspaceId] || {}), loading: false, tasks }
      }));
    } catch (err) {
      setTasksState((s) => ({
        ...s,
        [workspaceId]: { ...(s[workspaceId] || {}), loading: false, tasks: [] }
      }));
    }
  };

  // Helper for rendering Jira-style Nav Button
  const renderNavButton = (key, label, IconComponent, badge = null) => {
    const isActive = active === key;
    return (
      <button
        key={key}
        onClick={() => {
          setActive(key);
          setMobileOpen(false);
        }}
        className={`
          group relative flex items-center gap-3 rounded-[3px] px-2.5 py-1.5 w-full
          text-[13px] font-medium transition-colors duration-100
          ${isActive
            ? "bg-[#DEEBFF] text-[#0747A6] font-semibold"
            : "text-[#42526E] hover:bg-[#EBECF0] hover:text-[#172B4D]"
          }
        `}
      >
        <IconComponent className={`h-4 w-4 shrink-0 ${isActive ? "text-[#0747A6]" : "text-[#5E6C84]"}`} />
        {!collapsed && (
          <span className="min-w-0 flex-1 text-left truncate">{label}</span>
        )}
        {!collapsed && badge !== null && (
          <span className="px-1.5 py-0.2 text-[10px] font-semibold rounded-full bg-[#DFE1E6] text-[#42526E]">
            {badge}
          </span>
        )}

        {/* Collapsed Tooltip */}
        {collapsed && (
          <span className="hidden lg:group-hover:flex absolute left-full ml-2 px-2 py-1 rounded bg-[#172B4D] text-white text-xs font-normal whitespace-nowrap z-50 shadow-md">
            {label}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 bg-[#091E42]/50 z-30 lg:hidden transition-opacity duration-200 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      />

      {/* Main Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          bg-[#F4F5F7] border-r border-[#DFE1E6]
          flex flex-col select-none
          transition-all duration-200 ease-in-out
          ${collapsed ? "lg:w-16" : "lg:w-60"}
          w-64
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header / Project Context */}
        <div className="relative flex items-center h-14 px-3 border-b border-[#DFE1E6] shrink-0 bg-[#F4F5F7]">
          <div className="flex items-center h-16 px-2 overflow-hidden">
            {collapsed ? (
              <Wrench className="h-5 w-5 text-blue-600 shrink-0 mx-auto" />
            ) : (
              <div className="flex flex-col">
                <div className="flex items-start gap-1">
                  <span className="font-semibold text-slate-800 text-[17px] whitespace-nowrap">
                    SprintLab <sup className="text-slate-400 text-[11px]">tm</sup>
                  </span>
                </div>

                <span className="text-[11px] text-slate-500 whitespace-nowrap">
                  Create &amp; manage tasks with ease
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle Button (Jira Floating Style) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
            className="hidden lg:flex absolute -right-3 top-4 h-6 w-6 items-center justify-center rounded-full bg-white border border-[#DFE1E6] text-[#5E6C84] hover:bg-[#DEEBFF] hover:text-[#0747A6] shadow-sm transition-colors"
          >
            <ChevronLeft
              className={`h-3.5 w-3.5 transition-transform duration-200 ${collapsed ? "rotate-180" : ""
                }`}
            />
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            className="lg:hidden flex h-7 w-7 items-center justify-center rounded text-[#5E6C84] hover:bg-[#EBECF0]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto no-scrollbar space-y-4">

          {/* Main Navigation Items */}
          <div className="space-y-0.5">
            {renderNavButton("dashboard", "Dashboard", LayoutGrid)}
            {renderNavButton("tasks", "My Tasks", ListChecks)}
          </div>

          {/* SECTION: PLANNING */}
          <div>
            {!collapsed && (
              <div className="px-2 mb-1 text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider">
                Planning
              </div>
            )}
            <div className="space-y-0.5">
              {renderNavButton("roadmap", "Roadmap", Map)}
              {renderNavButton("backlog", "Backlog", Layers)}
              {renderNavButton("board", "Active Board", Kanban)}
            </div>
          </div>

          {/* SECTION: WORKSPACES / PROJECTS */}
          <div>
            {!collapsed && (
              <div className="flex items-center justify-between px-2 mb-1 text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider">
                <span>Workspaces</span>
                <span className="text-[10px] bg-[#DFE1E6] text-[#42526E] px-1">
                  {workspaces.length}
                </span>
              </div>
            )}

            <div className="space-y-0.5">
              {/* Main Workspaces Trigger */}
              <div className="relative">
                <button
                  onClick={() => {
                    setActive("workspaces");
                    setWorkspacesOpen(!workspacesOpen);
                  }}
                  className={`
                    group relative flex items-center gap-2.5 rounded-[3px] px-2.5 py-1.5 w-full text-[13px] font-medium transition-colors
                    ${active === "workspaces"
                      ? "bg-[#DEEBFF] text-[#0747A6] font-semibold"
                      : "text-[#42526E] hover:bg-[#EBECF0] hover:text-[#172B4D]"
                    }
                  `}
                >
                  <Users className="h-4 w-4 shrink-0 text-[#5E6C84]" />
                  {!collapsed && (
                    <>
                      <span className="min-w-0 flex-1 text-left truncate">
                        All Workspaces
                      </span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 text-[#5E6C84] transition-transform duration-150 ${workspacesOpen ? "" : "-rotate-90"
                          }`}
                      />
                    </>
                  )}
                  {collapsed && (
                    <span className="hidden lg:group-hover:flex absolute left-full ml-2 px-2 py-1 rounded bg-[#172B4D] text-white text-xs font-normal whitespace-nowrap z-50 shadow-md">
                      All Workspaces
                    </span>
                  )}
                </button>

                {/* Nested Workspaces List */}
                {workspacesOpen && !collapsed && (
                  <div className="ml-3.5 pl-2.5 my-1 border-l border-[#DFE1E6] space-y-0.5">
                    {workspaces.length > 0 ? (
                      workspaces.map((ws) => (
                        <div key={ws._id} className="group/item flex flex-col">
                          <div className="flex items-center justify-between gap-1 rounded-[3px] px-2 py-1 text-[12px] text-[#42526E] hover:bg-[#EBECF0] hover:text-[#172B4D] cursor-pointer">
                            <div
                              onClick={() => openWorkspace(ws)}
                              className="flex items-center gap-2 min-w-0 flex-1 truncate"
                            >
                              <span
                                className="h-4 w-4 shrink-0 flex items-center justify-center text-[9px] font-bold text-white"
                                style={{ backgroundColor: ws.color || "#42526E" }}
                              >
                                {getWorkspaceInitial(ws.title)}
                              </span>
                              <span className="truncate">{ws.title || "Untitled"}</span>
                            </div>

                            {/* Sub-item Task Toggle */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTasksFor(ws._id);
                              }}
                              className="p-0.5 rounded hover:bg-[#DFE1E6] text-[#5E6C84]"
                              title="Toggle tasks"
                            >
                              <ChevronRight
                                className={`h-3 w-3 transition-transform ${tasksState[ws._id]?.open ? "rotate-90" : ""
                                  }`}
                              />
                            </button>
                          </div>

                          {/* Nested Tasks */}
                          {tasksState[ws._id]?.open && (
                            <div className="ml-3 pl-2 my-0.5 border-l border-[#DFE1E6] space-y-0.5">
                              {tasksState[ws._id]?.loading ? (
                                <span className="text-[11px] text-[#5E6C84] px-1 py-0.5 block">
                                  Loading...
                                </span>
                              ) : (tasksState[ws._id]?.tasks || []).length > 0 ? (
                                tasksState[ws._id].tasks.map((task) => (
                                  <button
                                    key={task._id || task.id || task.title}
                                    className="w-full text-left text-[11px] text-[#5E6C84] hover:text-[#172B4D] hover:bg-[#EBECF0] px-1.5 py-0.5 rounded truncate block"
                                  >
                                    {task.title}
                                  </button>
                                ))
                              ) : (
                                <span className="text-[11px] text-[#5E6C84] px-1 py-0.5 block">
                                  No tasks
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-[11px] text-[#5E6C84] px-2 py-1 block">
                        No workspaces found
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION: TEAM & PERFORMANCE */}
          <div>
            {!collapsed && (
              <div className="px-2 mb-1 text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider">
                Team & Insights
              </div>
            )}
            <div className="space-y-0.5">
              {renderNavButton("members", "Members", UserRound)}
              {renderNavButton("reports", "Reports", BarChart2)}
              {renderNavButton("achieved", "Achieved", CircleCheck)}
            </div>
          </div>
        </nav>

        {/* Bottom Actions Footer */}
        <div className="p-2 border-t border-[#DFE1E6] shrink-0 bg-[#F4F5F7] space-y-0.5">
          {renderNavButton("settings", "Project Settings", Settings)}

          {/* Logout Button */}
          <button
            onClick={onLogoutClick}
            className="group relative flex items-center gap-3 rounded-[3px] px-2.5 py-1.5 w-full text-[13px] font-medium text-[#DE350B] hover:bg-[#FFEBE6] transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0 text-[#DE350B]" />
            {!collapsed && <span>Log out</span>}

            {collapsed && (
              <span className="hidden lg:group-hover:flex absolute left-full ml-2 px-2 py-1 rounded bg-[#172B4D] text-white text-xs font-normal whitespace-nowrap z-50 shadow-md">
                Log out
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Hide default scrollbars */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </>
  );
}