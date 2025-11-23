import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Branch } from "@/types/interfaces/branch/branch.interface";

interface State {
  branch: Branch; // usado para el pos
  setBranch: (branch: Branch) => void;
  selectedBranch: Branch | null; // usado para config/branch
  setSelectedBranch: (branch: Branch | null) => void;
  branches: Branch[];
  setBranches: (branches: Branch[]) => void;
}

export const useBranchStore = create<State>()(
  persist(
    (set) => ({
      branch: {} as Branch,

      setBranch: (branch: Branch) => {
        set({ branch });
        //console.log("get.branch", get().branch);
      },

      selectedBranch: null,
      setSelectedBranch: (branch) => {
        console.log("bramch.store:setSelectedBranch", branch);
        set({ selectedBranch: branch })
      },

      branches: [],
      setBranches: (branches) => set({ branches }),
    }),
    {
      name: "branch-store",
    }
  )
);
