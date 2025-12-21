import "server-only";

import prisma from "@/server/db/prisma";
import type { CashRegister } from "@/types/interfaces/cash-register/cash-register.interface";

export const cashRegisterDeleteByIdRepository = async (
  id: string
): Promise<CashRegister> => {
  return await prisma.cashRegisterModel.delete({
    where: {
      id,
    },
  });
};
