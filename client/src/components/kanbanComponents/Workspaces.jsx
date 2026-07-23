import { LayoutGrid, List, StickyNote, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import ProjectCard from "../projectComponents/ProjectCard";
import ProjectListView from "../projectComponents/ProjectListView";
import ProjectNoteView from "../projectComponents/ProjectNoteView";
import CreateProjectModal from "../../Modals/CreateProjectModal";
import ProjectDetail from "./ProjectDetail";
import useWorkspaceStore from "../../store/workspaceStore";
import ProjectCardSkeleton from "../ProjectCardSkeleton";

export default function Workspaces() {
  const [projectData, setProjectData] = useState([]);
  const [isProjectForm, setProjectForm] = useState(false);
  const [viewMode, setViewMode] = useState("card"); // "card" (default), "list", "note"

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

  return (
    <div className="h-full">
      {selectedWorkspace ? (
        <ProjectDetail />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 py-5 px-5">
            <h1 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
              <Users className="h-6 w-6 text-blue-600" />
              Workspaces
            </h1>

            <div className="flex items-center gap-3">
              {/* View Switcher Toggle Buttons */}
              <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setViewMode("card")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 hover:cursor-pointer ${
                    viewMode === "card"
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 hover:cursor-pointer ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="List View (Excel)"
                >
                  <List className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">List (Excel)</span>
                </button>

                <button
                  onClick={() => setViewMode("note")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 hover:cursor-pointer ${
                    viewMode === "note"
                      ? "bg-blue-500 text-white shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Note View"
                >
                  <StickyNote className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Note</span>
                </button>
              </div>

              <button
                className="inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-3.5 py-2 rounded-lg transition-all duration-150 shadow-xs hover:cursor-pointer"
                onClick={() => setProjectForm(true)}
              >
                <Plus className="h-4 w-4" />
                New Workspace
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
              {viewMode === "card" && (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-5">
                  {projectData.map((project) => (
                    <ProjectCard
                      key={project._id}
                      projectData={project}
                    />
                  ))}
                </div>
              )}

              {viewMode === "list" && (
                <ProjectListView projects={projectData} />
              )}

              {viewMode === "note" && (
                <ProjectNoteView projects={projectData} />
              )}
            </>
          ) : (
            <div className="mx-5 flex flex-col items-center justify-center text-center bg-slate-50/60 border border-slate-200 rounded-2xl py-20 px-6 animate-fade-in-up [animation-delay:80ms]">
              <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-5">
                <LayoutGrid className="h-5 w-5 text-slate-400" />
              </div>

              <p className="text-base font-semibold text-slate-700 mb-1">
                No workspaces found
              </p>

              <p className="text-sm text-slate-400 mb-6">
                Create a new workspace to get started
              </p>

              <button
                className="inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-150 shadow-xs hover:cursor-pointer"
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