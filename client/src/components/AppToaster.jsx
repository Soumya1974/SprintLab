import { useEffect, useState } from "react";
import { Toaster, resolveValue } from "react-hot-toast";
import { Check, Loader2, X } from "lucide-react";

// const ICONS = {
//   success: <Check className="h-5 w-5 shrink-0 text-blue-600" />,
//   error: <X className="h-5 w-5 shrink-0 text-red-600" />,
//   loading: <Loader2 className="h-5 w-5 shrink-0 animate-spin text-blue-600" />,
//   blank: null,
// };

function TimerBar({ duration = 3000, visible }) {
  // Starts at 100% width, then transitions to 0% on next tick.
  // Using a transition (not a keyframe animation) means it works
  // without any global CSS setup.
  const [shrink, setShrink] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setShrink(false);
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setShrink(true));
    });
    return () => cancelAnimationFrame(raf);
  }, [visible, duration]);

  return (
    <div className="h-0.75 w-full bg-slate-200">
      <div
        className="h-full bg-blue-300"
        style={{
          width: shrink ? "0%" : "100%",
          transition: visible ? `width ${duration}ms linear` : "none",
        }}
      />
    </div>
  );
}

export default function AppToaster() {
  return (
    <Toaster position="top-right" gutter={10}>
      {(t) => (
        <div
          className="relative w-90 overflow-hidden border border-[#E5E7EB] bg-white"
          style={{ opacity: t.visible ? 1 : 0, transition: "opacity 150ms ease" }}
        >
          <div className="flex gap-3 px-4 py-3.5 items-start">
            <p className="pt-0.5 text-[15px] font-medium leading-snug text-slate-900">
              {resolveValue(t.message, t)}
            </p>
          </div>

          {t.type !== "loading" && <TimerBar duration={t.duration || 3000} visible={t.visible} />}
        </div>
      )}
    </Toaster>
  );
}