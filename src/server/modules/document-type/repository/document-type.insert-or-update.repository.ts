import "server-only";

import prisma from "@/server/db/prisma";
import type { Branch } from "@/server/modules/branch/domain/branch.types";

export const documentTypeInsertOrUpdateRepository = async (
  branch: Branch,
  userId: string
): Promise<Branch> => {
  const { id, CashRegister, ...rest } = branch;

  if (id) {
    return await prisma.branchModel.update({
      where: {
        id,
      },
      data: {
        ...rest,
      },
    });
  }

  return await prisma.branchModel.create({
    data: {
      ...rest,
      BranchUser: {
        createMany: {
          data: [
            {
              userId,
            },
          ],
        },
      },
    },
  });
};
