import { Wrench, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-5 font-sans">
      <div className="flex items-center gap-2 mb-10 animate-fade-in">
        <Wrench className="h-5 w-5 text-blue-600" />
        <span className="font-semibold text-slate-800 text-[17px]">
          SprintLab
        </span>
      </div>

      <div className="text-center animate-fade-in-up">
        <p className="text-7xl font-semibold text-blue-600 tracking-tight mb-3">
          404
        </p>
        <h1 className="text-xl font-semibold text-slate-800 mb-2">
          Page not found
        </h1>
        <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or may have
          been moved.
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-150"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out both; }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out 100ms both; }
      `}</style>
    </div>
  );
}