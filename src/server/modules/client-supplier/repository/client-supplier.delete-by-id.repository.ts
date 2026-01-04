import "server-only";

import prisma from "@/server/db/prisma";
import type { ClientSupplier } from "@/server/modules/client-supplier/domain/client-supplier.interface";

export const clientSupplierDeleteByIdRepository = async (
  id: string
): Promise<ClientSupplier> => {
  return await prisma.clientSupplierModel.delete({
    where: {
      id,
    },
  });
};
