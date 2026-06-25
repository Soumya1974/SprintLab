import { Clock, MessageSquare } from "lucide-react";

const STAGES = [
  { key: "todo", label: "To Do", dot: "bg-slate-400" },
  { key: "progress", label: "In Progress", dot: "bg-blue-500" },
  { key: "done", label: "Done", dot: "bg-emerald-500" },
];

export default function HeroKanban() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </div>
          <span className="text-xs font-medium text-slate-400">
            SprintLab · Live
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {STAGES.map((stage) => (
            <div key={stage.key} className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 px-0.5">
                <span className={`h-1.5 w-1.5 rounded-full ${stage.dot}`} />
                <span className="text-[11px] font-medium text-slate-500">
                  {stage.label}
                </span>
              </div>
              <div
                className="bg-slate-50/70 rounded-xl border border-slate-100 p-1.5 flex flex-col gap-1.5 min-h-37.5"
                id={`hero-col-${stage.key}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* the moving card - positioned via animation keyframes referencing column slots */}
      <div className="hero-kanban-card absolute bg-white border border-blue-100 rounded-lg shadow-md px-2.5 py-2 w-[28%]">
        <div className="h-1.5 w-8 bg-blue-200 rounded-full mb-1.5" />
        <p className="text-[10px] font-medium text-slate-700 leading-tight mb-1.5">
          Ship landing page
        </p>
        <div className="flex items-center gap-2 text-slate-300">
          <Clock className="h-2.5 w-2.5" />
          <MessageSquare className="h-2.5 w-2.5" />
        </div>
      </div>

      {/* ambient background blob */}
      <div
        className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-blue-50/80 blur-3xl"
        aria-hidden="true"
      />

      <style>{`
        .hero-kanban-card {
          top: 76px;
          left: 16px;
          animation: cardTravel 7s ease-in-out infinite;
        }

        @keyframes cardTravel {
          0%, 8% {
            left: 16px;
            top: 76px;
            opacity: 1;
          }
          28%, 36% {
            left: calc(33.33% + 8px);
            top: 76px;
            opacity: 1;
          }
          56%, 64% {
            left: calc(66.66% + 0px);
            top: 76px;
            opacity: 1;
          }
          90% {
            left: calc(66.66% + 0px);
            top: 76px;
            opacity: 1;
          }
          95% {
            opacity: 0;
          }
          96% {
            left: 16px;
            top: 76px;
            opacity: 0;
          }
          100% {
            left: 16px;
            top: 76px;
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-kanban-card {
            animation: none;
            left: calc(66.66% + 0px);
          }
        }
      `}</style>
    </div>
  );
}