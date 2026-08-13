import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

const onlineUsers = new Map();

function removeSocket(workspaceId, userId, socketId) {

  if (!workspaceId) return;

  const workspace = onlineUsers.get(workspaceId);

  if (!workspace) return;

  const sockets = workspace.get(userId);

  if (!sockets) return;

  // Remove this browser tab
  sockets.delete(socketId);

  // No tabs left -> user offline
  if (sockets.size === 0) {
    workspace.delete(userId);
  }

  // Nobody online
  if (workspace.size === 0) {
    onlineUsers.delete(workspaceId);
  }

  io.to(workspaceId).emit(
    "workspace:online-users",
    workspace ? [...workspace.keys()] : []
  );
}

export const initializeSocket = (server) => {

  const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  //Authenticate accesstoken
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication failed"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = decoded;

      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {

    socket.on("join-workspace", ({ workspaceId }) => {

      const userId = socket.user.id; //get user id from middleware
      socket.join(workspaceId);

      socket.workspaceId = workspaceId;
      socket.userId = userId;

      if (!onlineUsers.has(workspaceId)) {
        onlineUsers.set(workspaceId, new Map());
      }

      const workspace = onlineUsers.get(workspaceId);

      if (!workspace.has(userId)) {
        workspace.set(userId, new Set());
      }

      workspace.get(userId).add(socket.id);

      io.to(workspaceId).emit(
        "workspace:online-users",
        [...workspace.keys()]
      );
    });

    socket.on("leave-workspace", ({ workspaceId }) => {
      removeSocket(workspaceId, socket.user.id, socket.id);
    });

    socket.on("disconnect", () => {
      removeSocket(
        socket.workspaceId,
        socket.user.id,
        socket.id
      )
    });
  });
};

export { io };