import "server-only";

import prisma from "@/server/db/prisma";
import type { ClientSupplier } from "@/types/interfaces/client-supplier/client-supplier.interface";

export const clientSupplierInsertOrUpdateRepository = async (
  clientSupplier: ClientSupplier
): Promise<ClientSupplier> => {
  const { id, createdAt, updatedAt, Company, ...rest } = clientSupplier;

  if (id) {
    return await prisma.clientSupplierModel.update({
      where: {
        id,
      },
      data: {
        ...rest,
      },
    });
  }

  return await prisma.clientSupplierModel.create({
    data: {
      ...rest,
    },
  });
};
