import "server-only";

import prisma from "@/server/db/prisma";
import type { PaymentMethod } from "@/server/modules/payment-method/domain/payment-method.interface";

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
