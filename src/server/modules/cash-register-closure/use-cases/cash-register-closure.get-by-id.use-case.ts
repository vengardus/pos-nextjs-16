import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { cashRegisterClosureGetByIdRepository } from "../repository/cash-register-closure.get-by-id.repository";

export const cashRegisterClosureGetByIdUseCase = async (
  cashRegisterClosureId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!cashRegisterClosureId) throw new Error("CashRegister closure id is required");
    const data = await cashRegisterClosureGetByIdRepository(cashRegisterClosureId);
    
    resp.data = data;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
