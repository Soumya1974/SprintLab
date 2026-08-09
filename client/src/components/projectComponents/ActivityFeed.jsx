import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import useWorkspaceStore from "../../store/workspaceStore";
import { getActivityText } from "../../utils/getActivityText";
import api from "../../api/axios";
import {
  FolderPlus,
  ListPlus,
  MessageSquare,
  UserPlus,
  UserCheck,
  ArrowRightLeft,
  Activity,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import { UserProfileAvatar } from "./UserProfileModal";

const AVATAR_COLORS = [
  "bg-blue-400",
  "bg-violet-400",
  "bg-emerald-400",
  "bg-amber-400",
  "bg-rose-400",
  "bg-cyan-400",
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "task", label: "Tasks" },
  { key: "comment", label: "Comments" },
  { key: "member", label: "Members" },
];

const ACTIVITY_ICONS = {
  WORKSPACE_CREATED: FolderPlus,
  TASK_CREATED: ListPlus,
  COMMENT_ADDED: MessageSquare,
  MEMBER_INVITED: UserPlus,
  MEMBER_JOINED: UserCheck,
  TASK_STATUS_CHANGED: ArrowRightLeft,
};

function getActivityIcon(action) {
  return ACTIVITY_ICONS[action] || Activity;
}

function colorForId(id = "") {
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatTimestamp(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date)) return "";

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;

  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
}

function isToday(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

function isThisWeek(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return d >= startOfWeek;
}

function ActivitySkeleton() {
  return (
    <div className="flex items-start gap-3 animate-pulse">
      <div className="h-8 w-8 shrink-0 rounded-full bg-slate-200" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-3 w-4/5 rounded bg-slate-200" />
        <div className="h-2.5 w-1/3 rounded bg-slate-100" />
      </div>
    </div>
  );
}

export default function ActivityFeed({ onToggle, maximized, onlineUsers }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const scrollRef = useRef(null);

  const workspaceData = useWorkspaceStore((state) => state.workspaceData);

  // Fetch activities, oldest first so newest lands at the bottom
  useEffect(() => {

    const getActivities = async () => {
      setLoading(true);

      try {
        const response = await api.get(`/api/activity/${workspaceData}`);
        const sorted = [...response.data.activities].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        setActivities(sorted);

      } catch (error) {
        console.error(error);

      } finally {
        setLoading(false);
      }
    };

    if (workspaceData) {
      getActivities();
    }
  }, [workspaceData]);

  // Scroll to the latest activity once loaded / on refresh
  useEffect(() => {
    if (!loading && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [loading, activities.length]);

  // Listen for new activities — append to the bottom, then auto-scroll down
  useEffect(() => {

    const handleNewActivity = (activity) => {

      setActivities(prev => [
        ...prev,
        activity,
      ]);

      requestAnimationFrame(() => {

        if (scrollRef.current) {
          scrollRef.current.scrollTop =
            scrollRef.current.scrollHeight;
        }

      });

    };

    socket.on("activity:new", handleNewActivity);

    return () => {
      socket.off("activity:new", handleNewActivity);
    };

  }, []);

  const filteredActivities = activities.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "today") return isToday(item.createdAt);
    if (activeFilter === "week") return isThisWeek(item.createdAt);
    return item.type === activeFilter;
  });

  return (
    <div className="w-full border border-slate-200 bg-white p-5 animate-fade-in-up overflow-y-scroll">
      <div className="mb-3 flex items-center justify-between">
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

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`px-3 py-1 text-xs font-medium transition-all duration-200 ${activeFilter === filter.key
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div
        ref={scrollRef}
        className={`scrollbar-hide overflow-y-auto pr-1 transition-all duration-300 ${maximized ? "h-[70vh]" : "h-72"
          }`}
      >
        {loading ? (
          <div className="flex flex-col gap-4">
            <ActivitySkeleton />
            <ActivitySkeleton />
            <ActivitySkeleton />
            <ActivitySkeleton />
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-slate-400">No activities</p>
            <p className="text-xs text-slate-300 mt-1">
              Activity will show up here as your team works
            </p>
          </div>
        ) : (
          filteredActivities.map((item, index) => {
            const user = item.userId || {};
            const isOnline = onlineUsers?.includes(user._id?.toString());
            const initial = user.name
              ? user.name.charAt(0).toUpperCase()
              : "?";

            const isLast = index === filteredActivities.length - 1;
            const ActivityIcon = getActivityIcon(item.action);


            return (
              <div
                key={item._id}
                className="relative flex items-start gap-3 pb-4 animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index, 10) * 30}ms` }}
              >
                

                <UserProfileAvatar user={user}>
                  <div className="relative z-10 shrink-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || "User"}
                        className="h-8 w-8 rounded-full object-cover border border-white"
                      />
                    ) : (
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white border border-white ${colorForId(
                          user._id || user.name
                        )}`}
                      >
                        {initial}
                      </div>
                    )}

                    {/* Activity icon */}
                    <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center border border-slate-200 bg-white shadow-sm">
                      <ActivityIcon
                        className="h-2.5 w-2.5 text-slate-500"
                        strokeWidth={2.25}
                      />
                    </div>
                  </div>
                </UserProfileAvatar>

                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm text-slate-600 leading-snug">
                    {getActivityText(item)}
                  </p>

                  <div className="mt-0.5 flex items-center gap-1.5">
                    <p className="text-xs text-slate-400">{formatTimestamp(item.createdAt)}</p>

                    <span className="text-slate-300">·</span>

                    <span
                      className={`inline-flex items-center gap-1 border border-slate-100 px-1 py-0.2 text-[10px] font-medium ${isOnline
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                        }`}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out both; }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}