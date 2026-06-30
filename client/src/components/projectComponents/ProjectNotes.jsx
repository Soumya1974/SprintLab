import {
  Heading,
  Bold,
  Italic,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Link2,
  Image,
  MoreHorizontal,
  Maximize2,
} from "lucide-react";

const TOOLBAR_ICONS = [
  { icon: Heading, label: "Heading" },
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: List, label: "Bullet list" },
  { icon: ListOrdered, label: "Numbered list" },
  { icon: CheckSquare, label: "Checklist" },
  { icon: Code, label: "Code" },
  { icon: Link2, label: "Link" },
  { icon: Image, label: "Image" },
  { icon: MoreHorizontal, label: "More" },
];

export default function ProjectNotes() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-800">
          Project Notes
        </h2>
        <button
          aria-label="Expand"
          className="h-7 w-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors duration-150"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* toolbar */}
      <div className="flex items-center gap-0.5 border border-slate-200 rounded-lg p-1.5 mb-4 bg-slate-50/50 w-fit">
        {TOOLBAR_ICONS.map(({ icon: Icon, label }) => (
          <button
            key={label}
            aria-label={label}
            className="h-7 w-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-sm transition-all duration-150"
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>

      {/* notepad content */}
      <div className="min-h-35">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">
          Website Redesign Plan
        </h3>

        <p className="text-sm font-medium text-slate-600 mb-2">Goals:</p>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <span className="h-4 w-4 rounded bg-emerald-500 flex items-center justify-center shrink-0">
              <CheckSquare className="h-3 w-3 text-white" strokeWidth={3} />
            </span>
            <span className="text-sm text-slate-600">
              Improve user experience and navigation
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <span className="h-4 w-4 rounded bg-emerald-500 flex items-center justify-center shrink-0">
              <CheckSquare className="h-3 w-3 text-white" strokeWidth={3} />
            </span>
            <span className="text-sm text-slate-600">
              Make the website fully responsive
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <span className="h-4 w-4 rounded border-2 border-slate-300 shrink-0" />
            <span className="text-sm text-slate-600">
              Increase page load speed
            </span>
          </label>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-right mt-4">Edited 2h ago</p>
    </div>
  );
}