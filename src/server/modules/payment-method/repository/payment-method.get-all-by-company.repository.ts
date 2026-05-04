import "server-only";

import prisma from "@/server/db/prisma";
import type { PaymentMethod } from "@/server/modules/payment-method/domain/payment-method.interface";

export const paymentMethodGetAllByCompanyRepository = async (
  companyId: string,
  page: number,
  pageSize: number,
  search?: string
): Promise<{ data: PaymentMethod[]; total: number }> => {
  const where = {
    companyId,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { cod: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.paymentMethodModel.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        cod: "asc",
      },
    }),
    prisma.paymentMethodModel.count({ where }),
  ]);

  return { data, total };
};
