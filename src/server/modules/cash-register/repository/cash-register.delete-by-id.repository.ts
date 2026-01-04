import "server-only";

import prisma from "@/server/db/prisma";
import type { CashRegister } from "@/server/modules/cash-register/domain/cash-register.types";

export const cashRegisterDeleteByIdRepository = async (
  id: string
): Promise<CashRegister> => {
  return await prisma.cashRegisterModel.delete({
    where: {
      id,
    },
  });
};
