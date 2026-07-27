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
  X,
  Wrench,
  BarChart,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import useWorkspaceStore from "../../store/workspaceStore";


const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { key: "workspaces", label: "Workspaces", icon: Users },
  { key: "tasks", label: "My Tasks", icon: ListChecks },
  { key: "members", label: "Members", icon: UserRound },
  { key: "achieved", label: "Achieved", icon: CircleCheck },
  { key: "settings", label: "Settings", icon: Settings },
];


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
  const setWorkspaceData = useWorkspaceStore((state) => state.setWorkspaceData);
  const setProjectDetails = useWorkspaceStore((state) => state.setProjectDetails);
  const setWorkspaceDueDate = useWorkspaceStore((state) => state.setWorkspaceDueDate);
  const workspaceRefreshKey = useWorkspaceStore((state) => state.workspaceRefreshKey);

  useEffect(() => {
    let isMounted = true;

    const loadWorkspaces = async () => {
      try {
        const response = await api.get("/api/workspaces/get-projects");
        if (isMounted) {
          setWorkspaces(response.data.userProjects || []);
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
  }, [workspaceRefreshKey]);

  const openWorkspace = (workspace) => {
    setWorkspaceData(workspace._id);
    setProjectDetails(workspace);
    setWorkspaceDueDate(workspace.dueDate);
    setActive("workspaces");
    setMobileOpen(false);
  };

  const toggleTasksFor = async (workspaceId) => {
    setTasksState((s) => ({ ...s, [workspaceId]: { ...(s[workspaceId] || {}), open: !(s[workspaceId]?.open) } }));

    if (tasksState[workspaceId]?.tasks && tasksState[workspaceId]?.tasks.length) return;

    try {
      setTasksState((s) => ({ ...s, [workspaceId]: { ...(s[workspaceId] || {}), loading: true } }));
      const resp = await api.get(`/api/workspaces/get-task/${workspaceId}`);
      const tasks = resp.data.projectData || [];
      setTasksState((s) => ({ ...s, [workspaceId]: { ...(s[workspaceId] || {}), loading: false, tasks } }));
    } catch (err) {
      setTasksState((s) => ({ ...s, [workspaceId]: { ...(s[workspaceId] || {}), loading: false, tasks: [] } }));
    }
  };

  return (
    <>
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 bg-slate-900/40 z-30 lg:hidden transition-opacity duration-300 ${mobileOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
      />

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          bg-white border-r border-slate-200
          flex flex-col
          transition-all duration-300 ease-in-out
          ${collapsed ? "lg:w-19" : "lg:w-60"}
          w-64
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 shrink-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-size-[24px_24px]">
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

          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-150"
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""
                }`}
            />
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            className="lg:hidden flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto no-scrollbar bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-size-[24px_24px]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <div key={item.key}>
                <button
                  onClick={() => {
                    setActive(item.key);
                    setMobileOpen(false);
                  }}
                  className={`
                    group relative flex items-center gap-3 rounded-lg px-3 py-2.5 w-full
                    text-sm font-medium transition-all duration-150
                    ${isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                    }
                  `}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span
                    className={`whitespace-nowrap transition-all duration-200 ${collapsed ? "lg:opacity-0 lg:w-0 lg:hidden" : "opacity-100"
                      }`}
                  >
                    {item.label}
                  </span>

                  {collapsed && (
                    <span className="hidden lg:group-hover:flex absolute left-full ml-3 px-2 py-1 rounded-md bg-slate-800 text-white text-xs whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                    </span>
                  )}
                </button>

                {item.key === "workspaces" && (
                  <section className={`relative mt-1 mb-2 ml-5.5 pl-3 border-l border-slate-300 ${collapsed ? "lg:hidden" : ""}`}>
                    <span className="absolute left-0 top-3.5 w-3 h-px bg-slate-300" aria-hidden="true" />

                    <button
                      type="button"
                      onClick={() => setWorkspacesOpen(!workspacesOpen)}
                      className="w-full flex items-center justify-between py-1.5 px-1 group"
                    >
                      <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-700 ml-2 transition-colors">
                        All workspaces
                      </h2>
                      <div className="flex items-center gap-1.5">

                        <span className="text-[10px] font-semibold text-slate-400">
                          {workspaces.length}
                        </span>

                        <ChevronRight
                          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${workspacesOpen ? "rotate-90" : ""
                            }`}
                        />
                      </div>
                    </button>

                    <div
                      className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                      style={{ gridTemplateRows: workspacesOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div className="max-h-56 overflow-y-auto no-scrollbar">
                          {workspaces.length > 0 ? (
                            <div className="relative ml-2.25 pl-3 border-l border-slate-300">
                              {workspaces.map((workspace) => (
                                <div key={workspace._id} className="relative">
                                  <span className="absolute -left-3 top-4.5 w-3 h-px bg-slate-300" aria-hidden="true" />

                                  <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => openWorkspace(workspace)}
                                    title={`Open ${workspace.title}`}
                                    className="group flex w-full items-center gap-2 rounded-md py-1.5 px-2 text-left text-[13px] text-slate-600 transition-colors hover:bg-slate-50 cursor-pointer"
                                  >
                                    <span
                                      className="h-5 w-5 shrink-0 flex items-center justify-center text-[9px] font-bold text-white"
                                      style={{ backgroundColor: workspace.color || "#64748b" }}
                                    >
                                      {getWorkspaceInitial(workspace.title)}
                                    </span>
                                    <span className="min-w-0 flex-1 truncate font-medium group-hover:text-slate-900">
                                      {workspace.title || "Untitled workspace"}
                                    </span>

                                    <span
                                      className="flex items-center gap-0.5 text-[10px] text-slate-400 shrink-0"
                                      title={`${workspace.members?.length || 0} members`}
                                    >
                                      <UserRound className="h-3 w-3" />
                                      {workspace.members?.length || 0}
                                    </span>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleTasksFor(workspace._id);
                                      }}
                                      aria-label="Toggle tasks"
                                      className="p-0.5 rounded-sm text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
                                    >
                                      <ChevronRight
                                        className={`h-3.5 w-3.5 transition-transform duration-200 ${tasksState[workspace._id]?.open ? "rotate-90" : ""
                                          }`}
                                      />
                                    </button>
                                  </div>

                                  <div
                                    className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                                    style={{
                                      gridTemplateRows: tasksState[workspace._id]?.open ? "1fr" : "0fr",
                                    }}
                                  >
                                    <div className="overflow-hidden">
                                      <div className="relative ml-4.5 pl-3 border-l border-slate-300 my-0.5">
                                        {tasksState[workspace._id]?.loading ? (
                                          <p className="text-[11px] text-slate-400 py-1.5">Loading tasks...</p>
                                        ) : (tasksState[workspace._id]?.tasks || []).length > 0 ? (
                                          (tasksState[workspace._id]?.tasks || []).map((task) => (
                                            <div key={task._id || task.id || task.title} className="relative">
                                              <span className="absolute -left-3 top-3.25 w-3 h-px bg-slate-300" aria-hidden="true" />
                                              <button className="w-full text-left text-[12px] text-slate-500 hover:text-slate-800 truncate py-1.5 px-2 rounded-md hover:bg-slate-50 transition-colors">
                                                {task.title}
                                              </button>
                                            </div>
                                          ))
                                        ) : (
                                          tasksState[workspace._id]?.open && (
                                            <p className="text-[11px] text-slate-400 py-1.5 px-2">No tasks</p>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="px-3 py-2 text-xs text-slate-400">No workspaces yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-slate-100 shrink-0">
          <button className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors duration-150 w-full hover:cursor-pointer"
            onClick={onLogoutClick}
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            <span
              className={`whitespace-nowrap transition-all duration-200 ${collapsed ? "lg:opacity-0 lg:w-0 lg:hidden" : "opacity-100"
                }`}
            >
              Logout
            </span>
            {collapsed && (
              <span className="hidden lg:group-hover:flex absolute left-full ml-3 px-2 py-1 rounded-md bg-slate-800 text-white text-xs whitespace-nowrap z-50 shadow-lg"
              >
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </>
  );
}