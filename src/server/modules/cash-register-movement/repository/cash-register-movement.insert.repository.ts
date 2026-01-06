import "server-only";

import prisma from "@/server/db/prisma";
import type { CashRegisterMovement } from "@/server/modules/cash-register-movement/domain/cash-register-movement.interface";

export const cashRegisterMovementInsertRepository = async (
  cashRegisterMovement: CashRegisterMovement,
  userId: string
): Promise<CashRegisterMovement> => {
  return await prisma.cashRegisterMovementModel.create({
    data: {
      ...cashRegisterMovement,
      userId,
    },
  });
};
