import { ArrowRight, Sparkles } from "lucide-react";
import HeroKanban from "./HeroKanban";

export default function Hero({ onNavigate }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <Sparkles className="h-3.5 w-3.5" />
            Now with real-time workspace sync
          </div>

          <h1 className="text-4xl sm:text-5xl font-semibold text-slate-800 leading-[1.1] tracking-tight mb-5">
            Sprint planning that
            <br />
            doesn&apos;t slow your team down
          </h1>

          <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-8 max-w-md">
            SprintLab gives product teams one clean workspace for tasks,
            sprints, and people so status updates stop living in chat
            threads and start living where the work happens.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate?.("signup")}
              className="group inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-medium px-5 py-3 rounded-lg transition-all duration-150 shadow-sm shadow-blue-200"
            >
              Get started for free
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => onNavigate?.("login")}
              className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium px-5 py-3 rounded-lg border border-slate-200 transition-colors duration-150"
            >
              Log in
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-5">
            No credit card required · Free for teams up to 5
          </p>
        </div>

        <div className="animate-fade-in-up [animation-delay:120ms]">
          <HeroKanban />
        </div>
      </div>
    </section>
  );
}