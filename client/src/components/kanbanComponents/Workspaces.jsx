import { LayoutGrid, Plus, Users } from "lucide-react";
import { Children, useEffect, useState } from "react";
import api from "../../api/axios";
import ProjectCard from "../projectComponents/ProjectCard";
import CreateProjectModal from "../../Modals/CreateProjectModal";
import ProjectDetail from "./ProjectDetail";
import useWorkspaceStore from "../../store/workspaceStore";
import ProjectCardSkeleton from "../ProjectCardSkeleton";

export default function Workspaces() {

  const [isProjectCard, setProjectCard] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [isProjectForm, setProjectForm] = useState(false);
  const [openProject, setOpenProject] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const workspaceData = useWorkspaceStore((state) => state.workspaceData);
  const selectedWorkspace = projectData.find((project) => project._id === workspaceData);

  const handleGetdata = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/workspaces/get-projects");

      setProjectData(response.data.userProjects);
    }
    catch (err) {
      switch (err.response.status) {
        case 400:
          toast.error(err.response.data.message);
          break;
        case 500:
          toast.error("Internal Server Error");
          break;
        default:
          toast.error("Something went wrong");
      }
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {

    handleGetdata();

  }, []);

  return (
    <div className="h-full"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgb(203 213 225 / 0.7) 1px, transparent 1px),
          linear-gradient(to bottom, rgb(203 213 225 / 0.7) 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        backgroundColor: "#F1F5F9",
      }}>

      {
        selectedWorkspace ? (

          <ProjectDetail />

        ) : (

          <>
            <div className="flex items-center justify-between py-5 px-5">
              <h1 className="flex gap-2 text-xl font-semibold text-slate-900">
                <Users />
                Workspaces
              </h1>

              <button className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-all duration-150 hover:cursor-pointer"
                onClick={() => setProjectForm(true)}
              >
                <Plus className="h-4 w-4" />
                New Workspace
              </button>
            </div>

            {
              isLoading ? (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-5">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <ProjectCardSkeleton key={index} />
                  ))}
                </div>
              )
              :
              projectData ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-5">
              {projectData.map((project) => (
                <ProjectCard key={project._id} projectData={project} onOpenProjectClick={() => setOpenProject(true)} />
              ))}
            </div>
            ) : (

            <div className="flex flex-col items-center justify-center text-center bg-slate-50/60 border border-slate-200 rounded-2xl py-20 px-6 animate-fade-in-up [animation-delay:80ms]">
              <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-5">
                <LayoutGrid className="h-5 w-5 text-slate-400" />
              </div>

              <p className="text-base font-semibold text-slate-700 mb-1">
                No workspaces found
              </p>
              <p className="text-sm text-slate-400 mb-6">
                Create a new workspace to get started
              </p>

              <button className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-150 hover:cursor-pointer"
                onClick={() => setProjectForm(true)}
              >
                <Plus className="h-4 w-4" />
                Create Workspace
              </button>
            </div>

            )

            }
          </>

        )
      }

      {
        isProjectForm && <CreateProjectModal onClose={() => setProjectForm(false)} handleGetData={handleGetdata} />
      }

    </div>
  );
}