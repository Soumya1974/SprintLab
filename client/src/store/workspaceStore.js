import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWorkspaceStore = create(
    persist(
        (set) => ({
            workspaceData = null,

            setWorkspaceData: (id) => set({ projectData: id  }),
            clearWorkspaceData: () => set({ projectData: null })
        }),
        {
            name: "workspace-store"
        }
    )
);

export default useWorkspaceStore;