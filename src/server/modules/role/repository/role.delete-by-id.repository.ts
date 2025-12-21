import "server-only";

import prisma from "@/server/db/prisma";
import type { Role } from "@/types/interfaces/role/role.interface";

export const roleDeleteByIdRepository = async (id: string): Promise<Role> => {
  return await prisma.roleModel.delete({
    where: {
      id,
    },
  });
};
