import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      email: "",
      accessToken: null,
      signupProgress: false,

      setEmail: (email) => set({ email }),
      clearEmail: () => set({ email: "" }),

      setAccessToken: (token) =>
        set({ accessToken: token }),
      clearAccessToken: () =>
        set({ accessToken: null }),

      setSignupInProgress: (value) =>
        set({ signupInProgress: value }),
      clearSignupProgress: (value) =>
        set({ signupInProgress: false }),
      
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;