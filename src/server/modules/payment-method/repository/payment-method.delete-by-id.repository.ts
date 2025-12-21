import "server-only";

import prisma from "@/server/db/prisma";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";

export const paymentMethodDeleteByIdRepository = async (
  id: string
): Promise<PaymentMethod> => {
  return await prisma.paymentMethodModel.delete({
    where: {
      id,
    },
  });
};
