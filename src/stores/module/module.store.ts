import { Module } from "@/types/interfaces/module/module.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  modules: Module[]; // usado para el pos
  setModules: (modules: Module[]) => void;
}

export const useModuleStore = create<State>()(
  persist(
    (set) => ({
      modules: [],

      setModules: (modules: Module[]) => {
        set({ modules });
      },

    }),
    {
      name: "module-store",
    }
  )
);
