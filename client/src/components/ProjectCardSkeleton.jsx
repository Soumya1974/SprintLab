import React from "react";

const ProjectCardSkeleton = () => {
  return (
    <div className="relative h-full bg-gray-200 border border-slate-200 p-5 overflow-hidden shadow-sm animate-pulse">

      <span className="absolute left-0 top-0 h-full w-1 bg-slate-200" />

      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="h-5 w-40 rounded bg-slate-200" />

        <div className="h-6 w-20 rounded-full bg-slate-200" />
      </div>

      <div className="space-y-2 mb-2">
        <div className="h-3 w-full rounded bg-slate-200" />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">

        <div className="flex -space-x-2">
          <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white" />
          <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white" />
          <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-slate-200" />
          <div className="h-3 w-20 rounded bg-slate-200" />
        </div>
      </div>

      <div className="mt-4 h-10 w-full rounded-lg bg-slate-200" />
    </div>
  );
};

export default ProjectCardSkeleton;