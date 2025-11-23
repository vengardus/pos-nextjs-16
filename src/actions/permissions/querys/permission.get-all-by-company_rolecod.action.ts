"use server";

import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Permission } from "@/types/interfaces/permission/permission.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const permissionGetAllByCompanyRoleCod = async (
  companyId: string,
  roleCod: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  try {
    if (!roleCod || !companyId) throw new Error("Role y compañia son requeridos");
    const data = await prisma.permissionModel.findMany({
      where: {
        companyId,
        roleCod,
      },
    });
    resp.data = data as Permission[];
    resp.success = true;
    console.log("=>permissions/get-all-by-company_rolecod", companyId, roleCod);
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
