import "server-only";

import prisma from "@/server/db/prisma";
import type { ClientSupplier } from "@/server/modules/client-supplier/domain/client-supplier.interface";

export const clientSupplierGetAllByCompanyRepository = async (
  companyId: string,
  page: number,
  pageSize: number,
  search?: string
): Promise<{ data: ClientSupplier[]; total: number }> => {
  const where = {
    companyId,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } as any },
        { legalIdentifier: { contains: search, mode: "insensitive" } as any },
        { naturalIdentifier: { contains: search, mode: "insensitive" } as any },
        { email: { contains: search, mode: "insensitive" } as any },
      ],
    }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.clientSupplierModel.findMany({
      where: where as any,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { name: "asc" },
    }),
    prisma.clientSupplierModel.count({ where: where as any }),
  ]);

  return {
    data: data as ClientSupplier[],
    total,
  };
};
