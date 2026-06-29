import { LayoutGrid, Plus } from "lucide-react";
import { Children, useEffect, useState } from "react";
import api from "../../api/axios";
import ProjectCard from "../projectComponents/ProjectCard";
import CreateProjectModal from "../../Modals/CreateProjectModal";

export default function Workspaces() {

  const [isProjectCard, setProjectCard] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [isProjectForm, setProjectForm] = useState(false);

  const handleGetdata = async () => {
    try {
      const response = await api.get("/api/workspaces/get-projects");

      if (response.data.userProjects.length >= 1) {
        setProjectCard(true);
      }
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
  }

  useEffect(() => {

    handleGetdata();

  }, []);

  return (
    <div className="px-4 h-full sm:px-6 py-5 animate-fade-in-up">

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-slate-800">Workspaces</h1>

        <button className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-all duration-150 hover:cursor-pointer"
          onClick={() => setProjectForm(true)}
        >
          <Plus className="h-4 w-4" />
          New Workspace
        </button>
      </div>

      {
        !isProjectCard ? (
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
        ) : (

          <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {projectData.map(project => (
              <ProjectCard
                key={project._id}
                projectData={project}
              />
            ))}
          </div>

        )
      }

      {
        isProjectForm && <CreateProjectModal onClose={() => setProjectForm(false)} handleGetData={ handleGetdata } />
      }


      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out both; }
      `}</style>

    </div>
  );
}