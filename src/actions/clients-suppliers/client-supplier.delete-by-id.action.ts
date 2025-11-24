"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/infrastructure/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const clientSupplierDeleteById = async (id: string): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const clientsupplier = await prisma.clientSupplierModel.findUnique({
      where: {
        id,
      },
    })
    if (!clientsupplier) throw new Error("ClientSupplier not found")
    if (clientsupplier.isDefault) throw new Error("ClientSupplier genérica no puede ser eliminada.")

    const clientsupplierDelete = await prisma.clientSupplierModel.delete({
      where: {
        id,
      },
    });
    resp.data = clientsupplierDelete;
    resp.success = true;
    revalidatePath("/config/clientssuppliers");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
