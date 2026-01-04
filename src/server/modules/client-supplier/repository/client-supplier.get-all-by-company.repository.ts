import "server-only";

import prisma from "@/server/db/prisma";
import type { ClientSupplier } from "@/server/modules/client-supplier/domain/client-supplier.interface";

export const clientSupplierGetAllByCompanyRepository = async (
  companyId: string
): Promise<ClientSupplier[]> => {
  return await prisma.clientSupplierModel.findMany({
    where: {
      companyId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};
