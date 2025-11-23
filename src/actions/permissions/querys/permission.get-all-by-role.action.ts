"use server";

import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { Permission } from "@/types/interfaces/permission/permission.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const permissionGetAllByRole = async (
  roleId: string
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  try {
    if (!roleId) throw new Error("Role id is required");
    const data = await prisma.permissionModel.findMany({
      where: {
        roleId,
      },
    });
    resp.data = data as Permission[];
    resp.success = true;
    console.log("=>permissions/get-all-by-role");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
