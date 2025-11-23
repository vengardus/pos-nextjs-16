import type { Combobox } from "@/types/interfaces/ui/combobox.interface";
import { Role } from "@/types/interfaces/role/role.interface";

export const mapRoleToCombobox = (roles: Role[]): Combobox[] => {
  return roles
    .filter((role) => !["SUPER_ADMIN"].includes(role.cod))
    .map((role) => ({
      value: role.id,
      label: role.description.charAt(0) + role.description.slice(1).toLowerCase(), // "ADMIN" -> "Admin"
    }));
};
