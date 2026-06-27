import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,

      email: "",

      setEmail: (email) => set({ email }),

      clearEmail: () => set({ email: "" }),

      setAccessToken: (token) =>
        set({ accessToken: token }),

      clearAccessToken: () =>
        set({ accessToken: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;