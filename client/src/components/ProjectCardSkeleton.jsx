import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProjectCardSkeleton = () => {
  return (
    <div className="relative h-full bg-white border border-slate-200 p-4 overflow-hidden shadow-sm flex flex-col animate-pulse">

      {/* Left vertical line */}
      <span className="absolute left-6 top-0 h-full w-px bg-slate-200" />

      <div className="pl-3 flex-1">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="space-y-2 flex-1">
            <div className="h-5 w-48 bg-slate-200 rounded" />
            <div className="h-4 w-28 bg-slate-200 rounded" />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-6 w-20 bg-slate-200 rounded-full" />
            <div className="h-4 w-20 bg-slate-200 rounded" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-11/12" />
          <div className="h-3 bg-slate-200 rounded w-8/12" />
        </div>

        {/* Owner */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-full bg-slate-200" />
          <div className="space-y-1">
            <div className="h-3 w-14 bg-slate-200 rounded" />
            <div className="h-4 w-28 bg-slate-200 rounded" />
          </div>
        </div>

        {/* Members */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-10 bg-slate-200 rounded" />
        </div>

        {/* Avatar stack */}
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white"
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pl-3 pt-3 mt-3 border-t border-slate-200">
        <div className="h-10 w-full bg-slate-200 rounded-lg" />
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;