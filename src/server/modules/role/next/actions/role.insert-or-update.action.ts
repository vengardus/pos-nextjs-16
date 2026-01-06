"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { Role } from "@/server/modules/role/domain/role.interface";
import { initResponseAction } from "@/utils/response/init-response-action";
import { roleInsertOrUpdateUseCase } from "@/server/modules/role/use-cases/role.insert-or-update.use-case";

export const roleInsertOrUpdateAction = async (
  role: Role,
  companyId: string
): Promise<ResponseAction> => {
  if (!role || !companyId) {
    const resp = initResponseAction();
    resp.message = "Datos inválidos.";
    return resp;
  }

  const resp = await roleInsertOrUpdateUseCase(role, companyId);

  if (resp.success) {
    updateTag(`roles-${companyId}`);
    updateTag(`permissions-${role.id}`);
    updateTag(`permissions-${companyId}-${role.cod}`);
    revalidatePath("/config/roles");
  }

  return resp;
};
