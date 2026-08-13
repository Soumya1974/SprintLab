import {
  UserPlus,
  Settings,
  ChevronDown,
  LogOutIcon,
} from "lucide-react";

import useWorkspaceStore from "../../store/workspaceStore";
import InviteModal from "../../Modals/InviteModal";
import { socket } from "../../socket";
import { useEffect, useRef, useState } from "react";
import { UserProfileAvatar } from "./UserProfileModal";

export default function ProjectHeader({
  workspace,
  onlineUsers = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [realtimeOnlineUsers, setRealtimeOnlineUsers] =
    useState(onlineUsers);

  const inviteBtnRef = useRef(null);

  const restorePreviousWorkspace =
    useWorkspaceStore(
      (state) => state.restorePreviousWorkspace
    );

  // --------------------------------------------------
  // MEMBERS
  // --------------------------------------------------

  const rawMembers = workspace?.members || [];

  const membersList = [];
  const seenIds = new Set();

  // Add owner
  if (
    workspace?.owner &&
    typeof workspace.owner === "object" &&
    workspace.owner._id
  ) {
    const ownerId =
      workspace.owner._id.toString();

    seenIds.add(ownerId);

    membersList.push(workspace.owner);
  }

  // Add members
  for (const member of rawMembers) {
    const user = member.user || member;

    if (
      user &&
      user._id &&
      !seenIds.has(user._id.toString())
    ) {
      seenIds.add(
        user._id.toString()
      );

      membersList.push(user);
    }
  }

  // --------------------------------------------------
  // ONLINE USERS
  // --------------------------------------------------

  useEffect(() => {
    setRealtimeOnlineUsers(onlineUsers);
  }, [onlineUsers]);

  useEffect(() => {
    const handleOnlineUsers = (users) => {
      setRealtimeOnlineUsers(users);
    };

    socket.on(
      "workspace:online-users",
      handleOnlineUsers
    );

    return () => {
      socket.off(
        "workspace:online-users",
        handleOnlineUsers
      );
    };
  }, []);

  const onlineUserIds = new Set(
    (realtimeOnlineUsers || []).map(
      (id) => id?.toString()
    )
  );

  const onlineCount = membersList.filter(
    (member) =>
      onlineUserIds.has(
        member._id?.toString()
      )
  ).length;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="sticky top-0 z-20 mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-5 py-2 backdrop-blur supports-backdrop-filter:bg-white/80">

      {/* Workspace information */}

      <div>

        <div className="flex items-center gap-3 mb-1.5">

          <h1 className="text-2xl font-semibold text-slate-800">
            {workspace?.title || "Workspace"}
          </h1>

          {workspace?.status && (
            <span
              style={{
                color: workspace.color,
              }}
              className="text-xs font-medium bg-violet-50 px-2.5 py-1"
            >
              {workspace.status}
            </span>
          )}

        </div>

        <p className="text-sm text-slate-500">
          {workspace?.description || ""}
        </p>

      </div>


      {/* Right side */}

      <div className="flex items-center gap-4">

        {/* Online members */}

        {membersList.length > 0 && (

          <div className="flex items-center gap-2 border-r border-slate-200 pr-4">

            <div className="flex items-center -space-x-1.5 overflow-hidden">

              {membersList.map((member) => {

                const isOnline =
                  onlineUserIds.has(
                    member._id?.toString()
                  );

                const initial =
                  member.name
                    ? member.name
                      .charAt(0)
                      .toUpperCase()
                    : "?";

                return (
                  <UserProfileAvatar
                    key={member._id}
                    user={member}
                  >

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


        {/* Buttons */}

        <div className="flex gap-2">

          <button onClick={restorePreviousWorkspace}>
            <LogOutIcon className="h-4 w-4" />
            Back
          </button>


          <button
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 border border-slate-200 active:scale-95 px-3.5 py-2 hover:cursor-pointer transition-colors duration-150"
            onClick={() => setIsOpen(true)}
            ref={inviteBtnRef}
          >
            <UserPlus className="h-4 w-4" />
            Invite
          </button>


          <button
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 px-3.5 py-2 hover:cursor-pointer transition-all duration-150"
          >
            <Settings className="h-4 w-4" />
            Settings
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

        </div>

      </div>


      {/* Invite modal */}

      {isOpen && (
        <InviteModal
          anchorRef={inviteBtnRef}
          onClose={() => setIsOpen(false)}
        />
      )}

    </div>
  );
}