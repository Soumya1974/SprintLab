import { useState, useRef, useEffect } from "react";
import { ChevronDown, Bell, Menu } from "lucide-react";

export default function Topbar({ onMenuClick }) {
  const [wsOpen, setWsOpen] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (wsRef.current && !wsRef.current.contains(e.target)) setWsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 active:scale-95 transition-all duration-150"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative" ref={wsRef}>
          <button
            onClick={() => setWsOpen(!wsOpen)}
            className="flex items-center gap-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 hover:border-slate-300 transition-colors duration-150"
          >
            <span>Select Workspace</span>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${wsOpen ? "rotate-180" : ""
                }`}
            />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all duration-150"
        >
          <Bell className="h-4.5 w-4.5" />
        </button>

        <button
          aria-label="Account"
          className="h-9 w-9 rounded-full active:scale-95 transition-all duration-150"
        >
          <img src="https://imgs.search.brave.com/gqMXrbzzUd8ga0aULDgdlPi6nb6-Cjp1N6wcHFE9Pmk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC81/Ni8xNC9kZWZhdWx0/LWF2YXRhci1tYW4t/dG8tc29jaWFsLXVz/ZXItdmVjdG9yLTE3/ODY1NjE0LmpwZw"
            className="h-9 w-9 rounded-full active:scale-95 hover:scale-110 hover:cursor-pointer transition-all duration-150"
          />
        </button>
      </div>
    </header>
  );
}