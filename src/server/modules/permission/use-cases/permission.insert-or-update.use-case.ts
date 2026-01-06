import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Permission } from "@/server/modules/permission/domain/permission.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { permissionInsertOrUpdateRepository } from "../repository/permission.insert-or-update.repository";

export const permissionInsertOrUpdateUseCase = async (
  permission: Permission
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const proccesPermission =
      await permissionInsertOrUpdateRepository(permission);

    resp.data = proccesPermission;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
