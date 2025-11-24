import 'server-only'

import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const cashRegisterGetByBranch = async (
  branchId: string,
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!branchId) throw new Error("Branch id is required");
    const data = await prisma.cashRegisterModel.findFirst({
      where: {
        branchId,
      },
      select: {
        id: true,
        description: true
      },
    });
    resp.data = data;
    resp.success = true;
    console.log("=>cash-register/get-by-branch");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
