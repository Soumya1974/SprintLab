import { cloneElement, useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import ProjectHeader from "../projectComponents/ProjectHeader";
import TaskBoard from "../projectComponents/TaskBoard";
import ProjectNotes from "../projectComponents/ProjectNotes";
import ActivityFeed from "../projectComponents/ActivityFeed";
import CommentsSection from "../projectComponents/CommentsSection";
// import StatsRow from "../projectComponents/StatsRow";

function FullscreenPanel({ id, activePanel, setActivePanel, children }) {
  const isFullscreen = activePanel === id;
  const fullscreenControl = (
    <button
      type="button"
      onClick={() => setActivePanel(isFullscreen ? null : id)}
      aria-label={isFullscreen ? "Minimize panel" : "Open panel fullscreen"}
      title={isFullscreen ? "Minimize" : "Fullscreen"}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-blue-50 hover:text-blue-600"
    >
      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
    </button>
  );

  return (
    <section
      className={isFullscreen
        ? "absolute inset-0 z-30 flex min-h-0 flex-col overflow-hidden bg-slate-100 p-3 sm:p-6"
        : "relative flex min-h-0 flex-col"
      }
    >
      <div className={isFullscreen ? "fullscreen-content min-h-0 flex-1 overflow-auto [&>div]:h-full! [&>div]:min-h-full" : "min-h-0"}>
        {cloneElement(children, {
          fullscreenControl,
          isFullscreen,
          onToggleFullscreen: () => setActivePanel(isFullscreen ? null : id),
        })}
      </div>
    </section>
  );
}

export default function ProjectDetail() {
  const [activePanel, setActivePanel] = useState(null);

  useEffect(() => {
    if (!activePanel) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActivePanel(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activePanel]);

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
              <FullscreenPanel
                id="tasks"
                activePanel={activePanel}
                setActivePanel={setActivePanel}
              >
              <TaskBoard />
              </FullscreenPanel>
            </div>

            <div className="space-y-6">
              <FullscreenPanel
                id="activity"
                activePanel={activePanel}
                setActivePanel={setActivePanel}
              >
                <ActivityFeed />
              </FullscreenPanel>
              <FullscreenPanel
                id="comments"
                activePanel={activePanel}
                setActivePanel={setActivePanel}
              >
                <CommentsSection />
              </FullscreenPanel>
            </div>
          </div>

          <FullscreenPanel
            id="notes"
            activePanel={activePanel}
            setActivePanel={setActivePanel}
          >
            <ProjectNotes />
          </FullscreenPanel>
        </main>
      </div>
    </div>
  );
}