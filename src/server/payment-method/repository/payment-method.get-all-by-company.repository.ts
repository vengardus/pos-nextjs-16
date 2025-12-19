import "server-only";

import prisma from "@/server/db/prisma";
import type { PaymentMethod } from "@/types/interfaces/payment-method/payment-method.interface";

export const paymentMethodGetAllByCompanyRepository = async (
  companyId: string
): Promise<PaymentMethod[]> => {
  return await prisma.paymentMethodModel.findMany({
    where: {
      companyId,
    },
    orderBy: {
      cod: "asc",
    },
  });
};
