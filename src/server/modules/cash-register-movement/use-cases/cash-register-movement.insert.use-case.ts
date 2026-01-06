import "server-only";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import type { CashRegisterMovement } from "@/server/modules/cash-register-movement/domain/cash-register-movement.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { cashRegisterMovementInsertRepository } from "../repository/cash-register-movement.insert.repository";

export const cashRegisterMovementInsertUseCase = async (
  cashRegisterMovement: CashRegisterMovement,
  userId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const proccesCashRegisterMovement = await cashRegisterMovementInsertRepository(
      cashRegisterMovement,
      userId
    );

    resp.data = proccesCashRegisterMovement;
    resp.success = true;
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
