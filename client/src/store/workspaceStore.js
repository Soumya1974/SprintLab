import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWorkspaceStore = create(
    persist(
        (set) => ({
            workspaceData: null,
            projectDetails: null,
            taskForm: false,
            workspaceDueDate: "",

            setWorkspaceData: (id) => set({ workspaceData: id  }),
            clearWorkspaceData: () => set({ workspaceData: null }),

            setProjectDetails: (data) => set({ projectDetails: data}),
            clearProjectDetails: () => set({ projectDetails: null}),

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