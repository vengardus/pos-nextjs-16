import "server-only";

import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const cashRegisterClosureGetById = async (
  cashRegisterClosureId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!cashRegisterClosureId) throw new Error("CashRegister id is required");
    const data = await prisma.cashRegisterClosureModel.findFirst({
      where: {
        id: cashRegisterClosureId
      },
      select: {
        id: true,
        status: true
      },
    });
    resp.data = data;
    resp.success = true;
    console.log("=>cash-register-closure/get-by-id")
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
