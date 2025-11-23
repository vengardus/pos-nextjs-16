"use server";

import { revalidatePath} from "next/cache";
import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";
import { UserRole } from "@/types/enums/user-role.enum";

export const userDeleteById = async (id: string): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const user = await prisma.userModel.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new Error("User not found");
    if (user.roleId === UserRole.ADMIN)
      throw new Error("Usuario Admin no puede ser eliminada.");

    const userDelete = await prisma.userModel.delete({
      where: {
        id,
      },
    });
    resp.data = userDelete;
    resp.success = true;
    //updateTag(`users-${companyId}`);
    revalidatePath("/config/users");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
