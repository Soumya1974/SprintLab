import { UserPlus, Share2, Settings, ChevronDown, LogOutIcon } from "lucide-react";
import useWorkspaceStore from "../../store/workspaceStore";
import InviteModal from "../../Modals/InviteModal";
import { socket } from "../../socket";
import { useEffect, useRef, useState } from "react";
import { UserProfileAvatar } from "./UserProfileModal";

export default function ProjectHeader({ onlineUsers = [] }) {

  const [isOpen, setIsOpen] = useState(false);
  const [realtimeOnlineUsers, setRealtimeOnlineUsers] = useState(onlineUsers);

  const inviteBtnRef = useRef(null);
  const restorePreviousWorkspace = useWorkspaceStore((state) => state.restorePreviousWorkspace);
  const projectDetails = useWorkspaceStore((state) => state.projectDetails);

  // Extract all workspace members (including owner)
  const rawMembers = projectDetails?.members || [];
  const membersList = [];
  const seenIds = new Set();

  if (projectDetails?.owner && typeof projectDetails.owner === "object" && projectDetails.owner._id) {
    seenIds.add(projectDetails.owner._id.toString());
    membersList.push(projectDetails.owner);
  }

  for (const m of rawMembers) {
    const u = m.user || m;
    if (u && u._id && !seenIds.has(u._id.toString())) {
      seenIds.add(u._id.toString());
      membersList.push(u);
    }
  }

  useEffect(() => {
    setRealtimeOnlineUsers(onlineUsers);
  }, [onlineUsers]);

  useEffect(() => {
    const handleOnlineUsers = (users) => {
      setRealtimeOnlineUsers(users);
    };

    socket.on("workspace:online-users", handleOnlineUsers);

    return () => {
      socket.off("workspace:online-users", handleOnlineUsers);
    };
  }, []);

  const onlineUserIds = new Set((realtimeOnlineUsers || []).map((id) => id?.toString()));
  const onlineCount = membersList.filter((m) =>
    onlineUserIds.has(m._id?.toString())
  ).length;

  return (
    <div className="sticky top-0 z-20 mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-5 py-2 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div>
        <div className="flex items-center gap-3 mb-1.5">
          <h1 className="text-2xl font-semibold text-slate-800">
            {projectDetails?.title}
          </h1>
          <span style={{ color: projectDetails?.color }} className="text-xs font-medium bg-violet-50 px-2.5 py-1">
            {projectDetails?.status}
          </span>
        </div>
        <p className="text-sm text-slate-500">
          {projectDetails?.description}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Jira-style Online Members Avatars */}
        {membersList.length > 0 && (
          <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
            <div className="flex items-center -space-x-1.5 overflow-hidden">
              {membersList.map((member) => {
                const isOnline = onlineUserIds.has(member._id?.toString());
                const initial = member.name ? member.name.charAt(0).toUpperCase() : "?";

                return (
                  <UserProfileAvatar key={member._id} user={member}>
                    <div
                      title={`${member.name} (${isOnline ? "Online" : "Offline"})`}
                      className="relative inline-block h-8 w-8 rounded-full border border-white bg-slate-200 text-slate-700 text-xs font-medium shrink-0"
                    >
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200 text-slate-700 font-semibold">
                          {initial}
                        </div>
                      )}
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                    </div>
                  </UserProfileAvatar>
                );
              })}
            </div>
            <span className="text-xs text-slate-500 font-medium ml-1">
              {onlineCount} online
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 border border-slate-200 active:scale-95 px-3.5 py-2 hover:cursor-pointer transition-colors duration-150"
            onClick={restorePreviousWorkspace}
          >
            <LogOutIcon className="h-4 w-4" />
            Back
          </button>
          <button className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 border border-slate-200 active:scale-95 px-3.5 py-2 hover:cursor-pointer transition-colors duration-150"
            onClick={() => setIsOpen(true)}
            ref={inviteBtnRef}
          >
            <UserPlus className="h-4 w-4" />
            Invite
          </button>
          <button className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 px-3.5 py-2 hover:cursor-pointer transition-all duration-150">
            <Settings className="h-4 w-4" />
            Settings
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {
        isOpen && <InviteModal
          anchorRef={inviteBtnRef}
          onClose={() => setIsOpen(false)}
        />
      }
    </div>
  );
}