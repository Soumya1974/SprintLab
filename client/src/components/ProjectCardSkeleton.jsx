import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProjectCardSkeleton = () => {
  return (
    <div className="relative h-full bg-white border border-slate-200 p-5 overflow-hidden shadow-sm">

      <span className="absolute left-0 top-0 h-full w-1">
        <Skeleton height="100%" />
      </span>

      <div className="flex items-start justify-between gap-3 mb-1">
        <Skeleton height={20} width={160} borderRadius={6} />
        <Skeleton height={24} width={80} borderRadius={999} />
      </div>

      <div className="space-y-2 mb-2">
        <Skeleton height={12} width="65%" />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">

        <div className="flex -space-x-2">
          <Skeleton circle width={32} height={32} />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton width={14} height={14} />
          <Skeleton width={70} height={12} />
        </div>
      </div>

      <div className="mt-2">
        <Skeleton height={40} borderRadius={8} />
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;