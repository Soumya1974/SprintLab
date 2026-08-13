const useWorkspaceStore = create((set) => ({
  user: null,

  workspaceData: null,

  previousWorkspaceId: null,

  allWorkspaces: [],

  workspaceRefreshKey: 0,

  taskForm: false,

  workspaceDueDate: "",

  selectWorkspace: (id) =>
    set((state) => ({
      previousWorkspaceId:
        state.workspaceData &&
        state.workspaceData !== id
          ? state.workspaceData
          : state.previousWorkspaceId,

      workspaceData: id,
    })),

  restorePreviousWorkspace: () =>
    set((state) => ({
      workspaceData: state.previousWorkspaceId,
      previousWorkspaceId: null,
    })),

  setWorkspaceData: (id) =>
    set({
      workspaceData: id,
    }),

  clearWorkspaceData: () =>
    set({
      workspaceData: null,
      previousWorkspaceId: null,
    }),

  setAllWorkspaces: (workspaces) =>
    set({
      allWorkspaces: workspaces,
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
      previousWorkspaceId: null,
      allWorkspaces: [],
      workspaceRefreshKey: 0,
      taskForm: false,
      workspaceDueDate: "",
    }),
}));

export default useWorkspaceStore;