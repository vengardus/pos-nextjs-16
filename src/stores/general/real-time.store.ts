import { create } from "zustand";

interface RealTimeState {
  updated: boolean;
  setUpdated: (updated:boolean) => void
}

export const useRealTimeStore = create<RealTimeState>((set) => ({
  updated: false,
  setUpdated: (updated) => set({ updated: updated }),
}));
