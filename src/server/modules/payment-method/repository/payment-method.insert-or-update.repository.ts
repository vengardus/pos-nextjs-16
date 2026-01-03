import "server-only";

import prisma from "@/server/db/prisma";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";

export const paymentMethodInsertOrUpdateRepository = async (
  paymentMethod: PaymentMethod
): Promise<PaymentMethod> => {
  const { id, ...data } = paymentMethod;

  if (id) {
    return await prisma.paymentMethodModel.update({
      where: {
        id,
      },
      data,
    });
  }

  return await prisma.paymentMethodModel.create({
    data,
  });
};
