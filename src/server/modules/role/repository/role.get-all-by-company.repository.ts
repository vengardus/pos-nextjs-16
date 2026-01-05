import "server-only";

import prisma from "@/server/db/prisma";
import type { Role } from "@/server/modules/role/domain/role.interface";

export const roleGetAllByCompanyRepository = async (
  companyId: string
): Promise<Role[]> => {
  return await prisma.roleModel.findMany({
    where: {
      companyId,
    },
  });
};
