"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/server/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const paymentMethodDeleteById = async (id: string): Promise<ResponseAction> => {
  const resp = initResponseAction();

  try {
    const paymentMethod = await prisma.paymentMethodModel.findUnique({
      where: {
        id,
      },
    });
    if (!paymentMethod) throw new Error("PaymentMethod not found");
    if (paymentMethod.isDefault)
      throw new Error("Método de pago genérico no puede ser eliminada.");

    const paymentDelete = await prisma.paymentMethodModel.delete({
      where: {
        id,
      },
    });
    resp.data = paymentDelete;
    resp.success = true;
    revalidatePath("/config/payment-methods");
  } catch (error) {
    resp.message = getActionError(error);
  }
  return resp;
};
