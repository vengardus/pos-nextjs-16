import 'server-only';

import prisma from "@/server/db/prisma";
import type { Permission } from "@/server/modules/permission/domain/permission.interface";

export const permissionGetAllByCompanyRoleCodRepository = async (
  companyId: string,
  roleCod: string
): Promise<Permission[]> => {
  return prisma.permissionModel.findMany({
    where: {
      companyId,
      roleCod,
    },
  }) as Promise<Permission[]>;
};
