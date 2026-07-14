import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      email: "",
      accessToken: null,
      signupProgress: false,
      forgotPasswordProgress: false,
      inviteToken: null,

      setEmail: (email) => set({ email }),

      clearEmail: () => set({ email: "" }),

      setAccessToken: (token) =>
        set({ accessToken: token }),

      clearAccessToken: () =>
        set({ accessToken: null }),

      setSignupProgress: (value) =>
        set({ signupProgress: value }),

      clearSignupProgress: () =>
        set({ signupProgress: false }),

      setForgotPasswordProgress: (value) =>
        set({ forgotPasswordProgress: value }),

      clearForgotPasswordProgress: () =>
        set({ forgotPasswordProgress: false }),

      setInviteToken: (token) =>
        set({ inviteToken: token }),

      clearInviteToken: () =>
        set({ inviteToken: null })
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;