import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { Role } from "@/server/modules/role/domain/role.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { roleInsertOrUpdateRepository } from "../repository/role.insert-or-update.repository";

export const roleInsertOrUpdateUseCase = async (
  role: Role,
  companyId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (role.Permission?.length === 0) {
      throw new Error("Debe seleccionar al menos un permiso");
    }

    const proccesRole = await roleInsertOrUpdateRepository(role, companyId);

    resp.data = proccesRole;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
