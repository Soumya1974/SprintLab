import { LayoutGrid, List, CalendarRange, Plus, Users, Clock, Filter, Search, X, ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import ProjectCard from "../projectComponents/ProjectCard";
import ProjectListView from "../projectComponents/ProjectListView";
import ProjectTimelineView from "../projectComponents/ProjectTimelineView";
import CreateProjectModal from "../../Modals/CreateProjectModal";
import ProjectDetail from "./ProjectDetail";
import useWorkspaceStore from "../../store/workspaceStore";
import ProjectCardSkeleton from "../ProjectCardSkeleton";

export default function Workspaces() {
  const [projectData, setProjectData] = useState([]);
  const [isProjectForm, setProjectForm] = useState(false);
  const [viewMode, setViewMode] = useState("card"); // "card" (default), "list", "note"

  // Filter and Sort states
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDue7Days, setFilterDue7Days] = useState(false);
  const [sortBy, setSortBy] = useState("default"); // "default", "dueSoon", "mostMembers", "title"
  const [searchQuery, setSearchQuery] = useState("");

  // Start with true so the skeleton appears immediately
  const [isLoading, setLoading] = useState(true);

  const workspaceData = useWorkspaceStore(
    (state) => state.workspaceData
  );

  const selectedWorkspace = projectData.find(
    (project) => project._id === workspaceData
  );

  const handleGetdata = async () => {
    try {
      const response = await api.get(
        "/api/workspaces/get-projects"
      );

      setProjectData(response.data.userProjects || []);
    } catch (err) {
      switch (err.response?.status) {
        case 400:
          toast.error(err.response.data.message);
          break;

        case 500:
          toast.error("Internal Server Error");
          break;

        default:
          toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetdata();
  }, []);

  // Compute filtered & sorted projects
  const filteredProjects = projectData
    .filter((project) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = project.title?.toLowerCase().includes(q);
        const matchDesc = project.description?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }

      // Status filter
      if (filterStatus !== "all" && project.status !== filterStatus) {
        return false;
      }

      // Due date under 7 days filter
      if (filterDue7Days) {
        if (!project.dueDate) return false;
        const due = new Date(project.dueDate).getTime();
        const now = new Date().getTime();
        const diffDays = (due - now) / (1000 * 60 * 60 * 24);
        if (diffDays < -1 || diffDays > 7) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "mostMembers") {
        return (b.members?.length || 0) - (a.members?.length || 0);
      }
      if (sortBy === "dueSoon") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return 0;
    });

  const hasActiveFilters =
    filterStatus !== "all" || filterDue7Days || sortBy !== "default" || searchQuery.trim() !== "";

  const resetFilters = () => {
    setFilterStatus("all");
    setFilterDue7Days(false);
    setSortBy("default");
    setSearchQuery("");
  };

  return (
    <div className="h-full">
      {selectedWorkspace ? (
        <ProjectDetail />
      ) : (
        <>
          <div className="sticky top-0 z-20 mb-4 flex flex-col justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-4 py-4 backdrop-blur supports-backdrop-filter:bg-white/80 sm:px-6 lg:flex-row lg:items-center">
            {/* Title & Count Badge */}
            <div className="flex items-center justify-between sm:justify-start gap-2.5">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600 shrink-0" />
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 shrink-0">
                    Workspaces
                  </h1>
                  <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 border border-blue-200/80 shrink-0">
                    {filteredProjects.length}
                  </span>
              </div>

              {/* Mobile View Compact New Button */}
              <button
                className="inline-flex sm:hidden items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-2.5 py-1.5 shadow-xs cursor-pointer shrink-0"
                onClick={() => setProjectForm(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New</span>
              </button>
            </div>

            {/* Top Controls Bar: Search, Filters, View Toggle, New Workspace */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
              {/* Search Bar */}
              <div className="relative flex items-center shrink-0">
                <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-7 py-1.5 bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-28 sm:w-36 md:w-44 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Filter Option Bar */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 border border-slate-300/80 shrink-0">
                {/* Filter: Due <= 7 Days */}
                <button
                  onClick={() => setFilterDue7Days(!filterDue7Days)}
                  className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${filterDue7Days
                      ? "bg-blue-500 text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                    }`}
                  title="Filter workspaces due in 7 days or less"
                >
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden sm:inline">Due &lt;= 7 Days</span>
                  <span className="sm:hidden">Due &lt;= 7d</span>
                </button>

                {/* Filter: Most Members */}
                <button
                  onClick={() => setSortBy(sortBy === "mostMembers" ? "default" : "mostMembers")}
                  className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${sortBy === "mostMembers"
                      ? "bg-blue-500 text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                    }`}
                  title="Sort workspaces by most members"
                >
                  <Users className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden sm:inline">Most Members</span>
                  <span className="sm:hidden">Members</span>
                </button>

                {/* Status Dropdown */}
                <div className="flex items-center gap-1 px-1">
                  <Filter className="h-3 w-3 text-slate-400 shrink-0" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="py-1 px-1.5 bg-white border border-slate-300 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer max-w-25 sm:max-w-none"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Reset Filters button */}
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="px-1.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-100/80 transition-colors cursor-pointer shrink-0"
                    title="Reset all filters"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* View Switcher Toggle Buttons */}
              <div className="flex items-center bg-slate-100 p-1 border border-slate-300/80 shrink-0">
                <button
                  onClick={() => setViewMode("card")}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium transition-all duration-150 cursor-pointer ${viewMode === "card"
                      ? "bg-blue-500 text-white shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                  title="Card View"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Card</span>
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium transition-all duration-150 cursor-pointer ${viewMode === "list"
                      ? "bg-blue-500 text-white shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                  title="List View (Excel)"
                >
                  <List className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Excel</span>
                </button>

                <button
                  onClick={() => setViewMode("note")}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium transition-all duration-150 cursor-pointer ${viewMode === "note"
                      ? "bg-blue-500 text-white shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                  title="Timeline View"
                >
                  <CalendarRange className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Timeline</span>
                </button>
              </div>

              {/* Desktop New Workspace Button */}
              <button
                className="hidden sm:inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 transition-all duration-150 shadow-xs cursor-pointer shrink-0"
                onClick={() => setProjectForm(true)}
              >
                <Plus className="h-4 w-4" />
                <span>New Workspace</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-5">
              {Array.from({ length: 9 }).map((_, index) => (
                <ProjectCardSkeleton key={index} />
              ))}
            </div>
          ) : projectData.length > 0 ? (
            <>
              {filteredProjects.length > 0 ? (
                <>
                  {viewMode === "card" && (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-5">
                      {filteredProjects.map((project) => (
                        <ProjectCard
                          key={project._id}
                          projectData={project}
                        />
                      ))}
                    </div>
                  )}

                  {viewMode === "list" && (
                    <ProjectListView projects={filteredProjects} />
                  )}

                  {viewMode === "note" && (
                    <ProjectTimelineView projects={filteredProjects} />
                  )}
                </>
              ) : (
                <div className="mx-5 flex flex-col items-center justify-center text-center bg-slate-50/60 border border-slate-200 py-16 px-6 animate-fade-in-up">
                  <div className="h-12 w-12  bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
                    <Filter className="h-5 w-5 text-amber-600" />
                  </div>

                  <p className="text-base font-semibold text-slate-800 mb-1">
                    No workspaces match your active filters
                  </p>

                  <p className="text-sm text-slate-400 mb-5">
                    Try adjusting your search query, status dropdown, or filter toggles.
                  </p>

                  <button
                    className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 transition-all cursor-pointer shadow-xs"
                    onClick={resetFilters}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="mx-5 flex flex-col items-center justify-center text-center bg-slate-50/60 border border-slate-200 rounded-2xl py-20 px-6 animate-fade-in-up [animation-delay:80ms]">
              <div className="h-12 w-12  bg-white border border-slate-200 flex items-center justify-center mb-5">
                <LayoutGrid className="h-5 w-5 text-slate-400" />
              </div>

              <p className="text-base font-semibold text-slate-700 mb-1">
                No workspaces found
              </p>

              <p className="text-sm text-slate-400 mb-6">
                Create a new workspace to get started
              </p>

              <button
                className="inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 transition-all duration-150 shadow-xs hover:cursor-pointer"
                onClick={() => setProjectForm(true)}
              >
                <Plus className="h-4 w-4" />
                Create Workspace
              </button>
            </div>
          )}
        </>
      )}

      {isProjectForm && (
        <CreateProjectModal
          onClose={() => setProjectForm(false)}
          handleGetData={handleGetdata}
        />
      )}
    </div>
  );
}
