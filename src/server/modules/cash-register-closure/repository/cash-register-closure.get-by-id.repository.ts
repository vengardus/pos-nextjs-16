import "server-only";

import prisma from "@/server/db/prisma";
import type { CashRegisterClosure } from "../domain/cash-register-closure.types";

export const cashRegisterClosureGetByIdRepository = async (
  cashRegisterClosureId: string
): Promise<CashRegisterClosure | null> => {
  return await prisma.cashRegisterClosureModel.findFirst({
    where: {
      id: cashRegisterClosureId,
    },
  }) as CashRegisterClosure | null;
};
