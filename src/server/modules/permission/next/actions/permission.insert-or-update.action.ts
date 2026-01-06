"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { Permission } from "@/server/modules/permission/domain/permission.interface";
import { initResponseAction } from "@/utils/response/init-response-action";
import { permissionInsertOrUpdateUseCase } from "@/server/modules/permission/use-cases/permission.insert-or-update.use-case";

export const permissionInsertOrUpdateAction = async (
  permission: Permission
): Promise<ResponseAction> => {
  if (!permission) {
    const resp = initResponseAction();
    resp.message = "Permiso inválido.";
    return resp;
  }

  const resp = await permissionInsertOrUpdateUseCase(permission);

  if (resp.success && resp.data) {
    console.log("updateTag: ", `permissions-${resp.data.companyId}`);
    updateTag(`permissions-${resp.data.companyId}`);
    revalidatePath("/config/permissions");
  }

  return resp;
};
