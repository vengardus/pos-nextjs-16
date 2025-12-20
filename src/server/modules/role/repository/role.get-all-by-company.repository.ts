import "server-only";

import prisma from "@/server/db/prisma";
import type { Role } from "@/types/interfaces/role/role.interface";

export const roleGetAllByCompanyRepository = async (
  companyId: string
): Promise<Role[]> => {
  return await prisma.roleModel.findMany({
    where: {
      companyId,
    },
  });
};
