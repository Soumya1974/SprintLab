import { create } from "zustand";

const useWorkspaceStore = create((set) => ({
  user: null,

  workspaceData: null,

  allWorkspaces: [],

  workspaceRefreshKey: 0,

  taskForm: false,

  workspaceDueDate: "",

  selectWorkspace: (id) =>
    set({
      workspaceData: id,
    }),

  setAllWorkspaces: (workspaces) =>
    set({
      allWorkspaces: workspaces,
    }),

  setWorkspaceData: (id) =>
    set({
      workspaceData: id,
    }),

  clearWorkspaceData: () =>
    set({
      workspaceData: null,
    }),

  refreshWorkspaces: () =>
    set((state) => ({
      workspaceRefreshKey:
        state.workspaceRefreshKey + 1,
    })),

  setTaskForm: (value) =>
    set({
      taskForm: value,
    }),

  clearTaskForm: () =>
    set({
      taskForm: false,
    }),

  setWorkspaceDueDate: (value) =>
    set({
      workspaceDueDate: value,
    }),

  clearWorkspaceDueDate: () =>
    set({
      workspaceDueDate: "",
    }),

  setUser: (user) =>
    set({
      user,
    }),

  clearUser: () =>
    set({
      user: null,
    }),

  resetWorkspaceStore: () =>
    set({
      user: null,
      workspaceData: null,
      allWorkspaces: [],
      workspaceRefreshKey: 0,
      taskForm: false,
      workspaceDueDate: "",
    }),
}));

export default useWorkspaceStore;