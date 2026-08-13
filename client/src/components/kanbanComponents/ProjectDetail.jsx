import { useEffect, useState } from "react";
import ProjectHeader from "../projectComponents/ProjectHeader";
import TaskBoard from "../projectComponents/TaskBoard";
import ProjectNotes from "../projectComponents/ProjectNotes";
import ActivityFeed from "../projectComponents/ActivityFeed";
import CommentsSection from "../projectComponents/CommentsSection";
import useWorkspaceStore from "../../store/workspaceStore";
import useAuthStore from "../../store/authStore";
import { socket } from "../../socket";

export default function ProjectDetail() {
  const [maximized, setMaximized] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const workspaceId = useWorkspaceStore(
    (state) => state.workspaceData
  );

  const accessToken = useAuthStore(
    (state) => state.accessToken
  );

  /*
    IMPORTANT:
    Get the current workspace/dashboard data from wherever
    your dashboard component stores it.

    If ProjectDetail itself is currently responsible for
    fetching dashboardData, keep it here.
  */

  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (!workspaceId || !accessToken) {
      setDashboardData(null);
      return;
    }

    const fetchWorkspace = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/workspaces/dashboard/${workspaceId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load workspace");
        }

        const data = await response.json();

        setDashboardData(data);
      } catch (error) {
        console.error(
          "Failed to fetch workspace:",
          error
        );

        setDashboardData(null);
      }
    };

    fetchWorkspace();
  }, [workspaceId, accessToken]);

  // --------------------------------------------------
  // SOCKET ONLINE USERS
  // --------------------------------------------------

  useEffect(() => {
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
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

  // --------------------------------------------------
  // SOCKET WORKSPACE
  // --------------------------------------------------

  useEffect(() => {
    if (!workspaceId || !accessToken) {
      return;
    }

    socket.auth = {
      token: accessToken,
    };

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-workspace", {
      workspaceId,
    });

    return () => {
      socket.emit("leave-workspace", {
        workspaceId,
      });

      socket.disconnect();
    };
  }, [workspaceId, accessToken]);

  // Current workspace returned by backend
  const workspace = dashboardData?.workspace;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">

      <div className="relative z-10 flex h-full flex-col overflow-hidden">

        <ProjectHeader
          workspace={workspace}
          onlineUsers={onlineUsers}
        />

        <div className="flex-1 overflow-y-auto scrollbar-hide">

          {maximized === null ? (

            <main className="mx-auto w-full px-0 pb-5 sm:px-6">

              <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">

                <div className="h-full xl:col-span-1">

                  <TaskBoard
                    maximized={false}
                    onToggle={() =>
                      setMaximized("task")
                    }
                  />

                </div>

                <div className="flex h-full flex-col gap-6">

                  <ActivityFeed
                    maximized={false}
                    onlineUsers={onlineUsers}
                    onToggle={() =>
                      setMaximized("activity")
                    }
                  />

                  <CommentsSection
                    maximized={false}
                    onToggle={() =>
                      setMaximized("comment")
                    }
                  />

                </div>

              </div>

              <ProjectNotes
                maximized={false}
                onToggle={() =>
                  setMaximized("notes")
                }
              />

            </main>

          ) : (

            <main className="flex h-full w-full flex-1">

              <div className="flex h-full w-full flex-1 p-4">

                {maximized === "task" && (
                  <TaskBoard
                    maximized
                    onToggle={() =>
                      setMaximized(null)
                    }
                  />
                )}

                {maximized === "activity" && (
                  <ActivityFeed
                    maximized
                    onToggle={() =>
                      setMaximized(null)
                    }
                  />
                )}

                {maximized === "comment" && (
                  <CommentsSection
                    maximized
                    onToggle={() =>
                      setMaximized(null)
                    }
                  />
                )}

                {maximized === "notes" && (
                  <ProjectNotes
                    maximized
                    onToggle={() =>
                      setMaximized(null)
                    }
                  />
                )}

              </div>

            </main>

          )}

        </div>

      </div>

    </div>
  );
}