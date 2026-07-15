import ProjectHeader from "../projectComponents/ProjectHeader";
import TaskBoard from "../projectComponents/TaskBoard";
import ProjectNotes from "../projectComponents/ProjectNotes";
import ActivityFeed from "../projectComponents/ActivityFeed";
import CommentsSection from "../projectComponents/CommentsSection";
// import StatsRow from "../projectComponents/StatsRow";

export default function ProjectDetail() {
  return (
    <div className="w-full min-h-full overflow-hidden relative font-sans">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, rgb(203 213 225 / 0.7) 1px, transparent 1px),
        linear-gradient(to bottom, rgb(203 213 225 / 0.7) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          backgroundColor: "#F1F5F9",
        }}
      />

      <div className="absolute inset-0 overflow-y-auto pt-5 pb-5">
        <main className="w-full mx-auto sm:px-6">
          <div>
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