import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";
import { userGetByColumnRepository } from "../repository/user.get-by-column.repository";
import { userDeleteByIdRepository } from "../repository/user.delete-by-id.repository";

export const userDeleteByIdUseCase = async (
  id: string,
  requesterId: string,
  requesterRole: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (requesterRole === UserRole.GUEST) {
      throw new Error("No tienes permisos para eliminar usuarios.");
    }

    if (id === requesterId) {
      throw new Error("No puedes eliminarte a ti mismo.");
    }

    const user = await userGetByColumnRepository("id", id);
    if (!user) throw new Error("Usuario no encontrado.");
    
    if (user.roleId === UserRole.ADMIN || user.roleId === UserRole.SUPER_ADMIN) {
      throw new Error(`Usuario con rol ${user.roleId} no puede ser eliminado.`);
    }

    const userDelete = await userDeleteByIdRepository(id);
    resp.data = userDelete;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
