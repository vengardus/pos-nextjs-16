"use server";

import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Role } from "@/types/interfaces/role/role.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const roleGetAllByCompany = async (
  companyId: string
): Promise<ResponseAction> => {  
  const resp = initResponseAction();

  try {
    if (!companyId) throw new Error("Company id is required");
    const data = await prisma.roleModel.findMany({
      where: {
        companyId,
      },

    });
    resp.data = data as Role[];
    resp.success = true;
    console.log("=>roles/get-all-by-company");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
