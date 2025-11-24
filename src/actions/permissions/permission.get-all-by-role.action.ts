"use server";

import { permissionGetAllByRoleCached } from "@/lib/data/permissions/permission.cache";
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";


export const permissionGetAllByRoleAction = async (roleId: string): Promise<ResponseAction> => {
  return await permissionGetAllByRoleCached(roleId);
};
