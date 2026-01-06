import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";
import { userGetByColumnRepository } from "../repository/user.get-by-column.repository";
import { userDeleteByIdRepository } from "../repository/user.delete-by-id.repository";

export const userDeleteByIdUseCase = async (
  id: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const user = await userGetByColumnRepository("id", id);
    if (!user) throw new Error("User not found");
    if (user.roleId === UserRole.ADMIN) {
      throw new Error("Usuario Admin no puede ser eliminada.");
    }

    const userDelete = await userDeleteByIdRepository(id);
    resp.data = userDelete;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
