import "server-only";

import prisma from "@/server/db/prisma";
import type { Branch } from "@/types/interfaces/branch/branch.interface";

export const cashRegisterGetBranchByIdRepository = async (
  id: string
): Promise<Branch | null> => {
  return await prisma.branchModel.findUnique({
    where: {
      id,
    },
  });
};
