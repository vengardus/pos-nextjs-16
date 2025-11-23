import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Permission } from "@/types/interfaces/permission/permission.interface";

interface State {
  permissions: Permission[]; // usado para el pos
  setPermissions: (permissions: Permission[]) => void;
  updatePermissions: (moduleCod: string, checked: boolean) => void;
}

export const usePermissionStore = create<State>()(
  persist(
    (set) => ({
      permissions: [],

      setPermissions: (permissions: Permission[]) => {
        set({ permissions });
      },

      updatePermissions: (moduleCod: string, checked: boolean) => {
        set((state) => {
          const updatedPermissions = state.permissions.filter(
            (permission) => !(permission.moduleCod === moduleCod)
          );
    
          if (checked) {
            updatedPermissions.push({ 
              roleId: "",
              moduleCod: moduleCod,
              companyId: "",
              isGroup: false,
              roleCod: ""
             }); // Crea un objeto de permiso si el checkbox está marcado
          }
    
          return { permissions: updatedPermissions };
        });
      },

    }),
    {
      name: "permission-store",
    }
  )
);
