import { Wrench } from "lucide-react";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* Left brand panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-[42%] bg-slate-50 border-r border-slate-200 flex-col justify-between p-10 animate-fade-in">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-slate-800 text-[17px]">
            SprintLab
          </span>
        </div>

        <div className="max-w-sm">
          <h2 className="text-2xl font-semibold text-slate-800 leading-snug mb-3">
            Plan sprints. Ship faster. Stay in sync.
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Manage workspaces, tasks, and your team in one clean dashboard
            built for fast-moving product teams.
          </p>
        </div>

        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} SprintLab. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
        <div className="w-full max-w-[400px] animate-fade-in-up">
          {/* mobile logo */}
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <Wrench className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-slate-800 text-[17px]">
              SprintLab
            </span>
          </div>

          <h1 className="text-xl font-semibold text-slate-800 mb-1.5">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mb-6">{subtitle}</p>
          )}

          {children}

          {footer && <div className="mt-6 text-center">{footer}</div>}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out both; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out both; }
      `}</style>
    </div>
  );
}