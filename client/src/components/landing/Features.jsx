import { LayoutGrid, Users, Bell } from "lucide-react";

const FEATURES = [
  {
    icon: LayoutGrid,
    title: "Boards that stay in sync",
    description:
      "Drag a task across To Do, In Progress, and Done everyone watching the board sees it move instantly, no refresh needed.",
    accent: "bg-blue-50 text-blue-600",
  },
  {
    icon: Users,
    title: "Workspaces per team",
    description:
      "Spin up a separate workspace for each team or project, invite members, and keep permissions scoped to exactly who needs access.",
    accent: "bg-blue-50 text-blue-600",
  },
  {
    icon: Bell,
    title: "Real time updates",
    description:
      "Get notified when a task you own changes status or gets a comment nothing else. No digest emails, no alert fatigue.",
    accent: "bg-blue-50 text-blue-600",
  },
];

export default function Features() {
  return (
    <section id="features" className="px-5 sm:px-6 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-semibold text-slate-800 tracking-tight mb-3">
            Everything your sprint needs, nothing it doesn&apos;t
          </h2>
          <p className="text-base text-slate-500 leading-relaxed">
            SprintLab is built around the three things that actually slow
            teams down unclear task state, scattered ownership, and noisy
            updates.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group bg-white border border-slate-200 p-6 hover:border-blue-500 hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-1 transition-all duration-300 ease-out animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className={`h-11 w-11 rounded-xl ${feature.accent} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}