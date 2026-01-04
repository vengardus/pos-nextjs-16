import "server-only";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { cashRegisterClosureGetByStatusRepository } from "../repository/cash-register-closure.get-by-status.repository";

export const cashRegisterClosureGetByStatusUseCase = async (
  cashRegisterId: string,
  status: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!cashRegisterId) throw new Error("CashRegister id is required");
    const data = await cashRegisterClosureGetByStatusRepository(cashRegisterId, status);
    
    resp.data = data;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
