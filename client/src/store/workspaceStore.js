import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWorkspaceStore = create(
    persist(
        (set) => ({
            user: null,
            workspaceData: null,
            projectDetails: null,
            previousWorkspaceId: null,
            previousProjectDetails: null,
            allWorkspaces: [],
            workspaceRefreshKey: 0,
            taskForm: false,
            workspaceDueDate: "",

            selectWorkspace: (id, details, dueDate = "") =>
                set((state) => ({
                    previousWorkspaceId: state.workspaceData && state.workspaceData !== id ? state.workspaceData : null,
                    previousProjectDetails: state.workspaceData && state.workspaceData !== id ? state.projectDetails : null,
                    workspaceData: id,
                    projectDetails: details,
                    workspaceDueDate: dueDate,
                })),
            setWorkspaceData: (id) => set({ workspaceData: id }),
            clearWorkspaceData: () =>
                set({
                    workspaceData: null,
                    projectDetails: null,
                    previousWorkspaceId: null,
                    previousProjectDetails: null,
                }),
            setAllWorkspaces: (workspaces) => set({ allWorkspaces: workspaces }),

            setProjectDetails: (data) => set({ projectDetails: data }),
            clearProjectDetails: () => set({ projectDetails: null }),
            restorePreviousWorkspace: () =>
                set((state) => {
                    const hasPrevious = Boolean(state.previousWorkspaceId && state.previousWorkspaceId !== state.workspaceData);

                    return {
                        workspaceData: hasPrevious ? state.previousWorkspaceId : null,
                        projectDetails: hasPrevious ? state.previousProjectDetails : null,
                        previousWorkspaceId: null,
                        previousProjectDetails: null,
                    };
                }),
            refreshWorkspaces: () => set((state) => ({ workspaceRefreshKey: state.workspaceRefreshKey + 1 })),

            setTaskForm: (value) => set({ taskForm: value }),
            clearTaskForm: () => set({ taskForm: false }),

            setWorkspaceDueDate: (value) => set({ workspaceDueDate: value }),
            clearWorkspaceDueDate: () => set({ workspaceDueDate: "" }),

            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
        }),
        {
            name: "workspace-store"
        }
    )
);

export default useWorkspaceStore;