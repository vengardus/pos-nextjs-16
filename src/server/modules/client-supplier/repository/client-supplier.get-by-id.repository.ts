import "server-only";

import prisma from "@/server/db/prisma";
import type { ClientSupplier } from "@/types/interfaces/client-supplier/client-supplier.interface";

export const clientSupplierGetByIdRepository = async (
  id: string
): Promise<ClientSupplier | null> => {
  return await prisma.clientSupplierModel.findUnique({
    where: {
      id,
    },
  });
};
