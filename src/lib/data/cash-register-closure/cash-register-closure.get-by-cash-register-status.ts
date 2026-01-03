import "server-only";

import prisma from "@/server/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
export const cashRegisterClosureGetByCashRegisterStatus = async (
  cashRegisterId: string,
  status: string
): Promise<ResponseAction> => {

  const resp = initResponseAction();

  try {
    if (!cashRegisterId) throw new Error("CashRegister id is required");
    const data = await prisma.cashRegisterClosureModel.findFirst({
      where: {
        cashRegisterId,
        status
      },
      select: {
        id: true,
      },
    });
    resp.data = data;
    resp.success = true;
    console.log("query=>cashRegisterClosureGetByCashRegisterStatus")
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
