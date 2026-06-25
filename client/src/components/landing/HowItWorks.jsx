const STEPS = [
  {
    number: "01",
    title: "Create a workspace",
    description:
      "Name your team or project, pick a color, and invite the people who'll be working in it.",
  },
  {
    number: "02",
    title: "Lay out your sprint",
    description:
      "Add tasks to the board, assign owners, and set due dates — the board becomes your single source of truth.",
  },
  {
    number: "03",
    title: "Move work forward",
    description:
      "Drag tasks across stages as work progresses. Everyone sees status change live, no status-update meeting required.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="px-5 sm:px-6 py-20 sm:py-28 bg-slate-50/60 border-y border-slate-100"
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-semibold text-slate-800 tracking-tight mb-3">
            From new workspace to first sprint in minutes
          </h2>
          <p className="text-base text-slate-500 leading-relaxed">
            No setup calls, no onboarding wizard to fight through.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 relative">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="relative animate-fade-in-up"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <span className="text-sm font-semibold text-blue-600/40 tracking-wide">
                {step.number}
              </span>
              <h3 className="text-lg font-semibold text-slate-800 mt-2 mb-2.5">
                {step.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}