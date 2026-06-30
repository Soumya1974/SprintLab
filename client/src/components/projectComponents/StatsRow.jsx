import {
  ClipboardList,
  CheckCircle2,
  Clock,
  CalendarClock,
  Users,
} from "lucide-react";

const STATS = [
  {
    icon: ClipboardList,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    value: "42",
    label: "Total Tasks",
    title: "Tasks",
  },
  {
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    value: "18",
    label: "Tasks Done",
    title: "Completed",
  },
  {
    icon: Clock,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    value: "8",
    label: "Tasks In Progress",
    title: "In Progress",
  },
  {
    icon: CalendarClock,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    value: "5",
    label: "Tasks Overdue",
    title: "Overdue",
  },
  {
    icon: Users,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    value: "4",
    label: "Team Members",
    title: "Members",
  },
];

function ProgressRing({ percent = 68 }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width="92" height="92" viewBox="0 0 92 92" className="shrink-0">
      <circle
        cx="46"
        cy="46"
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="8"
      />
      <circle
        cx="46"
        cy="46"
        r={radius}
        fill="none"
        stroke="#4f46e5"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 46 46)"
      />
      <text
        x="46"
        y="46"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-slate-800 font-semibold"
        fontSize="18"
      >
        {percent}%
      </text>
    </svg>
  );
}

export default function StatsRow() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {/* overall progress card spans wider */}
      <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
        <p className="text-sm font-medium text-slate-500 mb-4">
          Overall Progress
        </p>
        <div className="flex items-center gap-4">
          <ProgressRing percent={68} />
          <div>
            <p className="text-sm font-semibold text-slate-800">
              68% complete
            </p>
            <p className="text-xs text-slate-400 mb-2">34 of 50 tasks done</p>
            <div className="h-1.5 w-28 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-[68%] bg-blue-600 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {STATS.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-white border border-slate-200 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500">
                {stat.title}
              </p>
              <div
                className={`h-8 w-8 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </div>
            <p className="text-2xl font-semibold text-slate-800">
              {stat.value}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}