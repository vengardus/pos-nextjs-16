import "server-only";

import prisma from "@/server/db/prisma";
import type { UserWithRelations } from "@/server/modules/user/domain/user-with-relations.interface";

export const userGetAllByCompanyRepository = async (
  companyId: string,
  page: number,
  pageSize: number,
  search?: string
): Promise<{ data: UserWithRelations[]; total: number }> => {
  const where = {
    BranchUser: {
      some: {
        Branch: {
          companyId: companyId,
        },
      },
    },
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.userModel.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        BranchUser: {
          include: {
            Branch: true,
          },
        },
      },
    }),
    prisma.userModel.count({ where }),
  ]);

  return { data: data as UserWithRelations[], total };
};
