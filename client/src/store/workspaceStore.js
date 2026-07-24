import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWorkspaceStore = create(
    persist(
        (set) => ({
            workspaceData: null,
            projectDetails: null,
            workspaceRefreshKey: 0,
            taskForm: false,
            workspaceDueDate: "",

            setWorkspaceData: (id) => set({ workspaceData: id  }),
            clearWorkspaceData: () => set({ workspaceData: null }),

            setProjectDetails: (data) => set({ projectDetails: data}),
            clearProjectDetails: () => set({ projectDetails: null}),
            refreshWorkspaces: () => set((state) => ({ workspaceRefreshKey: state.workspaceRefreshKey + 1 })),

            setTaskForm: (value) => set({ taskForm: value}),
            clearTaskForm: () => set({ taskForm: false}),

            setWorkspaceDueDate: (value) => set({ workspaceDueDate: value}),
            clearWorkspaceDueDate: () => set({ workspaceDueDate: ""}),
        }),
        {
            name: "workspace-store"
        }
    )
);

export default useWorkspaceStore;