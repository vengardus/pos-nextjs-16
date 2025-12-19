"use server";

import { revalidatePath, updateTag } from "next/cache";
import prisma from "@/server/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const roleDeleteById = async (id: string): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const role = await prisma.roleModel.findUnique({
      where: {
        id,
      },
    });
    if (!role) throw new Error("Role not found");
    if (role.isDefault)
      throw new Error("Role genérico no puede ser eliminada.");

    const roleDelete = await prisma.roleModel.delete({
      where: {
        id,
      },
    });
    resp.data = roleDelete;
    resp.success = true;
    revalidatePath("/config/roles");
    updateTag(`roles-${role.companyId}`);
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
