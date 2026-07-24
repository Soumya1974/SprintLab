import { CheckCircle2, Upload, MessageSquare, Plus, UserPlus } from "lucide-react";

const ACTIVITY = [
  {
    id: 1,
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    text: (
      <>
        <span className="font-semibold">Alice</span> completed{" "}
        <span className="font-medium">&quot;Design System&quot;</span>
      </>
    ),
    time: "10:30 AM",
  },
  {
    id: 2,
    icon: Upload,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    text: (
      <>
        <span className="font-semibold">Bob</span> uploaded{" "}
        <span className="font-medium">&quot;homepage-design.fig&quot;</span>
      </>
    ),
    time: "10:15 AM",
  },
  {
    id: 3,
    icon: MessageSquare,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
    text: (
      <>
        <span className="font-semibold">Charlie</span> commented on{" "}
        <span className="font-medium">&quot;UI/UX Design&quot;</span>
      </>
    ),
    time: "Yesterday",
  },
  {
    id: 4,
    icon: Plus,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    text: (
      <>
        <span className="font-semibold">David</span> created a new task{" "}
        <span className="font-medium">&quot;API Integration&quot;</span>
      </>
    ),
    time: "Yesterday",
  },
  {
    id: 5,
    icon: UserPlus,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    text: (
      <>
        <span className="font-semibold">Sarah</span> joined the project
      </>
    ),
    time: "2 days ago",
  },
  {
    id: 6,
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    text: (
      <>
        <span className="font-semibold">Mike</span> completed{" "}
        <span className="font-medium">&quot;Project Setup&quot;</span>
      </>
    ),
    time: "3 days ago",
  },
];

const AVATAR_COLORS = [
  "bg-blue-400",
  "bg-violet-400",
  "bg-emerald-400",
  "bg-amber-400",
  "bg-rose-400",
  "bg-cyan-400",
];

export default function ActivityFeed({ isFullscreen, onToggleFullscreen }) {
  return (
    <div className="bg-white border border-slate-200 p-5 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-800">
          Activity Feed
        </h2>
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150"
        >
          {isFullscreen ? "View less" : "View all"}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {ACTIVITY.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex items-start gap-3">
              <div className="relative shrink-0">
                <div
                  className={`h-8 w-8 rounded-full ${
                    AVATAR_COLORS[item.id % AVATAR_COLORS.length]
                  } ring-2 ring-white`}
                />
                <div
                  className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full ${item.iconBg} ring-2 ring-white flex items-center justify-center`}
                >
                  <Icon className={`h-2.5 w-2.5 ${item.iconColor}`} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-600 leading-snug">
                  {item.text}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>

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