import "server-only";

import prisma from "@/server/db/prisma";
import type { CashRegister } from "@/types/interfaces/cash-register/cash-register.interface";

export const cashRegisterGetByIdRepository = async (
  id: string
): Promise<CashRegister | null> => {
  return await prisma.cashRegisterModel.findUnique({
    where: {
      id,
    },
  });
};
