import "server-only";

import prisma from "@/server/db/prisma";
import type { ClientSupplier } from "@/server/modules/client-supplier/domain/client-supplier.interface";

export const clientSupplierGetByIdRepository = async (
  id: string
): Promise<ClientSupplier | null> => {
  return await prisma.clientSupplierModel.findUnique({
    where: {
      id,
    },
  });
};
