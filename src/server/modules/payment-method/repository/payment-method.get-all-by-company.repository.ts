import "server-only";

import prisma from "@/server/db/prisma";
import type { PaymentMethod } from "@/server/modules/payment-method/domain/payment-method.interface";

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
