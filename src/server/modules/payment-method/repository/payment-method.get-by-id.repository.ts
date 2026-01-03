import "server-only";

import prisma from "@/server/db/prisma";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";

export const paymentMethodGetByIdRepository = async (
  id: string
): Promise<PaymentMethod | null> => {
  return await prisma.paymentMethodModel.findUnique({
    where: {
      id,
    },
  });
};
