import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";
import { Permission } from "@/server/modules/permission/domain/permission.interface";
import type { Role } from "@/server/modules/role/domain/role.interface";

export class RoleBusiness {
    static getRoleByCod(roles:Role[], cod:string): Role | null {
      const role = roles.find((role) => role.cod === cod) || null;
      //console.log("role::", role, role?.id);
      return role
    }

    static getRoleById(roles:Role[], id:string): Role | null {
      const role = roles.find((role) => role.id === id) || null;
      //console.log("role-cod::", role, role?.cod);
      return role
    }

    static isRoleAllowed = (roleCod: string) => {
      if ([UserRole.SUPER_ADMIN as string, UserRole.ADMIN as string, UserRole.GUEST as string].includes(roleCod))
        return true;
      return false
    } 

    static isModuleAllowed = (roleCod: string, moduleCod: string, permissions: Permission[]) => {
      //console.log("permissions::", roleCod, moduleCod, permissions);
      const permission = permissions.find((permission) => permission.roleCod === roleCod && permission.moduleCod === moduleCod)
      return permission!=undefined? true : false
    }
  }
  
