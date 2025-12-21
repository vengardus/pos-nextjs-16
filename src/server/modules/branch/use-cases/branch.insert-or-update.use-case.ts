import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Branch } from "@/types/interfaces/branch/branch.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { branchInsertOrUpdateRepository } from "../repository/branch.insert-or-update.repository";

export const branchInsertOrUpdateUseCase = async (
  branch: Branch,
  userId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!userId) throw new Error("No hay sesión de usuario.");

    const { CashRegister, ...rest } = branch;
    console.log(rest);

    const proccesBranch = await branchInsertOrUpdateRepository(branch, userId);

    resp.data = proccesBranch;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
