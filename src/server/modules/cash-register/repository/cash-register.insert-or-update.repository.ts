import "server-only";

import prisma from "@/server/db/prisma";
import type { CashRegister } from "@/server/modules/cash-register/domain/cash-register.types";

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
