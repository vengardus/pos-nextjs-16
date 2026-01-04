import "server-only";

import prisma from "@/server/db/prisma";
import type { Branch } from "../domain/branch.types";

export const branchInsertOrUpdateRepository = async (
  branch: Branch,
  userId: string
): Promise<Branch> => {
  const { id, CashRegister, ...rest } = branch;

  return await prisma.$transaction(async (prismaTx) => {
    let proccesBranch: Branch = branch;

    if (id) {
      proccesBranch = await prismaTx.branchModel.update({
        where: {
          id,
        },
        data: {
          ...rest,
        },
      });
    } else {
      proccesBranch = await prismaTx.branchModel.create({
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
    }

    return proccesBranch;
  });
};
