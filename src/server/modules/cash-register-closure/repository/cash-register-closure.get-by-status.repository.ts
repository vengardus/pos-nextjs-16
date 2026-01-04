import "server-only";

import prisma from "@/server/db/prisma";
import type { CashRegisterClosure } from "../domain/cash-register-closure.types";

export const cashRegisterClosureGetByStatusRepository = async (
  cashRegisterId: string,
  status: string
): Promise<CashRegisterClosure | null> => {
  return await prisma.cashRegisterClosureModel.findFirst({
    where: {
      cashRegisterId,
      status,
    },
  }) as CashRegisterClosure | null;
};
