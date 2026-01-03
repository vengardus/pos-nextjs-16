import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { roleDeleteByIdRepository } from "../repository/role.delete-by-id.repository";
import { roleGetByIdRepository } from "../repository/role.get-by-id.repository";

export const roleDeleteByIdUseCase = async (
  id: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const role = await roleGetByIdRepository(id);
    if (!role) throw new Error("Role not found");
    if (role.isDefault)
      throw new Error("Role genérico no puede ser eliminada.");

    const roleDelete = await roleDeleteByIdRepository(id);

    resp.data = roleDelete;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
