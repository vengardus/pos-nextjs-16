import "server-only";

import prisma from "@/server/db/prisma";
import type { ClientSupplier } from "@/types/interfaces/client-supplier/client-supplier.interface";

export const clientSupplierDeleteByIdRepository = async (
  id: string
): Promise<ClientSupplier> => {
  return await prisma.clientSupplierModel.delete({
    where: {
      id,
    },
  });
};
