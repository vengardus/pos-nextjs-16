import 'server-only';

import prisma from "@/server/db/prisma";
import type { Permission } from "@/server/modules/permission/domain/permission.interface";

export const permissionGetAllByRoleRepository = async (
  roleId: string
): Promise<Permission[]> => {
  return prisma.permissionModel.findMany({
    where: {
      roleId,
    },
  }) as Promise<Permission[]>;
};
