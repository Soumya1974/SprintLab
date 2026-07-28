import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { CheckCircle2, Upload, MessageSquare, Plus, UserPlus } from "lucide-react";
import useWorkspaceStore from "../../store/workspaceStore";
import { getActivityText } from "../../utils/getActivityText";
import api from "../../api/axios";

const AVATAR_COLORS = [
  "bg-blue-400",
  "bg-violet-400",
  "bg-emerald-400",
  "bg-amber-400",
  "bg-rose-400",
  "bg-cyan-400",
];

export default function ActivityFeed({ onToggle, maximized }) {

  const [activities, setActivities] = useState([]);
  const workspaceData = useWorkspaceStore((state) => state.workspaceData);

  console.log(activities);

  useEffect(() => {
    const getActivities = async () => {
      try {
        const response = await api.get(`/api/activity/${workspaceData}`);

        setActivities(getActivityText(response.data.activities));

      } catch (error) {
        console.error(error);
      }
    };

    if (workspaceData) {
      getActivities();
    }
  }, [workspaceData]);

  // Join workspace room
  useEffect(() => {
    if (!workspaceData) return;

    socket.emit("join-workspace", workspaceData);

    return () => {
      socket.emit("leave-workspace", workspaceData);
    };
  }, [workspaceData]);

  // Listen for new activities
  useEffect(() => {
    socket.on("activity:new", (activity) => {
      setActivities((prev) => [activity, ...prev]);
    });

    return () => {
      socket.off("activity:new");
    };
  }, []);



  return (
    <div className="w-full border border-slate-200 bg-white p-5 animate-fade-in-up">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">
          Activity Feed
        </h2>

        <button
          onClick={onToggle}
          className="text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-blue-600"
        >
          {maximized ? "View Less" : "View All"}
        </button>
      </div>

      {/* <div className="flex flex-col gap-4">
        {ACTIVITY.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex items-start gap-3">
              <div className="relative shrink-0">
                <div
                  className={`h-8 w-8 rounded-full ${AVATAR_COLORS[item.id % AVATAR_COLORS.length]
                    } ring-2 ring-white`}
                />

              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-600 leading-snug">
                  {item.text}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div> */}

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