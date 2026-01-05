import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/server/modules/role/domain/role.interface";

interface State {
  roles: Role[]; // usado para el pos
  setRoles: (roles: Role[]) => void;
}

export const useRoleStore = create<State>()(
  persist(
    (set) => ({
      roles: [],

      setRoles: (roles: Role[]) => {
        set({ roles });
      },
    }),
    {
      name: "role-store",
    }
  )
);
