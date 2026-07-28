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
    console.log(`User Connected: ${socket.id}`);

    // User joins a workspace
    socket.on("join-workspace", (workspaceId) => {
        
      socket.join(workspaceId);

      console.log(
        `Socket ${socket.id} joined workspace ${workspaceId}`
      );
    });

    // User leaves a workspace
    socket.on("leave-workspace", (workspaceId) => {
      socket.leave(workspaceId);

      console.log(
        `Socket ${socket.id} left workspace ${workspaceId}`
      );
    });

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });
};

export { io };