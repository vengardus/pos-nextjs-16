import "server-only";

import prisma from "@/server/db/prisma";
import type { Role } from "@/server/modules/role/domain/role.interface";

export const roleGetAllByCompanyRepository = async (
  companyId: string,
  page?: number,
  limit?: number,
  search?: string
): Promise<{ data: Role[]; total: number }> => {
  const trimmedSearch = search?.trim();
  const filterClause = trimmedSearch
    ? {
        OR: [
          {
            description: {
              contains: trimmedSearch,
              mode: "insensitive" as const,
            },
          },
          {
            cod: {
              contains: trimmedSearch,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const where = {
    companyId,
    ...filterClause,
  };

  if (page !== undefined && limit !== undefined) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.roleModel.findMany({
        where,
        orderBy: {
          description: "asc",
        },
        skip,
        take: limit,
      }),
      prisma.roleModel.count({
        where,
      }),
    ]);

    return {
      data: data as Role[],
      total,
    };
  }

  const [data, total] = await Promise.all([
    prisma.roleModel.findMany({
      where,
      orderBy: {
        description: "asc",
      },
    }),
    prisma.roleModel.count({
      where,
    }),
  ]);

  return {
    data: data as Role[],
    total,
  };
};
