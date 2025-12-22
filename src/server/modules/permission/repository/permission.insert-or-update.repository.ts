import "server-only";

import prisma from "@/server/db/prisma";
import type { Permission } from "@/types/interfaces/permission/permission.interface";

export const permissionInsertOrUpdateRepository = async (
  permission: Permission
): Promise<Permission> => {
  const { id, ...data } = permission;

  if (id) {
    return await prisma.permissionModel.update({
      where: {
        id,
      },
      data,
    });
  }

  return await prisma.permissionModel.create({
    data,
  });
};
