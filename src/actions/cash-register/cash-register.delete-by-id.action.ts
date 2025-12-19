"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/server/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const cashRegisterDeleteById = async (id: string): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const cashRegister = await prisma.cashRegisterModel.findUnique({
      where: {
        id,
      },
    })
    if (!cashRegister) throw new Error("Cash Register not found")
    if (cashRegister.isDefault) throw new Error("Cash Register genérica no puede ser eliminada.")

    const cashRegisterDelete = await prisma.cashRegisterModel.delete({
      where: {
        id,
      },
    });
    resp.data = cashRegisterDelete;
    resp.success = true;
    revalidatePath("/config/branches");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
