import 'server-only'

import prisma from "@/server/db/prisma";
import { CashRegisterStatusEnum } from "../domain/cash-register.types";

export async function cashRegisterGetOpenClosuresByBranchRepository(params: { branchId: string }) {
  console.log("query=>cashRegisterGetOpenClosuresByBranchRepository");
  return await prisma.cashRegisterClosureModel.findMany({
    where: {
      CashRegister: {
        is: {
          branchId: params.branchId,
        },
      },
      status: CashRegisterStatusEnum.OPENING,
    },
    select: {
      id: true,
      userId: true,
      CashRegister: {
        select: {
          id: true,
          description: true,
          Branch: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}
