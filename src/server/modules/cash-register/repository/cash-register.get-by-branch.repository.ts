import 'server-only'

import prisma from "@/server/db/prisma";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";

export const cashRegisterGetByBranchRepository = async (
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
    console.log("query=>cashRegisterGetByBranchRepository");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
