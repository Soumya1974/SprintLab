import ProjectHeader from "../projectComponents/ProjectHeader";
import TaskBoard from "../projectComponents/TaskBoard";
import ProjectNotes from "../projectComponents/ProjectNotes";
import ActivityFeed from "../projectComponents/ActivityFeed";
import CommentsSection from "../projectComponents/CommentsSection";
// import StatsRow from "../projectComponents/StatsRow";

export default function ProjectDetail() {
  return (
    <div className="w-full flex bg-slate-50 overflow-x-hidden font-sans pt-5"
      style={{
        backgroundImage: `linear-gradient(to right, rgb(226 232 240 / 0.6) 1px, transparent 1px),linear-gradient(to bottom, rgb(226 232 240 / 0.6) 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        backgroundColor: "#ffffff",
      }}
    >
      <div className="min-h-screen pb-5">
        <main className="mx-auto sm:px-6 pb-8">
          <div className="px-5">
            <ProjectHeader />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            <div className="xl:col-span-2">
              <TaskBoard />
            </div>

            <div className="space-y-6">
              <ActivityFeed />
              <CommentsSection />
            </div>
          </div>

          <ProjectNotes />
        </main>
      </div>
    </div>
  );
}