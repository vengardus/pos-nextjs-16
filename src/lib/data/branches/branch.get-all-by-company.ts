import 'server-only'

import prisma from "@/server/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Branch } from "@/types/interfaces/branch/branch.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const branchGetAllByCompany = async (
  companyId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    if (!companyId) throw new Error("Company id is required");
    const data = await prisma.branchModel.findMany({
      where: {
        companyId,
      },
      include: {
        CashRegister: {
          select: {
            id: true,
            description: true,
            isDefault: true,
            branchId: true
          },
          orderBy: {
            description: "asc"
          }
        }
      }
    });
    resp.data = data as Branch[];
    resp.success = true;
    console.log("query=>branchGetAllByCompany: ", data);
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
