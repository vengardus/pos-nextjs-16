import "server-only";

import prisma from "@/server/db/prisma";
import type { CashRegister } from "@/server/modules/cash-register/domain/cash-register.types";

export const cashRegisterGetByIdRepository = async (
  id: string
): Promise<CashRegister | null> => {
  return await prisma.cashRegisterModel.findUnique({
    where: {
      id,
    },
  });
};
