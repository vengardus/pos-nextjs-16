import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { Branch } from "@/server/modules/branch/domain/branch.types";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { documentTypeInsertOrUpdateRepository } from "../repository/document-type.insert-or-update.repository";

export const documentTypeInsertOrUpdateUseCase = async (
  branch: Branch,
  userId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!userId) throw new Error("No hay sesión de usuario.");

    const { CashRegister, ...rest } = branch;
    console.log(rest);

    const proccesBranch = await documentTypeInsertOrUpdateRepository(
      branch,
      userId
    );

    resp.data = proccesBranch;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
