import {
  LayoutGrid,
  Users,
  ListChecks,
  UserRound,
  CircleCheck,
  Settings,
  LogOut,
  ChevronLeft,
  X,
  Wrench,
} from "lucide-react";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { key: "workspaces", label: "Workspaces", icon: Users },
  { key: "tasks", label: "My Tasks", icon: ListChecks },
  { key: "members", label: "Members", icon: UserRound },
  { key: "achieved", label: "Achieved", icon: CircleCheck },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  active,
  setActive,
}) {
  return (
    <>
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 bg-slate-900/40 z-30 lg:hidden transition-opacity duration-300 ${
          mobileOpen
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
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <Wrench className="h-5 w-5 text-blue-600 shrink-0" />
            <span
              className={`font-semibold text-slate-800 text-[17px] whitespace-nowrap transition-all duration-200 ${
                collapsed ? "lg:opacity-0 lg:w-0" : "opacity-100"
              }`}
            >
              SprintLab
            </span>
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-150"
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform duration-300 ${
                collapsed ? "rotate-180" : ""
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

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActive(item.key);
                  setMobileOpen(false);
                }}
                className={`
                  group relative flex items-center gap-3 rounded-lg px-3 py-2.5
                  text-sm font-medium transition-all duration-150
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  }
                `}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span
                  className={`whitespace-nowrap transition-all duration-200 ${
                    collapsed ? "lg:opacity-0 lg:w-0 lg:hidden" : "opacity-100"
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
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-slate-100 shrink-0">
          <button className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors duration-150 w-full">
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            <span
              className={`whitespace-nowrap transition-all duration-200 ${
                collapsed ? "lg:opacity-0 lg:w-0 lg:hidden" : "opacity-100"
              }`}
            >
              Logout
            </span>
            {collapsed && (
              <span className="hidden lg:group-hover:flex absolute left-full ml-3 px-2 py-1 rounded-md bg-slate-800 text-white text-xs whitespace-nowrap z-50 shadow-lg">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}