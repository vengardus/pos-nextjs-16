import 'server-only'

import prisma from "@/server/db/prisma";

export async function cashRegisterGetFreeByBranchRepository(branchId: string, openedIds: string[]) {
  console.log("query=>cashRegisterGetFreeByBranchRepository");
  const allRegisters = await prisma.cashRegisterModel.findMany({
    where: { branchId },
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
  });

  return allRegisters.filter((cr) => !openedIds.includes(cr.id));
}
