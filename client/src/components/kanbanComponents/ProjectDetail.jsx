import { useState } from "react";
import ProjectHeader from "../projectComponents/ProjectHeader";
import TaskBoard from "../projectComponents/TaskBoard";
import ProjectNotes from "../projectComponents/ProjectNotes";
import ActivityFeed from "../projectComponents/ActivityFeed";
import CommentsSection from "../projectComponents/CommentsSection";
// import StatsRow from "../projectComponents/StatsRow";

export default function ProjectDetail() {

  const [maximized, setMaximized] = useState(null);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden font-sans">
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

      <div className="relative z-10 flex h-full flex-col overflow-hidden">
        <ProjectHeader />

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {maximized === null ? (
            <main className="mx-auto w-full px-0 pb-5 sm:px-6">
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
                <div className="xl:col-span-2">
                  <TaskBoard
                    maximized={false}
                    onToggle={() => setMaximized("task")}
                  />
                </div>

                <div className="space-y-6">
                  <ActivityFeed
                    maximized={false}
                    onToggle={() => setMaximized("activity")}
                  />

                  <CommentsSection
                    maximized={false}
                    onToggle={() => setMaximized("comment")}
                  />
                </div>
              </div>

              <ProjectNotes
                maximized={false}
                onToggle={() => setMaximized("notes")}
              />
            </main>
          ) : (
            <main className="flex h-full w-full flex-1">
              <div className="flex h-full w-full flex-1 p-4">
                {maximized === "task" && (
                  <TaskBoard maximized onToggle={() => setMaximized(null)} />
                )}

                {maximized === "activity" && (
                  <ActivityFeed maximized onToggle={() => setMaximized(null)} />
                )}

                {maximized === "comment" && (
                  <CommentsSection maximized onToggle={() => setMaximized(null)} />
                )}

                {maximized === "notes" && (
                  <ProjectNotes maximized onToggle={() => setMaximized(null)} />
                )}
              </div>
            </main>
          )}
        </div>
      </div>
    </div>
  );
}