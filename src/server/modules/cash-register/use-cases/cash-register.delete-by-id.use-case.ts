import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { cashRegisterDeleteByIdRepository } from "../repository/cash-register.delete-by-id.repository";
import { cashRegisterGetByIdRepository } from "../repository/cash-register.get-by-id.repository";

export const cashRegisterDeleteByIdUseCase = async (
  id: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const cashRegister = await cashRegisterGetByIdRepository(id);
    if (!cashRegister) throw new Error("Cash Register not found");
    if (cashRegister.isDefault)
      throw new Error("Cash Register genérica no puede ser eliminada.");

    const cashRegisterDelete = await cashRegisterDeleteByIdRepository(id);

    resp.data = cashRegisterDelete;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
