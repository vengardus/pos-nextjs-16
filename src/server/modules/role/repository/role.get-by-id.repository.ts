import "server-only";

import prisma from "@/server/db/prisma";
import type { Role } from "@/server/modules/role/domain/role.interface";

export const roleGetByIdRepository = async (
  id: string
): Promise<Role | null> => {
  return await prisma.roleModel.findUnique({
    where: {
      id,
    },
  });
};
