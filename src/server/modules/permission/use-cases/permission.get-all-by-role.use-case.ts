import 'server-only';

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

import { permissionGetAllByRoleRepository } from "../repository/permission.get-all-by-role.repository";

export const permissionGetAllByRoleUseCase = async (
  roleId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  try {
    if (!roleId) throw new Error("Role id is required");
    const data = await permissionGetAllByRoleRepository(roleId);
    resp.data = data;
    resp.success = true;
    console.log("query=>permissionGetAllByRole", roleId);
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
