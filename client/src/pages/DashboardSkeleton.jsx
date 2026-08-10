// DashboardSkeleton.jsx
// Skeleton loading state for the SprintLab Dashboard, mirroring the exact
// grid/card layout so there's no content-shift when real data arrives.
//
// Requires a custom "blink" keyframe animation registered in tailwind.config.js:
//
//   // tailwind.config.js
//   module.exports = {
//     theme: {
//       extend: {
//         keyframes: {
//           blink: {
//             "0%, 100%": { opacity: 1 },
//             "50%": { opacity: 0.35 },
//           },
//         },
//         animation: {
//           blink: "blink 1.4s ease-in-out infinite",
//         },
//       },
//     },
//   };
//
// Then every skeleton block below just uses `animate-blink`.
// (If you don't want to touch the config, swap `animate-blink` for the
// arbitrary-value form `animate-[blink_1.4s_ease-in-out_infinite]` — but
// that still needs the `blink` keyframes defined in the config to resolve.)

const CARD = "border border-[#E5E7EB] bg-white";

function Bone({ className = "" }) {
  return <div className={`animate-blink bg-slate-200 ${className}`} />;
}

function SkeletonKpiCard() {
  return (
    <div className={`${CARD} p-4`}>
      <div className="flex items-center justify-between gap-2">
        <Bone className="h-3.5 w-20" />
        <Bone className="h-7 w-7" />
      </div>
      <Bone className="mt-3 h-6 w-16" />
      <Bone className="mt-2 h-3 w-24" />
    </div>
  );
}

function SkeletonStatusBreakdown() {
  return (
    <div className={`${CARD} p-4`}>
      <div className="flex items-center justify-between gap-2">
        <Bone className="h-3.5 w-28" />
        <Bone className="h-7 w-7" />
      </div>
      <div className="mt-3 space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <Bone className="h-3 w-16" />
            <Bone className="h-3 w-6" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonTeamMembers() {
  return (
    <div className={`${CARD} p-4`}>
      <div className="flex items-center justify-between gap-2">
        <Bone className="h-3.5 w-24" />
        <Bone className="h-7 w-7" />
      </div>
      <Bone className="mt-3 h-6 w-10" />
      <div className="mt-2 flex items-center gap-3">
        <Bone className="h-3 w-16" />
        <Bone className="h-3 w-16" />
      </div>
    </div>
  );
}

function SkeletonTrendChart() {
  return (
    <div className={`${CARD} p-4`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <Bone className="h-4 w-40" />
        <Bone className="h-3 w-16" />
      </div>
      <div className="flex h-60 items-end gap-2 px-1">
        {[40, 65, 30, 80, 55, 70, 45].map((h, i) => (
          <Bone key={i} className="w-full" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

function SkeletonActivityFeed() {
  return (
    <div className={`${CARD} p-4`}>
      <Bone className="mb-4 h-4 w-32" />
      <div className="h-60 space-y-2 overflow-hidden pr-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 border border-gray-50 bg-slate-50/60 px-3 py-2"
          >
            <Bone className="h-6 w-6 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Bone className="h-3 w-4/5" />
              <Bone className="h-2.5 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonMemberWorkload() {
  return (
    <div className={`${CARD} h-full p-4`}>
      <Bone className="mb-4 h-4 w-32" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between border border-[#E5E7EB] px-3 py-2"
          >
            <div className="flex items-center gap-2.5">
              <Bone className="h-8 w-8 rounded-full" />
              <div className="space-y-1.5">
                <Bone className="h-3 w-24" />
                <Bone className="h-2.5 w-14" />
              </div>
            </div>
            <Bone className="h-4 w-6" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonTaskDistribution() {
  return (
    <div className={`${CARD} h-full p-4`}>
      <Bone className="mb-4 h-4 w-32" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <div className="mb-1.5 flex items-center justify-between">
              <Bone className="h-3 w-16" />
              <Bone className="h-3 w-8" />
            </div>
            <Bone className="h-1.5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonUpcomingDeadlines() {
  return (
    <div className={`${CARD} h-full p-4`}>
      <Bone className="mb-4 h-4 w-36" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between border border-[#E5E7EB] px-3 py-2"
          >
            <div className="flex min-w-0 items-center gap-2">
              <Bone className="h-3.5 w-3.5 shrink-0" />
              <Bone className="h-3 w-32" />
            </div>
            <Bone className="h-3 w-14 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Bone className="h-3 w-16" />
          <Bone className="mt-2 h-5 w-48" />
        </div>
        <Bone className="h-6 w-32" />
      </div>

      {/* Filter bar */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <Bone key={i} className="h-8 w-20" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <SkeletonKpiCard />
        </div>
        <div className="lg:col-span-3">
          <SkeletonStatusBreakdown />
        </div>
        <div className="lg:col-span-3">
          <SkeletonKpiCard />
        </div>
        <div className="lg:col-span-3">
          <SkeletonTeamMembers />
        </div>

        <div className="lg:col-span-8">
          <SkeletonTrendChart />
        </div>
        <div className="lg:col-span-4">
          <SkeletonActivityFeed />
        </div>

        <div className="lg:col-span-4">
          <SkeletonMemberWorkload />
        </div>
        <div className="lg:col-span-4">
          <SkeletonTaskDistribution />
        </div>
        <div className="lg:col-span-4">
          <SkeletonUpcomingDeadlines />
        </div>
      </div>
    </div>
  );
}