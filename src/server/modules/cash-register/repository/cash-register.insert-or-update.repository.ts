import "server-only";

import prisma from "@/server/db/prisma";
import type { CashRegister } from "@/types/interfaces/cash-register/cash-register.interface";

export const cashRegisterInsertOrUpdateRepository = async (
  cashRegister: CashRegister
): Promise<CashRegister> => {
  const { id, ...data } = cashRegister;

  if (id) {
    return await prisma.cashRegisterModel.update({
      where: {
        id,
      },
      data,
    });
  }

  return await prisma.cashRegisterModel.create({
    data,
  });
};
