"use server";

import { revalidatePath, updateTag } from "next/cache";
import prisma from "@/server/db/prisma";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

// Configuration Cloudinary

export const paymentMethodInsertOrUpdate = async (
  paymentmethod: PaymentMethod,
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  const { id, ...data } = paymentmethod;

  try {
    const proccesPaymentMethod = id
      ? await prisma.paymentMethodModel.update({ where: { id }, data })
      : await prisma.paymentMethodModel.create({ data });

    resp.data = proccesPaymentMethod;
    resp.success = true;

    updateTag(`payment-methods-${proccesPaymentMethod.companyId}`);
    revalidatePath("/config/payment-methods");
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
