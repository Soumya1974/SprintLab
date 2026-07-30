import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    
    // User joins a workspace
    socket.on("join-workspace", (workspaceId) => {
      socket.join(workspaceId);
    });

    // User leaves a workspace
    socket.on("leave-workspace", (workspaceId) => {
      socket.leave(workspaceId);
    });

    socket.on("disconnect", () => {
    });
  });
};

export { io };