import "server-only";

import prisma from "@/server/db/prisma";
import type { UserWithRelations } from "@/types/interfaces/user/user-with-relations.interface";

export const userGetAllByCompanyRepository = async (
  companyId: string
): Promise<UserWithRelations[]> => {
  return await prisma.userModel.findMany({
    where: {
      BranchUser: {
        some: {
          Branch: {
            companyId: companyId, // Filtrar por compañía
          },
        },
      },
    },
    include: {
      BranchUser: {
        include: {
          Branch: true, // Opcional: incluir info de la sucursal
        },
      },
    },
  }) as UserWithRelations[];
};
