"use server";

import { permissionGetAllByRoleCached } from "@/server/modules/permission/next/cache/permission.get-all-by-role.cache";
import { ResponseAction } from "@/shared/types/common/response-action.interface";

export const permissionGetAllByRoleAction = async (roleId: string): Promise<ResponseAction> => {
  return await permissionGetAllByRoleCached(roleId);
};
