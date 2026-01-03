import "server-only";

import prisma from "@/server/db/prisma";
import type { CashRegisterMovement } from "@/types/interfaces/cash-register-movement/cash-register-movement.interface";

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
