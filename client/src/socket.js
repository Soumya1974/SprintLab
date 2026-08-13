import { io } from "socket.io-client";
import { useAuthStore } from "./store/authStore";

export const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
  withCredentials: true,
});

export const connectSocket = () => {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    console.log("No access token");
    return;
  }

  socket.auth = {
    token: accessToken,
  };

  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};