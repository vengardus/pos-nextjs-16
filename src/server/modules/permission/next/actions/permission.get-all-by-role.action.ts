"use server";

import { permissionGetAllByRoleCached } from "@/server/modules/permission/next/cache/permission.get-all-by-role.cache";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";

export const permissionGetAllByRoleAction = async (roleId: string): Promise<ResponseAction> => {
  return await permissionGetAllByRoleCached(roleId);
};
