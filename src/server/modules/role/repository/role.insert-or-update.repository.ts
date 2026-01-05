import "server-only";

import type { Prisma } from "@prisma/client";
import prisma from "@/server/db/prisma";
import type { Role } from "@/server/modules/role/domain/role.interface";

export const roleInsertOrUpdateRepository = async (
  role: Role,
  companyId: string
): Promise<Role> => {
  const { id, isDefault, Company, Permission, ...rest } = role;

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    let proccesRole: Role = role;

    if (id) {
      await tx.permissionModel.deleteMany({
        where: {
          roleId: id,
        },
      });
    }

    if (id) {
      proccesRole = await tx.roleModel.update({
        where: {
          id,
        },
        data: {
          ...rest,
          Permission: {
            createMany: {
              data: Permission!.map((permission) => {
                return {
                  moduleCod: permission.moduleCod,
                  companyId,
                  roleCod: role.cod,
                };
              }),
            },
          },
        },
      });
    } else {
      proccesRole = await tx.roleModel.create({
        data: {
          ...rest,
          companyId,
          Permission: {
            createMany: {
              data: Permission!.map((permission) => {
                return {
                  moduleCod: permission.moduleCod,
                  companyId,
                  roleCod: role.cod,
                };
              }),
            },
          },
        },
      });
    }

    return proccesRole;
  });
};
