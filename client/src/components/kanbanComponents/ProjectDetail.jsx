import ProjectHeader from "../projectComponents/ProjectHeader";
import TaskBoard from "../projectComponents/TaskBoard";
import ProjectNotes from "../projectComponents/ProjectNotes";
import ActivityFeed from "../projectComponents/ActivityFeed";
import CommentsSection from "../projectComponents/CommentsSection";

export default function ProjectDetail() {
  return (
    <div className="w-full flex bg-slate-50 overflow-hidden font-sans mt-5"
        style={{
        backgroundImage: `linear-gradient(to right, rgb(226 232 240 / 0.6) 1px, transparent 1px),linear-gradient(to bottom, rgb(226 232 240 / 0.6) 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        backgroundColor: "#ffffff",
      }}
    >

        <main className="px-5 pb-8">
          <ProjectHeader />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
                <div className="xl:col-span-2 flex flex-col">
                <TaskBoard />
                </div>

                <div className="flex flex-col">
                    <ActivityFeed />
                    <CommentsSection />
                </div>
            </div>
            <ProjectNotes />
        </main>
      </div>
  );
}