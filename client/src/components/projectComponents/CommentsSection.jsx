import { Send } from "lucide-react";

const COMMENTS = [
  {
    id: 1,
    author: "Charlie",
    avatarColor: "bg-rose-400",
    time: "Yesterday",
    text: (
      <>
        <span className="text-blue-600 font-medium">@Alice</span> The new
        design looks great! Just a small suggestion on the hero section.
      </>
    ),
  },
  {
    id: 2,
    author: "Alice",
    avatarColor: "bg-violet-400",
    time: "2 days ago",
    text: (
      <>
        <span className="text-blue-600 font-medium">@Bob</span> Can you
        update the Figma file with the latest changes?
      </>
    ),
  },
];

export default function CommentsSection({ onToggle, maximized }) {
  return (
    <div className="w-full border border-slate-200 bg-white p-5 animate-fade-in-up">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">
          Recent Comments
        </h2>
        
        <button
          onClick={onToggle}
          className="text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-blue-600"
        >
          {maximized ? "View Less" : "View All"}
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-4">
        {COMMENTS.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3">
            <div
              className={`h-8 w-8 rounded-full ${comment.avatarColor} shrink-0`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <p className="text-sm font-semibold text-slate-800">
                  {comment.author}
                </p>
                <p className="text-xs text-slate-400">{comment.time}</p>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mt-0.5">
                {comment.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full rounded-lg border border-slate-200 pl-3.5 pr-10 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors duration-150 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <button
          aria-label="Send comment"
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-blue-600 transition-colors duration-150 hover:bg-blue-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

        <style>{`
                @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(8px); }
                to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fadeInUp 0.4s ease-out both; }
        `}</style>


    </div>
  );
}